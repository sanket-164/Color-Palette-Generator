import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from datetime import timedelta

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["SECRET_KEY"] = "legends_are_building_this_project_right_now"
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "mysql+pymysql://root:@localhost:3307/color_palette"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["JWT_SECRET_KEY"] = "this_is_secret_you_should_not_read_this"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)

db = SQLAlchemy(app)

jwt = JWTManager(app)