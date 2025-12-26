import datetime
from functools import wraps
from flask import request, jsonify
import jwt
from config import JWT_SECRET


def require_auth(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        token = auth.replace("Bearer ", "")
        if not token:
            return jsonify({"error": "Unauthorized"}), 401
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            request.user = payload
        except Exception:
            return jsonify({"error": "Unauthorized"}), 401
        return fn(*args, **kwargs)
    return wrapper


def issue_token(user_id, email, hours=12):
    exp = datetime.datetime.utcnow() + datetime.timedelta(hours=hours)
    return jwt.encode({"userId": str(user_id), "email": email, "exp": exp}, JWT_SECRET, algorithm="HS256")