from app.models.order import OrderBook
from app.extensions import db


class OrderService:
    def create_order(self, user_id, crypto_id, order_type, amount, price):
        new_order = OrderBook(
            user_id=user_id,
            crypto_id=crypto_id,
            order_type=order_type,
            amount=amount,
            price=price,
            status='OPEN'
        )
        db.session.add(new_order)
        db.session.commit()
        return new_order

    def get_order_by_id(self, order_id):
        return OrderBook.query.get(order_id)

    # Add more order-related services (order book management, trade execution, etc.) as needed
