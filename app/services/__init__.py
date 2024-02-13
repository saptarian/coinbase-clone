from .asset_service import AssetService
from .blacklist_service import BlacklistService
from .crypto_service import CryptoService
from .order_service import OrderService
from .transaction_service import TransactionService
from .user_service import UserService
from .wallet_service import WalletService


asset_svc = AssetService()
blacklist_svc = BlacklistService()
crypto_svc = CryptoService()
order_svc = OrderService()
transaction_svc = TransactionService()
user_svc = UserService()
wallet_svc = WalletService()