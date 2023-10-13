from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.services.wallet_service import WalletService


wallets_bp = Blueprint('wallets', __name__)
wallet_service = WalletService()


@wallets_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_wallets(user_id):
    wallets = wallet_service.get_wallets_by_user_id(user_id)
    wallet_list = [wallet.to_dict() for wallet in wallets]
    return jsonify(wallet_list)


@wallets_bp.route('/test', methods=['GET'])
def get_test():

    pokemon_species = [
      {
        'name': 'bulbasaur',
        'url': 'https://pokeapi.co/api/v2/pokemon-species/1/'
      },
      {
        'name': 'charmander',
        'url': 'https://pokeapi.co/api/v2/pokemon-species/4/'
      },
    ]

    return jsonify(pokemon_species=pokemon_species)
