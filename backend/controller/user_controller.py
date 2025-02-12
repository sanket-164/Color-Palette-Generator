from model.User import User
from config import db
import hashlib


def find_user(user_id=-1, email=""):
    if user_id != -1 and email == "":
        return User.query.filter_by(id=user_id).first()
    elif user_id == -1 and email != "":
        return User.query.filter_by(email=email).first()


def create_user(name, email, password):
    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    new_user = User(name=name, email=email, password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return new_user


def update_user(user_id, data):
    user = User.query.get(user_id)

    if "name" in data:
        user.name = data["name"]

    db.session.commit()

    return user
