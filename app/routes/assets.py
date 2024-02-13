from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.services import asset_svc
assets_bp = Blueprint('asset', __name__)


@assets_bp.route('/', methods=['GET'])
@jwt_required()
def get_assets():
    assets = asset_svc.get_all_assets()
    asset_list = [asset.to_dict() for asset in assets]
    return jsonify(asset_list)


@assets_bp.route('/<int:asset_id>', methods=['GET'])
@jwt_required()
def get_asset(asset_id):
    asset = asset_svc.get_asset_by_id(asset_id)
    if asset:
        return jsonify(asset.to_dict())

    return jsonify({'message': 'Asset not found'}), 404

