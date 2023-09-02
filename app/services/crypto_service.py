from app.models.crypto import Crypto
from app.extensions import db


class CryptoService:
    def get_crypto_by_id(self, crypto_id):
        return Crypto.query.get(crypto_id)

    def get_all_cryptos(self):
        return Crypto.query.all()

    # Add more cryptocurrency-related services as needed
