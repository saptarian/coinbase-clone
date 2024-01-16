from flask import jsonify
from http import HTTPStatus
from functools import wraps
from flask_jwt_extended import get_jwt_identity

from app.services.user_service import UserService


user_service = UserService()

def user_id_required(func):
    @wraps(func)
    def decorator(*args, **kwargs):
        user_id = None 
        try:
            user_id = user_service.get_user_id(get_jwt_identity())
        except Exception as error:
            return jsonify(
                message=error
            ), HTTPStatus.EXPECTATION_FAILED

        if user_id is None:
            return jsonify(
                message='User not found'
            ), HTTPStatus.UNAUTHORIZED

        return func(user_id, *args, **kwargs)

    return decorator
