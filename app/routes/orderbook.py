from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.decorators import user_id_required
from app.services.order_service import OrderService


orderbook_bp = Blueprint('orderbook', __name__)
order_service = OrderService()


@orderbook_bp.route('/', methods=['POST'])
@jwt_required()
@user_id_required
def create_order(user_id):
    data = request.get_json()

    # Validate the input data
    if 'asset_symbol' not in data \
    or 'wallet_symbol' not in data \
    or 'order_type' not in data \
    or 'total' not in data \
    or data['asset_symbol'] == data['wallet_symbol']:
        return jsonify({'message': 'Missing required fields'}), 400

    # Ensure that user_id, crypto_id, and other fields are valid before creating an order
    # Implement validation logic here

    new_order = order_service.create_order(
        user_id=user_id, 
        asset_symbol=data['asset_symbol'], 
        total=data['total'],
        wallet_symbol=data['wallet_symbol'],
        order_type=data['order_type']
    )
    if not new_order:
        return jsonify({'message': 'Cannot create order'}), 400

    return new_order.to_dict()


@orderbook_bp.route('/complete', methods=['POST'])
@jwt_required()
@user_id_required
def complete_order(user_id):
    data = request.get_json()

    # Validate the input data
    if 'uuid' not in data:
        return jsonify({'message': 'Missing order id'}), 400

    transaction_order = order_service.set_complete_order(
        user_id=user_id, 
        uuid=data['uuid']
    )
    if not transaction_order:
        return jsonify({'message': 'Cannot complete order'}), 400

    new_transaction, fulfilled_order = transaction_order
    new_transaction = new_transaction.to_dict()
    fulfilled_order = fulfilled_order.to_dict()
    new_transaction.update(fulfilled_order)
    # new_transaction.pop('uuid')
    # fulfilled_order.pop('id')
    return jsonify(new_transaction)


@orderbook_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    order = order_service.get_order_by_id(order_id)
    if order:
        return jsonify(order.to_dict())
    return jsonify({'message': 'Order not found'}), 404
