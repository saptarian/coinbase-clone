from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.utils.decorators import user_id_required, catch_custom_exceptions
from app.services import order_svc, crypto_svc
from app.services.cache_service import PendingOrderService
from app.utils.helpers import generate_order_uuid, is_numeric
orderbook_bp = Blueprint('orderbook', __name__)
pending_order_svc = PendingOrderService()


def bad_start(msg: str):
    return jsonify(message='Cannot create order: {}'.format(msg)), 400


def bad_end(msg: str):
    return jsonify(message='Cannot complete order: {}'.format(msg)), 400


@orderbook_bp.route('/', methods=['POST'])
@catch_custom_exceptions
@jwt_required()
@user_id_required
def create_order(user_id):
    body = request.get_json()
    asset_symbol = body.get('asset_symbol')
    wallet_symbol = body.get('wallet_symbol')
    order_type = body.get('order_type')
    total = body.get('total')

    # Validate the input data
    if not asset_symbol or not wallet_symbol \
    or not order_type or not total \
    or not is_numeric(total) or float(total) <= 0 \
    or len(wallet_symbol.strip(' ')) < 2 \
    or len(asset_symbol.strip(' ')) < 2: 
        return bad_start('missing required fields')

    if asset_symbol == wallet_symbol:
        return bad_start('asset conflict')

    use_wallet = order_svc.get_user_wallet_by_asset_symbol(
        user_id, wallet_symbol
    )
    if not use_wallet:
        return bad_start('unexpected wallet')

    amount: float = 0.0
    price: float = crypto_svc.get_asset_price_by_symbol(asset_symbol)
    if not price or price <= 0: 
        return bad_start('unexpected asset price')

    if order_type != 'buy' and order_type != 'sell':
        return bad_start('something wrong')

    elif order_type == 'buy':
        if not use_wallet: 
            return bad_start('unexpected wallet')

        asset = order_svc.get_asset_by_symbol(symbol=asset_symbol)
        if not asset: 
            return bad_start('unexpected asset')

        wallet, _ = use_wallet
        
        amount = float(total) / price
        if wallet.balance < float(total):
            return bad_start('not enough balance')

    else: 
        # check user asset balance
        selling_asset = order_svc.get_user_wallet_by_asset_symbol(user_id, asset_symbol)
        if not selling_asset:
            return bad_start('unexpected selling asset')

        asset_wallet, asset = selling_asset
        wallet_balance_in_usd = float(asset_wallet.balance) * price
        if wallet_balance_in_usd < float(total):
            return bad_start('not enough asset')

        wallet, _ = use_wallet
        amount = float(total) / price


    # store order in temp cache with expired time
    new_order = {
        'uuid': generate_order_uuid(user_id),
        'asset_id': asset.id,
        'order_type': order_type,
        'amount': amount,
        'price': price,
        'status': 'pending',
        'timestamp': datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    }
    result = pending_order_svc.store(**{
        'user_id': user_id, 
        'wallet_id': wallet.id,
        **new_order
    })
    if not result: return bad_start('store failed')
    return jsonify(new_order)


@orderbook_bp.route('/complete', methods=['POST'])
@catch_custom_exceptions
@jwt_required()
@user_id_required
def complete_order(user_id):
    payload = request.get_json()
    uuid = payload.get('uuid')
    # Validate the input data
    if not uuid:
        return bad_end('missing order id')

    order = pending_order_svc.get(uuid)
    if not order: return bad_end('expired')

    wallet_id = order['wallet_id']
    asset_id = order['asset_id']
    order_type = order['order_type']
    amount = order['amount']
    price = order['price']

    if not wallet_id or not asset_id or not order_type \
    or not amount or not price: return bad_end('missing values') 

    if user_id != order['user_id'] \
    or uuid != order['uuid']:
        return bad_end('unexpected order')

    wallet = order_svc.get_wallet_by_id(wallet_id)
    if not wallet:
        return bad_end('unexpected wallet')

    asset = order_svc.get_user_wallet_by_asset_id(user_id, asset_id)

    if order_type != 'buy' and order_type != 'sell':
        return bad_end('something wrong')

    # create new wallet for this asset
    elif order_type == 'buy' and not asset:
        asset = order_svc.create_wallet(user_id, asset_id, balance=0)

    elif order_type == 'sell' and not asset:
        return bad_end('unexpected asset')

    # complete the order 
    if order_svc.is_order_exists(order['uuid'], order['user_id']):
        return bad_end('conflict order')

    new_order = order_svc.create_new_order(**{
        **order, 'status': 'fulfilled'
    })
    # new transaction
    new_transaction = order_svc.create_transaction(
        user_id= new_order.user_id, 
        order_id= new_order.id, 
        order_uuid= new_order.uuid, 
        transaction_type= new_order.order_type
    )

    if not new_transaction:
        return bad_end('transaction failed')

    total_price: float = float(amount) * float(price)

    if order_type == 'buy':
        wallet.balance = float(wallet.balance) - total_price
        asset.balance = float(asset.balance) + amount

    else:
        wallet.balance = float(wallet.balance) + total_price
        asset.balance = float(asset.balance) - amount

    order_svc.commit()

    return jsonify({
        **new_transaction.to_dict(),
        **{
            **new_order.to_dict(), 
            'price': float(price), 
            'amount': float(amount)
        }
    })

