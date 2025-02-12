from model.User import User
from sqlalchemy import or_
from config import db
import hashlib


def find_user(user_id=-1, email=""):
    return User.query.filter(or_(User.email == email, User.id == user_id)).first()


def create_user(name, email, password):
    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    new_user = User(name=name, email=email, password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return new_user


def update_user(user_id, name):
    pass
