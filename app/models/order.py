import datetime
from sqlalchemy.orm import relationship 
from app.extensions import db


class OrderBook(db.Model):
    __tablename__ = "order_books"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    asset_id = db.Column(db.Integer, db.ForeignKey('assets.id'))
    wallet_id = db.Column(db.Integer, db.ForeignKey('wallets.id'))
    order_type = db.Column(db.String(20), nullable=False)
    amount = db.Column(db.Numeric(precision=18, scale=8), nullable=False)
    price = db.Column(db.Numeric(precision=18, scale=8), nullable=False)
    status = db.Column(db.String(20), default='pending', nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    uuid = db.Column(db.String(30), unique=True)
    asset = relationship("Asset")
    user = relationship("User")
    wallet = relationship("Wallet")

    def __init__(self, user_id, asset_id, order_type, amount, price, wallet_id):
        self.user_id = user_id
        self.asset_id = asset_id
        self.order_type = order_type
        self.amount = amount
        self.wallet_id = wallet_id
        self.price = price

        ms = datetime.datetime.utcnow()
        self.timestamp = ms

        unix_str = str(round(datetime.datetime.timestamp(ms) * 1000))
        rev = '%d%s' % (user_id, unix_str[::-1])

        self.uuid = '%s-%s-%s' % (rev[:4], rev[4:9], rev[9:])


    def to_dict(self):
        # Convert order object to a dictionary for JSON response
        return {
            'uuid': self.uuid,
            'asset_id': self.asset_id,
            'order_type': self.order_type,
            'amount': float(self.amount),
            'price': float(self.price),
            'status': self.status,
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }
