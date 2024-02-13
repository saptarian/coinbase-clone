from app.models.user import User
from app.models.identity import Identity
from app.models.address import Address
from app.models.preference import Preference
from app.models.analytic import Analytic
from app.models.phone_number import PhoneNumber
from app.extensions import db

from sqlalchemy import and_
from .wallet_service import WalletService


class UserService(WalletService):
    def get_user_by_id(self, user_id: int):
        return User.query.get(user_id)


    def create_user(self, body: dict):
        new_user = User(
            body['first_name'],
            body['last_name'],
            body['email']
        )
        new_user.password = body['password']
        self.save_changes(new_user)
        return new_user


    def get_identity_id(self, user_id: int):
        return db.session.query(Identity.id).\
            filter(Identity.user_id == user_id).first()


    def get_identity(self, user_id: int):
        return Identity.query.filter_by(user_id=user_id).first()


    def get_profile(self, user_id: int):
        identity = self.get_identity(user_id)
        if not identity:
            return None

        address = Address.query.filter_by(user_id=user_id).first()
        # analytic = Analytic.query.filter_by(user_id=user_id).first()
        preference = Preference.query.filter_by(user_id=user_id).first()

        return identity, address, preference, self.get_list_of_phone_numbers(user_id)


    def get_primary_phone(self, user_id: int):
        return PhoneNumber.query.filter_by(user_id=user_id, is_primary=True).first()


    def get_list_of_phone_numbers(self, user_id: int):
        return PhoneNumber.query.filter(PhoneNumber.user_id==user_id).all()


    def get_all_user_phone_number(self, user_id: int):
        result = db.session.query(PhoneNumber.number).\
            filter(PhoneNumber.user_id == user_id).all()

        result = list(res[0] for res in result)

        # print('get_all_user_phone_number', result)
        return result


    def create_profile(self, user_id: int, body: dict):
        identity = body['identity']
        if not identity:
            return

        self.create_identity(user_id, identity)
        self.create_preference(user_id)

        address = body['address']
        if address:
            self.create_address(user_id, address)

        analytic = body['analytic']
        if analytic:
            self.create_analytic(user_id, analytic)

        asset = self.get_asset_by_symbol(symbol='USD')
        if not asset:
            raise Exception('Critical error: NO USD FOUND!')

        self.create_demo_wallet(user_id, asset.id)


    def create_identity(self, user_id: int, identity: dict):
        new_identity = Identity(user_id,
            identity['date_of_birth']
        )
        self.save_changes(new_identity)


    def create_phone_number(self, user_id: int, data: dict):
        new_phone_number = PhoneNumber(user_id,
            data['phone_number'], is_primary=True
        )
        self.save_changes(new_phone_number)


    def add_phone_number(self, user_id: int, number: str):
        new_number = PhoneNumber(user_id, number)
        self.save_changes(new_number)


    def remove_phone_number(self, user_id: int, target_number: str):
        phone_numbers = PhoneNumber.query.filter(
            PhoneNumber.user_id == user_id
        ).all()

        if len(phone_numbers) <= 1:
            return

        for phone in phone_numbers:
            if phone.number == target_number and \
                        phone.is_primary == False:
                PhoneNumber.query.filter(
                    PhoneNumber.id == phone.id
                ).delete()
                db.session.commit()


    def create_address(self, user_id: int, address: dict):
        new_address = Address(user_id, 
            address['street'],
            address.get('unit', ''),
            address['city'],
            address['postal_code'],
            address['country']
        )
        self.save_changes(new_address)


    def create_preference(self, user_id: int):
        new_preference = Preference(user_id)
        self.save_changes(new_preference)


    def create_analytic(self, user_id: int, analytic: dict):
        new_analytic = Analytic(user_id, 
            analytic.get('employment_status', ''),
            analytic.get('source_of_funds', ''),
            analytic.get('use_app_for', ''),
            analytic.get('work_in_industry', '')
        )
        self.save_changes(new_analytic)


    def is_profile_created(self, user_id) -> bool:
        result = db.session.query(Identity.id).\
            filter(Identity.user_id == user_id).\
            first() is not None 

        # print('is_profile_created', result)
        return result


    def get_all_users(self):
        return User.query.all()


    def get_user_by_email(self, email: str):
        return User.query.filter_by(email=email).scalar()


    def is_user_exist(self, email: str) -> bool:
        result = db.session.query(User.id).\
            filter(User.email == email).\
            first() is not None 

        # print('is_user_exist', result)
        return result


    def get_user_by_public_id(self, public_id: str):
        return User.query.filter_by(public_id=public_id).scalar()


    def get_user_id(self, public_id: str):
        return db.session.query(User.id).\
            filter_by(public_id=public_id).scalar()


    def update_legal_name(self, user_id: int):
        pass


    def update_user(self, user_id: int, values: dict):
        result = User.query.filter(User.id == user_id).\
            update(values, synchronize_session=False)

        db.session.commit()
        # print('update_user', result, user_id, values)
        return result


    def update_password(self, user_id: int, password: str, new_password: str):
        user = self.get_user_by_id(user_id)
        if user and user.check_password(password):
            user.password = new_password
            db.session.commit()
            # print('update_password', user)
            return user

        # wrong current password
        return None


    def update_date_of_birth(self, user_id: int, date_of_birth: str):
        identity = self.get_identity(user_id)

        if not identity:
            return None

        identity.set_date_of_birth(date_of_birth)
        db.session.commit()
        # print('update_date_of_birth', identity)
        return identity


    def update_address(self, user_id: int, address: dict):
        result = Address.query.\
            filter(Address.user_id == user_id).\
            update(address, synchronize_session=False)

        db.session.commit()
        # print('update_address', result, user_id, address)
        return result


    def update_primary_number(self, user_id: int, new_primary: str):
        current_primary = self.get_primary_phone(user_id)

        if current_primary and current_primary.number != new_primary:
            current_primary.is_primary = False

            result = PhoneNumber.query.\
            filter(and_(
                PhoneNumber.user_id == user_id,
                PhoneNumber.number == new_primary
            )).update(
                {'is_primary': True}, 
                synchronize_session=False
            )
            db.session.commit()


    def save_changes(self, data):
        db.session.add(data)
        db.session.commit()

