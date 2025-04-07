from flask import jsonify
from config import app, db
from routes.auth_routes import auth_routes
from routes.user_routes import user_routes

@app.route("/")
def get():
    """
    A simple hello endpoint.
    ---
    responses:
      200:
        description: Returns a greeting
        examples:
          application/json: { "message": "Hello, world!" }
    """
    return jsonify({"message": "Hello world!"}), 200
    
app.register_blueprint(auth_routes, url_prefix='/auth')
app.register_blueprint(user_routes, url_prefix='/user')

if __name__ == "__main__":
    app.app_context().push()
    db.create_all()
    app.run(debug=True)
