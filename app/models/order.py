import datetime

from app.extensions import db


class OrderBook(db.Model):
    __tablename__ = "order_book"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    crypto_id = db.Column(db.Integer, nullable=False)
    order_type = db.Column(db.String(10), nullable=False)
    amount = db.Column(db.Numeric(precision=18, scale=8), nullable=False)
    price = db.Column(db.Numeric(precision=18, scale=8), nullable=False)
    status = db.Column(db.String(10), default='OPEN', nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

    def __init__(self, user_id, crypto_id, order_type, amount, price, status):
        self.user_id = user_id
        self.crypto_id = crypto_id
        self.order_type = order_type
        self.amount = amount
        self.price = price
        self.status = status
        self.timestamp = datetime.datetime.utcnow()

    def to_dict(self):
        # Convert order object to a dictionary for JSON response
        return {
            'id': self.id,
            'crypto_id': self.crypto_id,
            'order_type': self.order_type,
            'amount': float(self.amount),
            'price': float(self.price),
            'status': self.status,
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }
