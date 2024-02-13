from .cache_service import CacheServices


class CryptoService(CacheServices):
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
        if not symbol or len(symbol.strip(' ')) < 2: 
            return None
        symbol = symbol.upper()
        try:
            quote = self.quotes.ensure(symbol=symbol)
            if not quote:
                raise Exception(f'{symbol} not found')
            return quote
        except Exception:
            return None

