from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
import bcrypt
from middleware.auth import issue_token

bp = Blueprint("auth", __name__, url_prefix="/api/auth")

client: MongoClient = None

def init(mongo_client):
    global client
    client = mongo_client

@bp.post("/signup")
def signup():
    db = client.get_database()
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"error": "email and password required"}), 400
    if db.users.find_one({"email": email}):
        return jsonify({"error": "user already exists"}), 400
    pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    user = {
        "email": email,
        "passwordHash": pw_hash,
        "firstName": data.get("firstName"),
        "lastName": data.get("lastName"),
        "profession": data.get("profession"),
        "birthDate": data.get("birthDate"),
    }
    db.users.insert_one(user)
    return jsonify({"ok": True})

@bp.post("/signin")
def signin():
    db = client.get_database()
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")
    u = db.users.find_one({"email": email})
    if not u or not bcrypt.checkpw((password or "").encode(), (u.get("passwordHash") or "").encode()):
        return jsonify({"error": "Invalid credentials"}), 400
    token = issue_token(u["_id"], u["email"])
    return jsonify({"token": token})

@bp.get("/me")
def me():
    # Optional: protected route using token; for simplicity return 200
    return jsonify({"ok": True})