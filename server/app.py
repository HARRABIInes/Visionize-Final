import os
from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from config import MONGODB_URI, DB_NAME, FRONTEND_ORIGIN, PORT
from controllers.auth import bp as auth_bp, init as auth_init
from controllers.projects import bp as projects_bp, init as projects_init
from controllers.tasks import bp as tasks_bp, init as tasks_init

app = Flask(__name__)
CORS(app, origins=[FRONTEND_ORIGIN], supports_credentials=True)

mongo_client = MongoClient(MONGODB_URI)
db = mongo_client[DB_NAME]

# Initialize controllers with client
auth_init(mongo_client)
projects_init(mongo_client)
tasks_init(mongo_client)

# Health check
@app.get("/api/health")
def health():
    return jsonify({"ok": True, "db": DB_NAME})

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(projects_bp)
app.register_blueprint(tasks_bp)

if __name__ == "__main__":
    app.run(port=PORT, debug=True)
