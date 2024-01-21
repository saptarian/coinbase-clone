from app.extensions import db
from sqlalchemy.orm import relationship 
from .base import Base

class PhoneNumber(db.Model, Base):
    __tablename__ = "phone_numbers"

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    number = db.Column(db.String(20), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    verified = db.Column(db.Boolean, default=False)
    user = relationship("User")


    def __init__(self, user_id, number, is_primary=False):
        self.user_id = user_id
        self.number = number
        self.is_primary = is_primary

    def unreveal(self):
        text = self.number
        return f'+xx xxx xxxx xx{text[-2:]}'

    def __repr__(self):
        return "<number '{}'>".format(self.number)

    def to_dict(self, reveal: bool = False):
        number = self.unreveal()
        if reveal:
            number = self.number
        return {
            'number': number,
            'verified': self.verified,
            'is_primary': self.is_primary,
            'created_at': self.created_at
        }
