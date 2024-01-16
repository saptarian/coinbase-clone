import os, datetime


basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    # Flask App Configuration
    DEBUG = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'secret_key')

    # Database Configuration
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'coinbase_clone.db')  # Use SQLite for development, update for production
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # File Upload Configuration
    MAX_CONTENT_LENGTH = 1024 * 1024  # 1 MB
    UPLOAD_EXTENSIONS = ['.jpg', '.png']
    UPLOAD_PATH = os.path.join(basedir, 'uploads')
    AVATAR_PATH = os.path.join(UPLOAD_PATH, 'avatar')
    
    # RapidAPI Config (for cryptocurrency data)
    # RAPIDAPI_KEY = os.getenv('RAPIDAPI_KEY')
    # RAPIDAPI_HOST = os.getenv('RAPIDAPI_HOST')

    # Coin Market Cap Configuration
    CMC_PRO_API_KEY = os.getenv("CMC_PRO_API_KEY")
    
    # CORS Configuration (adjust for your frontend URL)
    CORS_ORIGINS = [
        os.getenv('FLASK_BASE_URL', 'http://localhost:3000'),
    ]

    # JWT Configuration (for authentication)
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt_secret_key')
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(hours=4)  # Set desired expiration time
    JWT_REFRESH_TOKEN_EXPIRES = datetime.timedelta(days=30)  # Set desired refresh token expiration time
    # JWT_BLACKLIST_ENABLED = True
    # JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']

    # Celery Configuration
    CELERY_ENABLE_UTC = True
    CELERY_BROKER_URL = 'redis://{host}:{port}/0'.format(
        host=os.getenv('FLASK_REDIS_HOST', '127.0.0.1'),
        port=os.getenv('FLASK_REDIS_PORT', 6379),
    )
    CELERY_RESULT_BACKEND = CELERY_BROKER_URL
    CELERY_ACCEPT_CONTENT = ('json', 'pickle')
    

class ProductionConfig(Config):
    DEBUG = False

    db_engine = 'postgresql'
    db_username = os.getenv('DB_USERNAME', 'postgres')
    db_password = os.getenv('DB_PASSWORD')
    db_host = os.getenv('DB_HOST', 'localhost')
    db_name = os.getenv('DB_NAME', 'coinbase_clone')

    SQLALCHEMY_DATABASE_URI = '{db_engine}://{db_username}:{db_password}@{db_host}/{db_name}'  # Use PostgreSQL for production
    # Add production-specific configurations


class DevelopmentConfig(Config):
    DEBUG = True
    # SQLALCHEMY_ECHO = True
    # Add development-specific configurations


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'test.db')  # Use a separate database for testing
    # Add testing-specific configurations


config_by_name = {
    'production': ProductionConfig,
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig,
}


def get_config():
    environment = os.getenv('FLASK_ENV', 'default')
    print("Config Environment:", environment)
    return config_by_name[environment]

