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
                "color_1": theme.color_1,
                "color_2": theme.color_2,
                "color_3": theme.color_3,
                "color_4": theme.color_4,
                "color_5": theme.color_5,
            },
        }

    return response

@user_routes.route("/", methods=["GET"])
def user_hello():
    return jsonify({"message": "Hello from user"}), 200


@user_routes.route("/profile", methods=["GET", "PATCH"])
def user_profile():
    current_user_id = verify_jwt()
    if request.method == "GET":

        user = find_user_by_id(user_id=current_user_id)

        response = {
            "message": "User Profile",
            "user": {"id": user.id, "name": user.name, "email": user.email},
        }

        return jsonify(response), 200

    if request.method == "PATCH":
        user = update_user(user_id=current_user_id, data=request.get_json())

        response = {
            "message": "Profile Updated",
            "user": {"id": user.id, "name": user.name, "email": user.email},
        }

        return jsonify(response), 200


@user_routes.route("/generate-theme", methods=["POST"])
def generate_theme():
    # current_user_id = verify_jwt()
    try:
        if "images" not in request.files:
            return "No file part", 400

        if request.files.getlist("images")[0].filename == "":
            return jsonify({"error": "Did not get any Image"}), 400

        image_pixels = get_image_pixels(request.files.getlist("images"))
        colors = generate_colors(image_pixels, k=5)

        new_theme = add_theme(
            user_id=1,
            color_1=colors[0],
            color_2=colors[1],
            color_3=colors[2],
            color_4=colors[3],
            color_5=colors[4]
        )

        return jsonify(generate_theme_response("Theme Created", new_theme)), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e) }), 500


@user_routes.route("/theme", methods=["GET", "PATCH", "DELETE"])
def user_theme():
    current_user_id = verify_jwt()
    if request.method == "GET":
        user_themes = get_themes(user_id=current_user_id)

        themes = []

        for theme in user_themes:
            themes.append(
                {
                    "theme_id": theme.id,
                    "user_id": theme.user_id,
                    "color_1": theme.color_1,
                    "color_2": theme.color_2,
                    "color_3": theme.color_3,
                    "color_4": theme.color_4,
                    "color_5": theme.color_5,
                }
            )

        response = {
            "message": "User Themes",
            "themes": themes,
        }

        return jsonify(response), 200

    if request.method == "PATCH":
        data = request.get_json()

        required_fields = [
            "theme_id",
            "color_1",
            "color_2",
            "color_3",
            "color_4",
            "color_5",
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
            color_1=data["color_1"],
            color_2=data["color_2"],
            color_3=data["color_3"],
            color_4=data["color_4"],
            color_5=data["color_5"],
        )

        return jsonify(generate_theme_response("Theme Updated", theme)), 200
    
    if request.method == 'DELETE':
        data = request.get_json()

        theme = get_theme(data['theme_id'])

        if not theme:
            return jsonify({"message": "Theme not found"}), 404
        
        delete_theme(theme)

        return jsonify(generate_theme_response("Theme Deleted", theme)), 200
