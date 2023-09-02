from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.services.transaction_service import TransactionService


transactions_bp = Blueprint('transactions', __name__)
transaction_service = TransactionService()


@transactions_bp.route('/', methods=['POST'])
@jwt_required()
def create_transaction():
    data = request.get_json()

    # Validate the input data
    if 'user_id' not in data or 'crypto_id' not in data or 'transaction_type' not in data or 'amount' not in data or 'price' not in data:
        return jsonify({'message': 'Missing required fields'}), 400

    user_id = data['user_id']
    crypto_id = data['crypto_id']
    transaction_type = data['transaction_type']
    amount = data['amount']
    price = data['price']

    # Ensure that user_id, crypto_id, and other fields are valid before creating a transaction
    # Implement your validation logic here

    transaction = transaction_service.create_transaction(user_id, crypto_id, transaction_type, amount, price)
    return jsonify({'message': 'Transaction created successfully'})


@transactions_bp.route('/<int:transaction_id>', methods=['GET'])
@jwt_required()
def get_transaction(transaction_id):
    transaction = transaction_service.get_transaction_by_id(transaction_id)
    if transaction:
        return jsonify(transaction.to_dict())
    return jsonify({'message': 'Transaction not found'}), 404
