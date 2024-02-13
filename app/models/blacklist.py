from app.extensions import db

import datetime


class BlacklistToken(db.Model):
    """
    Token Model for storing JWT tokens
    """
    __tablename__ = 'blacklist_tokens'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    jti = db.Column(db.String(40), unique=True, nullable=False, index=True)
    blacklisted_on = db.Column(db.DateTime, nullable=False)

    def __init__(self, jti):
        self.jti = jti
        self.blacklisted_on = datetime.datetime.utcnow()

    def __repr__(self):
        return "<jti '{}'>".format(self.jti)

    @staticmethod
    def check_blacklist(jti: str) -> bool:
        # check whether auth token has been blacklisted
        res = BlacklistToken.query.filter_by(jti=jti).scalar()
        return not res == None
