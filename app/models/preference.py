from app.extensions import db
from .base import Base


class Preference(db.Model, Base):
    __tablename__ = "preferences"

    user_id = db.Column(db.Integer, nullable=False)
    timezone = db.Column(db.String(20), default='UTC')
    currency = db.Column(db.String(10), default='USD')

    def __init__(self, user_id):
        self.user_id = user_id

    def to_dict(self):
        return {
            'id': self.id,
            'timezone': self.timezone,
            'currency': self.currency,
        }
