from datetime import datetime as dt
from sqlalchemy.orm import relationship 
from app.extensions import db
from .base import Base


class Identity(db.Model, Base):
    __tablename__ = "identities"

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    verified = db.Column(db.Boolean, default=False)
    date_of_birth = db.Column(db.DateTime, nullable=False)
    document_type = db.Column(db.String(50))
    document_url = db.Column(db.String(150))
    user = relationship("User")


    def __init__(self, user_id, date_of_birth):
        self.user_id = user_id
        self.set_date_of_birth(date_of_birth)

    def set_date_of_birth(self, date_of_birth: str):
        y, m, d = date_of_birth.split('-')
        self.date_of_birth = dt(int(y), int(m), int(d))

    def update_document(self, document_type: str, document_url: str):
        self.verified = False
        self.document_type = document_type
        self.document_url = document_url

    def to_dict(self):
        return {
            'verified': self.verified,
            'date_of_birth': self.date_of_birth,
        }
