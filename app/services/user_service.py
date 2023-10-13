from app.models.user import User
from app.models.identity import Identity
from app.models.address import Address
from app.models.preference import Preference
from app.models.analytic import Analytic
from app.models.phone_number import PhoneNumber
from app.extensions import db


class UserService:
    def get_user_by_id(self, user_id: int):
        return User.query.get(user_id)


    def create_user(self, body: dict):
        if not self.is_user_exist(body.get('email')):
            new_user = User(
                body.get('first_name'), 
                body.get('last_name'), 
                body.get('email')
            )
            new_user.password = body.get('password')
            self.save_changes(new_user)
            return new_user

        else:
            return None


    def get_identity(self, user_id: int):
        return Identity.query.filter_by(user_id=user_id).scalar()


    def get_profile(self, user_id: int):
        identity = self.get_identity(user_id)
        if not identity:
            return None

        address = Address.query.filter_by(user_id=user_id).scalar()
        # analytic = Analytic.query.filter_by(user_id=user_id).scalar()
        preference = Preference.query.filter_by(user_id=user_id).scalar()

        return identity, address, preference


    def get_primary_phone(self, user_id: int):
        return PhoneNumber.query.filter_by(user_id=user_id, is_primary=True).scalar()


    def create_profile(self, user_id: int, body: dict):
        identity = body.get('identity')
        if not identity:
            return

        self.create_identity(user_id, identity)
        self.create_preference(user_id)

        address = body.get('address')
        if address:
            self.create_address(user_id, address)

        analytic = body.get('analytic')
        if analytic:
            self.create_analytic(user_id, analytic)


    def create_identity(self, user_id: int, identity: dict):
        new_identity = Identity(user_id,
            identity.get('date_of_birth', '')
        )
        self.save_changes(new_identity)


    def create_phone_number(self, user_id: int, data: dict):
        new_phone_number = PhoneNumber(user_id,
            data.get('phone_number')
        )
        self.save_changes(new_phone_number)


    def create_address(self, user_id: int, address: dict):
        new_address = Address(user_id, 
            address.get('street', ''), 
            address.get('unit', ''), 
            address.get('city', ''), 
            address.get('postal_code', ''), 
            address.get('country', '')
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
        return not Identity.query.get(user_id).scalar() == None 


    def get_all_users(self):
        return User.query.all()


    def get_user_by_email(self, email: str):
        return User.query.filter_by(email=email).scalar()


    def is_user_exist(self, email: str) -> bool:
        return not self.get_user_by_email(email) == None


    def get_user_by_public_id(self, public_id: str):
        return User.query.filter_by(public_id=public_id).scalar()


    def save_changes(self, data) -> None:
        db.session.add(data)
        db.session.commit()

