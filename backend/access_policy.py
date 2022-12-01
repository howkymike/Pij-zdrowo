import uuid
import time
from flask import Flask, jsonify, request, session, redirect
from email_validator import validate_email, EmailNotValidError

from main import db_access_policy, db_data, db_session, db
from utils.list_operation import unique_list

class AccessPolicy:

    def create_access_register(self, email, role, source):
        new_obj = {
            "email": email,
            "source": source,
            "access": ""
        }
        
        if role == "analyst":
            new_obj["access"] = "*"
        
        if role == "customer":
            #if db_data.measurement.find_one({"source": source}):
            new_obj["access"] = source
            #else:
            #    return jsonify({"error": "Given source does not exists"}), 400
        db_access_policy.access_policy.insert_one(new_obj)

    def filter_access(self, data, token):
        new_data = []

        if not token:
            return jsonify({"error": "Unauthorized"}), 400

        token_data = db_session.session.find_one({"token": token})
        access_db = db_access_policy.access_policy.find_one({"email": token_data["email"]})

        if access_db and access_db["access"] == "*":
            return data
        else:
            # case gdzie mamy jeden dict zamiast liste dictow
            if type({}) == type(data):
                if data["source"] in access_db["access"]:
                    return data
                else:
                    return None
            for index, one in enumerate(data):
                if one["source"] in access_db["access"]:
                    new_data.append(one)
        return new_data
    
    def get_sources(self, token):
        session_data = db_session.session.find_one({"token": token})
        email = session_data["email"]
        access_policy_data = db_access_policy.access_policy.find_one({"email": email})
        access_sources = access_policy_data["access"]
        if access_sources == "*":
            data = db_data.measurement.find()
            sources = [one["source"] for one in data]
            sources = unique_list(sources)
            return sources
        sources = access_sources
        return sources
        
    def add_source_to_one_user(self):
        token = request.headers.get("Auth")
        session_data = db_session.session.find_one({"token": token})
        email = session_data["email"]
        account_data = db.users.find_one({"email": email})

        if account_data["role"] != "admin":
            return jsonify({"error": "Unauthorized"}), 401        
        
        user_email = request.form.get("user")
        new_source = request.form.get("source")
        if user_email in [None, ""] or new_source in [None, ""]:
            return jsonify({"error": "You need to specify user email and new source"}), 400

        filter = {"email": user_email }
        db_access_policy.access_policy.update_one(filter, {"$set": {"access":new_source}})
        return jsonify({"success": "updated"}), 200

    def is_analyst(self, token):
        session_data = db_session.session.find_one({"token": token})
        email = session_data["email"]
        access_data = db_access_policy.access_policy.find_one({"email": email})
        if access_data["access"] == "*":
            return True
        else:
            return False
        