from functools import wraps
from http import HTTPStatus

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, \
    get_jwt_identity, get_jwt, create_access_token

from app.services.user_service import UserService
from app.services.blacklist_service import BlacklistService


auth_bp = Blueprint('auth', __name__)
user_service = UserService()
blacklist_service = BlacklistService()


def user_id_required(func):
    @wraps(func)
    def decorator(*args, **kwargs):
        user = None 
        try:
            user = user_service.get_user_by_public_id(get_jwt_identity())
        except Exception as error:
            return jsonify(
                message=error
            ), HTTPStatus.EXPECTATION_FAILED

        if not user:
            return jsonify(
                message='User not found'
            ), HTTPStatus.BAD_REQUEST

        return func(user.id, *args, **kwargs)

    return decorator


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


@auth_bp.route("/profile", methods=['GET'])
@jwt_required()
@user_id_required
def get_profile(user_id):
    user_profile = user_service.get_profile(user_id)
    if not user_profile:
        return jsonify(
            message='Profile was not created yet'
        ), HTTPStatus.NOT_ACCEPTABLE

    identity, address, preference = user_profile
    return jsonify({
        'user': user_service.get_user_by_id(user_id).to_dict(),
        'identity': identity.to_dict(),
        'address': address.to_dict(),
        'preference': preference.to_dict(),
    })


@auth_bp.route("/user", methods=['GET'])
@jwt_required()
@user_id_required
def get_user(user_id):
    return jsonify(user_service.get_user_by_id(user_id).to_dict())


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
    identity = user_service.get_identity(user_id)
    if not identity:
        return '', HTTPStatus.ACCEPTED

    return '', HTTPStatus.NO_CONTENT


@auth_bp.route("/create/identity", methods=['POST'])
@jwt_required()
@user_id_required
def create_identity(user_id):
    identity = user_service.get_identity(user_id)
    if identity:
        return jsonify(
            message='Cannot create new identity'
        ), HTTPStatus.NOT_ACCEPTABLE

    body = request.get_json()
    user_service.create_profile(user_id, body)

    return '', HTTPStatus.CREATED


@auth_bp.route("/create/phone", methods=['POST'])
@jwt_required()
@user_id_required
def create_phone(user_id):
    phone = user_service.get_primary_phone(user_id)
    if phone:
        return jsonify(
            message='Cannot create new phone'
        ), HTTPStatus.NOT_ACCEPTABLE    

    body = request.get_json()
    user_service.create_phone_number(user_id, body)

    return '', HTTPStatus.CREATED


# We are using the `refresh=True` options in jwt_required to only allow
# refresh tokens to access this route.
# @auth_bp.route("/refresh", methods=["POST"])
# @jwt_required(refresh=True)
# def refresh():
#     identity = get_jwt_identity()
#     access_token = create_access_token(identity=identity)
#     return jsonify(access_token=access_token)