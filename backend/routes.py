from flask import Flask, request, session

from main import app
from database.data import Data
from auth import User
from main import token_needed
from access_policy import AccessPolicy

@app.route("/dashboard")
@token_needed
def dashboard():
    return "You are in dashboard", 200

@app.route("/register", methods=['POST'])
def singup():
    return User().signup()

@app.route("/login", methods=['POST'])
def login():
    return User().login()
    
@app.route("/logout")
@token_needed
def logout():
    return User().logout()

@app.route("/data/id/<index>")
@token_needed
def get_data_one(index):
    return Data().get_data_by_ID(index)

@app.route("/data/id")
@token_needed
def get_data_all():
    return Data().get_all_data()

@app.route("/data/source/<source>")
@token_needed
def get_source_one(source):
    return Data().get_source_by_ID(source)

@app.route("/data/source")
@token_needed
def get_source_all():
    return Data().get_all_data()

@app.route("/lastData")
@token_needed
def get_last_data():
    return Data().get_data_last()

@app.route("/data/mysources")
@token_needed
def get_my_sources():
    return Data().get_my_sources_list()

@app.route("/adminito/add_source", methods=["POST"])
@token_needed
def add_source_to_user():
    return AccessPolicy().add_source_to_one_user()

@app.route("/abnormalData")
@token_needed
def get_abnormal_data():
    return Data().get_data_abnormal()

@app.route("/data/statistics")
@token_needed
def get_statistics():
    return Data().get_data_statistics()