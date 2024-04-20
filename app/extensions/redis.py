from redis import StrictRedis


class RedisExt(object):
    def __init__(self, app=None):
        if app is not None:
            self.init_app(app)
        self._redis_client = None

    def init_app(self, app):
        """Initialize a Flask application."""
        # Follow the Flask guidelines on usage of app.extensions
        self._redis_client = StrictRedis(
            host=app.config.get('REDIS_HOST'),
            port=app.config.get('REDIS_PORT'),
            db=app.config.get('REDIS_DB'),
            password=app.config.get('REDIS_PASSWORD'),
            ssl=app.config.get('REDIS_SSL')
        )
        if not hasattr(app, "extensions"):
            app.extensions = {}  # pragma: no cover
        app.extensions["redis"] = self

    def __getattr__(self, name):
        return getattr(self._redis_client, name)

    def __getitem__(self, name):
        return self._redis_client[name]

    def __setitem__(self, name, value):
        self._redis_client[name] = value

    def __delitem__(self, name):
        del self._redis_client[name]

