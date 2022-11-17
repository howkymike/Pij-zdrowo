import uuid
from flask import Flask, jsonify, request, session, redirect
from email_validator import validate_email, EmailNotValidError
import datetime

from main import db, db_data, access_policy_object
from config import PASSWORD_HASH_SALT
from utils.sha256 import hash_password_with_salt
from utils.uuid import validate_uuidv4
from utils.date import date_to_epoch, convert_datetime_from_data_array

class Data:
    def get_data_by_ID(self, index):
        index = str(index)
        date_type = "epoch" if request.args.get("date_type") == "epoch" else "readable"

        if not validate_uuidv4(index):
            return jsonify({"error": "Invalid UUIDv4 structure in data searching"}), 400
        data = db_data.measurement.find_one({"_id": index})

        if date_type == "readable":
            data = convert_datetime_from_data_array(date_type, data)

        data = access_policy_object.filter_access(data, request.headers.get("Auth"))
        
        return jsonify(data), 200

    def get_all_data(self):
        data = []

        sorting = request.args.get("sort")
        order = request.args.get("order")
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
        date_type = "epoch" if request.args.get("date_type") == "epoch" else "readable"
        

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
        if start_date:
            start_date = int(date_to_epoch(start_date).strftime("%s"))
            print(start_date)
            data = list(filter(lambda x: x['date'] > start_date, data))
        if end_date:
            end_date = int(date_to_epoch(end_date).strftime("%s"))
            print(end_date)
            data = list(filter(lambda x: x['date'] < end_date, data))

        if date_type == "readable":
            data = convert_datetime_from_data_array(date_type, data)

        data = access_policy_object.filter_access(data, request.headers.get("Auth"))

        return jsonify(data), 200

    def get_source_by_ID(self, index):
        index = str(index)
        date_type = "epoch" if request.args.get("date_type") == "epoch" else "readable"

        if not validate_uuidv4(index):
            return jsonify({"error":"Invalid UUIDv4 structure in source searching"}), 400
        data = db_data.measurement.find_one({"source": index})
        
        date_type = "epoch" if request.args.get("date_type") == "epoch" else "readable"

        if date_type == "readable":
            data = convert_datetime_from_data_array(date_type, data)

        data = access_policy_object.filter_access(data, request.headers.get("Auth"))

        return jsonify(data), 200

    def get_data_last(self):
        how_much = int(request.args.get("count")) if request.args.get("count") else 10
        date_type = "epoch" if request.args.get("date_type") == "epoch" else "readable"

        sorted_data = list(db_data.measurement.find().sort("date", -1))
        if request.args.get("count"):
            sorted_data = sorted_data[:how_much]
        else:
            sorted_data = sorted_data[:10]
        
        if date_type == "readable":
            sorted_data = convert_datetime_from_data_array(date_type, sorted_data)

        sorted_data = access_policy_object.filter_access(sorted_data, request.headers.get("Auth"))

        return jsonify(sorted_data),200