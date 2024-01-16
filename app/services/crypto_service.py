from app import tasks


class CryptoService:
    def get_asset_price_by_symbol(self, symbol: str):
        api_asset = self.get_api_asset_by_symbol(symbol)
        if not api_asset: return None

        asset_price = api_asset.get('quote')
        if not asset_price: return None

        asset_price = asset_price.get('USD')
        if not asset_price: return None

        return asset_price.get('price') if \
            asset_price.get('price') else None


    def get_api_asset_by_symbol(self, symbol: str):
        """ 
        What we have:
        - cache id-map => { 'BTC': {item}, 'ETH': {item}, 'SOL': {item} }
            type: hash

        - cahce list-top-100 => [ 1, 145, 334, 245 ]
            type: pickle

        - cache list crypto is periodically updated with 200 coin per page
            shape => [ {item}, {item}, {item} ]
            type: pickle

        - cache quotes is on demand update with 100 coin per page
            shape => { 1: {item}, 2: {item}, 3: {item} }
            type: pickle

        Goal: need coin stats for symbol 'ETH' 

        What we do:
            - get item from cache id-map by symbol 'ETH' => {item}
            - get rank from {item} => 3
            - get page position, where is on cache quotes using number per page is 100 and rank => 2
            - get page we needed from cache quotes or by hit api => { 1: {item}, 2: {item}, 3: {item} }
            - process items:
                - get item from items by id, 
                - id we get from id-map's item.id, 
                - return the item => {item_with_price}

        """
        if not symbol or len(symbol.strip(' ')) < 2: 
            return None

        symbol = symbol.upper()
        task = tasks.ensure_quotes.apply_async(
            kwargs={ 'symbol': symbol }
        )
        try:
            quote = task.get(timeout=10)
            if not quote:
                raise Exception(f'{symbol} not found')

            return quote

        except Exception as e:
            raise Exception(f'Error when get asset by symbol: {e}') from e

    # Add more cryptocurrency-related services as needed
