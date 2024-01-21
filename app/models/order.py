from datetime import datetime
from sqlalchemy.orm import relationship 
from app.extensions import db


class OrderBook(db.Model):
    __tablename__ = "order_books"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    asset_id = db.Column(db.Integer, db.ForeignKey('assets.id'))
    wallet_id = db.Column(db.Integer, db.ForeignKey('wallets.id'))
    order_type = db.Column(db.String(20), nullable=False)
    amount = db.Column(db.Numeric(precision=36, scale=22), nullable=False)
    price = db.Column(db.Numeric(precision=36, scale=22), nullable=False)
    status = db.Column(db.String(20), default='pending', nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    uuid = db.Column(db.String(30), unique=True)
    asset = relationship("Asset")
    user = relationship("User")
    wallet = relationship("Wallet")


    def __init__(
        self, user_id, asset_id, order_type, 
        amount, price, wallet_id, status, uuid, 
        **kwargs
    ):
        self.user_id = user_id
        self.asset_id = asset_id
        self.order_type = order_type
        self.amount = amount
        self.wallet_id = wallet_id
        self.price = price
        self.status = status
        self.timestamp = datetime.utcnow()
        self.uuid = uuid


    def __repr__(self):
        return "<uuid '{}'>".format(self.uuid)


    def to_dict(self):
        # Convert order object to a dictionary for JSON response
        return {
            'uuid': self.uuid,
            'asset_id': self.asset_id,
            'order_type': self.order_type,
            'amount': float(self.amount) if float(self.amount) > 1e-6 else 0,
            'price': float(self.price) if float(self.price) > 1e-6 else 0,
            'status': self.status,
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }
