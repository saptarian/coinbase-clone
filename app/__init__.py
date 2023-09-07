from flask import Flask
from app.config import get_config
from app.extensions import db, migrate, cors, jwt, bcrypt
from app.routes import register_routes

from app.models.blacklist import BlacklistToken


def create_app() -> Flask:
    app = Flask(__name__)

    # Load configuration based on the environment (e.g., development, production)
    app.config.from_object(get_config())

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)

    # cors.init_app(app)
    # Allow requests only from a specific frontend domain
    cors.init_app(app, resources={r"/*": {"origins": "http://localhost:5173"}})

    # Callback function to check if a JWT exists in the database blocklist
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
        jti = jwt_payload["jti"]
        token = db.session.query(BlacklistToken.id).filter_by(jti=jti).scalar()
        return token is not None


    # Register routes from the routes package
    register_routes(app)

    return app
