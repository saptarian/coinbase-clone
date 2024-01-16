from app.models.transaction import Transaction
from app.models.order import OrderBook
from app.models.wallet import Wallet
from app.models.asset import Asset
from app.models.wallet import Wallet
from app.extensions import db

from sqlalchemy.orm import aliased


class TransactionService:
    def create_transaction(self, user_id, order_id, order_uuid, transaction_type):
        new_transaction = Transaction(
            user_id=user_id,
            order_id=order_id,
            order_uuid=order_uuid,
            transaction_type=transaction_type
        )
        self.save_changes(new_transaction)
        return new_transaction


    def get_transaction_by_id(self, transaction_id):
        return Transaction.query.get(transaction_id)


    def get_transactions_by_user_id(self, user_id):
        # Perform a join query to retrieve data from multiple tables 
        # join statement
        # wallet_used = Asset.join(OrderBook,
        #    OrderBook.wallet_id == Asset.id)

        a = aliased(Asset)
        w = aliased(Asset)

        stmt = db.select(
            Transaction.transaction_type, Transaction.timestamp,
            OrderBook.amount, OrderBook.price, OrderBook.status,
            a.name, a.symbol, a.slug, a.is_fiat,
            w.name.label('wallet_name'),
            w.symbol.label('wallet_symbol'),
            w.slug.label('wallet_slug'),
            w.is_fiat.label('wallet_is_fiat')
        ).select_from(Transaction).join(
            OrderBook, Transaction.order_id == OrderBook.id
        ).join(
            a, OrderBook.asset_id == a.id
        ).join(
            Wallet, OrderBook.wallet_id == Wallet.id
        ).join(
            w, Wallet.asset_id == w.id
        ).filter(
            Transaction.user_id == user_id
        ).order_by(Transaction.id.desc())

        results = db.session.execute(stmt)

        print(stmt)
        print(results)

        rows = []
        for row in results:
            rows.append({
                'transaction_type': row.transaction_type,
                'timestamp': row.timestamp,
                'order_amount': float(row.amount),
                'order_price': float(row.price),
                'order_status': row.status,
                'asset_name': row.name,
                'asset_symbol': row.symbol,
                'asset_slug': row.slug,
                'asset_is_fiat': row.is_fiat,
                'wallet_name': row.wallet_name,
                'wallet_symbol': row.wallet_symbol,
                'wallet_slug': row.wallet_slug,
                'wallet_is_fiat': row.wallet_is_fiat,
            })

        return rows


    def save_changes(self, data):
        db.session.add(data)
        db.session.commit()

    # TODO: Add more transaction-related services (transaction history, analytics, etc.) as needed
