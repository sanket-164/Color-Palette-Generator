from config import db

class User(db.Model):
    __tabelname__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(500), nullable=False)

    def __repr__(self):
        return f"User({self.name}, {self.email})"
