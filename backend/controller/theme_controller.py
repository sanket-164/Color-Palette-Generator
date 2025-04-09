from model.Theme import Theme
from config import db

def get_theme(theme_id):
    return Theme.query.filter_by(id=theme_id).first()

def get_themes(user_id):
    return Theme.query.filter_by(user_id=user_id)

def add_theme(user_id, background_color, surface_color, text_color, primary_color, secondary_color):
    new_theme = Theme(user_id=user_id, background_color=background_color, surface_color=surface_color, text_color=text_color, primary_color=primary_color, secondary_color=secondary_color)
    
    db.session.add(new_theme)
    db.session.commit()
    
    return new_theme

def update_theme(theme_id, background_color, surface_color, text_color, primary_color, secondary_color):
    theme = Theme.query.get(theme_id)
    
    theme.background_color = background_color
    theme.surface_color = surface_color
    theme.text_color = text_color
    theme.primary_color = primary_color
    theme.secondary_color = secondary_color

    db.session.commit()

    return theme

def delete_theme(theme):
    db.session.delete(theme)  # Delete the theme
    db.session.commit()