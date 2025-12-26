from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from middleware.auth import require_auth

bp = Blueprint("tasks", __name__)
client: MongoClient = None

def init(mongo_client):
    global client
    client = mongo_client


def oid(v):
    return str(v) if isinstance(v, ObjectId) else v


def sanitize(doc):
    return {k: oid(v) if isinstance(v, ObjectId) else v for k, v in (doc or {}).items()}


@bp.get("/api/projects/<pid>/tasks")
@require_auth
def list_tasks(pid):
    db = client.get_database()
    tasks = [sanitize(t) for t in db.tasks.find({"projectId": pid})]
    return jsonify(tasks)


@bp.post("/api/projects/<pid>/tasks")
@require_auth
def add_task(pid):
    db = client.get_database()
    d = request.json or {}
    t = {
        "projectId": pid,
        "title": d.get("title"),
        "description": d.get("description"),
        "status": d.get("status", "Non démarré"),
        "progress": d.get("progress", 0),
        "priority": d.get("priority", "Normal"),
        "type": d.get("type", "Normal"),
        "assignee": d.get("assignee"),
        "responsable": d.get("responsable"),
        "startDate": d.get("startDate"),
        "endDate": d.get("endDate"),
    }
    res = db.tasks.insert_one(t)
    task = db.tasks.find_one({"_id": res.inserted_id})
    return jsonify(sanitize(task)), 201


@bp.put("/api/tasks/<tid>")
@require_auth
def update_task(tid):
    db = client.get_database()
    d = request.json or {}
    db.tasks.update_one({"_id": ObjectId(tid)}, {"$set": {
        "title": d.get("title"),
        "description": d.get("description"),
        "status": d.get("status"),
        "progress": d.get("progress"),
        "priority": d.get("priority"),
        "type": d.get("type"),
        "assignee": d.get("assignee"),
        "responsable": d.get("responsable"),
        "startDate": d.get("startDate"),
        "endDate": d.get("endDate"),
    }})
    t = db.tasks.find_one({"_id": ObjectId(tid)})
    return jsonify(sanitize(t))


@bp.delete("/api/tasks/<tid>")
@require_auth
def delete_task(tid):
    db = client.get_database()
    db.tasks.delete_one({"_id": ObjectId(tid)})
    return jsonify({"ok": True})