from datetime import datetime as dt

from app.extensions import db
from .base import Base


class Identity(db.Model, Base):
    __tablename__ = "identities"

    user_id = db.Column(db.Integer, nullable=False)
    date_of_birth = db.Column(db.DateTime, nullable=False)

    def __init__(self, user_id, date_of_birth):
        self.user_id = user_id
        self.set_date_of_birth(date_of_birth)

    def set_date_of_birth(self, date_of_birth: str):
        y, m, d = date_of_birth.split('-')
        self.date_of_birth = dt(int(y), int(m), int(d))

    def to_dict(self):
        return {
            'id': self.id,
            'date_of_birth': self.date_of_birth,
        }
