from app.models.transaction import Transaction
from app.extensions import db


class TransactionService:
    def create_transaction(self, user_id, crypto_id, transaction_type, amount, price):
        new_transaction = Transaction(
            user_id=user_id,
            crypto_id=crypto_id,
            transaction_type=transaction_type,
            amount=amount,
            price=price
        )
        db.session.add(new_transaction)
        db.session.commit()
        return new_transaction

    def get_transaction_by_id(self, transaction_id):
        return Transaction.query.get(transaction_id)

    # Add more transaction-related services (transaction history, analytics, etc.) as needed
