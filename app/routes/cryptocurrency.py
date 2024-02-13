from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from requests.exceptions import ConnectionError, \
    Timeout, TooManyRedirects, RequestException

from app.services import crypto_svc
from app.utils.helpers import is_digit
from app.utils.decorators import catch_custom_exceptions
crypto_bp = Blueprint('cryptocurrency', __name__)


validation_rules = {
    'symbol': {'type': 'text', 'min_len': 2,
        'tail_func': lambda s: s.upper() 
    },
    'symbols': {'type': 'text', 'min_len': 3,
        'tail_func': lambda s: s.strip(' ,').upper() 
    },
    'search': {'type': 'text', 'min_len': 3,
        'tail_func': lambda s: s.lower() 
    },
    'slug': {'type': 'text', 'min_len': 2 },
    'ids': {'type': 'text', 'min_len': 1,
        'tail_func': lambda s: s.strip(' ,') 
    },
    'page': {'type': 'number', 'min': 1 },
    'id': {'type': 'number', 'min': 1 },
    'bundle': {'type': 'text',
        'accepts': ['symbol', 'slug', 'id'] 
    },
}

def params_validator(key_list, **kwargs) -> dict:
    cleaned = {}
    for key in key_list:
        rules = validation_rules[key]
        param = kwargs.get(key)
        if not param: continue
        param = str(param)
        
        if rules.get('accepts') \
        and param not in rules['accepts']:
            continue

        if rules['type'] == 'text':
            if rules.get('min_len') \
            and len(param.strip(' ')) < rules['min_len']:
                continue

        elif rules['type'] == 'number':
            if not is_digit(param):
                continue
            param = int(param)
            if rules.get('min') and param < rules['min']:
                continue

        if rules.get('tail_func'):
            param = rules.get('tail_func')(param)

        cleaned[key] = param

    return cleaned


@crypto_bp.route('/metadata', methods=['GET'])
@catch_custom_exceptions
@jwt_required()
def get_metadata():
    params = params_validator(
        ['symbol', 'page', 'id', 'slug', 'ids'], 
        **{'page': 1, **request.args}
    )
    if len([v for v in params.values() if v is not None]) == 0:
        return jsonify(message= 'Invalid Parameters'), 400

    ids = params.get('ids')
    if ids:
        params['ids'] = [i for i in ids.split(',') if i and is_digit(i)]

    return jsonify(crypto_svc.metadata.ensure(**params))


@crypto_bp.route('/quotes', methods=['GET'])
@catch_custom_exceptions
# @jwt_required()
def get_quotes():
    params = params_validator(
        ['symbol', 'page', 'id', 'slug', 'ids'], 
        **{'page': 1, **request.args}
    )
    if len([v for v in params.values() if v is not None]) == 0:
        return jsonify(message= 'Invalid Parameters'), 400

    ids = params.get('ids')
    if ids:
        params['ids'] = [i for i in ids.split(',') if i and is_digit(i)]

    return jsonify(crypto_svc.quotes.ensure(**params))


@crypto_bp.route('/list-crypto', methods=['GET'])
@catch_custom_exceptions
# @jwt_required()
def get_list_crypto():
    kwargs = params_validator(
        ['page', 'search'], **{'page': 1, **request.args}
    )
    search = kwargs.get('search')
    if search:
        data = crypto_svc.search.find(search)
        if not data: raise ValueError(f'Error search: {search}')
        return jsonify(data)

    if len([v for v in kwargs.values() if v is not None]) == 0:
        return jsonify(message= 'Invalid Parameters'), 400

    return jsonify(crypto_svc.list_crypto.ensure(kwargs['page']))


@crypto_bp.route('/quote', methods=['GET'])
@catch_custom_exceptions
@jwt_required()
def get_crypto():
    kwargs = params_validator(
        ['symbol', 'id', 'slug'], **request.args
    )
    if len([v for v in kwargs.values() if v is not None]) == 0:
        return jsonify(message= 'Invalid Parameters'), 400

    quotes = {}
    quotes = crypto_svc.quotes.ensure(**kwargs)
    metadata = {}
    metadata = crypto_svc.metadata.ensure(**kwargs)
    if not quotes and not metadata:
        return jsonify(message= 'Not found'), 404 

    if type(quotes) is dict and type(metadata) is dict:
        return jsonify({**quotes, **metadata})
    else:
        return jsonify(quotes) if quotes else jsonify(metadata)


@crypto_bp.route('/global-statistic', methods=['GET'])
@catch_custom_exceptions
# @jwt_required()
def get_global_statistic():
    return jsonify(crypto_svc.global_statistic.ensure())


@crypto_bp.route('/historical-data/<string:symbol>', methods=['GET'])
@catch_custom_exceptions
@jwt_required()
def get_historical_data(symbol):
    years = 4 if not is_digit(request.args.get('years')) else \
        int(request.args.get('years'))
    symbol = symbol.upper() if symbol and \
        len(symbol.split('-')) == 2 else None
    if not symbol: 
        return jsonify(message= 'Invalid Parameters'), 400 
    return jsonify(crypto_svc.historical_data.ensure(
        symbol= symbol, 
        years= years
    ))


@crypto_bp.route('/spark-data/<string:symbol>', methods=['GET'])
@catch_custom_exceptions
# @jwt_required()
def get_spark_data(symbol):
    symbol = symbol.upper() if symbol and \
        len(symbol.split('-')) > 1 else None
    if not symbol: 
        return jsonify(message= 'Invalid Parameters'), 400 
    return jsonify(crypto_svc.spark_data.ensure(symbol=symbol))


@crypto_bp.route('/fiat', methods=['GET'])
@catch_custom_exceptions
# @jwt_required()
def get_fiat():
    symbol = request.args.get('symbol')
    if symbol and len(symbol.strip(' ')) == 3: 
        symbol = symbol.upper()
    return jsonify(crypto_svc.fiat_map.ensure(symbol=symbol))


@crypto_bp.route('/latest-news/<int:n>', methods=['GET'])
@catch_custom_exceptions
# @jwt_required()
def get_latest_news(n):
    return jsonify(
        crypto_svc.latest_news.get_latest(
            None if n <= 0 else n
        )
    )


@crypto_bp.route('/fiat-rates', methods=['GET'])
@catch_custom_exceptions
# @jwt_required()
def get_fiat_rates():
    params = params_validator(['symbols'], **request.args)
    symbols = params.get('symbols')
    if symbols:
        symbols = symbols.split(',')
        if len(symbols) == 1:
            symbols = symbols[0]
    return jsonify(crypto_svc.fiat_rates.ensure(symbols))


@crypto_bp.route('/id-map', methods=['GET'])
@catch_custom_exceptions
# @jwt_required()
def get_id_map():
    kwargs = params_validator(
        ['symbol', 'page', 'id', 'slug', 'bundle'], 
        **{'page': 1, **request.args}
    )
    if len([v for v in kwargs.values() if v is not None]) == 0:
        return jsonify(message= 'Invalid Parameters'), 400

    if kwargs.get('bundle') and kwargs.get('page'):
        return jsonify(crypto_svc.cmc_id_map.get_bundle(
            kwargs.get('bundle'),
            kwargs.get('page')
        )) 

    return jsonify(crypto_svc.cmc_id_map.ensure(**kwargs))
    
