from config import db

class Theme(db.Model):
    __tabelname__ = 'theme'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    background_color = db.Column(db.String(10), nullable=False)
    surface_color = db.Column(db.String(10), nullable=False)
    text_color = db.Column(db.String(10), nullable=False)
    primary_color = db.Column(db.String(10), nullable=False)
    secondary_color = db.Column(db.String(10), nullable=False)

    def __repr__(self):
        return f"Theme({self.id}, {self.user_id}, {self.background_color}, {self.surface_color}, {self.text_color}, {self.primary_color}, {self.secondary_color})"
