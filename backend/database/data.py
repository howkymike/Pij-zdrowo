import uuid
from flask import Flask, jsonify, request, session, redirect
from email_validator import validate_email, EmailNotValidError

from main import db, db_data
from config import PASSWORD_HASH_SALT
from utils.sha256 import hash_password_with_salt
from utils.uuid import validate_uuidv4

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

    def get_data_last(self):
        how_much = int(request.args.get("count"))
        sorted_data = list(db_data.measurement.find().sort("date", -1))
        if request.args.get("count"):
            sorted_data = sorted_data[:how_much]
        else:
            sorted_data = sorted_data[:10]
        
        return jsonify(sorted_data),200