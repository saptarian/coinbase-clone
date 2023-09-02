import datetime

from app.extensions import db


class Transaction(db.Model):
    __tablename__ = "transaction"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    crypto_id = db.Column(db.Integer, nullable=False)
    transaction_type = db.Column(db.String(10), nullable=False)
    amount = db.Column(db.Numeric(precision=18, scale=8), nullable=False)
    price = db.Column(db.Numeric(precision=18, scale=8), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

    def __init__(self, user_id, crypto_id, transaction_type, amount, price):
        self.user_id = user_id
        self.crypto_id = crypto_id
        self.transaction_type = transaction_type
        self.amount = amount
        self.price = price
        self.timestamp = datetime.datetime.utcnow()

    def to_dict(self):
        # Convert transaction object to a dictionary for JSON response
        return {
            'id': self.id,
            'user_id': self.user_id,
            'crypto_id': self.crypto_id,
            'transaction_type': self.transaction_type,
            'amount': float(self.amount),
            'price': float(self.price),
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }
