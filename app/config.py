import os, datetime


basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    # Flask App Config
    DEBUG = True
    SECRET_KEY = os.getenv('SECRET_KEY', 'secret_key')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'coinbase_clone.db')  # Use SQLite for development, update for production
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # RapidAPI Config (for cryptocurrency data)
    RAPIDAPI_KEY = os.getenv('RAPIDAPI_KEY')
    RAPIDAPI_HOST = os.getenv('RAPIDAPI_HOST')
    
    # CORS Configuration (adjust for your frontend URL)
    CORS_ORIGINS = [
        'http://localhost:3000',  # Replace with frontend URL
    ]

    # JWT Configuration (for authentication)
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt_secret_key')
    # JWT_BLACKLIST_ENABLED = True
    # JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(minutes=30)  # Set desired expiration time
    JWT_REFRESH_TOKEN_EXPIRES = datetime.timedelta(days=30)  # Set desired refresh token expiration time
    

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
    environment = os.environ.get('FLASK_ENV', 'default')
    return config_by_name[environment]

