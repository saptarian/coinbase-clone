from app.extensions import db
from sqlalchemy.orm import relationship 
from .base import Base


class Address(db.Model, Base):
    __tablename__ = "address"

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    street = db.Column(db.String(50))
    unit = db.Column(db.String(20))
    city = db.Column(db.String(20))
    postal_code = db.Column(db.Integer)
    country = db.Column(db.String(20))
    user = relationship("User")

    def __repr__(self):
        return "<country '{}'>".format(self.country)

    def __init__(self, user_id, street, unit, city, postal_code, country):
        self.user_id = user_id
        self.street = str(street or '')[:50]
        self.unit = str(unit or '')[:20]
        self.city = str(city or '')[:20]
        self.postal_code = postal_code
        self.country = str(country or '')[:20]

    def to_dict(self):
        return {
            'street': self.street,
            'unit': self.unit,
            'city': self.city,
            'postal_code': self.postal_code,
            'country': self.country,
        }
