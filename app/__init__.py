import os
from flask import Flask
from werkzeug.debug import DebuggedApplication

from app.models.blacklist import BlacklistToken
from app.config import get_config
from app.extensions import db, migrate, cors, jwt, bcrypt, ext_celery
from app.routes import register_routes


def create_app() -> Flask:
    app = Flask(__name__)

    # Load configuration based on the environment (e.g., development, production)
    app.config.from_object(get_config())


    # Initialize extensions
    ext_celery.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)

    # cors.init_app(app)
    # Allow requests only from a specific frontend domain
    cors.init_app(app, resources={r"/*": {
        "origins": os.getenv('FRONTEND_URL', "http://localhost:5173")
    }})

    # Callback function to check if a JWT exists in the database blocklist
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
        jti = jwt_payload["jti"]
        token = db.session.query(BlacklistToken.id).\
            filter_by(jti=jti).first()
        return token is not None


    # Register routes from the routes package
    register_routes(app)

    # shell context for flask cli
    # @app.shell_context_processor
    # def ctx():
    #     return {"app": app, "db": db}

    # print('app.debug', app.debug)
    if app.debug:
        app.wsgi_app = DebuggedApplication(app.wsgi_app, evalex=True)

    return app
