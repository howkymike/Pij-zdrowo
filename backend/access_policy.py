import uuid
import time
from flask import Flask, jsonify, request, session, redirect
from email_validator import validate_email, EmailNotValidError

from main import db_access_policy, db_data, db_session

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
            if db_data.measurement.find_one({"source": source}):
                new_obj["access"] = source
            else:
                return jsonify({"error": "Given source does not exists"}), 400
        db_access_policy.access_policy.insert_one(new_obj)

    def filter_access(self, data, token):
        new_data = []

        if not token:
            return jsonify({"error": "Unauthorized"}), 400

        token_data = db_session.session.find_one({"token": token})
        access_db = db_access_policy.access_policy.find_one({"email": token_data["email"]})

        if access_db["access"] == "*":
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
            
        
