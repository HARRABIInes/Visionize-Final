from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from middleware.auth import require_auth

bp = Blueprint("projects", __name__, url_prefix="/api/projects")
client: MongoClient = None

def init(mongo_client):
    global client
    client = mongo_client


def oid(v):
    return str(v) if isinstance(v, ObjectId) else v


def sanitize(doc):
    return {k: oid(v) if isinstance(v, ObjectId) else v for k, v in (doc or {}).items()}


@bp.get("")
@require_auth
def list_projects():
    db = client.get_database()
    projects = [sanitize(p) for p in db.projects.find({"ownerId": request.user["userId"]})]
    return jsonify(projects)


@bp.post("")
@require_auth
def create_project():
    db = client.get_database()
    data = request.json or {}
    doc = {
        "title": data.get("title"),
        "description": data.get("description"),
        "ownerId": request.user["userId"],
        "members": [],
        "managementMethod": data.get("managementMethod"),
    }
    res = db.projects.insert_one(doc)
    return jsonify({"_id": oid(res.inserted_id)}), 201


@bp.get("/<pid>")
@require_auth
def get_project(pid):
    db = client.get_database()
    p = db.projects.find_one({"_id": ObjectId(pid)})
    if not p:
        return jsonify({"error": "Not found"}), 404
    return jsonify(sanitize(p))


@bp.put("/<pid>")
@require_auth
def update_project(pid):
    db = client.get_database()
    data = request.json or {}
    db.projects.update_one({"_id": ObjectId(pid)}, {"$set": {
        "title": data.get("title"),
        "description": data.get("description"),
        "managementMethod": data.get("managementMethod"),
    }})
    p = db.projects.find_one({"_id": ObjectId(pid)})
    return jsonify(sanitize(p))


@bp.delete("/<pid>")
@require_auth
def delete_project(pid):
    db = client.get_database()
    db.projects.delete_one({"_id": ObjectId(pid)})
    db.tasks.delete_many({"projectId": pid})
    return jsonify({"ok": True})


@bp.post("/<pid>/members")
@require_auth
def add_member(pid):
    db = client.get_database()
    d = request.json or {}
    email = d.get("email")
    m = db.users.find_one({"email": email})
    if not m:
        return jsonify({"error": "User not found"}), 404
    db.projects.update_one({"_id": ObjectId(pid)}, {"$addToSet": {"members": str(m["_id"])}})
    return jsonify({"ok": True})


@bp.delete("/<pid>/members/<mid>")
@require_auth
def remove_member(pid, mid):
    db = client.get_database()
    db.projects.update_one({"_id": ObjectId(pid)}, {"$pull": {"members": mid}})
    return jsonify({"ok": True})