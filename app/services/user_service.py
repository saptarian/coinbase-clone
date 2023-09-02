from flask import jsonify
from flask_jwt_extended import create_access_token, \
    create_refresh_token

from app.models.user import User
from app.extensions import db


class UserService:
    def get_user_by_id(self, user_id):
        return User.query.get(user_id)


    def create_user(self, first_name, last_name, email, password):
        # Create a new user and generate token
        user = User.query.filter_by(email=email).first()
        if not user:
            new_user = User(first_name, last_name, email)
            new_user.password = password
            self.save_changes(new_user)
            return self.generate_token(new_user)
        else:
            return jsonify(message="User already exists. Please sign in."), 409


    def generate_token(self, user: User):
        try:
            # generate the auth token
            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)
            return jsonify(access_token=access_token, refresh_token=refresh_token)

        except Exception as e:
            return jsonify(message="Some error occurred. Please try again.", 
                error=e), 401


    def get_all_users(self):
        return User.query.all()


    def get_user_by_email(self, email: str):
        return User.query.filter_by(email=email).scalar()


    def is_user_exist(self, email: str) -> bool:
        return not self.get_user_by_email(email) == None


    def get_user_by_public_id(self, public_id):
        return User.query.filter_by(public_id=public_id).scalar()


    def save_changes(self, data: User) -> None:
        db.session.add(data)
        db.session.commit()

    # Add more user-related services (update, delete, etc.) as needed
