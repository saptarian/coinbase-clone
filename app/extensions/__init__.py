from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt

from flask_celeryext import FlaskCeleryExt
from .celery import make_celery


db = SQLAlchemy()
migrate = Migrate()
cors = CORS()
jwt = JWTManager()
bcrypt = Bcrypt()
ext_celery = FlaskCeleryExt(create_celery_app=make_celery) 

# print('ext_celery', ext_celery)