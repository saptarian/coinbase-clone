from app.extensions import db
from sqlalchemy.orm import relationship 
from .base import Base


class Wallet(db.Model, Base):
    __tablename__ = "wallets"

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    inactive = db.Column(db.Boolean, default=False)
    asset_id = db.Column(db.Integer, db.ForeignKey('assets.id'))
    balance = db.Column(db.Numeric(precision=18, scale=8), default=0, nullable=False)
    asset = relationship("Asset")
    user = relationship("User")

    def __init__(self, user_id, asset_id, balance = 0):
        self.user_id = user_id
        self.balance = balance
        self.asset_id = asset_id

    def to_dict(self):
        # Convert wallet object to a dictionary for JSON response
        return {
            'asset_id': self.asset_id,
            'inactive': self.inactive,
            'balance': float(self.balance)
        }
