from app.extensions import db
from .base import Base

class PhoneNumber(db.Model, Base):
    __tablename__ = "phone_numbers"

    user_id = db.Column(db.Integer, nullable=False)
    number = db.Column(db.String(20), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    verified = db.Column(db.Boolean, default=False)

    def __init__(self, user_id, number):
        self.user_id = user_id
        self.number = number
        self.is_primary = True

    def to_dict(self):
        return {
            'id': self.id,
            'number': self.number,
            'verified': self.verified,
            'is_primary': self.is_primary,
        }
