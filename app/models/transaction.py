import datetime
from sqlalchemy.orm import relationship 
from app.extensions import db


class Transaction(db.Model):
    __tablename__ = "transactions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    order_id = db.Column(db.Integer, db.ForeignKey('order_books.id'))
    order_uuid = db.Column(db.String(30))
    transaction_type = db.Column(db.String(20), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    order_book = relationship("OrderBook")
    user = relationship("User")

    def __init__(self, user_id, order_id, order_uuid, transaction_type):
        self.user_id = user_id
        self.order_id = order_id
        self.transaction_type = transaction_type
        self.order_uuid = order_uuid
        self.timestamp = datetime.datetime.utcnow()

    def __repr__(self):
        return "<order_uuid '{}'>".format(self.order_uuid)

    def to_dict(self):
        # Convert transaction object to a dictionary for JSON response
        return {
            'order_uuid': self.order_uuid,
            'transaction_type': self.transaction_type,
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }
