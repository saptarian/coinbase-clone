from flask import Flask, jsonify, request
from redis.exceptions import ConnectionError
from python_ipware import IpWare

from .config import get_config
from .extensions import db, migrate, cors, \
    jwt, bcrypt, ext_celery, rds, api_ext
from .routes import register_routes
from .models.blacklist import BlacklistToken


def create_app() -> Flask:
    app = Flask(__name__)

    # Load configuration based on the environment 
    # (e.g., development, production)
    app.config.from_object(get_config())

    # Initialize extensions
    ext_celery.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    rds.init_app(app)
    api_ext.init_app(app)

    # cors.init_app(app)
    # Allow requests only from a specific frontend domain
    cors.init_app(app, resources={
        r"/*": { "origins": app.config.get('FRONTEND_BASE_URL') }
    })

    # Callback function to check if a JWT exists in the database blocklist
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
        jti = jwt_payload["jti"]
        token = db.session.query(BlacklistToken.id).\
            filter_by(jti=jti).first()
        return token is not None


    def is_too_many_request(identifier: str, limit: int, seconds: int):
        key = f'PING:{identifier}'
        if rds.setnx(key, int(limit)):
            rds.expire(key, seconds)
        bucket_val = rds.get(key)
        if bucket_val and int(bucket_val) > 0:
            rds.decrby(key, 1)
            return False
        return True

    proxies = app.config.get('TRUSTED_PROXIES')

    if proxies and len( proxies.split(',') ):
        ipw = IpWare( proxy_list= proxies.split(',') )
    else:
        ipw = IpWare()

    # Callback function requests interceptor
    @app.before_request 
    def before_request_callback(): 
        if request.method == "OPTIONS" \
        or app.config.get('IGNORE_RATE_LIMITER'):
            return
        ip, _ = ipw.get_client_ip(meta=request.environ)
        if not ip:
            return jsonify(message="Unexpected request headers"), 400
        try:
            if is_too_many_request(
                ip, 
                app.config.get('RATE_LIMIT', 30), 
                app.config.get('RATE_SECONDS', 60)
            ): 
                return jsonify(
                    message="Too many requests, please try again later"
                ), 429
        except (ConnectionRefusedError, ConnectionError) as e:
            match e:
                case ConnectionError():
                    return jsonify(message="Cache conn failed"), 500
            return jsonify(message="ConnectionRefusedError"), 500


    # Register routes from the routes package
    register_routes(app)
    return app
