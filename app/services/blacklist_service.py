from flask import jsonify

from app.models.blacklist import BlacklistToken
from app.extensions import db


class BlacklistService:
    def save_token(self, jti: str):
        blacklist_token = BlacklistToken(jti=jti)
        try:
            # insert the token
            db.session.add(blacklist_token)
            db.session.commit()
            return jsonify(message='Successfully logged out.')
        except Exception as e:
            return jsonify(message=e), 409

    # Add more cryptocurrency-related services as needed
