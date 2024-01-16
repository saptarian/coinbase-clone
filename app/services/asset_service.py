from app.models.asset import Asset
from app.extensions import db


class AssetService:
    def get_asset_by_id(self, asset):
        return Asset.query.get(asset)

    def get_all_assets(self):
        return Asset.query.all()

    def get_asset_by_symbol(self, symbol: str):
        return Asset.query.filter_by(symbol=symbol).first()

    