from datetime import datetime as dt
from app.extensions import db


class Base:
	id = db.Column(db.Integer, primary_key=True )
	created_at = db.Column(db.DateTime, default=dt.utcnow() )
	updated_at = db.Column(db.DateTime, onupdate=dt.utcnow() )