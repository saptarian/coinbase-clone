import datetime

from app.extensions import db


class Wallet(db.Model):
    __tablename__ = "wallet"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, nullable=False)
    crypto_id = db.Column(db.Integer, nullable=False)
    balance = db.Column(db.Numeric(precision=18, scale=8), default=0, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)

    def __init__(self, user_id, crypto_id, balance):
        self.user_id = user_id
        self.crypto_id = crypto_id
        self.balance = balance
        self.created_at = datetime.datetime.utcnow()

    def to_dict(self):
        # Convert wallet object to a dictionary for JSON response
        return {
            'id': self.id,
            'user_id': self.user_id,
            'crypto_id': self.crypto_id,
            'balance': float(self.balance),
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
