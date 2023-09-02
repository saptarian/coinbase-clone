from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.services.order_service import OrderService


orderbook_bp = Blueprint('orderbook', __name__)
order_service = OrderService()


@orderbook_bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    data = request.get_json()

    # Validate the input data
    if 'user_id' not in data or 'crypto_id' not in data or 'order_type' not in data or 'amount' not in data or 'price' not in data:
        return jsonify({'message': 'Missing required fields'}), 400

    user_id = data['user_id']
    crypto_id = data['crypto_id']
    order_type = data['order_type']
    amount = data['amount']
    price = data['price']

    # Ensure that user_id, crypto_id, and other fields are valid before creating an order
    # Implement your validation logic here

    order = order_service.create_order(user_id, crypto_id, order_type, amount, price)
    return jsonify({'message': 'Order created successfully'})


@orderbook_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    order = order_service.get_order_by_id(order_id)
    if order:
        return jsonify(order.to_dict())
    return jsonify({'message': 'Order not found'}), 404
