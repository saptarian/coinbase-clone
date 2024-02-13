from dataclasses import dataclass
from typing import Union, Tuple
from celery import current_app


@dataclass(frozen=True)
class CeleryConfig:
    enable_utc: bool
    broker_url: str
    result_backend: str
    accept_content: Tuple[str, ...]


def make_celery(app):
    celery = current_app
    config = CeleryConfig(
        enable_utc=app.config.get('CELERY_ENABLE_UTC'),
        broker_url=app.config.get('CELERY_BROKER_URL'),
        result_backend=app.config.get('CELERY_RESULT_BACKEND'),
        accept_content=app.config.get('CELERY_ACCEPT_CONTENT')
    )
    celery.config_from_object(config)
    return celery
