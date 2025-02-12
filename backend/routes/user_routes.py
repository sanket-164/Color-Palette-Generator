from flask import Blueprint, jsonify, request
from controller.user_controller import find_user, update_user
from middleware.jwt_authentication import verify_jwt

user_routes = Blueprint("user_routes", __name__)


@user_routes.route("/", methods=["GET"])
def user_hello():
    return jsonify({"message": "Hello from user"}), 200


@user_routes.route("/profile", methods=["GET", "PATCH"])
def user_profile():
    current_user_id = verify_jwt()
    if request.method == "GET":
        
        user = find_user(user_id=current_user_id)
        
        response = {
            "message": "User Profile",
            "user": {"id": user.id, "name": user.name, "email": user.email},
        }

        return jsonify(response), 200

    if request.method == "PATCH":
        user = update_user(user_id=current_user_id, data=request.get_json())
        
        response = {
            "message": "User Profile",
            "user": {"id": user.id, "name": user.name, "email": user.email},
        }

        return jsonify(response), 200


@user_routes.route("/theme", methods=["GET", "POST", "PATCH"])
def user_theme():
    pass
