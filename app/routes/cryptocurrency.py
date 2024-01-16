from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from requests.exceptions import ConnectionError, \
    Timeout, TooManyRedirects, RequestException

from app import tasks
from app.utils.helpers import is_digit

crypto_bp = Blueprint('cryptocurrency', __name__)


def running_task(task):
    try:
        data = task.get(timeout=45)
        return jsonify(data) if data else \
            (jsonify(message= 'Not found'), 404)
    except (RequestException, ConnectionError, 
            TooManyRedirects) as e:
        print(f'Error running task: {e}')
        return jsonify({
            'message': f'Error running task: {e}'
        }), 500
    except Timeout:
        return jsonify({
            'message': f'Request timeout'
        }), 408


validation_rules = {
    'symbol': {'type': 'text', 'min_len': 2, 'tail_func': lambda s: s.upper() },
    'search': {'type': 'text', 'min_len': 3, 'tail_func': lambda s: s.lower() },
    'slug': {'type': 'text', 'min_len': 2 },
    'ids': {'type': 'text', 'min_len': 1, 'tail_func': lambda s: s.strip(' ,') },
    'page': {'type': 'number', 'min': 1 },
    'id': {'type': 'number', 'min': 1 },
    'bundle': {'type': 'text', 'accepts': ['symbol', 'slug', 'id'] },
}

def params_cleaner(key_list, **kwargs) -> dict:
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


def get_metadata_or_quotes(task_func, **kwargs):
    params = params_cleaner(
        ['symbol', 'page', 'id', 'slug', 'ids'], 
        **{'page': 1, **kwargs}
    )
    if len([v for v in params.values() if v is not None]) == 0:
        return jsonify(message= 'Invalid Parameters'), 400

    # print('get_metadata_or_quotes', params)
    return running_task(
        task_func.apply_async(
            kwargs= params
        )
    )

@crypto_bp.route('/metadata', methods=['GET'])
@jwt_required()
def get_metadata():
    return get_metadata_or_quotes(
        tasks.ensure_metadata, 
        **request.args
    )


@crypto_bp.route('/quotes', methods=['GET'])
# @jwt_required()
def get_quotes():
    return get_metadata_or_quotes(
        tasks.ensure_quotes, 
        **request.args
    )


@crypto_bp.route('/list-crypto', methods=['GET'])
# @jwt_required()
def get_list_crypto():
    kwargs = params_cleaner(
        ['page', 'search'], 
        **{'page': 1, **request.args}
    )
    # print('get_list_crypto {}{}'.format(kwargs, request.args))
    if kwargs.get('search'):
        task = tasks.search_entire_id_map_list_by_keyword.apply_async(
            args= (kwargs['search'],)
        )
        try:
            data = task.get(timeout=60*2)
            return jsonify(
                status= {'total_count': len(data)},
                data= list(data.values())
            )
        except (RequestException, ConnectionError, 
                TooManyRedirects) as e:
            print(f'Error searching list crypto: {e}')
            return jsonify({
                'message': f'Error searching list crypto: {e}'
            }), 500
        except Timeout:
            return jsonify({
                'message': f'Request timeout'
            }), 408

    if len([v for v in kwargs.values() if v is not None]) == 0:
        return jsonify(message= 'Invalid Parameters'), 400

    cached_data = tasks.load_from_cache(
        tasks.get_cache_key('list_crypto', kwargs['page'])
    )
    return jsonify(cached_data) if cached_data else running_task(
        tasks.store_list_crypto.apply_async(
            kwargs= kwargs
        )
    )


@crypto_bp.route('/quote', methods=['GET'])
@jwt_required()
def get_crypto():
    kwargs = params_cleaner(
        ['symbol', 'id', 'slug'], 
        **request.args
    )
    if len([v for v in kwargs.values() if v is not None]) == 0:
        return jsonify(message= 'Invalid Parameters'), 400

    # print('get_crypto', kwargs)
    quotes_task = tasks.ensure_quotes.apply_async(
        kwargs= kwargs
    )
    metadata_task = tasks.ensure_metadata.apply_async(
        kwargs= kwargs
    )
    quotes = {}
    metadata = {}
    try:
        quotes = quotes_task.get(timeout=45)
        metadata = metadata_task.get(timeout=45)
        if not quotes and not metadata:
            return jsonify(message= 'Not found'), 404 

        if type(quotes) is type({}) \
        and type(metadata) is type({}):
            return jsonify({**quotes, **metadata})
        else:
            return jsonify(quotes) if quotes else jsonify(metadata)

    except (RequestException, ConnectionError, 
            TooManyRedirects, ValueError, 
            KeyError, IndexError) as e:
        print(f'Error get_crypto: {e}')
        return jsonify({
            'message': f'Error running or processing tasks: {e}'
        }), 500
    except Timeout:
        return jsonify({
            'message': f'Request timeout'
        }), 408


@crypto_bp.route('/global-statistic', methods=['GET'])
# @jwt_required()
def get_global_statistic():
    cached_data = tasks.load_from_cache(
        tasks.get_cache_key('global_statistic')
    )
    return jsonify(cached_data) if cached_data else running_task(
        tasks.store_global_statistic.apply_async()
    )


@crypto_bp.route('/historical-data/<string:symbol>', methods=['GET'])
# @jwt_required()
def get_historical_data(symbol):
    years = 4 if not is_digit(request.args.get('years')) else \
        int(request.args.get('years'))
    symbol = symbol.upper() if symbol and \
        len(symbol.split('-')) == 2 else None

    if not symbol: 
        return jsonify(message= 'Invalid Parameters'), 400 

    cached_data = tasks.load_from_cache(
        tasks.get_cache_key('historical_data', symbol)
    )
    return jsonify(cached_data) if cached_data else running_task(
        tasks.store_historial_data.apply_async(
        kwargs={'symbol': symbol, 'years': years}
    ))


@crypto_bp.route('/spark-data/<string:symbol>', methods=['GET'])
# @jwt_required()
def get_spark_data(symbol):
    symbol = symbol.upper() if symbol and \
        len(symbol.split('-')) == 2 else None

    if not symbol: 
        return jsonify(message= 'Invalid Parameters'), 400 

    cached_data = tasks.load_from_cache(
        tasks.get_cache_key('spark_data', symbol)
    )
    return jsonify(cached_data) if cached_data \
        else running_task(
            tasks.store_spark_data.apply_async(
            kwargs={'symbol': symbol}
        )
    )


@crypto_bp.route('/fiat', methods=['GET'])
# @jwt_required()
def get_fiat():
    symbol = request.args.get('symbol').upper() if \
        request.args.get('symbol') and \
        len(request.args.get('symbol').strip(' ')) == 3 \
        else None

    # print('/fiat', symbol)
    return running_task(
        tasks.ensure_fiat_map.apply_async(
            kwargs={'symbol': symbol}
        )
    )


@crypto_bp.route('/id-map', methods=['GET'])
# @jwt_required()
def get_id_map():
    kwargs = params_cleaner(
        ['symbol', 'page', 'id', 'slug', 'bundle'], 
        **{'page': 1, **request.args}
    )
    if len([v for v in kwargs.values() if v is not None]) == 0:
        return jsonify(message= 'Invalid Parameters'), 400

    # print('get_id_map', kwargs)
    if kwargs.get('bundle') and kwargs.get('page'):
        return running_task(
            tasks.get_bundle_id_map.apply_async(
                args= (
                    kwargs.get('bundle'), 
                    kwargs.get('page')
            ))
        ) 

    return running_task(
        tasks.ensure_cmc_id_map.apply_async(
            kwargs= kwargs
        )
    )
    
