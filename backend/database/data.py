import uuid
from flask import Flask, jsonify, request, session, redirect
from email_validator import validate_email, EmailNotValidError
import datetime

from main import db, db_data, access_policy_object
from config import PASSWORD_HASH_SALT, PH_AVG
from utils.sha256 import hash_password_with_salt
from utils.uuid import validate_uuidv4
from utils.date import date_to_epoch, convert_datetime_from_data_array
from utils.detect import detect_abnormal_all
from utils.list_operation import unique_list

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
        date_type = "epoch" if request.args.get("date_type") in ["epoch", None] else "readable"

        #if not validate_uuidv4(index):
        #    return jsonify({"error":"Invalid UUIDv4 structure in source searching"}), 400
        #data = db_data.measurement.find_one({"source": index})
        data = list(db_data.measurement.find({"source": index}))
        
        if date_type == "readable":
            data = convert_datetime_from_data_array(date_type, data)

        data = access_policy_object.filter_access(data, request.headers.get("Auth"))

        return jsonify(data), 200

    def get_data_last(self):
        how_much = int(request.args.get("count")) if request.args.get("count") else 10
        date_type = "epoch" if request.args.get("date_type") in ["epoch", None] else "readable"

        sorted_data = list(db_data.measurement.find().sort("date", -1))
        if request.args.get("count"):
            sorted_data = sorted_data[:how_much]
        else:
            sorted_data = sorted_data[:10]
        
        if date_type == "readable":
            sorted_data = convert_datetime_from_data_array(date_type, sorted_data)

        sorted_data = access_policy_object.filter_access(sorted_data, request.headers.get("Auth"))

        return jsonify(sorted_data),200

    def get_my_sources_list(self):
        sources = access_policy_object.get_sources(request.headers.get("Auth"))
        return jsonify({"sources":sources}), 200

    def get_data_abnormal(self):
        how_much = int(request.args.get("count")) if request.args.get("count") else 20
        date_type = "epoch" if request.args.get("date_type") in ["epoch", None] else "readable"

        data = list(db_data.measurement.find())

        if date_type == "readable":
            data = convert_datetime_from_data_array(date_type, data)

        access_policy_data = access_policy_object.filter_access(data, request.headers.get("Auth"))
        abnormal_data = detect_abnormal_all(data)

        return jsonify(abnormal_data), 200

    def get_data_statistics(self):
        token = request.headers.get("Auth")
        data = list(db_data.measurement.find().sort("date"))

        # unique sources
        unique_sources = unique_list(data)
        unique_sources_count = len(unique_sources)

        # locations
        location = []
        for one in data:
            location.append(one["location"])
        location = unique_list(location)

        # abnormal data
        access_policy_data = access_policy_object.filter_access(data, request.headers.get("Auth"))
        abnormal_data = detect_abnormal_all(data)

        if not access_policy_object.is_analyst(token):
            return jsonify({"error": "Invalid permissions, you are not analyst"}), 403
        
        # best tds
        lista_tds = []
        for one in data:
            if one["TDS"] > 49:
                lista_tds.append(one["TDS"])
        lista_tds.sort()
        best_tds = db_data.measurement.find_one({"TDS": lista_tds[0]})
        worst_tds = db_data.measurement.find_one({"TDS": lista_tds[-1]})
        
        # best ph
        lista_ph = []
        for one in data:
            lista_ph.append(abs(one["PH"] - PH_AVG))
        lista_ph.sort()
        #print(lista_ph[-1] + 8)
        best_ph = db_data.measurement.find_one({"PH": lista_ph[0] + 8})
        worst_ph = db_data.measurement.find_one({"PH": lista_ph[-1] + 8})

        # average tds and ph numbers
        average_tds = 0
        average_ph = 0
        for one in unique_sources:
            source_data = list(db_data.measurement.find({"source": one}).sort("date"))
            average_ph += source_data[-1]["PH"]
            average_tds += source_data[-1]["TDS"]
        
        average_ph = round(average_ph / len(unique_sources), 2)
        average_tds = round(average_tds / len(unique_sources), 2)

        return jsonify({
            "unique_sources_count": unique_sources_count, 
            "unique_location":location, 
            "abnormal_data": abnormal_data, 
            "best_ph": best_ph, 
            "best_tds": best_tds,
            "worst_tds": worst_tds,
            "worst_ph": worst_ph,
            "average_ph": average_ph,
            "average_tds": average_tds
            }), 200
        

        
