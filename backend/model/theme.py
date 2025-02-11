from server import db

class Theme(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key=True)
    img = db.Column(db.String(100), nullable=False)
    color_1 = db.Column(db.String(10), nullable=False)
    color_2 = db.Column(db.String(10), nullable=False)
    color_3 = db.Column(db.String(10), nullable=False)
    color_4 = db.Column(db.String(10), nullable=False)
    color_5 = db.Column(db.String(10), nullable=False)