from app.extensions import db
from .base import Base


class Analytic(db.Model, Base):
    __tablename__ = "analytics"

    user_id = db.Column(db.Integer, nullable=False)
    employment_status = db.Column(db.String(10))
    source_of_funds = db.Column(db.String(10))
    use_app_for = db.Column(db.String(10))
    work_in_industry = db.Column(db.String(20))

    def __init__(self, user_id, employment_status,
                 source_of_funds, use_app_for, work_in_industry):
        self.user_id = user_id
        self.employment_status = employment_status
        self.source_of_funds = source_of_funds
        self.use_app_for = use_app_for
        self.work_in_industry = work_in_industry

    def to_dict(self):
        return {
            'id': self.id,
            'employment_status': self.employment_status,
            'source_of_funds': self.source_of_funds,
            'use_app_for': self.use_app_for,
            'work_in_industry': self.work_in_industry,
        }
