from app.models.order import OrderBook
from app.models.wallet import Wallet
from app.extensions import db
from sqlalchemy import and_

from .wallet_service import WalletService
from .crypto_service import CryptoService
from .transaction_service import TransactionService


class OrderService(WalletService, TransactionService, CryptoService):
    def create_buy_order(self, user_id, asset_symbol, total, wallet_symbol, order_type):
        # check user wallet balance
        user_wallet_asset = self.get_user_wallet_by_asset_symbol(user_id, wallet_symbol)
        if not user_wallet_asset: 
            return None

        asset = self.get_asset_by_symbol(symbol=asset_symbol)
        if not asset: 
            return None

        user_wallet, _ = user_wallet_asset
        print('user_wallet', user_wallet.to_dict())
        print('asset_wallet', asset.to_dict())
        wallet_balance = user_wallet.balance
        print('wallet_balance', wallet_balance)

        # check actual price after calculated
        asset_price = self.get_asset_price_by_symbol(asset_symbol)
        if not asset_price: return None
        total_purchase = float(total)
        order_amount = total_purchase / asset_price
        print('total_purchase', total_purchase)

        if wallet_balance < total_purchase:
            return None

        # TODO: check real-time price asset and calculation
        # TODO: check current balance (wallet_used) is enough
        # TODO: calculation amount to asset price instead $usd 

        new_order = OrderBook(
            user_id=user_id,
            asset_id=asset.id,
            order_type=order_type,
            wallet_id=user_wallet.id,
            amount=order_amount,
            price=asset_price
        )
        self.save_changes(new_order)

        # TODO: Preview the order back to client
        return new_order


    def create_sell_order(self, user_id, asset_symbol, total, wallet_symbol, order_type):
        # check user asset balance
        selling_asset = self.get_user_wallet_by_asset_symbol(user_id, asset_symbol)
        if not selling_asset:
            return None

        asset_price = self.get_asset_price_by_symbol(asset_symbol)
        if not asset_price: return None

        asset_wallet, asset = selling_asset
        wallet_balance_in_usd = float(asset_wallet.balance) * asset_price
        if wallet_balance_in_usd < float(total):
            return None

        wallet_asset_used = self.get_user_wallet_by_asset_symbol(user_id, wallet_symbol)
        if not wallet_asset_used:
            return None

        wallet_used, _ = wallet_asset_used

        new_order = OrderBook(
            user_id=user_id,
            asset_id=asset.id,
            order_type=order_type,
            wallet_id=wallet_used.id,
            amount=float(total) / asset_price,
            price=asset_price
        )
        self.save_changes(new_order)

        # TODO: Preview the order back to client
        return new_order


    def create_order(self, user_id, asset_symbol, total, wallet_symbol, order_type):
        if order_type == 'buy':
            return self.create_buy_order(
                user_id=user_id, 
                asset_symbol=asset_symbol, 
                total=total, 
                wallet_symbol=wallet_symbol, 
                order_type=order_type
            )

        elif order_type == 'sell':
            return self.create_sell_order(
                user_id=user_id, 
                asset_symbol=asset_symbol, 
                total=total, 
                wallet_symbol=wallet_symbol, 
                order_type=order_type
            )

        return None


    def complete_sell_order(self, order, user_id):
        user_wallet = self.get_wallet_by_id(order.wallet_id)
        if not user_wallet:
            return None

        print('user_wallet', user_wallet.to_dict())

        asset_wallet = self.get_user_wallet_by_asset_id(user_id, order.asset_id)
        if not asset_wallet:
            return None

        print('asset_wallet', asset_wallet.to_dict())

        total_price_in_usd = order.amount * order.price
        print('total_price_in_usd', total_price_in_usd)

        # set order complete
        fulfilled_order = order
        fulfilled_order.status = 'fulfilled'
        db.session.commit()
        print('fulfilled_order', fulfilled_order.to_dict())

        # update asset balance in wallet
        print('asset_wallet', asset_wallet.to_dict())
        asset_wallet.balance = asset_wallet.balance - order.amount
        db.session.commit()
        print('asset_wallet', asset_wallet.to_dict())

        # update balance on used wallet
        print('user_wallet', user_wallet.to_dict())
        user_wallet.balance = user_wallet.balance + total_price_in_usd
        db.session.commit()
        print('user_wallet', user_wallet.to_dict())

        # update transaction
        new_transaction = self.create_transaction(
            user_id, fulfilled_order.id, fulfilled_order.uuid, 'sell')

        print('new_transaction', new_transaction.to_dict())
        return new_transaction, fulfilled_order


    def complete_buy_order(self, order, user_id):
        user_wallet = self.get_wallet_by_id(order.wallet_id)
        if not user_wallet:
            return None

        asset_wallet = self.get_user_wallet_by_asset_id(user_id, order.asset_id)
        if not asset_wallet:
            new_wallet = self.create_wallet(user_id, order.asset_id, balance=0)
            asset_wallet = new_wallet

        total_price = order.amount * order.price
        print('total_price', total_price)

        # set order complete
        fulfilled_order = order
        fulfilled_order.status = 'fulfilled'
        db.session.commit()

        print('fulfilled_order', fulfilled_order.to_dict())
        print('user_wallet', user_wallet.to_dict())

        # update wallet balance 
        user_wallet.balance = user_wallet.balance - total_price
        db.session.commit()

        print('user_wallet', user_wallet.to_dict())
        print('asset_wallet', asset_wallet.to_dict())

        # update wallet balance on asset
        asset_wallet.balance = asset_wallet.balance + fulfilled_order.amount
        db.session.commit()

        print('asset_wallet', asset_wallet.to_dict())

        # update transaction
        new_transaction = self.create_transaction(
            user_id, fulfilled_order.id, fulfilled_order.uuid, 'buy')

        print('new_transaction', new_transaction.to_dict())

        return new_transaction, fulfilled_order


    def set_complete_order(self, user_id, uuid):
        pending_order = OrderBook.query.filter(and_(
            OrderBook.user_id==user_id, 
            OrderBook.uuid==uuid
        )).first()

        print('pending_order', pending_order.to_dict())

        # check status, user_id, and not older than X minutes ,etc
        if not pending_order \
        or pending_order.status != 'pending':
            return None

        if pending_order.order_type == 'buy':
            return self.complete_buy_order(
                order=pending_order, 
                user_id=user_id, 
            )

        elif pending_order.order_type == 'sell':
            return self.complete_sell_order(
                order=pending_order, 
                user_id=user_id, 
            )

        return None


    def get_order_by_id(self, order_id):
        return OrderBook.query.get(order_id)


    def save_changes(self, data):
        db.session.add(data)
        db.session.commit()
