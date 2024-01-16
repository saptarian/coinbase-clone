import os
from http import HTTPStatus

from flask import Blueprint, jsonify, request, abort, \
    send_from_directory, current_app
    
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename

from app.decorators import user_id_required
from app.services.user_service import UserService


users_bp = Blueprint('user', __name__)
user_service = UserService()


@users_bp.route("/", methods=['GET'])
@jwt_required()
@user_id_required
def get_user(user_id):
    return jsonify(user_service.get_user_by_id(user_id).to_dict())


@users_bp.route("/profile", methods=['GET'])
@jwt_required()
@user_id_required
def get_profile(user_id):
    user_profile = user_service.get_profile(user_id)
    if not user_profile:
        return jsonify(
            message='Profile was not created yet'
        ), HTTPStatus.NOT_ACCEPTABLE

    identity, address, preference, phone_numbers = user_profile
    return jsonify({
        'user': user_service.get_user_by_id(user_id).to_dict(),
        'identity': identity.to_dict(),
        'address': address.to_dict(),
        'preference': preference.to_dict(),
        'phone_numbers': list(number.to_dict(reveal=True) for number in phone_numbers),
    })


@users_bp.route("/phones", methods=['GET'])
@jwt_required()
@user_id_required
def get_phones(user_id):
    phone_numbers = user_service.get_list_of_phone_numbers(user_id)
    if not phone_numbers or not len(phone_numbers):
        return jsonify(
            message='Something went wrong'
        ), HTTPStatus.NOT_ACCEPTABLE

    return jsonify({
        'phone_numbers': list(number.to_dict(reveal=True) for number in phone_numbers),
    })


@users_bp.route("/create/identity", methods=['POST'])
@jwt_required()
@user_id_required
def create_identity(user_id):
    identity_id = user_service.get_identity_id(user_id)
    if identity_id is not None:
        return jsonify(
            message='Cannot create new identity'
        ), HTTPStatus.NOT_ACCEPTABLE

    body = request.get_json()
    user_service.create_profile(user_id, body)

    return '', HTTPStatus.CREATED


@users_bp.route("/create/phone", methods=['POST'])
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


@users_bp.route('/update/email', methods=['POST'])
@jwt_required()
@user_id_required
def update_email(user_id):
    body = request.get_json()
    email = body.get('email')

    if not email:
        return jsonify(
            message='Cannot update email'
        ), HTTPStatus.NOT_ACCEPTABLE    

    user_service.update_user(user_id, { 
        'email': email 
    })
    return '', HTTPStatus.CREATED


@users_bp.route('/update', methods=['POST'])
@jwt_required()
@user_id_required
def update_user(user_id):
    body = request.get_json()
    display_name = body.get('display_name')
    values = {}

    if not display_name:
        return jsonify(
            message='Cannot update user'
        ), HTTPStatus.NOT_ACCEPTABLE    

    if display_name:
        values['display_name'] = display_name

    user_service.update_user(user_id, values)
    return '', HTTPStatus.CREATED


@users_bp.route("/add/phone", methods=['POST'])
@jwt_required()
@user_id_required
def add_phone(user_id):
    body = request.get_json()
    number = body.get('number')

    if not number or number in user_service.\
            get_all_user_phone_number(user_id):
        return jsonify(
            message='Cannot add new phone number'
        ), HTTPStatus.NOT_ACCEPTABLE

    user_service.add_phone_number(user_id, number)
    return '', HTTPStatus.CREATED


@users_bp.route("/update/primary-phone", methods=['POST'])
@jwt_required()
@user_id_required
def set_primary_phone(user_id):
    body = request.get_json()
    number = body.get('number')

    list_numbers = user_service.\
        get_all_user_phone_number(user_id)
    print('set_primary_phone', number, list_numbers)

    if not number or number not in list_numbers:
        return jsonify(
            message='Cannot do that'
        ), HTTPStatus.NOT_ACCEPTABLE

    user_service.update_primary_number(user_id, number)
    return '', HTTPStatus.CREATED


# @users_bp.route("/debug", methods=['GET'])
# def debug_phone():
#     user_service.remove_phone_number(8, '123123123')
#     return '', HTTPStatus.NO_CONTENT


@users_bp.route("/phone", methods=['POST'])
@jwt_required()
@user_id_required
def delete_phone(user_id):
    body = request.get_json()
    number = body.get('number')

    if not number or number not in user_service.\
            get_all_user_phone_number(user_id):
        return jsonify(
            message='Cannot delete phone number'
        ), HTTPStatus.NOT_ACCEPTABLE

    user_service.remove_phone_number(user_id, number)
    return '', HTTPStatus.NO_CONTENT


@users_bp.route('/update/avatar', methods=['POST'])
@jwt_required()
@user_id_required
def update_avatar(user_id):
    avatar = request.files['avatar']
    filename = secure_filename(avatar.filename)

    if filename != '':
        file_ext = os.path.splitext(filename)[1]
        if file_ext not in ['.jpg', '.png']:
            abort(400)

        save_dir = os.path.join(
            current_app.config['UPLOAD_PATH'], 
            get_jwt_identity()
        )

        if not os.path.exists(save_dir):
            os.makedirs(save_dir)

        avatar.save(os.path.join(save_dir, 'avatar.png'))
        user_service.update_user(user_id, {
            'photo_url': '/user/avatar'
        })

    return '', HTTPStatus.CREATED


@users_bp.route('/avatar', methods=['GET'])
@jwt_required()
def get_avatar():
    try:
        return send_from_directory(
            os.path.join(
                current_app.config['UPLOAD_PATH'], 
                get_jwt_identity()
            ),
            'avatar.png'
        )
    except Exception as e:
        return '', HTTPStatus.NO_CONTENT


@users_bp.route('/update/password', methods=['POST'])
@jwt_required()
@user_id_required
def update_password(user_id):
    body = request.get_json()
    password = body.get('password')
    new_password = body.get('new_password')

    if not password or not new_password:
        return jsonify(
            message='Cannot update password'
        ), HTTPStatus.NOT_ACCEPTABLE    

    user = user_service.update_password(user_id, password, new_password)

    if not user:
        return jsonify(
            message='Invalid password'
        ), HTTPStatus.NOT_ACCEPTABLE 

    return '', HTTPStatus.CREATED


@users_bp.route('/update/date_of_birth', methods=['POST'])
@jwt_required()
@user_id_required
def update_date_of_birth(user_id):
    body = request.get_json()

    if 'date_of_birth' not in body:
        return jsonify(
            message='Cannot update identity'
        ), HTTPStatus.NOT_ACCEPTABLE    

    user_service.update_date_of_birth(user_id, body['date_of_birth'])
    return '', HTTPStatus.CREATED
    

@users_bp.route('/update/address', methods=['POST'])
@jwt_required()
@user_id_required
def update_address(user_id):
    address = request.get_json()

    if 'street' not in address or \
       'unit' not in address or \
       'city' not in address or \
       'postal_code' not in address or \
       'country' not in address:
        return jsonify(
            message='Cannot update address'
        ), HTTPStatus.NOT_ACCEPTABLE    

    user_service.update_address(user_id, address)
    return '', HTTPStatus.CREATED


@users_bp.route("/phone", methods=['GET'])
@jwt_required()
@user_id_required
def get_phone(user_id):
    return jsonify(
        user_service.get_primary_phone(
            user_id).to_dict(reveal=True
        )
    )
