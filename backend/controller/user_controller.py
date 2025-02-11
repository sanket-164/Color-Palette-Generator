from model.User import User
from config import db
import hashlib

def find_user(email):
    return User.query.filter_by(email=email).first()

def create_user(name, email, password):
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    
    new_user = User(name=name, email=email, password=hashed_password)
    
    db.session.add(new_user)
    db.session.commit()
    
    return new_user