from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.services.user_service import UserService


users_bp = Blueprint('users', __name__)
user_service = UserService()


@users_bp.route('/', methods=['GET'])
@jwt_required()
def get_users():
    users = user_service.get_all_users()
    user_list = [user.to_dict() for user in users]
    return jsonify(user_list)


@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = user_service.get_user_by_id(user_id)
    if user:
        return jsonify(user.to_dict())
    return jsonify({'message': 'User not found'}), 404
