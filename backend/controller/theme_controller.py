from model.Theme import Theme
from config import db

def get_themes(user_id):
    return Theme.query.filter_by(user_id=user_id)

def add_theme(user_id, color_1, color_2, color_3, color_4, color_5):
    new_theme = Theme(user_id=user_id, color_1=color_1, color_2=color_2, color_3=color_3, color_4=color_4, color_5=color_5)
    
    db.session.add(new_theme)
    db.session.commit()
    
    return new_theme

def update_theme(theme_id, color_1, color_2, color_3, color_4, color_5):
    theme = Theme.query.get(theme_id)
    
    theme.color_1 = color_1
    theme.color_2 = color_2
    theme.color_3 = color_3
    theme.color_4 = color_4
    theme.color_5 = color_5

    db.session.commit()

    return theme