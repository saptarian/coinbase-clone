import jwt, datetime, os
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from helpers import createJWT


server = Flask(__name__)
server.config.from_object(os.environ.get("APP_SETTINGS"))
server.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# print(server.config) 

db = SQLAlchemy(server)
from models import User


@server.post("/signin")
def signin():
	auth = request.authorization

	# Authorization: Bearer eyJhbGciOiJIUzI1NiJ9
		# .eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
		# .NV91eyejrt08JMy_aRGtVRV1ExM2rS37YJRBP1QWGqc

	# print(request.authorization)
	# print(request.headers)
	# print(request.data)
	# print(request.args)
	# print(request.values)
	# print(request.headers.get("Authorization"))

	if not auth:
		return "missing credentials", 401

	# check db for username and password
	res = User.query.filter_by(email=auth.email).all()

	if len(res) > 0:
		email = res[0].email
		password = res[0].password

		if auth.email != email or auth.password != password:
			return "invalid credentials", 401
		else:
			return createJWT(auth.email, os.environ.get("JWT_SECRET"), True)

	else:
		return "invalid credentials", 401


@server.post("/validate")
def validate():
	encoded_jwt = request.headers.get("Authorization")

	if not encoded_jwt:
		return "missing credentials", 401

	encoded_jwt = encoded_jwt.split(" ")[1]

	try:
		decoded = jwt.decode(
			encoded_jwt,
			os.environ.get("JWT_SECRET"),
			algorithm=["HS256"]
		)
	except:
		return "not authorized", 403

	return decoded, 200


@server.route("/")
def hello():
	user = User.query.first()
	return f"{user.email}"


@server.route("/<name>")
def hello_name(name):
	return f"{User.query.filter_by(first_name=name).first().password}"


if __name__ == "__main__":
	# db.create_all()
	server.run(host="0.0.0.0", port=5454)
