from flask import Blueprint
from sqlalchemy import text

from app.extensions import db, rds
up_bp = Blueprint("up", __name__)


@up_bp.get("/")
def index():
    rds.ping()
    with db.engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return ""


@up_bp.get("/check")
def check():
    return ""