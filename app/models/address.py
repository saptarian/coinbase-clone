from app.extensions import db
from .base import Base


class Address(db.Model, Base):
    __tablename__ = "address"

    user_id = db.Column(db.Integer, nullable=False)
    street = db.Column(db.String(50))
    unit = db.Column(db.String(50))
    city = db.Column(db.String(20))
    postal_code = db.Column(db.Integer)
    country = db.Column(db.String(10))

    def __init__(self, user_id, street, unit, city, postal_code, country):
        self.user_id = user_id
        self.street = street
        self.unit = unit
        self.city = city
        self.postal_code = postal_code
        self.country = country

    def to_dict(self):
        return {
            'id': self.id,
            'street': self.street,
            'unit': self.unit,
            'city': self.city,
            'postal_code': self.postal_code,
            'country': self.country,
        }
