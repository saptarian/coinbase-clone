import sys
from app import create_app

# we import this here so celery can access it for its startup
from app.extensions import ext_celery

app = create_app()
celery = ext_celery.celery
# print('celery', celery, app)

if __name__ == '__main__':
    app.run(debug=True)
