import os, pickle, math
from redis import StrictRedis
from celery import shared_task, current_app
from celery.schedules import crontab

from app import api
from app.api import cache


redis_client = StrictRedis(
    host=os.getenv('FLASK_REDIS_HOST', 'localhost'), 
    port=os.getenv('FLASK_REDIS_PORT', 6379), db=0
)

# Schedule Celery task to update cache
current_app.conf.beat_schedule = {
    'update-cache-every-periodically': {
        'task': 'tasks.store_cache_periodically',
        'schedule': crontab(minute='*/3')
    },
}

@shared_task(name='tasks.store_cache_periodically')
def store_cache_periodically():
    store_list_crypto.delay()


MINUTE_IN_SECONDS = 60
HOUR_IN_SECONDS = MINUTE_IN_SECONDS * 60 


def get_cache_key(name: str, suffix = None) -> str:
    # print(f"get_cache_key {(name, suffix, cache[name]['key'])}")
    return cache[name]['key'] if not cache[name].get('suffix') \
        or not suffix else f"{cache[name]['key']}:{suffix}"


def dump_to_cache(
    key: str, 
    data = None, 
    stale_time_in_hour: int = 0,
    **kwargs
):
    if data:
        redis_client.set(
            key, 
            pickle.dumps(data),
            ex= (stale_time_in_hour * HOUR_IN_SECONDS) if \
                stale_time_in_hour else None, 
            **kwargs
        )
    return data


def load_from_cache(key: str):
    result = redis_client.get(key)
    if result: return pickle.loads(result)
    return None


def get_page_num_by_rank(rank: int, max_per_page: int) -> int:
    return 1 + int(math.floor((rank -1) / max_per_page))


@shared_task
def get_cmc_id_map_total_pages():
    total_coins = get_total_count_active_cryptocurrencies()
    return int(math.ceil(
        total_coins / cache['cmc_id_map']['len']
    )) if total_coins else 1


@shared_task
def get_total_count_active_cryptocurrencies():
    cached_data = load_from_cache(
        get_cache_key('global_statistic')
    )
    results = cached_data if cached_data else \
        store_global_statistic()

    if not results: 
        return 0

    return results.get('active_cryptocurrencies', 0)


@shared_task
def store_list_id_top_100(page: int = 1):
    if not page or page < 1: return None
    page_from_top_200 = int(math.ceil(page/2))
    cached_list = load_from_cache(
        get_cache_key('list_crypto', page_from_top_200)
    )
    id_top_100 = []
    raw_list = cached_list if cached_list \
       else store_list_crypto(
            page= page_from_top_200
        )
    if raw_list and raw_list.get('data'):
        idx_start, idx_end = (
            cache['id_top_100']['len'], 
            cache['list_crypto']['len']
        ) if page % 2 == 0 else \
            ( 0, cache['id_top_100']['len'] )
        id_top_100 = list(map(
            lambda o: o['id'], 
            raw_list['data'][idx_start:idx_end]
        ))
    return None if not len(id_top_100) \
        else dump_to_cache(
            get_cache_key('id_top_100', page), 
            id_top_100
        )


@shared_task
def ensure_list_id_top_100(page: int = 1):
    if not page or page < 1: 
        return None

    results = load_from_cache(get_cache_key('id_top_100', page))
    return results if results else store_list_id_top_100(page)


@shared_task
def ensure_fiat_map(**kwargs):
    symbol = kwargs.get('symbol')
    cache_key = get_cache_key('fiat_map')
    if symbol and len(symbol) == 3:
        symbol = symbol.upper()
    else: symbol = None

    if symbol:
        fiat = redis_client.hget(cache_key, symbol)
        if fiat:
            return pickle.loads(fiat)
        if not redis_client.exists(cache_key):
            return store_fiat_map(symbol)
        return None

    fiat_map = redis_client.hgetall(cache_key)
    if not fiat_map or not len(fiat_map):
        return store_fiat_map()

    mapping = {}
    for key, item in fiat_map.items():
        mapping[key.decode('utf-8')] = pickle.loads(item)

    return mapping


@shared_task
def store_list_crypto(**kwargs):
    page = int(kwargs.get('page')) if \
        kwargs.get('page') else 1

    fetched_data = api.fetch_list_crypto(page= page)

    if not fetched_data:
        return None

    return dump_to_cache(
        get_cache_key('list_crypto', page), 
        fetched_data
    )


def convert_list_id_to_params_format(list_id):
     return ''.join(map(
        lambda n: f'{n}' if n == list_id[-1] else f'{n},', 
        list_id 
    ))


@shared_task
def ensure_cache_with_cmc_id_as_key_and_pipeline(
    cache_key: str,
    store_func,
    **kwargs
):
    options = [kwargs.get(v) for v in ['slug', 'symbol', 'id']]
    id_params = kwargs.get('ids')
    page = int(kwargs.get('page')) if kwargs.get('page') else 1

    is_bundle = False
    if (page or id_params) and len([o for o in options if o]) == 0:
        is_bundle = True

    if not is_bundle:
        id_map = ensure_cmc_id_map(**kwargs)
        if not id_map or not id_map.get('rank'): 
            return None

        page = get_page_num_by_rank(
            id_map['rank'], cache[cache_key]['len']
        )
        item = redis_client.get(
            get_cache_key(cache_key, id_map['id'])
        )
        return pickle.loads(item) if item else store_func(
            False,
            page= page,
            id= id_map['id']
        )

    else:
        id_list = id_params.split(',') \
            if id_params else ensure_list_id_top_100(page)

        if not len(id_list): 
            return None

        if not kwargs.get('ignore_fix_ids'):
            id_list = filter_valid_and_active_ids_from_bundle(
                id_list
            )
        id_list = id_list[0:cache[cache_key]['len']]

        num_keys_exists = redis_client.exists(
            *[get_cache_key(cache_key, i) for i in id_list]
        )
        # print('{} keys exists out of {}'.format(num_keys_exists, len(id_list)))
        if num_keys_exists != len(id_list):
            return store_func(
                True,
                page= page,
                ids= id_params
            )

        data = {}
        with redis_client.pipeline() as pipe:
            for _id in id_list:
                pipe.get(
                    get_cache_key(cache_key, _id)
                )
            results = pipe.execute()
            for res in results:
                item = pickle.loads(res)
                data[str(item['id'])] = item

        return data


@shared_task
def ensure_metadata(**kwargs):
    return ensure_cache_with_cmc_id_as_key_and_pipeline(
        'metadata', 
        store_metadata,
        **kwargs
    )


@shared_task
def ensure_quotes(**kwargs):
    return ensure_cache_with_cmc_id_as_key_and_pipeline(
        'quotes', 
        store_quotes,
        **kwargs
    )


@shared_task
def store_cache_with_cmc_id_as_key_and_pipeline(
    cache_key: str, 
    fetch_func,
    **kwargs
):
    page = int(kwargs.get('page')) if kwargs.get('page') else 1
    list_id = ensure_list_id_top_100(page)
    if not list_id: return None

    ids = id_params = kwargs.get('ids')
    if id_params:
        if len(id_params.split(',')) > 100:
            id_params = convert_list_id_to_params_format(
                id_params.split(',')[0:100]
            )
        else:
            id_params = convert_list_id_to_params_format(
                [*id_params.split(','), *list_id][0:100]
            )
    else:
        id_params = convert_list_id_to_params_format(list_id)

    fetched_data = fetch_func(id_params)
    if not fetched_data or not fetched_data.get('data'):
        return None

    data = fetched_data.get('data')
    if not data: return None

    with redis_client.pipeline() as pipe:
        for key, item in data.items():
            pipe.set(
                get_cache_key(cache_key, key), 
                pickle.dumps(item),
                ex= (kwargs.get('expire_in_hours') * HOUR_IN_SECONDS) \
                    if kwargs.get('expire_in_hours') else None
            )
        pipe.execute()

    cmc_id = kwargs.get('id')
    if cmc_id and not kwargs.get('bundle'):
        return data.get(str(cmc_id))
    elif ids:
        items = {}
        for _id in ids.split(','):
            items[str(_id)] = data.get(str(_id))
        return items
    return data


@shared_task
def store_quotes(bundle: bool = False, **kwargs):
    return store_cache_with_cmc_id_as_key_and_pipeline(
        'quotes', 
        api.fetch_quotes,
        # expire_in_hours= 1,
        bundle= bundle,
        **kwargs
    )


@shared_task
def store_metadata(bundle: bool = False, **kwargs):
    return store_cache_with_cmc_id_as_key_and_pipeline(
        'metadata', 
        api.fetch_metadata,
        bundle= bundle,
        **kwargs
    )


@shared_task
def store_fiat_map(symbol: str | None):
    fetched_data = api.fetch_fiat_map()
    if not fetched_data or not fetched_data.get('data'):
        return None

    result_dict, result_packed = transform_to_dict_and_pack(
        fetched_data.get('data'), 'symbol'
    )
    redis_client.hset(
        get_cache_key('fiat_map'), 
        mapping= result_packed
    )
    return result_dict if not symbol else \
        result_dict.get(symbol)


@shared_task
def store_global_statistic(**kwargs):
    fetched_data = api.fetch_global_statistic()
    if not fetched_data:
        return None

    return dump_to_cache(
        get_cache_key('global_statistic'), 
        fetched_data.get('data')
        # , stale_time_in_hour= 24
    )


@shared_task
def get_bundle_id_map(option: str = 'id', page: int = 1):
    accepts = ['slug', 'symbol', 'id']
    if page < 1 or option not in accepts: 
        return None

    cache_key = get_cache_key(
        'cmc_id_map', 
        f"{option + ':' if option != 'id' else ''}bundle:{page}"
    )
    cached_data = load_from_cache(cache_key)
    return cached_data if cached_data else \
        store_cmc_id_map(page= page, get_bundle= option)


@shared_task
def filter_valid_and_active_ids_from_bundle(id_list):
    entire_coin_map_dict = get_all_pages_id_map_dict_bundle('id')
    if not entire_coin_map_dict: return []

    return list(filter(
        lambda _id: entire_coin_map_dict.get(str(_id)) and \
            entire_coin_map_dict.get(str(_id))['is_active']
        , id_list
    ))


def filter_item_by_keyword(keyword: str, item):
    return (keyword in item['name'].lower() or \
            keyword in item['slug'].lower() or \
            keyword in item['symbol'].lower()) and \
            item['is_active']


@shared_task
def search_entire_id_map_list_by_keyword(keyword: str):
    entire_coin_map_dict = get_all_pages_id_map_dict_bundle('id')
    if not entire_coin_map_dict: return []

    cmc_id_list = list(map(
        lambda item: item['id'],
        filter(
            lambda item: filter_item_by_keyword(keyword, item),
            entire_coin_map_dict.values()
        )
    ))
    # print('search_entire_id_map_list_by_keyword {}: {}'.format(
    #     keyword, 
    #     convert_list_id_to_params_format(
    #         cmc_id_list[0:cache['quotes']['len']])
    #     )
    # )
    return ensure_quotes(
        ids= convert_list_id_to_params_format(
            cmc_id_list[0:cache['quotes']['len']]
        ),
        ignore_fix_ids= True
    )


@shared_task
def get_all_pages_id_map_dict_bundle(option: str = 'id'):
    total_pages = get_cmc_id_map_total_pages()
    combined_dict = {}
    for page in range(1, total_pages +1):
        id_map = ensure_cmc_id_map(page= page, get_bundle= option)
        if id_map:
            combined_dict = {**combined_dict, **id_map}
    return combined_dict


@shared_task
def ensure_cmc_id_map(**kwargs):
    options_key = ['slug', 'symbol', 'id', 'page']
    options = [kwargs.get(v) for v in options_key]
    total_pages = get_cmc_id_map_total_pages()
    # print(f"ensure_cmc_id_map {(options, total_pages)}")
    for page in range(1, total_pages +1):
        cache_keys = [
            get_cache_key('cmc_id_map', f'slug:{page}'),
            get_cache_key('cmc_id_map', f'symbol:{page}'),
            get_cache_key('cmc_id_map', page),
            get_cache_key('cmc_id_map', f'slug:bundle:{page}'),
            get_cache_key('cmc_id_map', f'symbol:bundle:{page}'),
            get_cache_key('cmc_id_map', f'bundle:{page}')
        ]
        if redis_client.exists(*cache_keys) >= len(cache_keys):
            if kwargs.get('ignore_result'): continue
            if options[0]:  # slug
                _id = redis_client.hget(cache_keys[0], options[0])
                if _id:
                    item = redis_client.hget(cache_keys[2], _id)
                    if item: return pickle.loads(item)
            elif options[1]:  # symbol
                _id = redis_client.hget(cache_keys[1], options[1])
                if _id:
                    item = redis_client.hget(cache_keys[2], _id)
                    if item: return pickle.loads(item)
            elif options[2]:  # id
                item = redis_client.hget(cache_keys[2], options[2])
                if item: return pickle.loads(item)
            elif page == options[-1]:  # page
                if kwargs.get('get_bundle') == 'slug':
                    return load_from_cache(
                        get_cache_key('cmc_id_map', f'slug:bundle:{page}')
                    )
                elif kwargs.get('get_bundle') == 'symbol':
                    return load_from_cache(
                        get_cache_key('cmc_id_map', f'symbol:bundle:{page}')
                    )
                elif kwargs.get('get_bundle') == 'id':
                    return load_from_cache(
                        get_cache_key('cmc_id_map', f'bundle:{page}')
                    )
                items = redis_client.hgetall(cache_keys[2])
                mapping = {}
                for key, item in items.items():
                    mapping[key.decode('utf-8')] = pickle.loads(item)
                return mapping
        else:
            params = {**kwargs, 'page': page}
            # print(f"cache not found! updating.. {params}")
            return store_cmc_id_map(**params)

    return None   


@shared_task
def transform_to_dict_and_pack(array_data, 
                               key_taken: str = 'id'):
    result_dict = {}
    result_packed = {}
    for item in array_data:
        item_key = str(item[key_taken])
        if item_key not in result_dict:
            result_dict[item_key] = item
            result_packed[item_key] = pickle.dumps(item)
    return result_dict, result_packed


@shared_task
def transform_to_dict(array_data, key_taken: str = 'id'):
    result_dict = {}
    for item in array_data:
        item_key = str(item[key_taken])
        if item_key not in result_dict:
            result_dict[item_key] = item['id']
    return result_dict


@shared_task(ignore_result=True)
def store_id_map_caches(data: dict, cache_keys: tuple):
    with redis_client.pipeline() as pipe:
        pipe.hset(cache_keys[0], mapping= data)
        pipe.set(
            cache_keys[1], 
            pickle.dumps(data)
            # , ex= 24 * HOUR_IN_SECONDS
        )
        pipe.execute()


@shared_task
def store_cmc_id_map(**kwargs):
    page = int(kwargs.get('page')) if kwargs.get('page') else 1
    resp_data = api.fetch_cmc_id_map(page)
    if not resp_data or not resp_data.get('data'):
        return None

    id_map_by_symbol = transform_to_dict(
        resp_data.get('data'), 'symbol'
    )
    store_id_map_caches(
        id_map_by_symbol,
        (
            get_cache_key('cmc_id_map', f'symbol:{page}'),
            get_cache_key('cmc_id_map', f'symbol:bundle:{page}')
        )
    )

    id_map_by_slug = transform_to_dict(
        resp_data.get('data'), 'slug'
    )
    store_id_map_caches(
        id_map_by_slug,
        (
            get_cache_key('cmc_id_map', f'slug:{page}'),
            get_cache_key('cmc_id_map', f'slug:bundle:{page}')
        )
    )

    id_map_dict_by_id, id_map_dict_by_id_packed = \
        transform_to_dict_and_pack(
            resp_data.get('data'), 'id'
        )
    with redis_client.pipeline() as pipe:
        pipe.hset(
            get_cache_key('cmc_id_map', page), 
            mapping= id_map_dict_by_id_packed
        )
        pipe.set(
            get_cache_key('cmc_id_map', f'bundle:{page}'), 
            pickle.dumps(id_map_dict_by_id)
            # , ex= 24 * HOUR_IN_SECONDS
        )
        pipe.execute()

    # retrieve and return if any
    cmc_id = kwargs.get('id')
    if kwargs.get('slug'):
        cmc_id = id_map_by_slug.get(kwargs.get('slug'))
        
    elif kwargs.get('symbol'):
        cmc_id = id_map_by_symbol.get(kwargs.get('symbol'))

    if cmc_id:
        return id_map_dict_by_id.get(str(cmc_id))

    elif kwargs.get('get_bundle') == 'slug':
        return id_map_by_slug

    elif kwargs.get('get_bundle') == 'symbol':
        return id_map_by_symbol

    return id_map_dict_by_id


@shared_task
def store_historial_data(**kwargs):
    symbol = kwargs.get('symbol').upper() if \
        kwargs.get('symbol') else None
    years = int(kwargs.get('years')) if kwargs.get('years') else 4
    if not symbol:
        return None

    return dump_to_cache(
        get_cache_key('historical_data', symbol),
        api.fetch_yahoo_finance(symbol, years)
        # , stale_time_in_hour= 24
    )


@shared_task
def store_spark_data(**kwargs):
    symbol = kwargs.get('symbol').upper() if \
        kwargs.get('symbol') else None

    if not symbol:
        return None

    return dump_to_cache(
        get_cache_key('spark_data', symbol),
        api.fetch_yahoo_spark(symbol)
        # , stale_time_in_hour= 24
    )


@shared_task
def store_ip_user(identifier: str):
    pass


@shared_task
def store_pending_order(**kwargs) -> bool:
    try:
        redis_client.set(
            'orderbook:{}'.format(kwargs.get('uuid')),
            pickle.dumps(kwargs),
            ex= 2 * MINUTE_IN_SECONDS
        )
        return True
    except Exception:
        return False


@shared_task
def get_pending_order(uuid: str) -> bool:
    if not uuid:
        return None

    try:
        cached_data = redis_client.get(
            'orderbook:{}'.format(uuid)
        )
        return pickle.loads(cached_data) if \
            cached_data else None
    except Exception:
        return None

