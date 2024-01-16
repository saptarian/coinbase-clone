from flask import Flask
from flask_jwt_extended import get_jwt_identity, \
    create_access_token, set_access_cookies, get_jwt

from .auth import auth_bp
from .users import users_bp
from .assets import assets_bp
from .wallets import wallets_bp
from .transactions import transactions_bp
from .orderbook import orderbook_bp
from .cryptocurrency import crypto_bp


def register_routes(app: Flask) -> None:
    """
    Register all routes with the Flask app.
    :param app: Flask application instance.
    """
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(users_bp, url_prefix='/user')
    app.register_blueprint(assets_bp, url_prefix='/asset')
    app.register_blueprint(wallets_bp, url_prefix='/wallet')
    app.register_blueprint(transactions_bp, url_prefix='/transaction')
    app.register_blueprint(orderbook_bp, url_prefix='/orderbook')
    app.register_blueprint(crypto_bp, url_prefix='/cryptocurrency')
