import os, datetime

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    # Flask App Configuration
    DEBUG = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'TH!5-W4$-@-ZUP3R-$ECR3T-K3Y')

    # Use SQLite for development
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'coinbase_clone.db')  
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    ########## File Upload Configuration ##########
    MAX_CONTENT_LENGTH = 1024 * 1024  # 1 MB
    UPLOAD_EXTENSIONS = ['.jpg', '.png']
    UPLOAD_PATH = os.path.join(basedir, 'uploads')
    AVATAR_PATH = os.path.join(UPLOAD_PATH, 'avatar')
    
    ########## 3rd party api secret ##########
    CRYPTO_NEWS_HOST = os.getenv(
        'CRYPTO_NEWS_HOST',
        'cryptocurrency-news2.p.rapidapi.com'
    )
    RAPIDAPI_KEY = os.getenv('RAPIDAPI_KEY')
    # Coin Market Cap Configuration
    CMC_BASE_URL = os.getenv('CMC_BASE_URL', "https://pro-api.coinmarketcap.com")
    CMC_PRO_API_KEY = os.getenv("CMC_PRO_API_KEY")
    CMC_MOCK_API_KEY = os.getenv('CMC_MOCK_API_KEY')
    # Openexchanges for currencies rates 
    OPEN_EXCHANGE_RATES_BASE_URL = os.getenv(
        'OPEN_EXCHANGE_RATES_BASE_URL',
        "https://openexchangerates.org/api/latest.json"
    )
    OPEN_EXCHANGE_RATES_APP_ID = os.getenv('OPEN_EXCHANGE_RATES_APP_ID')
    # Yahoo finance
    YAHOO_FINANCE_BASE_URL = os.getenv(
        'YAHOO_FINANCE_BASE_URL',
        "https://query1.finance.yahoo.com/v7/finance"
    )

    # SERVER_NAME = os.getenv(
    #     "SERVER_NAME", "localhost:{0}".format(os.getenv("PORT", "8000"))
    # )
    # FLASK_BASE_URL = os.getenv('FLASK_BASE_URL', SERVER_NAME)
    
    # CORS Configuration (adjust for your frontend URL)
    FRONTEND_BASE_URL = os.getenv('FRONTEND_BASE_URL')
    CORS_ORIGINS = [FRONTEND_BASE_URL]

    ########## JWT Configuration (for authentication) ##########
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'TH!5-W4$-@-JWT-SUP3R-$ECR3T-K3Y')
    # Set desired expiration time
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(hours=4)  
    # Set desired refresh token expiration time
    JWT_REFRESH_TOKEN_EXPIRES = datetime.timedelta(days=30)  
    # JWT_BLACKLIST_ENABLED = True
    # JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']

    ########## Redis Configuration ##########
    REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
    REDIS_PORT = os.getenv('REDIS_PORT', 6379)
    REDIS_DB = os.getenv('REDIS_DB', 0)
    REDIS_PASSWORD = os.getenv('REDIS_PASSWORD')

    ########## Celery Configuration ##########
    CELERY_ENABLE_UTC = True
    CELERY_BROKER_URL = 'redis://{host}:{port}/{db}'.format(
        host=REDIS_HOST,
        port=REDIS_PORT,
        db=REDIS_DB
    )
    CELERY_RESULT_BACKEND = CELERY_BROKER_URL
    CELERY_ACCEPT_CONTENT = ('json', 'pickle')

    ########## Rate Limiter ##########
    IGNORE_RATE_LIMITER = os.getenv('IGNORE_RATE_LIMITER')
    RATE_LIMIT = os.getenv('RATE_LIMIT', 60)
    RATE_SECONDS = os.getenv('RATE_SECONDS', 60)
    TRUSTED_PROXIES = os.getenv('TRUSTED_PROXIES')
    

class ProductionConfig(Config):
    DEBUG = False

    # Use PostgreSQL for production
    db_engine = 'postgresql'
    db_username = os.getenv('POSTGRES_USER', 'postgres')
    db_password = os.getenv('POSTGRES_PASSWORD')
    db_host = os.getenv('POSTGRES_HOST', 'postgres')
    db_port = os.getenv('POSTGRES_PORT', '5432')
    db_name = os.getenv('POSTGRES_DB', db_username)
    db = '{engine}://{user}:{pwd}@{host}:{port}/{db}'.format(
        engine= db_engine, 
        user= db_username, 
        pwd= db_password, 
        host= db_host, 
        port= db_port, 
        db= db_name
    )  
    SQLALCHEMY_DATABASE_URI = os.getenv("DB_URL", db)


class DevelopmentConfig(Config):
    DEBUG = True
    IP_ADDRESS_MOCK = '10.0.0.1'
    # SQLALCHEMY_ECHO = True
    REDIS_HOST = 'localhost'


class TestingConfig(Config):
    TESTING = True
    # Use a separate database for testing
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'test.db')  


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

