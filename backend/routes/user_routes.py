from flask import Blueprint, jsonify, request
from controller.user_controller import find_user_by_id, update_user
from controller.theme_controller import get_theme, get_themes, add_theme, update_theme, delete_theme
from middleware.jwt_authentication import verify_jwt
from image_processing import generate_colors

user_routes = Blueprint("user_routes", __name__)

def generate_theme_response(message, theme):
    response = {
            "message": message,
            "theme": {
                "theme_id": theme.id,
                "user_id": theme.user_id,
                "background_color": theme.background_color,
                "surface_color": theme.surface_color,
                "text_color": theme.text_color,
                "primary_color": theme.primary_color,
                "secondary_color": theme.secondary_color,
            },
        }

    return response

@user_routes.route("/", methods=["GET"])
def user_hello():
    """
    Health check for user service
    ---
    tags:
      - User
    summary: Health check
    description: Returns a greeting message from user service.
    security:
      - BearerAuth: []
    responses:
      200:
        description: Service is running
        examples:
          application/json:
            message: Hello from user
    """
    return jsonify({"message": "Hello from user"}), 200


@user_routes.route("/profile", methods=["GET"])
def get_user_profile():
    """
    Get user profile
    ---
    tags:
      - User
    summary: View profile
    security:
      - BearerAuth: []
    responses:
      200:
        description: User profile returned
        examples:
          application/json:
            message: User Profile
            user:
              id: "123"
              name: John Doe
              email: john@example.com
    """
    current_user_id = verify_jwt()

    user = find_user_by_id(user_id=current_user_id)

    if(user is None):
        return jsonify({"error": "User not found"}), 404

    response = {
        "message": "User Profile",
        "user": {"id": user.id, "name": user.name, "email": user.email},
    }

    return jsonify(response), 200

@user_routes.route("/profile", methods=["PATCH"])
def update_user_profile():
    """
    Update user profile
    ---
    tags:
      - User
    summary: Edit profile
    security:
      - BearerAuth: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            name:
              type: string
    responses:
      200:
        description: Profile updated
        examples:
          application/json:
            message: Profile Updated
            user:
              id: "123"
              name: John Doe
              email: john@example.com
    """
    current_user_id = verify_jwt()

    user = find_user_by_id(user_id=current_user_id)

    if(user is None):
        return jsonify({"error": "User not found"}), 404
    
    user = update_user(user_id=current_user_id, data=request.get_json())

    response = {
        "message": "Profile Updated",
        "user": {"id": user.id, "name": user.name, "email": user.email},
    }

    return jsonify(response), 200

@user_routes.route("/generate-theme", methods=["POST"])
def generate_theme():
    """
    Generate a color theme from images
    ---
    tags:
      - Theme
    summary: Generate color theme
    consumes:
      - multipart/form-data
    security:
      - BearerAuth: []
    parameters:
      - in: formData
        name: images
        type: file
        required: true
        collectionFormat: multi
        description: List of images to extract colors from
      - in: formData
        name: compress
        type: boolean
        required: false
        enum:
          - "true"
          - "false"
        description: Whether to compress images before processing default is true
    responses:
      201:
        description: Theme created successfully
        examples:
          application/json:
              message: "User Themes"
              theme:
                  theme_id: 1
                  user_id: 1
                  background_color: "#12100d"
                  surface_color: "#05192d"
                  text_color: "#b2cbd0"
                  primary_color: "#227f9c"
                  secondary_color: "#cc1314"
      400:
        description: Invalid image upload or no images provided
        examples:
          application/json:
              error: "Did not get any Image"
      500:
        description: Server error
        examples:
          application/json:
              error: "Server Error"
    """
    current_user_id = verify_jwt()

    try:
      user = find_user_by_id(user_id=current_user_id)

      if(user is None):
          return jsonify({"error": "User not found"}), 404
      
      if "images" not in request.files:
          return jsonify({"error": "Did not get any Image"}), 400

      if request.files.getlist("images")[0].filename == "":
          return jsonify({"error": "Did not get any Image"}), 400

      colors = generate_colors(request.files.getlist("images"), request.form.get("compress", "true").lower() == "true")

      new_theme = add_theme(
          user_id=current_user_id,
          background_color=colors[0],
          surface_color=colors[1],
          text_color=colors[2],
          primary_color=colors[3],
          secondary_color=colors[4]
      )

      return jsonify(generate_theme_response("Theme Created", new_theme)), 201
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e) }), 500

@user_routes.route("/theme", methods=["GET"])
def get_user_themes():
    """
    Get all themes for the current user.
    ---
    tags:
      - Theme
    summary: Get user themes
    description: Retrieve a list of all themes associated with the currently authenticated user.
    security:
      - BearerAuth: []
    responses:
      200:
        description: List of themes
        examples:
          application/json:
              message: "User Themes"
              themes:
                - theme_id: 1
                  user_id: 1
                  background_color: "#12100d"
                  surface_color: "#05192d"
                  text_color: "#b2cbd0"
                  primary_color: "#227f9c"
                  secondary_color: "#cc1314"
                - theme_id: 2
                  user_id: 1
                  background_color: "#12100d"
                  surface_color: "#05192d"
                  text_color: "#b2cbd0"
                  primary_color: "#227f9c"
                  secondary_color: "#cc1314"
      401:
        description: Unauthorized - Invalid or missing JWT token
      500:
        description: Internal server error
    """
    current_user_id = verify_jwt()
    
    user = find_user_by_id(user_id=current_user_id)

    if(user is None):
      return jsonify({"error": "User not found"}), 404
    
    user_themes = get_themes(user_id=current_user_id)

    themes = []

    for theme in user_themes:
        themes.append(
            {
                "theme_id": theme.id,
                "user_id": theme.user_id,
                "background_color": theme.background_color,
                "surface_color": theme.surface_color,
                "text_color": theme.text_color,
                "primary_color": theme.primary_color,
                "secondary_color": theme.secondary_color,
            }
        )

    response = {
        "message": "User Themes",
        "themes": themes,
    }

    return jsonify(response), 200


@user_routes.route("/theme", methods=["PATCH"])
def update_user_theme():
    """
    Update a user's theme
    ---
    tags:
      - Theme
    summary: Update theme
    security:
      - BearerAuth: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - theme_id
            - background_color
            - surface_color
            - text_color
            - primary_color
            - secondary_color
          properties:
            theme_id:
              type: integer
            background_color:
              type: string
            surface_color:
              type: string
            text_color:
              type: string
            primary_color:
              type: string
            secondary_color:
              type: string
    responses:
      200:
        description: Theme updated
        examples:
          application/json:
              message: "Theme Updated"
              theme:
                  theme_id: 0
                  user_id: 1
                  background_color: "#12100d"
                  surface_color: "#05192d"
                  text_color: "#b2cbd0"
                  primary_color: "#227f9c"
                  secondary_color: "#cc1314"
      400:
        description: Missing required fields
        examples:
          application/json:
              error: "Missing required fields"
              missing_fields: []
    """
    verify_jwt()
    data = request.get_json()

    required_fields = [
        "theme_id",
        "background_color",
        "surface_color",
        "text_color",
        "primary_color",
        "secondary_color",
    ]

    if not all(field in data for field in required_fields):
        return (
            jsonify(
                {
                    "error": "Missing required fields",
                    "missing_fields": [
                        field for field in required_fields if field not in data
                    ],
                }
            ),
            400,
        )
    
    theme = get_theme(data['theme_id'])

    if not theme:
        return jsonify({"message": "Theme not found"}), 404

    theme = update_theme(
        theme_id=data["theme_id"],
        background_color=data["background_color"],
        surface_color=data["surface_color"],
        text_color=data["text_color"],
        primary_color=data["primary_color"],
        secondary_color=data["secondary_color"],
    )

    return jsonify(generate_theme_response("Theme Updated", theme)), 200


@user_routes.route("/theme", methods=["DELETE"])
def delete_user_theme():
    """
    Delete a user theme
    ---
    tags:
      - Theme
    summary: Delete theme
    security:
      - BearerAuth: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - theme_id
          properties:
            theme_id:
              type: integer
    responses:
      200:
        description: Theme deleted
        examples:
          application/json:
              message: "Theme Deleted"
              theme:
                  theme_id: 0
                  user_id: 1
                  background_color: "#12100d"
                  surface_color: "#05192d"
                  text_color: "#b2cbd0"
                  primary_color: "#227f9c"
                  secondary_color: "#cc1314"
      404:
        description: Theme not found
        examples:
          application/json:
              error: "Theme not found"
    """
    verify_jwt()
    data = request.get_json()

    theme = get_theme(data['theme_id'])

    if not theme:
        return jsonify({"message": "Theme not found"}), 404
    
    delete_theme(theme)

    return jsonify(generate_theme_response("Theme Deleted", theme)), 200

