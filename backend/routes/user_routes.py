from flask import Blueprint, jsonify, request
from controller.user_controller import find_user, update_user
from controller.theme_controller import get_themes, add_theme, update_theme
from middleware.jwt_authentication import verify_jwt
from image_processing import get_image_pixels, generate_colors


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


@user_routes.route("/generate-theme", methods=["POST"])
def generate_theme():
    current_user_id = verify_jwt()
    try:
        if "images" not in request.files:
            return "No file part", 400

        if request.files.getlist("images")[0].filename == "":
            return jsonify({"error": "Did not get any Image"}), 400

        image_pixels = get_image_pixels(request.files.getlist("images"))
        colors = generate_colors(image_pixels, k=5)

        hexa_values = []

        for color in colors:
            red = hex(color[0]).split("0x")[1].rstrip()
            green = hex(color[1]).split("0x")[1].rstrip()
            blue = hex(color[2]).split("0x")[1].rstrip()

            red = red if len(red) else red + "0"
            green = green if len(green) else green + "0"
            blue = blue if len(blue) else blue + "0"

            hexa_values.append(f"#{red}{green}{blue}")

        new_theme = add_theme(
            user_id=current_user_id,
            color_1=hexa_values[0],
            color_2=hexa_values[1],
            color_3=hexa_values[2],
            color_4=hexa_values[3],
            color_5=hexa_values[4],
        )

        response = {
            "message": "Theme Created",
            "theme": {
                "theme_id": new_theme.id,
                "user_id": new_theme.user_id,
                "color_1": new_theme.color_1,
                "color_2": new_theme.color_2,
                "color_3": new_theme.color_3,
                "color_4": new_theme.color_4,
                "color_5": new_theme.color_5,
            },
        }

        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": e}), 500


@user_routes.route("/theme", methods=["GET", "PATCH"])
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

        response = {
            "message": "Theme Updated",
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

        return jsonify(response), 200
