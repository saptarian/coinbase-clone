import pickle, math
from dataclasses import dataclass
from typing import List, Union, Optional

from app.extensions import rds, api_ext
from app.utils.helpers import is_digit

# Constant
MINUTE_IN_SECONDS = 60
HOUR_IN_SECONDS = MINUTE_IN_SECONDS * 60 


class CacheService:
    def dump(
        self,
        key: str, 
        data = None, 
        ex: Optional[int] = None,
        ignore_pickle: bool = False,
        **kwargs
    ):
        expired = 5 * MINUTE_IN_SECONDS
        if ex and ex > 0: expired = ex
        store = data if ignore_pickle else pickle.dumps(data)
        if data:
            rds.set(key, store, ex= expired, **kwargs)
        return data


    def load(self, key: str, ignore_pickle: bool = False):
        # print(f'load: {key}')
        result = rds.get(key)
        if not result: return None
        if ignore_pickle: return result
        return pickle.loads(result)


    def key(self, cache, *args):
        if not len(args): return cache.key
        key = ':'.join([cache.key, *map(lambda x: str(x), args)])
        # print(f'key: {key}')
        return key 


    def get_page_index(
        self, 
        item_index: int, 
        n_items_per_page: int,
        first_index: int = 1
    ) -> int:
        return first_index + int(
            math.floor(
                (item_index - first_index) / n_items_per_page
            )
        )

    def mapping(
        self, 
        array_item: list, 
        key_taken: str = 'id', 
        include_pack: bool = False,
        key_item_to_store: Optional[str] = None
    ):
        result_dict = {}
        result_packed = {}
        for item in array_item:
            key = str(item[key_taken])
            store = item
            if key_item_to_store:
                store = item[key_item_to_store]
            if key not in result_dict:
                result_dict[key] = store
                if include_pack:
                    result_packed[key] = pickle.dumps(store)

        return result_dict if not include_pack \
            else (result_dict, result_packed)


class CMCGlobalStatisticService(CacheService):
    def _api(self):
        return api_ext.cmc

    def _node(self):
        return self._api().nodes.global_statistic

    def _cache(self):
        return self._node().cache

    def store(self):
        data = self._api().fetch_global_statistic()
        if not data: return None
        return self.dump(
            self._cache().key, 
            data.get('data')
            , ex= 24 * HOUR_IN_SECONDS
        )

    def ensure(self):
        data = self.load(self._cache().key)
        return data if data else self.store()


    def get_total_count_active_cryptocurrencies(self):
        # print(f'get_total_count_active_cryptocurrencies {dir(self)}')
        cached_data = self.load(self._cache().key)
        item = cached_data if cached_data else \
            self.store()

        if not item: return 0
        return item.get('active_cryptocurrencies', 0)


class CMCIDMapService(CacheService):
    def __init__(self):
        self.global_statistic = CMCGlobalStatisticService()

    def _api(self):
        return api_ext.cmc

    def _node(self):
        return self._api().nodes.cmc_id_map

    def _cache(self):
        return self._node().cache

    def store_packages(self, mapping: tuple, data: tuple):
        map_key, map_value = mapping
        data_key, data_value = data
        with rds.pipeline() as pipe:
            pipe.hset(map_key, mapping= map_value)
            pipe.expire(map_key, 24 * HOUR_IN_SECONDS)
            pipe.set(
                data_key, 
                pickle.dumps(data_value)
                , ex= 24 * HOUR_IN_SECONDS
            )
            pipe.execute()


    def create_package(self, items: list, name: str, suffix):
        mapping = self.mapping(
            array_item= items,
            key_taken= name, 
            key_item_to_store= 'id'
        )
        self.store_packages(
            mapping=(
                self.key(self._cache(), name, suffix),
                mapping
            ),
            data=(
                self.key(self._cache(), name, 'bundle', suffix),
                mapping
            )
        )
        return mapping


    def store(self, **kwargs):
        page = int(kwargs.get('page', 1))
        if page > self.get_total_pages(): return None
        resp_data = self._api().fetch_cmc_id_map(page)
        if not resp_data or not resp_data.get('data'):
            return None

        id_map_by_symbol = self.create_package(
            items= resp_data.get('data'),
            name= 'symbol',
            suffix= str(page)
        )
        id_map_by_slug = self.create_package(
            items= resp_data.get('data'),
            name= 'slug',
            suffix= str(page)
        )
        id_map_dict_by_id, id_map_dict_by_id_packed = self.mapping(
            array_item= resp_data.get('data'), 
            key_taken= 'id',
            include_pack= True
        )
        self.store_packages(
            mapping=(
                self.key(self._cache(), page),
                id_map_dict_by_id_packed
            ),
            data=(
                self.key(self._cache(), 'bundle', page),
                id_map_dict_by_id
            )
        )
        # retrieve and return if any
        if kwargs.get('slug'):
            _id = id_map_by_slug.get(kwargs.get('slug'))
            return id_map_dict_by_id.get(str(_id)) \
                if _id else None
        elif kwargs.get('symbol'):
            _id = id_map_by_symbol.get(kwargs.get('symbol'))
            return id_map_dict_by_id.get(str(_id)) \
                if _id else None

        _id = kwargs.get('id')
        if _id: return id_map_dict_by_id.get(str(_id))
        match kwargs.get('get_bundle'):
            case 'slug':
                return id_map_by_slug
            case 'symbol':
                return id_map_by_symbol

        return id_map_dict_by_id


    def ensure(self, **kwargs):
        option_keys = ['slug', 'symbol', 'id', 'page']
        options = [kwargs.get(v) for v in option_keys]
        total_pages = self.get_total_pages()
        # print(f"ensure_cmc_id_map {(options, total_pages)}")
        for page in range(1, total_pages +1):
            cache_keys = [
                self.key(self._cache(), 'slug', page),
                self.key(self._cache(), 'symbol', page),
                self.key(self._cache(), page),
                self.key(self._cache(), 'slug', 'bundle', page),
                self.key(self._cache(), 'symbol', 'bundle', page),
                self.key(self._cache(), 'bundle', page),
            ]
            if rds.exists(*cache_keys) >= len(cache_keys):
                if kwargs.get('ignore_result'): continue
                if options[0]:  # slug
                    _id = rds.hget(cache_keys[0], options[0])
                    if _id:
                        item = rds.hget(cache_keys[2], _id)
                        if item: return pickle.loads(item)
                elif options[1]:  # symbol
                    _id = rds.hget(cache_keys[1], options[1])
                    if _id:
                        item = rds.hget(cache_keys[2], _id)
                        if item: return pickle.loads(item)
                elif options[2]:  # id
                    item = rds.hget(cache_keys[2], options[2])
                    if item: return pickle.loads(item)
                elif page == options[-1]:  # page
                    if kwargs.get('get_bundle') == 'slug':
                        return self.load(
                            self.key(self._cache(), 'slug', 'bundle', page),
                        )
                    elif kwargs.get('get_bundle') == 'symbol':
                        return self.load(
                            self.key(self._cache(), 'symbol', 'bundle', page),
                        )
                    elif kwargs.get('get_bundle') == 'id':
                        return self.load(
                            self.key(self._cache(), 'bundle', page),
                        )
                    items = rds.hgetall(cache_keys[2])
                    mapping = {}
                    for key, item in items.items():
                        mapping[key.decode('utf-8')] = pickle.loads(item)
                    return mapping
            else:
                if kwargs.get('page') \
                and kwargs.get('page') > 1 \
                and kwargs.get('page') != page:
                    continue

                params = {**kwargs, 'page': page}
                # print(f"cache not found! updating.. {params}")
                updated = self.store(**params)
                if not updated: continue
                return updated

        return None   


    def get_total_pages(self):
        total_coins = self.global_statistic\
            .get_total_count_active_cryptocurrencies()
        return int(math.ceil(
            total_coins / self._cache().item_len
        )) if total_coins else 1


    def get_bundle(self, option: str = 'id', page: int = 1):
        accepts = ['slug', 'symbol', 'id']
        if page < 1 or option not in accepts: 
            return None

        cache_key = self.key(
            self._cache(), 
            f"{option + ':' if option != 'id' else ''}bundle:{page}"
        )
        cached_data = self.load(cache_key)
        return cached_data if cached_data else \
            self.store(page= page, get_bundle= option)


    def get_all_pages_mapping_bundle(self, option: str = 'id'):
        total_pages = self.get_total_pages()
        combined_dict = {}
        for page in range(1, total_pages +1):
            id_map = self.ensure(page= page, get_bundle= option)
            if id_map:
                combined_dict = {**combined_dict, **id_map}
        return combined_dict


    def filter_valid_ids_from_bundle(self, id_list):
        entire_coin_mapping = self.get_all_pages_mapping_bundle('id')
        if not entire_coin_mapping: return []

        return list(filter(
            lambda _id: entire_coin_mapping.get(str(_id)) and \
                entire_coin_mapping.get(str(_id))['is_active']
            , id_list
        ))


    def filter_item(self, keyword: str, item):
        return (keyword in item['name'].lower() or \
                keyword in item['slug'].lower() or \
                keyword in item['symbol'].lower()) and \
                item['is_active']


class CMCFiatMapService(CacheService):
    def _api(self):
        return api_ext.cmc

    def _node(self):
        return self._api().nodes.fiat_map

    def _cache(self):
        return self._node().cache

    def store(self, symbol: Optional[str] = None):
        data = self._api().fetch_fiat_map()
        if not data or not data.get('data'):
            return None

        result_dict, result_packed = self.mapping(
            array_item= data.get('data'), 
            key_taken= 'symbol',
            include_pack= True
        )
        cache_key = self._cache().key
        rds.hset(cache_key, mapping= result_packed)
        rds.expire(cache_key, 72 * HOUR_IN_SECONDS)
        return result_dict if not symbol else \
            result_dict.get(symbol)


    def ensure(self, symbol: Optional[str] = None):
        cache_key = self._cache().key
        if symbol and len(symbol) == 3:
            symbol = symbol.upper()
        else: symbol = None

        if symbol:
            fiat = rds.hget(cache_key, symbol)
            if fiat: return pickle.loads(fiat)
            if not rds.exists(cache_key):
                return self.store(symbol)
            return None

        else:
            fiat_map = rds.hgetall(cache_key)
            if not fiat_map or not len(fiat_map):
                return self.store()
            mapping = {}
            for key, item in fiat_map.items():
                mapping[key.decode('utf-8')] = pickle.loads(item)
            return mapping


class CMCListCryptoService(CacheService):
    def _api(self):
        return api_ext.cmc

    def _node(self):
        return self._api().nodes.list_crypto

    def _cache(self):
        return self._node().cache

    def store(self, page: int = 1):
        data = self._api().fetch_list_crypto(page= page)
        if not data: return None
        return self.dump(
            self.key(self._cache(), page),
            data
            , ex= 5 * MINUTE_IN_SECONDS
        )

    def ensure(self, page: int = 1):
        data = self.load(self.key(self._cache(), page))
        return data if data \
            else self.store(page)


class CMCTopListService(CacheService):
    def __init__(self):
        self.list_crypto = CMCListCryptoService()

    def _api(self):
        return api_ext.cmc

    def _node(self):
        return self._api().nodes.id_top_list

    def _cache(self):
        return self._node().cache

    def store(self, page: int = 1):
        if not page or page < 1: return None
        page_from_top_list = int(math.ceil(page/2))
        cached_list = self.load(self.key(
            self.list_crypto._cache(), 
            page_from_top_list
        ))
        id_top_list = []
        raw_list = cached_list if cached_list \
           else self.list_crypto.store(
                page= page_from_top_list
            )
        if raw_list and raw_list.get('data'):
            index_start, index_end = (
                self._cache().item_len,
                self.list_crypto._cache().item_len
            ) if page % 2 == 0 else \
                ( 0, self._cache().item_len, )
            id_top_list = list(map(
                lambda o: o['id'], 
                raw_list['data'][index_start:index_end]
            ))
        return None if not len(id_top_list) else \
            self.dump(
                self.key(self._cache(), page), 
                id_top_list
                , ex= 5 * MINUTE_IN_SECONDS
            )


    def ensure(self, page: int = 1):
        if not page or page < 1: return None
        results = self.load(self.key(self._cache(), page))
        return results if results else self.store(page)


class CMCCacheExtendedService(CacheService):
    def __init__(self):
        self.id_map = CMCIDMapService()
        self.top_list = CMCTopListService()

    def store(self, cache, fetch_func, **kwargs):
        page = int(kwargs.get('page')) if kwargs.get('page') else 1
        list_id = self.top_list.ensure(page)
        if not list_id: return None
        ids = kwargs.get('ids')
        if ids:
            id_params = ids[0:100]
            if len(id_params) < 100:
                id_params = [*id_params, *list_id][0:100]
        else:
            id_params = list_id

        fetched_data = fetch_func(id_params)
        data = fetched_data.get('data')
        if not fetched_data or not data:
            return None

        with rds.pipeline() as pipe:
            for key, item in data.items():
                pipe.set(
                    self.key(cache, key),
                    pickle.dumps(item),
                    ex= kwargs.get('expire')
                )
            pipe.execute()

        cmc_id = kwargs.get('id')
        if cmc_id and not kwargs.get('bundle'):
            return data.get(str(cmc_id))
        elif ids:
            items = {}
            for _id in ids:
                items[str(_id)] = data.get(str(_id))
            return items
        return data


    def ensure(self, cls, cache, **kwargs):
        options = [kwargs.get(v) for v in ['slug', 'symbol', 'id']]
        ids = kwargs.get('ids')
        page = int(kwargs.get('page')) if kwargs.get('page') else 1
        is_bundle = False
        if (page or ids) and len([o for o in options if o]) == 0:
            is_bundle = True

        if not is_bundle:
            id_map = self.id_map.ensure(**kwargs)
            if not id_map or not id_map.get('rank'): 
                return None

            page = self.get_page_index(
                id_map['rank'], cache.item_len
            )
            item = rds.get(
                self.key(cache, id_map['id'])
            )
            return pickle.loads(item) if item \
                else cls.store(bundle=False, page=page, id=id_map['id'])

        else:
            if not ids: id_list = self.top_list.ensure(page)
            else: id_list = ids
            if not id_list or not len(id_list): return None
            if not kwargs.get('ignore_fix_ids'):
                id_list = self.id_map.filter_valid_ids_from_bundle(
                    id_list
                )
            id_list = id_list[0:cache.item_len]
            if not len(id_list): return None
            num_keys_exists = rds.exists(
                *[self.key(cache, i) for i in id_list]
            )
            if num_keys_exists != len(id_list):
                return cls.store(bundle=True, page=page, ids=ids)

            data = {}
            with rds.pipeline() as pipe:
                for _id in id_list:
                    pipe.get(self.key(cache, _id))
                results = pipe.execute()
                for res in results:
                    item = pickle.loads(res)
                    data[str(item['id'])] = item

            return data


class CMCMetadataService(CacheService):
    def __init__(self):
        self._cache_ext = CMCCacheExtendedService()

    def _api(self):
        return api_ext.cmc

    def _node(self):
        return self._api().nodes.metadata

    def _cache(self):
        return self._node().cache

    def store(self, bundle: bool = False, **kwargs):
        return self._cache_ext.store(
            self._cache(), 
            self._api().fetch_metadata,
            bundle= bundle,
            expire= 72 * HOUR_IN_SECONDS,
            **kwargs
        )

    def ensure(self, **kwargs):
        return self._cache_ext.ensure(self, self._cache(), **kwargs)


class CMCQuotesService(CacheService):
    def __init__(self):
        self._cache_ext = CMCCacheExtendedService()

    def _api(self):
        return api_ext.cmc

    def _node(self):
        return self._api().nodes.quotes

    def _cache(self):
        return self._node().cache

    def store(self, bundle: bool = False, **kwargs):
        return self._cache_ext.store(
            self._cache(), 
            self._api().fetch_quotes,
            bundle= bundle,
            expire= 5 * MINUTE_IN_SECONDS,
            **kwargs
        )

    def ensure(self, **kwargs):
        return self._cache_ext.ensure(self, self._cache(), **kwargs)


class CMCSearchService(CacheService):
    def __init__(self):
        self.quotes = CMCQuotesService()
        self.cmc_id_map = CMCIDMapService()

    def find(self, keyword: str):
        mapping = self.cmc_id_map.get_all_pages_mapping_bundle('id')
        if not mapping: 
            return None
        result = {'status': {}, 'data': []}
        result['status']['search'] = keyword
        cmc_id_list = list(map(
            lambda item: item['id'],
            filter(
                lambda item: self.cmc_id_map.filter_item(keyword, item),
                mapping.values()
            )
        ))
        result['status']['total_count'] = len(cmc_id_list)
        if not len(cmc_id_list): return result
        data = self.quotes.ensure(
            ids= cmc_id_list[0:self.quotes._cache().item_len],
            ignore_fix_ids= True
        )
        if not data or not len(data): return result
        result['data'] = list(data.values())
        result['status']['showing'] = len(result['data'])
        return result


class YahooHistoryService(CacheService):
    def _api(self):
        return api_ext.yahoo

    def _node(self):
        return self._api().nodes.historical_data

    def _cache(self):
        return self._node().cache

    def store(self, symbol: str, years: int = 4):
        symbol = symbol.upper() if symbol else None
        if not symbol: return None
        return self.dump(
            self.key(self._cache(), symbol),
            self._api().fetch_history(symbol, years)
            , ex= 24 * HOUR_IN_SECONDS
        )

    def ensure(self, symbol: str, years: int = 4):
        data = self.load(self.key(self._cache(), symbol))
        return data if data \
            else self.store(symbol=symbol, years=years)


class YahooSparkService(CacheService):
    def _api(self):
        return api_ext.yahoo

    def _node(self):
        return self._api().nodes.spark_data

    def _cache(self):
        return self._node().cache

    def store(self, symbol: str):
        symbol = symbol.upper() if symbol else None
        if not symbol: return None
        return self.dump(
            self.key(self._cache(), symbol),
            self._api().fetch_spark(symbol)
            , ex= 5 * MINUTE_IN_SECONDS
        )

    def ensure(self, symbol: str):
        data = self.load(self.key(self._cache(), symbol))
        return data if data \
            else self.store(symbol=symbol)


class LatestNewsService(CacheService):
    def _api(self):
        return api_ext.news

    def _node(self):
        return self._api().nodes.latest_news

    def _cache(self):
        return self._node().cache

    def store(self):
        return self.dump(
            self._cache().key,
            self._api().fetch_latest_news()
            , ex= 12 * HOUR_IN_SECONDS
        )

    def ensure(self):
        data = self.load(self._cache().key)
        return data if data else self.store()

    def get_latest(self, n: int = 50):
        items = self.ensure()
        lim = n if n and n <= len(items) else len(items)
        return items[0:lim] if items else None


class FiatRatesService(CacheService):
    def _api(self):
        return api_ext.open_exchange

    def _node(self):
        return self._api().nodes.fiat_rates

    def _cache(self):
        return self._node().cache

    def store(self, symbols: Optional[Union[List[str], str]] = None):
        api_data = self._api().fetch_rates()
        if not api_data: return None
        if api_data.get('base') != 'USD':
            raise ValueError('Base conversion is not USD')
        rates = api_data.get('rates')
        if not rates or not len(rates): return None
        cache_key = self._cache().key
        with rds.pipeline() as pipe:
            pipe.hset(cache_key, mapping=rates)
            pipe.expire(cache_key, 5 * MINUTE_IN_SECONDS)
            pipe.execute()

        if not symbols: return rates
        if type(symbols) is str: 
            return {symbols: rates.get(symbols)}
        remapping = {}
        for symbol in symbols:
            remapping[symbol] = rates.get(symbol)
        return remapping


    def ensure(self, symbols: Optional[Union[List[str], str]] = None):
        if type(symbols) is str:
            rate = rds.hget(self._cache().key, symbols)
            if rate is not None: return {symbols: float(rate)} 
            elif not rds.exists(self._cache().key):
                return self.store(symbols)
            else: return {symbols: None}

        rates = rds.hgetall(self._cache().key)
        if not rates or not len(rates):
            return self.store(symbols)

        if not symbols: 
            remapping = {}
            for key, item in rates.items():
                remapping[key.decode('utf-8')] = float(item)
            return remapping

        remapping = {}
        for symbol in symbols:
            rate = rates.get(bytes(symbol.encode('utf-8')))
            remapping[symbol] = float(rate) if rate is not None else None
        return remapping


class PendingOrderService(CacheService):
    def store(self, **kwargs) -> bool:
        uuid = kwargs.get('uuid')
        if not uuid: return False
        try:
            self.dump(
                f'orderbook:{uuid}',
                kwargs,
                ex= 2 * MINUTE_IN_SECONDS
            )
            return True
        except Exception:
            return False


    def get(self, uuid: str) -> bool:
        if not uuid: return None
        return self.load(f'orderbook:{uuid}')


@dataclass(frozen=True)
class CacheServices:
    fiat_map = CMCFiatMapService()
    cmc_id_map = CMCIDMapService()
    global_statistic = CMCGlobalStatisticService()
    quotes = CMCQuotesService()
    metadata = CMCMetadataService()
    list_crypto = CMCListCryptoService()
    historical_data = YahooHistoryService()
    spark_data = YahooSparkService()
    search = CMCSearchService()
    latest_news = LatestNewsService()
    fiat_rates = FiatRatesService()
