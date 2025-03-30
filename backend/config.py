import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from datetime import timedelta
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)

app.config["SECRET_KEY"] = os.getenv("SERVER_SECRET")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)

cors = CORS(app)

db = SQLAlchemy(app)

jwt = JWTManager(app)