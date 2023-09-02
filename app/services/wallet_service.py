from app.models.wallet import Wallet
from app.extensions import db


class WalletService:
    def create_wallet(self, user_id, crypto_id):
        new_wallet = Wallet(user_id=user_id, crypto_id=crypto_id)
        db.session.add(new_wallet)
        db.session.commit()
        return new_wallet

    def get_wallet_by_id(self, wallet_id):
        return Wallet.query.get(wallet_id)

    # Add more wallet-related services (update, transaction history, etc.) as needed
