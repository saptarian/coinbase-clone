from http import HTTPStatus

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, \
    get_jwt_identity, get_jwt, create_access_token

from app.decorators import user_id_required
from app.services.user_service import UserService
from app.services.blacklist_service import BlacklistService


auth_bp = Blueprint('auth', __name__)
user_service = UserService()
blacklist_service = BlacklistService()


def generate_token(identity: int):
    try:
        token = create_access_token(identity=identity)
        return jsonify(access_token=token)

    except Exception as error:
        return jsonify(
            message=error
        ), HTTPStatus.EXPECTATION_FAILED


@auth_bp.route('/signup', methods=['POST'])
def register():
    body = request.get_json()

    # TODO: doing some validation
    new_user = user_service.create_user(body)

    if not new_user:
        return jsonify(
            message="Email already registered."
        ), HTTPStatus.CONFLICT
    
    return generate_token(new_user.public_id)


@auth_bp.route('/signin', methods=['POST'])
def login():
    body = request.get_json()
    email = body.get('email')
    password = body.get('password')

    user = user_service.get_user_by_email(email)

    if user and user.check_password(password):
        return generate_token(user.public_id)

    return jsonify(
        message='Invalid email or password'
    ), HTTPStatus.UNAUTHORIZED


# Endpoint for revoking the current users access token. 
# Saved the unique identifier (jti) for the JWT into our database.
@auth_bp.route("/signout", methods=["DELETE"])
@jwt_required()
def revoke_token():
    try:
        blacklist_service.save_token(get_jwt()["jti"])
        return jsonify(message='Successfully logged out.')

    except Exception as error:
        return jsonify(
            message=error
        ), HTTPStatus.EXPECTATION_FAILED


@auth_bp.route("/validate", methods=['GET'])
@jwt_required()
def validate_jwt():
    return '', HTTPStatus.ACCEPTED


@auth_bp.route("/validate/phone", methods=['GET'])
@jwt_required()
@user_id_required
def validate_phone(user_id):
    primary_phone = user_service.get_primary_phone(user_id)
    if not primary_phone:
        return '', HTTPStatus.ACCEPTED

    return '', HTTPStatus.NO_CONTENT


@auth_bp.route("/validate/identity", methods=['GET'])
@jwt_required()
@user_id_required
def validate_identity(user_id):
    # is user first setup identity
    identity_id = user_service.get_identity_id(user_id)
    if identity_id is None:
        return '', HTTPStatus.ACCEPTED

    return '', HTTPStatus.NO_CONTENT


# We are using the `refresh=True` options in jwt_required to only allow
# refresh tokens to access this route.
# @auth_bp.route("/refresh", methods=["POST"])
# @jwt_required(refresh=True)
# def refresh():
#     identity = get_jwt_identity()
#     access_token = create_access_token(identity=identity)
#     return jsonify(access_token=access_token)