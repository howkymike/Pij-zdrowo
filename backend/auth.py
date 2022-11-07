import uuid
import time
from flask import Flask, jsonify, request, session, redirect
from email_validator import validate_email, EmailNotValidError

from main import db, db_data, db_session
from config import PASSWORD_HASH_SALT, SESSION_TIME
from utils.sha256 import hash_password_with_salt
from utils.uuid import validate_uuidv4

class User:

    def start_session(self, user):
        uuid_session = uuid.uuid4()
        current_time = time.time()
        obj = {
            "user": user["_id"],
            "email": user["email"],
            "token":str(uuid_session),
            "start_date": round(current_time)
        }
        db_session.session.delete_many({"user":user["_id"]})
        db_session.session.insert_one(obj)
        return obj["token"]

    def stop_session(self, token):
        db_session.delete_many({"token": token})
        return redirect("/login"), 401

    def check_session(self, token):
        session_from_db = db_session.session.find_one({"token": token})
        if session_from_db and round(time.time()) - session_from_db["start_date"] < SESSION_TIME:
            return True
        else:
            return False

    def signup(self):

        try:
            verify_email = validate_email(request.form.get("email"))
            email = verify_email["email"]
        except EmailNotValidError:
            return jsonify({"error":"Invalid email address"}), 400

        new_user = {
            "_id": uuid.uuid4().hex,
            "name": request.form.get("name"),
            "email": email,
            "password": request.form.get("password")
        }


        new_user["password"] = hash_password_with_salt(new_user["password"])

        if db.users.find_one( {"email": new_user['email'] }):
            return jsonify({"Error": "Provided email already in use"}), 400 # user enumeration vulnerability

        if db.users.insert_one(new_user):
            return jsonify({"success": "Successful registration"}), 200

        return jsonify({"Error": "Singup failed. Try one more time"}), 400

    def signout(self):
        self.stop_session(request.headers.get("Auth"))
        return redirect('/')

    def login(self):
        user = db.users.find_one({
            "email": request.form.get("email")
        })

        if user and user["password"] == hash_password_with_salt(request.form.get('password')):
            token = self.start_session(user)
            return jsonify({"success": "You've been authorized", "token": token}), 200
        return jsonify({ "error" : "Invalid login credentials"}), 404
