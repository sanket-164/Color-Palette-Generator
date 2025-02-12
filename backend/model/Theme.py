from config import db

class Theme(db.Model):
    __tabelname__ = 'theme'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    color_1 = db.Column(db.String(10), nullable=False)
    color_2 = db.Column(db.String(10), nullable=False)
    color_3 = db.Column(db.String(10), nullable=False)
    color_4 = db.Column(db.String(10), nullable=False)
    color_5 = db.Column(db.String(10), nullable=False)

    def __repr__(self):
        return f"Theme({self.id}, {self.user_id}, {self.color_1}, {self.color_2}, {self.color_3}, {self.color_4}, {self.color_5})"
