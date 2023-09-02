from flask import Flask
from flask_jwt_extended import get_jwt_identity, \
    create_access_token, set_access_cookies, get_jwt

from .auth import auth_bp
from .users import users_bp
from .cryptocurrencies import cryptocurrencies_bp
from .wallets import wallets_bp
from .transactions import transactions_bp
from .orderbook import orderbook_bp


def register_routes(app: Flask) -> None:
    """
    Register all routes with the Flask app.
    :param app: Flask application instance.
    """
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(users_bp, url_prefix='/users')
    app.register_blueprint(cryptocurrencies_bp, url_prefix='/cryptocurrencies')
    app.register_blueprint(wallets_bp, url_prefix='/wallets')
    app.register_blueprint(transactions_bp, url_prefix='/transactions')
    app.register_blueprint(orderbook_bp, url_prefix='/orderbook')
