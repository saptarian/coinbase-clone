import requests
from flask import Flask
from dataclasses import dataclass
from pytz import timezone
from typing import Dict, Union, Tuple, List, Optional
from uuid import uuid4
from csv import DictReader
from datetime import datetime, timedelta
from requests.exceptions import ConnectionError, \
    Timeout, TooManyRedirects, RequestException, HTTPError
from http.client import HTTPConnection

from app.utils.helpers import is_numeric


class ApiExt(object):
    def __init__(self, app=None):
        class ApiProvider:
            pass
        self._api_provider = ApiProvider()
        if app is not None:
            self.init_app(app)

    def init_app(self, app: Flask):
        """Initialize a Flask application."""
        # Follow the Flask guidelines on usage of app.extensions
        crypto_news_host = app.config.get('CRYPTO_NEWS_HOST')
        self._add_api_provider([
            ('cmc', CMCApiService(
                base_url= app.config.get('CMC_BASE_URL'),
                headers= {
                    'Accepts': 'application/json',
                    'X-CMC_PRO_API_KEY': app.config.get('CMC_PRO_API_KEY')
            })),
            ('news', RapidApiService(
                base_url= f"https://{crypto_news_host}",
                headers= {
                    'X-RapidAPI-Key': app.config.get('RAPIDAPI_KEY'),
                    'X-RapidAPI-Host': crypto_news_host
            })),
            ('open_exchange', OpenExchangeApiService(
                base_url= app.config.get('OPEN_EXCHANGE_RATES_BASE_URL'),
                headers= {"Accept": "application/json"},
                app_id= app.config.get('OPEN_EXCHANGE_RATES_APP_ID'),
            )),
            ('yahoo', YahooApiService(
                base_url= app.config.get('YAHOO_FINANCE_BASE_URL'),
                headers= {"User-Agent": "curl/7.83.1", "Accept": "*/*"},
            ))
        ])

        if not hasattr(app, "extensions"):
            app.extensions = {}  # pragma: no cover
        app.extensions["api-ext"] = self


    def __getattr__(self, name):
        return getattr(self._api_provider, name)

    def __getitem__(self, name):
        return self._api_provider[name]

    def __setitem__(self, name, value):
        setattr(self._api_provider, name, value)

    def _add_api_provider(self, configs):
        for config in configs:
            self.__setitem__(*config)


@dataclass
class Route:
    path: str = ''

@dataclass
class CacheItem:
    # format: key|limit-item-per-key|key-id-suffix
    # e.g.spark-data:BTC
    key: str
    item_len: Optional[int] = None
    suffix: Optional[str] = None

class Node:
    def __init__(
        self, 
        key: str, 
        path: str = '', 
        item_len: Optional[int] = None,
        suffix: Optional[str] = None
    ):
        self.route = Route(path)
        self.cache = CacheItem(key, item_len, suffix)


@dataclass(frozen=True)
class Nodes:
    list_crypto = Node(
        path='/v1/cryptocurrency/listings/latest', 
        key='list-crypto', 
        item_len=200, 
        suffix='page'
    )
    global_statistic = Node(
        path='/v1/global-metrics/quotes/latest', 
        key='global-statistic'
    )
    cmc_id_map = Node(
        path='/v1/cryptocurrency/map', 
        key='cmc-id-map', 
        item_len=5000, 
        suffix='page'
    )
    quotes = Node(
        path='/v2/cryptocurrency/quotes/latest', 
        key='quotes', 
        item_len= 100, 
        suffix='page'
    )
    metadata = Node(
        path='/v2/cryptocurrency/info', 
        key='metadata', 
        item_len= 100, 
        suffix='id'
    )
    fiat_map = Node(path='/v1/fiat/map', key='fiat-map')
    fiat_rates = Node(key='fiat-rates')
    latest_news = Node(path='/v1/coindesk', key='lanews')
    id_top_list = Node(key='id-top-100', item_len= 100, suffix='page')
    spark_data = Node(key='spark-data', item_len= -1, suffix='symbol')
    historical_data = Node(key='historical-data', item_len= -1, suffix='symbol')


@dataclass
class RequestConfig:
    connect_timeout: int = 5
    read_timeout: int = 30
    timeout: Tuple[int, int] = (connect_timeout, read_timeout)


# Constant
DAYS_IN_YEAR = 365


class ApiService(object):
    def __init__(
        self, 
        base_url: Optional[str] = None, 
        headers: Optional[dict] = None, 
    ):
        self.base_url = base_url
        self.headers = headers
        self.request_config = RequestConfig()

    def fetch(
        self,
        path: str = '', 
        params: Optional[dict] = None,
        base_url: Optional[str] = None,
        headers: Optional[dict] = None,
        jsonify: bool = True
    ):
        used_headers = headers or self.headers

        from urllib.parse import urlencode
        print((
            f"=> fetching: {base_url or self.base_url}"
            f"{path}{('?'+urlencode(params)) if params else ''}\n"
            f"headers: {used_headers}\n"
        ))
        try:
            response = requests.get(
                f'{base_url or self.base_url}{path}', 
                timeout= self.request_config.timeout,
                params= params,
                headers= used_headers
            )
            if response.status_code >= 400:
                print(f'{response.status_code}: {response.reason}')
                raise HTTPError(f'{response.reason}')
            response.raise_for_status()
            return response.json() if jsonify else response

        except (RequestException, ConnectionError, 
                Timeout, TooManyRedirects, HTTPError) as e:
            print(f"A {type(e).__name__} has occurred when fetching api")
            match e:
                case HTTPError():
                    raise HTTPError()
                case RequestException():
                    raise RequestException()
                case ConnectionError():
                    raise ConnectionError()
                case Timeout():
                    raise Timeout()
                case TooManyRedirects():
                    raise TooManyRedirects()
            raise e


    def join_list(self, values):
        return ','.join(map(lambda val: str(val), values))


class CMCApiService:
    def __init__(
        self, 
        base_url: Optional[str] = None, 
        headers: Optional[dict] = None
    ):
        self.service = ApiService(base_url, headers)
        self.nodes = Nodes()

    def fetch_list_crypto(self, page: int = 1):
        if page < 1: return None
        limit_percall = self.nodes.list_crypto.cache.item_len
        return self.service.fetch(
            path=self.nodes.list_crypto.route.path,
            params= {
                'start': (page-1) * limit_percall + 1,
                'limit': limit_percall,
                'convert': 'USD',
                'sort': 'market_cap',
                'sort_dir': 'desc',
                'cryptocurrency_type': 'all',
                'tag': 'all',
            }
        )

    def fetch_quotes(self, ids: Union[str, List[int]]):
        if not ids or not len(ids): return None
        id_params = ids
        if type(ids) is list:
            id_params = self.service.join_list(ids)
        return self.service.fetch(
            path=self.nodes.quotes.route.path,
            params= {
                'id': id_params, 
                'convert': 'USD',
                'skip_invalid': True,
            }
        )

    def fetch_metadata(self, ids: Union[str, List[int]]):
        if not ids or not len(ids): return None
        id_params = ids
        if type(ids) is list:
            id_params = self.service.join_list(ids)
        return self.service.fetch(
            path=self.nodes.metadata.route.path,
            params= {
                'id': id_params, 
                'skip_invalid': True,
            }
        )

    def fetch_fiat_map(self):
        return self.service.fetch(
            path=self.nodes.fiat_map.route.path,
            params= {
                'limit': 5000, 
                'include_metals': False,
            }
        )

    def fetch_global_statistic(self):
        return self.service.fetch(
            path=self.nodes.global_statistic.route.path,
            params= {'convert': 'USD', }
        )

    def fetch_cmc_id_map(self, page: int = 1):
        if page < 1: return None
        limit_percall = self.nodes.cmc_id_map.cache.item_len
        return self.service.fetch(
            path=self.nodes.cmc_id_map.route.path,
            params= {
                'listing_status': 'active',
                'start': (page - 1) * limit_percall + 1,
                'limit': limit_percall,
                'sort': 'cmc_rank',
            }
        )


class RapidApiService:
    def __init__(
        self, 
        base_url: Optional[str] = None, 
        headers: Optional[dict] = None
    ):
        self.service = ApiService(base_url, headers)
        self.nodes = Nodes()

    def fetch_latest_news(self):
        rss = self.service.fetch(
            path=self.nodes.latest_news.route.path
        )
        return rss.get('data') if rss else None


class OpenExchangeApiService:
    def __init__(
        self, 
        base_url: Optional[str] = None, 
        headers: Optional[dict] = None, 
        app_id: Optional[str] = None
    ):
        self.service = ApiService(base_url, headers)
        self.app_id = app_id
        self.nodes = Nodes()

    def fetch_rates(self, symbols: Optional[List[str]] = None):
        if not self.app_id:
            raise ValueError("Can't find appid")

        default = ''
        if not symbols:
            default = ("USD,AUD,BRL,CAD,CHF,CLP,CNY,CZK,VES"
            "DKK,EUR,GBP,HKD,HUF,IDR,ILS,INR,JPY,KRW,MXN,MYR,"
            "NOK,NZD,PHP,PKR,PLN,RUB,SEK,SGD,THB,TRY,TWD,ZAR,"
            "AED,BGN,HRK,MUR,RON,ISK,NGN,COP,ARS,PEN,VND,UAH,"
            "BOB,ALL,AMD,AZN,BAM,BDT,BHD,BMD,BYN,CRC,CUP,DOP,"
            "DZD,EGP,GEL,GHS,GTQ,HNL,IQD,IRR,JMD,JOD,KES,KGS,"
            "KHR,KWD,KZT,LBP,LKR,MAD,MDL,MKD,MMK,MNT,NAD,NIO,"
            "NPR,OMR,PAB,QAR,RSD,SAR,SSP,TND,TTD,UGX,UYU,UZS,")

        return self.service.fetch(
            params= {
                'app_id': self.app_id,
                'symbols': self.join_list(symbols) \
                    if symbols else default,
                'prettyprint': True,
                'show_alternative': False
            }
        )


class YahooApiService:
    def __init__(
        self, 
        base_url: Optional[str] = None, 
        headers: Optional[dict] = None
    ):
        self.service = ApiService(base_url, headers)
        self.nodes = Nodes()

    def fetch_history(self, symbol: str, years: int = 4 ):
        end = datetime.utcnow()
        start = end - timedelta(days= years * DAYS_IN_YEAR)
        response = self.service.fetch(
            path= f"/download/{symbol.upper()}",
            params= {
                'period1': int(start.timestamp()),
                'period2': int(end.timestamp()),
                'interval': '1d',
                'events': 'history',
                'includeAdjustedClose': True
            },
            jsonify= False
        )
        try:
            # Convert CSV to JSON and Python dict
            data = {"date": [], "adj-close": [], "volume": []}
            csv_reader = DictReader(
                response.content.decode("utf-8").splitlines()
            )
            for row in csv_reader:
                if row["Adj Close"] \
                and is_numeric(row["Adj Close"]) \
                and row["Volume"] \
                and is_numeric(row["Volume"]):
                    data["date"].append(row["Date"])
                    data["adj-close"].append(float(row["Adj Close"]))
                    data["volume"].append(float(row["Volume"]))

            # Convert Python dict to JSON
            # json_data = json.dumps(data, indent=4)
            return data

        except (ValueError, KeyError, IndexError) as e:
            message = f"A {type(e).__name__} has occurred when processing csv"
            print(message)
            match e:
                case ValueError():
                    raise ValueError(message)
                case KeyError():
                    raise KeyError(message)
                case IndexError():
                    raise IndexError(message)
            raise e


    def fetch_spark(self, symbols: str):
        data = self.service.fetch(
            path='/spark',
            params= {
                'symbols': symbols,
                'range': '5d',
                'interval': '5m',
                'indicators': 'close',
                'includeTimestamps': False,
                'includePrePost': False,
                'corsDomain': 'finance.yahoo.com',
                '.tsrc': 'finance'
            }
        )
        try:
            close = data.get('spark').\
                get('result')[0].\
                get('response')[0].\
                get('indicators').\
                get('quote')[0].\
                get('close')

            return {
                'close': close, 
                'len': len(close) if close else 0
            }

        except (ValueError, KeyError, IndexError) as e:
            message = f"A {type(e).__name__} has occurred when processing spark"
            print(message)
            match e:
                case ValueError():
                    raise ValueError(message)
                case KeyError():
                    raise KeyError(message)
                case IndexError():
                    raise IndexError(message)
            raise e

