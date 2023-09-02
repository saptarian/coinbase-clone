from app.extensions import db


class Crypto(db.Model):
    __tablename__ = "crypto"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    symbol = db.Column(db.String(10), nullable=False)
    # Add other cryptocurrency fields as needed

    def __init__(self, name, symbol):
        self.name = name
        self.symbol = symbol

    def to_dict(self):
        # Convert cryptocurrency object to a dictionary for JSON response
        return {
            'id': self.id,
            'name': self.name,
            'symbol': self.symbol,
            # Include other cryptocurrency fields here
        }
