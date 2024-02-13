from uuid import uuid4

from app.extensions import db, bcrypt
from .base import Base


class User(db.Model, Base):
    __tablename__ = "users"

    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    public_id = db.Column(db.String(100), unique=True)
    password_hash = db.Column(db.String(100), nullable=False)
    admin = db.Column(db.Boolean, default=False)
    inactive = db.Column(db.Boolean, default=False)
    email_verified = db.Column(db.Boolean, default=False)
    display_name = db.Column(db.String(50))
    photo_url = db.Column(db.String(150))

    def __init__(self, first_name, last_name, email):
        if len(email) > 150:
            raise ValueError('Max email length is 150')
        self.first_name = first_name[:30]
        self.last_name = last_name[:20]
        self.display_name = f'{first_name} {last_name}'[:50]
        self.email = email
        self.public_id = str(uuid4())

    @property
    def password(self):
        raise AttributeError('password: write-only field')

    @password.setter
    def password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password: str) -> bool:
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return "<email '{}'>".format(self.email)

    def to_dict(self):
        if not self.updated_at:
            self.updated_at = self.created_at

        if not self.display_name:
            self.display_name = f'{self.first_name} {self.last_name}'

        return {
            'first_name': self.first_name,
            'last_name': self.last_name,
            'display_name': self.display_name,
            'email': self.email,
            'public_id': self.public_id,
            'email_verified': self.email_verified,
            'photo_url': self.photo_url
        }
