from http import HTTPStatus
from typing import Union
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, \
    get_jwt_identity, get_jwt, create_access_token

from app.utils.decorators import user_id_required
from app.utils.helpers import id_email_valid
from app.services import user_svc, blacklist_svc
auth_bp = Blueprint('auth', __name__)


def generate_token(identity: Union[int, str]):
    try:
        return jsonify(
            access_token=create_access_token(identity=identity)
        )
    except Exception as error:
        return jsonify(
            message=error
        ), HTTPStatus.EXPECTATION_FAILED


@auth_bp.route('/signup', methods=['POST'])
def register():
    body = request.get_json()
    if not body.get('email') or not body.get('first_name') \
    or not body.get('last_name') or not body.get('password'):
        return jsonify(message="Missing some payload"), 400

    if not id_email_valid(body['email']) \
    or len(body['password']) < 6:
        return jsonify(message="Some payload invalid"), 400

    if user_svc.is_user_exist(body['email']):
        return jsonify(
            message="Email already registered"
        ), HTTPStatus.CONFLICT

    new_user = user_svc.create_user(body)    
    return generate_token(new_user.public_id)


@auth_bp.route('/signin', methods=['POST'])
def login():
    body = request.get_json()
    if not body.get('email') or not body.get('password'):
        return jsonify(message="Missing required payload"), 400

    user = user_svc.get_user_by_email(body['email'])
    if user and user.check_password(body['password']):
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
        blacklist_svc.save_token(get_jwt()["jti"])
        return jsonify(message='Logged out')
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
    primary_phone = user_svc.get_primary_phone(user_id)
    if not primary_phone:
        return '', HTTPStatus.ACCEPTED

    return '', HTTPStatus.NO_CONTENT


@auth_bp.route("/validate/identity", methods=['GET'])
@jwt_required()
@user_id_required
def validate_identity(user_id):
    # is user first setup identity
    identity_id = user_svc.get_identity_id(user_id)
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