from app.extensions import db
from .base import Base

class Asset(db.Model, Base):
    __tablename__ = "assets"

    name = db.Column(db.String(100), nullable=False)
    symbol = db.Column(db.String(10), nullable=False, unique=True)
    slug = db.Column(db.String(100), nullable=False, unique=True)
    is_fiat = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=False)

    def __init__(self, name, symbol, is_fiat, slug, is_active = True):
        self.name = name
        self.slug = slug
        self.symbol = symbol
        self.is_active = is_active
        self.is_fiat = is_fiat

    def to_dict(self):
        # Convert cryptocurrency object to a dictionary for JSON response
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'symbol': self.symbol,
            'is_fiat': self.is_fiat,
            'is_active': self.is_active,
            # Include other cryptocurrency fields here
        }
