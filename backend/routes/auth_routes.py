import hashlib
from flask import Blueprint, jsonify, request
from controller.user_controller import create_user, find_user_by_email
from flask_jwt_extended import create_access_token
from flasgger import swag_from

auth_routes = Blueprint("auth_routes", __name__)


@auth_routes.route("/", methods=["GET"])
def auth_hello():
    """
    Health check for auth service
    ---
    tags:
      - Auth
    summary: Health check for auth service
    description: Returns a greeting message from the authentication service.
    security:
      - BearerAuth: []
    responses:
      200:
        description: Successful response
        examples:
          application/json:
            message: Hello from authentication
    """
    return jsonify({"message": "Hello from authentication"}), 200

@auth_routes.route("/login", methods=["POST"])
def user_login():
    """
    Login user
    ---
    tags:
      - Auth
    summary: Login user
    description: Authenticate a user and return a JWT token.
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - email
            - password
          properties:
            email:
              type: string
            password:
              type: string
    responses:
      201:
        description: Login successful
        examples:
          application/json:
            message: Login successfully
            jwt_token: "<JWT_TOKEN>"
      400:
        description: Invalid input or wrong credentials
    """
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
    """
    Register new user
    ---
    tags:
      - Auth
    summary: Register new user
    description: Register a new user with name, email, and password.
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - name
            - email
            - password
          properties:
            name:
              type: string
            email:
              type: string
            password:
              type: string
    responses:
      201:
        description: User created
        examples:
          application/json:
            message: User created
            user:
              id: "123"
              name: John Doe
              email: john@example.com
      400:
        description: Email already exist or input invalid
    """
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
