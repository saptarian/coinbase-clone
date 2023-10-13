from app.models.blacklist import BlacklistToken
from app.extensions import db


class BlacklistService:
    def save_token(self, jti: str):
        blacklist_token = BlacklistToken(jti=jti)
        db.session.add(blacklist_token)
        db.session.commit()
