from flask_jwt_extended import jwt_required, get_jwt_identity

@jwt_required()
def verify_jwt():
    return get_jwt_identity()