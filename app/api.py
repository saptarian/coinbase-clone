import requests, os, logging
from uuid import uuid4
from csv import DictReader
from flask import current_app as cur_app
from datetime import datetime, timedelta
from requests.exceptions import ConnectionError, \
    Timeout, TooManyRedirects, RequestException
from http.client import HTTPConnection
from dotenv import load_dotenv


load_dotenv('.env')
# BASE_API_URL = 'http://127.0.0.1:8080'
cmc_base_url = "https://pro-api.coinmarketcap.com"
cmc_headers = {
    'Accepts': 'application/json',
    'X-CMC_PRO_API_KEY': os.getenv('CMC_PRO_API_KEY')
}
connect_timeout = 5
read_timeout = 30
req_timeout = (connect_timeout, read_timeout)


cache = {
    'fiat_map': { 
        'key': 'fiat-map', 
        'len': -1 
    },
    'cmc_id_map': { 
        'key': 'cmc-id-map', 
        'len': 5000, 
        'suffix': 'page' 
    },
    'global_statistic': { 
        'key': 'global-statistic', 
        'len': -1 
    },
    'quotes': { 
        'key': 'quotes', 
        'len': 100, 
        'suffix': 'page' 
    },
    'metadata': { 
        'key': 'metadata', 
        'len': 100,
        'suffix': 'id' 
    },
    'id_top_100': { 
        'key': 'id-top-100', 
        'len': 100, 
        'suffix': 'page' 
    },
    'list_crypto': { 
        'key': 'list-crypto', 
        'len': 200, 
        'suffix': 'page' 
    },
    'historical_data': { 
        'key': 'historical-data', 
        'len': -1, 
        'suffix': 'symbol' 
    },
    'spark_data': { 
        'key': 'spark-data', 
        'len': -1, 
        'suffix': 'symbol' 
    },
}


def debug_requests_on():
    '''Switches on logging of the requests module.'''
    HTTPConnection.debuglevel = 1

    logging.basicConfig()
    logging.getLogger().setLevel(logging.DEBUG)
    requests_log = logging.getLogger("requests.packages.urllib3")
    requests_log.setLevel(logging.DEBUG)
    requests_log.propagate = True


def fetch(base_url: str = cmc_base_url,
          api_path: str = '/', 
          parameters: dict = {},
          headers: dict = cmc_headers):
    # debug_requests_on()
    print('fetching: {}{}{}'.format(base_url, api_path, parameters))
    try:
        response = requests.get(base_url+api_path, 
                                timeout= req_timeout,
                                params= parameters,
                                headers= headers)
        response.raise_for_status()
        return response.json()

    except (RequestException, ConnectionError, 
            Timeout, TooManyRedirects) as e:
        raise RequestException(f"Error fetching api: {e}") from e


def fetch_list_crypto(page: int = 1):
    if page < 1: return None
    limit_percall = cache['list_crypto']['len']
    return fetch(api_path='/v1/cryptocurrency/listings/latest',
                 parameters= {
                    'start': (page-1)*limit_percall+1,
                    'limit': limit_percall,
                    'convert': 'USD',
                    'sort': 'market_cap',
                    'sort_dir': 'desc',
                    'cryptocurrency_type': 'all',
                    'tag': 'all',
                })
    

def fetch_quotes(id_params: str):
    if not id_params or not len(id_params): return None
    return fetch(api_path='/v2/cryptocurrency/quotes/latest',
                 parameters= {
                    'id': id_params, 
                    'convert': 'USD',
                    'skip_invalid': True,
                })


def fetch_metadata(id_params: str):
    if not id_params or not len(id_params): return None
    return fetch(api_path='/v2/cryptocurrency/info',
                 parameters= {
                    'id': id_params, 
                    'skip_invalid': True,
                })


def fetch_fiat_map():
    return fetch(api_path='/v1/fiat/map',
                 parameters= {
                    'limit': 5000, 
                    'include_metals': False,
                })


def fetch_global_statistic():
    return fetch(api_path='/v1/global-metrics/quotes/latest',
                 parameters= {'convert': 'USD', })


def fetch_cmc_id_map(page: int = 1):
    if page < 1: return None
    limit_percall = cache['cmc_id_map']['len']
    return fetch(api_path='/v1/cryptocurrency/map',
                 parameters= {
                    'listing_status': 'active',
                    'start': (page-1)*limit_percall+1,
                    'limit': limit_percall,
                    'sort': 'cmc_rank',
                })


YAHOO_FINANCE_BASE_URL = 'https://query1.finance.yahoo.com/v7/finance/download'
DAYS_IN_YEAR = 365
# 'https://query1.finance.yahoo.com/v7/finance/download'
# '/BTC-USD'
# '?period1=1545523200'
# '&period2=1703289600'
# '&interval=1d&events=history&includeAdjustedClose=true'
from pytz import timezone
from app.utils.helpers import is_numeric

def fetch_yahoo_finance(symbol: str = 'BTC-USD', 
                        years: int = 4):
    end = datetime.now(timezone("US/Eastern"))
    start = end - timedelta(days= years * DAYS_IN_YEAR)

    # Yahoo Finance API
    yahoo_finance_uri = (
        f"{YAHOO_FINANCE_BASE_URL}/{symbol.upper()}"
        f"?period1={int(start.timestamp())}"
        f"&period2={int(end.timestamp())}"
        "&interval=1d&events=history&includeAdjustedClose=true"
    )
    print('fetching: {}'.format(yahoo_finance_uri))

    try:
        response = requests.get(
            yahoo_finance_uri,
            timeout= req_timeout,
            # cookies={"session": str(uuid4())},
            headers={"User-Agent": "python-requests", "Accept": "*/*"}
        )
        response.raise_for_status()

        # Convert CSV to JSON and Python dict
        data = {"date": [], "adj-close": [], "volume": []}

        csv_reader = DictReader(
            response.content.decode("utf-8").splitlines()
        )
        for row in csv_reader:
            if row["Adj Close"] and \
               is_numeric(row["Adj Close"]) and \
               row["Volume"] and \
               is_numeric(row["Volume"]):
                data["date"].append(row["Date"])
                data["adj-close"].append(float(row["Adj Close"]))
                data["volume"].append(float(row["Volume"]))

        # Convert Python dict to JSON
        # json_data = json.dumps(data, indent=4)
        return data

    except (RequestException, TooManyRedirects, 
            ConnectionError, Timeout, ValueError, 
            KeyError, IndexError) as e:
        raise RequestException(f"Error processing data yahoo data: {e}") from e



def fetch_yahoo_spark(symbols: str = 'BTC-USD'):
    # Yahoo Finance API
    yahoo_finance_uri = (
        f"https://query1.finance.yahoo.com/v7/finance/spark"
        f"?symbols={symbols}&range=5d&interval=5m"
        "&indicators=close&includeTimestamps=false&includePrePost=false"
        "&corsDomain=finance.yahoo.com&.tsrc=finance"
    )
    print('fetching: {}'.format(yahoo_finance_uri))

    try:
        response = requests.get(
            yahoo_finance_uri,
            timeout= req_timeout,
            # cookies={"session": str(uuid4())},
            headers={"User-Agent": "python-requests", "Accept": "*/*"}
        )
        response.raise_for_status()
        data = response.json()
        close = data.get('spark').\
            get('result')[0].\
            get('response')[0].\
            get('indicators').\
            get('quote')[0].\
            get('close')

        return {'close': close, 'len': len(close) if close else 0}

    except (RequestException, TooManyRedirects, 
            ConnectionError, Timeout, IndexError) as e:
        raise RequestException(f"Error processing data yahoo data: {e}") from e
