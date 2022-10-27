import uuid
from flask import Flask, jsonify, request, session, redirect
from email_validator import validate_email, EmailNotValidError

from __init__ import db
from config import PASSWORD_HASH_SALT
from utils.sha256 import hash_password_with_salt

class User:

    def start_session(self, user):
        session['logged_in'] = True
        session['user'] = user
        del user['password']

        return jsonify(user), 200

    def signup(self):
        print(request.form)

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
            return self.start_session(new_user)

        return jsonify({"Error": "Singup failed. Try one more time"}), 400

    def signout(self):
        session.clear()
        return redirect('/')

    def login(self):
        user = db.users.find_one({
            "email": request.form.get("email")
        })

        if user and user["password"] == hash_password_with_salt(request.form.get('password')):
            self.start_session(user)
            return jsonify({"success": "You've been authorized"})
        return jsonify({ "error" : "Invalid login credentials"}), 200