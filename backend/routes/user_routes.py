from flask import Blueprint, jsonify, request
from controller.user_controller import find_user_by_id, update_user
from controller.theme_controller import get_theme, get_themes, add_theme, update_theme, delete_theme
from middleware.jwt_authentication import verify_jwt
from image_processing import get_image_pixels, generate_colors

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
            email:
              type: string
    responses:
      200:
        description: Profile updated
    """
    current_user_id = verify_jwt()
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
        description: List of images to extract colors from
    responses:
      200:
        description: Theme created successfully
      400:
        description: Invalid image upload
      500:
        description: Server error
    """
    # current_user_id = verify_jwt()
    try:
        if "images" not in request.files:
            return "No file part", 400

        if request.files.getlist("images")[0].filename == "":
            return jsonify({"error": "Did not get any Image"}), 400

        colors = generate_colors(request.files.getlist("images"))

        new_theme = add_theme(
            user_id=1,
            background_color=colors[0],
            surface_color=colors[1],
            text_color=colors[2],
            primary_color=colors[3],
            secondary_color=colors[4]
        )

        return jsonify(generate_theme_response("Theme Created", new_theme)), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e) }), 500

@user_routes.route("/theme", methods=["GET"])
def get_user_themes():
    """
    Get all themes for the current user
    ---
    tags:
      - Theme
    summary: Get user themes
    security:
      - BearerAuth: []
    responses:
      200:
        description: List of themes
    """
    current_user_id = verify_jwt()
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
      400:
        description: Missing required fields
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
                    "message": "Missing required fields",
                    "missing_fields": [
                        field for field in required_fields if field not in data
                    ],
                }
            ),
            400,
        )

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
      404:
        description: Theme not found
    """
    verify_jwt()
    data = request.get_json()

    theme = get_theme(data['theme_id'])

    if not theme:
        return jsonify({"message": "Theme not found"}), 404
    
    delete_theme(theme)

    return jsonify(generate_theme_response("Theme Deleted", theme)), 200

