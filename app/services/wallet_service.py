from app.models.wallet import Wallet
from app.models.asset import Asset
from app.extensions import db
from sqlalchemy import and_

from .asset_service import AssetService


class WalletService(AssetService):
    def create_wallet(self, user_id, asset_id, balance):
        new_wallet = Wallet(user_id, asset_id, balance)
        self.save_changes(new_wallet)
        return new_wallet

    def create_demo_wallet(self, user_id, asset_id):
        return self.create_wallet(user_id, asset_id, balance=5000)

    def get_wallet_by_id(self, wallet_id):
        return Wallet.query.get(wallet_id)

    def get_wallets_by_user_id(self, user_id):
        # Perform a join query to retrieve data from multiple tables 
        stmt = db.select(
            Wallet.balance,
            Wallet.inactive,
            Wallet.asset_id,
            Asset.name,
            Asset.slug,
            Asset.symbol,
            Asset.is_fiat,
            Asset.is_active
        ).select_from(Wallet).join(
            Asset, Wallet.asset_id == Asset.id
        ).filter(Wallet.user_id==user_id)
          
        results = db.session.execute(stmt)
        # print(stmt)

        rows = []
        for row in results: 
            balance, inactive, asset_id, name, slug, symbol, is_fiat, is_active = row
            rows.append({
                'balance': float(balance),
                'inactive': inactive,
                'asset_id': asset_id,
                'asset_name': name,
                'asset_slug': slug,
                'asset_symbol': symbol,
                'asset_is_fiat': is_fiat,
                'asset_is_active': is_active,
            })

        return rows


    def get_user_wallet_by_asset_id(self, user_id, asset_id):
        return Wallet.query.filter(
            and_(Wallet.user_id==user_id, 
                Wallet.asset_id==asset_id
        )).scalar()


    def get_user_wallet_by_asset_symbol(self, user_id, symbol):
        asset = self.get_asset_by_symbol(symbol=symbol)
        if not asset:
            return None

        return self.get_user_wallet_by_asset_id(user_id, asset.id), asset


    def commit(self):
        db.session.commit()

    def save_changes(self, data):
        db.session.add(data)
        db.session.commit()

