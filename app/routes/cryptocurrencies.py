from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.services.crypto_service import CryptoService


cryptocurrencies_bp = Blueprint('cryptocurrencies', __name__)
crypto_service = CryptoService()


@cryptocurrencies_bp.route('/', methods=['GET'])
@jwt_required()
def get_cryptocurrencies():
    cryptos = crypto_service.get_all_cryptos()
    crypto_list = [crypto.to_dict() for crypto in cryptos]
    return jsonify(crypto_list)


@cryptocurrencies_bp.route('/<int:crypto_id>', methods=['GET'])
@jwt_required()
def get_crypto(crypto_id):
    crypto = crypto_service.get_crypto_by_id(crypto_id)
    if crypto:
        return jsonify(crypto.to_dict())
    return jsonify({'message': 'Cryptocurrency not found'}), 404
