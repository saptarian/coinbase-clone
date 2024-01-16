from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.decorators import user_id_required
from app.services.wallet_service import WalletService


wallets_bp = Blueprint('wallet', __name__)
wallet_service = WalletService()


@wallets_bp.route('/', methods=['GET'])
@jwt_required()
@user_id_required
def get_user_wallets(user_id):
    wallets = wallet_service.get_wallets_by_user_id(user_id)
    # wallet_list = [wallet.to_dict() for wallet in wallets]
    return jsonify(wallets)


@wallets_bp.route('/<string:symbol>', methods=['GET'])
@jwt_required()
@user_id_required
def get_user_wallet_by_symbol(user_id, symbol):
    wallet_asset = wallet_service.get_user_wallet_by_asset_symbol(user_id, symbol)
    if not wallet_asset:
        return jsonify({'message': 'Wallet not found'}), 404

    wallet, asset = wallet_asset
    wallet = wallet.to_dict()
    asset = asset.to_dict()
    alter_asset = {}
    alter_asset['asset_name'] = asset['name']
    alter_asset['asset_slug'] = asset['slug']
    alter_asset['asset_symbol'] = asset['symbol']
    alter_asset['asset_is_fiat'] = asset['is_fiat']
    alter_asset['asset_is_active'] = asset['is_active']
    wallet.update(alter_asset)
    return jsonify(wallet)

