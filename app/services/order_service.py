from app.models.order import OrderBook
from app.models.transaction import Transaction
from app.models.wallet import Wallet
from app.extensions import db
from sqlalchemy import and_

from .wallet_service import WalletService
from .transaction_service import TransactionService


class OrderService(WalletService, TransactionService):
    def is_order_exists(self, uuid: str, user_id: int) -> bool:
        return db.session.query(OrderBook.id).\
            filter(and_(
                OrderBook.uuid == uuid,
                OrderBook.user_id == user_id
            )).first() is not None


    def create_new_order(self, **kwargs):
        new_order = OrderBook(**kwargs)
        self.save_changes(new_order)
        return new_order


    def get_order_by_id(self, order_id):
        return OrderBook.query.get(order_id)


    def save_changes(self, data):
        db.session.add(data)
        db.session.commit()
