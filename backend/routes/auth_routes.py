import hashlib
from flask import Blueprint, jsonify, request
from controller.user_controller import create_user, find_user_by_email
from flask_jwt_extended import create_access_token

auth_routes = Blueprint("auth_routes", __name__)


@auth_routes.route("/", methods=["GET"])
def auth_hello():
    return jsonify({"message": "Hello from authentication"}), 200


@auth_routes.route("/login", methods=["POST"])
def user_login():
    user = request.get_json()


    if not user or "email" not in user or "password" not in user:
        return jsonify({"error": "Invalid input"}), 400

    existing_user = find_user_by_email(email=user["email"])

    if existing_user == None or existing_user.password != hashlib.sha256(user["password"].encode()).hexdigest():
        return jsonify({"error": "Wrong credentials"}), 400
    
    response = {
        "message": "Login successfully",
        "jwt_token": create_access_token(identity=str(existing_user.id)),
    }

    return jsonify(response), 201


@auth_routes.route("/register", methods=["POST"])
def register_user():
    user = request.get_json()

    if not user or "name" not in user or "email" not in user:
        return jsonify({"error": "Invalid input"}), 400

    existing_user = find_user_by_email(user["email"])

    if existing_user:
        return jsonify({"error": "Email already exist"}), 400

    user = create_user(user["name"], user["email"], user["password"])

    response = {
        "message": "User created",
        "user": {"id": user.id, "name": user.name, "email": user.email},
    }
    
    return jsonify(response), 201
