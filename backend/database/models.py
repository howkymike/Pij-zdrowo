import uuid
from flask import Flask, jsonify, request, session, redirect
from email_validator import validate_email, EmailNotValidError

from __init__ import db, db_data
from config import PASSWORD_HASH_SALT
from utils.sha256 import hash_password_with_salt
from utils.uuid import validate_uuidv4

class User:

    def start_session(self, user):
        session['logged_in'] = True
        session['user'] = user
        del user['password']

        return jsonify({"info":"Successful registration"}), 200

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


class Data:
    def get_data_by_ID(self, index):
        index = str(index)
        print(index)
        if not validate_uuidv4(index):
            return jsonify({"error": "Invalid UUIDv4 structure in data searching"}), 400
        data = db_data.measurement.find_one({"_id": index})
        #del data["_id"]
        print(data)
        return jsonify(data), 200

    def get_all_data(self):
        data = []

        sorting = request.args.get("sort")
        order = request.args.get("order")

        if sorting and sorting in ["TDS", "PH", "date"]:
            if order and order == "ASC":
                for one in db_data.measurement.find().sort(sorting):
                    data.append(one)
            else:
                for one in db_data.measurement.find().sort(sorting, -1):
                    data.append(one)
        else:
            for one in db_data.measurement.find():
                data.append(one)
        
        return jsonify(data), 200

    def get_source_by_ID(self, index):
        index = str(index)
        if not validate_uuidv4(index):
            return jsonify({"error":"Invalid UUIDv4 structure in source searching"}), 400
        data = db_data.measurement.find_one({"source": index})
        return jsonify(data), 200
