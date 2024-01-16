from celery import current_app as current_celery_app


def make_celery(app):
    celery = current_celery_app

    class Config:
        enable_utc = app.config.get('CELERY_ENABLE_UTC')
        broker_url = app.config.get('CELERY_BROKER_URL')
        result_backend = app.config.get('CELERY_RESULT_BACKEND')
        accept_content = app.config.get('CELERY_ACCEPT_CONTENT')

    celery.config_from_object(Config)

    return celery
