from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token,\
    jwt_required, get_jwt_identity, get_jwt

from app.extensions import bcrypt
from app.services.user_service import UserService
from app.services.blacklist_service import BlacklistService


auth_bp = Blueprint('auth', __name__)
user_service = UserService()
blacklist_service = BlacklistService()


@auth_bp.route('/signup', methods=['POST'])
def register():
    data = request.get_json()
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    password = data.get('password')

    return user_service.create_user(first_name, last_name, email, password)


@auth_bp.route('/signin', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = user_service.get_user_by_email(email)

    if user and user.check_password(password):
        return user_service.generate_token(user)

    return jsonify({'message': 'Invalid email or password'}), 401


# Endpoint for revoking the current users access token. Saved the unique
# identifier (jti) for the JWT into our database.
@auth_bp.route("/signout", methods=["DELETE"])
@jwt_required()
def modify_token():
    jti = get_jwt()["jti"]
    return blacklist_service.save_token(jti)


@auth_bp.route("/protected", methods=['GET'])
@jwt_required()
def protected():
    current_user = user_service.get_user_by_id(get_jwt_identity())
    jti = get_jwt()["jti"]
    return jsonify(message=f"Howdy {current_user.first_name} {current_user.last_name}",
        jti=jti)


# We are using the `refresh=True` options in jwt_required to only allow
# refresh tokens to access this route.
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token)