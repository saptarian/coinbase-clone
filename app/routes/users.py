from os import path, makedirs
from http import HTTPStatus
from flask import Blueprint, jsonify, request, \
    send_from_directory, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename

from app.utils.decorators import user_id_required
from app.services import user_svc
users_bp = Blueprint('user', __name__)


@users_bp.route("/", methods=['GET'])
@jwt_required()
@user_id_required
def get_user(user_id):
    return jsonify(user_svc.get_user_by_id(user_id).to_dict())


@users_bp.route("/profile", methods=['GET'])
@jwt_required()
@user_id_required
def get_profile(user_id):
    user_profile = user_svc.get_profile(user_id)
    if not user_profile:
        return jsonify(
            message='Profile was not created yet'
        ), HTTPStatus.NOT_ACCEPTABLE

    identity, address, preference, phone_numbers = user_profile
    return jsonify({
        'user': user_svc.get_user_by_id(user_id).to_dict(),
        'identity': identity.to_dict(),
        'address': address.to_dict(),
        'preference': preference.to_dict(),
        'phone_numbers': list(
            number.to_dict(reveal=True) for number \
            in sorted(phone_numbers, key=lambda x: int(not x.is_primary))
        ),
    })


@users_bp.route("/phones", methods=['GET'])
@jwt_required()
@user_id_required
def get_phones(user_id):
    phone_numbers = user_svc.get_list_of_phone_numbers(user_id)
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
    identity_id = user_svc.get_identity_id(user_id)
    if identity_id is not None:
        return jsonify(message='Cannot create new identity'), 400

    payload = request.get_json()
    payload_required = ['identity', 'address', 'analytic']
    for k in payload_required:
        if k not in payload:
            return jsonify(message='Missing some payload'), 400

    if not payload['identity'].get('date_of_birth'):
        return jsonify(message='Missing date of birth'), 400

    address_required = ['street', 'city', 'postal_code', 'country']
    for k in address_required:
        if k not in payload['address']:
            return jsonify(message='Missing address field'), 400

    user_svc.create_profile(user_id, payload)
    return '', HTTPStatus.CREATED


@users_bp.route("/create/phone", methods=['POST'])
@jwt_required()
@user_id_required
def create_phone(user_id):
    phone = user_svc.get_primary_phone(user_id)
    if phone:
        return jsonify(message='Cannot create new phone'), 400

    body = request.get_json()
    if not body.get('phone_number') \
    or len(body.get('phone_number').strip(' ')) <= 6:
        return jsonify(message='Invalid phone number'), 400

    user_svc.create_phone_number(user_id, body)
    return '', HTTPStatus.CREATED


@users_bp.route('/update/email', methods=['POST'])
@jwt_required()
@user_id_required
def update_email(user_id):
    body = request.get_json()
    if not body.get('email'): 
        return jsonify(message='Missing required field'), 400

    user_svc.update_user(user_id, {'email': body['email']})
    return '', HTTPStatus.CREATED


@users_bp.route('/update', methods=['POST'])
@jwt_required()
@user_id_required
def update_user(user_id):
    body = request.get_json()
    # currently only accept display name only instead real identity
    #   which is required some document validation checking
    display_name = body.get('display_name')
    if not display_name:
        return jsonify(message='Missing required field'), 400

    user_svc.update_user(user_id, {'display_name': display_name})
    return '', HTTPStatus.CREATED


@users_bp.route("/add/phone", methods=['POST'])
@jwt_required()
@user_id_required
def add_phone(user_id):
    body = request.get_json()
    number = body.get('number')
    if not number or number \
    in user_svc.get_all_user_phone_number(user_id):
        return jsonify(message='Cannot add this phone number'), 400

    user_svc.add_phone_number(user_id, number)
    return '', HTTPStatus.CREATED


@users_bp.route("/update/primary-phone", methods=['POST'])
@jwt_required()
@user_id_required
def set_primary_phone(user_id):
    body = request.get_json()
    number = body.get('number')
    if not number or number not \
    in user_svc.get_all_user_phone_number(user_id):
        return jsonify(message='Invalid phone number'), 400

    user_svc.update_primary_number(user_id, number)
    return '', HTTPStatus.CREATED


@users_bp.route("/phone", methods=['POST'])
@jwt_required()
@user_id_required
def delete_phone(user_id):
    body = request.get_json()
    number = body.get('number')
    if not number or number not \
    in user_svc.get_all_user_phone_number(user_id):
        return jsonify(message='Invalid phone number'), 400

    user_svc.remove_phone_number(user_id, number)
    return '', HTTPStatus.NO_CONTENT


@users_bp.route('/update/avatar', methods=['POST'])
@jwt_required()
@user_id_required
def update_avatar(user_id):
    avatar = request.files['avatar']
    filename = secure_filename(avatar.filename)
    if filename == '':
        return jsonify(message='Invalid file name'), 400

    file_ext = path.splitext(filename)[1]
    if file_ext not in current_app.config['UPLOAD_EXTENSIONS']:
        return jsonify(message='Invalid file type'), 400

    save_dir = path.join(
        current_app.config['UPLOAD_PATH'], 
        get_jwt_identity()
    )
    if not path.exists(save_dir): makedirs(save_dir)
    avatar.save(path.join(save_dir, 'avatar.png'))
    user_svc.update_user(user_id, {'photo_url': '/user/avatar'})
    return '', HTTPStatus.CREATED


@users_bp.route('/avatar', methods=['GET'])
@jwt_required()
def get_avatar():
    try:
        return send_from_directory(
            path.join(
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
    if not body.get('password') \
    or not body.get('new_password'):
        return jsonify(message='Missing required field'), 400

    user = user_svc.update_password(
        user_id, body['password'], body['new_password']
    )
    if user: return '', HTTPStatus.CREATED
    return jsonify(message='Wrong Old password'), 400


@users_bp.route('/update/date_of_birth', methods=['POST'])
@jwt_required()
@user_id_required
def update_date_of_birth(user_id):
    body = request.get_json()
    if not body.get('date_of_birth'):
        return jsonify(message='Missing required field'), 400

    user_svc.update_date_of_birth(user_id, body['date_of_birth'])
    return '', HTTPStatus.CREATED
    

@users_bp.route('/update/address', methods=['POST'])
@jwt_required()
@user_id_required
def update_address(user_id):
    address = request.get_json()
    if not address.get('street') \
    or not address.get('unit') \
    or not address.get('city') \
    or not address.get('postal_code') \
    or not address.get('country'):
        return jsonify(message="Missing some field"), 400

    user_svc.update_address(user_id, address)
    return '', HTTPStatus.CREATED


@users_bp.route("/phone", methods=['GET'])
@jwt_required()
@user_id_required
def get_phone(user_id):
    return jsonify(
        user_svc.get_primary_phone(
            user_id).to_dict(reveal=True
        )
    )
