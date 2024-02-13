from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.utils.decorators import user_id_required
from app.services import transaction_svc
transactions_bp = Blueprint('transaction', __name__)


@transactions_bp.route('/', methods=['GET'])
@jwt_required()
@user_id_required
def get_user_transactions(user_id):
    transactions = transaction_svc.get_transactions_by_user_id(user_id)
    return jsonify(transactions)

