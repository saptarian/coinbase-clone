from flask import jsonify
from functools import wraps
from flask_jwt_extended import get_jwt_identity
from requests.exceptions import ConnectionError, \
    Timeout, TooManyRedirects, RequestException
from redis.exceptions import ConnectionError as RdsConnErr

from app.services.user_service import UserService


svc = UserService()

def user_id_required(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        user_id = None 
        try:
            user_id = svc.get_user_id(get_jwt_identity())
        except Exception as e:
            return jsonify(
                message=f"A {type(e).__name__} has occurred"
            ), 417
        if user_id is None: 
            return jsonify(message='User required'), 401
        return func(*args, **{**kwargs, 'user_id': user_id})
    return decorated_function


def catch_custom_exceptions(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except (RequestException, ConnectionError, 
                Timeout, TooManyRedirects, RdsConnErr,
                ValueError, KeyError, IndexError) as error:
            msg = f"A {type(error).__name__} has occurred"
            match error:
                case Timeout():
                    return jsonify(message=msg), 408
                case ConnectionError():
                    return jsonify(message=msg), 500
                case ValueError():
                    return jsonify(message=msg), 500
                case KeyError():
                    return jsonify(message=msg), 500
                case IndexError():
                    return jsonify(message=msg), 500
                case RdsConnErr():
                    return jsonify(message=msg), 500
            return jsonify(message=msg), 400
    return decorated_function


