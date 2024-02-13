from app.extensions import db
from sqlalchemy.orm import relationship 
from .base import Base


class Analytic(db.Model, Base):
    __tablename__ = "analytics"

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    employment_status = db.Column(db.String(20))
    source_of_funds = db.Column(db.String(20))
    use_app_for = db.Column(db.String(30))
    work_in_industry = db.Column(db.String(20))
    user = relationship("User")


    def __init__(self, user_id, employment_status,
                 source_of_funds, use_app_for, work_in_industry):
        self.user_id = user_id
        self.employment_status = str(employment_status or '')[:20]
        self.source_of_funds = str(source_of_funds or '')[:20]
        self.use_app_for = str(use_app_for or '')[:30]
        self.work_in_industry = str(work_in_industry or '')[:20]

    def to_dict(self):
        return {
            'id': self.id,
            'employment_status': self.employment_status,
            'source_of_funds': self.source_of_funds,
            'use_app_for': self.use_app_for,
            'work_in_industry': self.work_in_industry,
        }
