from flask import Flask, session, redirect, request, g, jsonify
import flask_login
from pymongo import MongoClient
#from flask_cors import CORS
#import jwt
from functools import wraps
import datetime


from config import MONDODB_URL, MONGODB_PORT, SECRET_KEY_FLASK, FULFILL_EXAMPLE_DATA


app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY_FLASK

# mongodb
client = MongoClient("127.0.0.1", 27017)
db = client["authorization"]
db_session = client["session"]
db_data = client["data"]
db_access_policy = client["access_policy"]



@app.before_request
def before_request():
    #session.permanent = True
    #app.permanent_session_lifetime = datetime.timedelta(minutes=60)
    #session.modified = True
    #.user = flask_login.current_user
    pass
    #print(request.headers.get("Auth"))

@app.after_request
def after_requests(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "deny"
    response.headers["Strict-Transport-Security"] = "test"
    response.headers["Content-Security-Policy"] = "test"
    response.headers["Server"] = "Pij Wode Gnojku"
    #response.headers["Content-Type"] = "application/json"
    return response

def token_needed(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        if session_handler.check_session(request.headers.get("Auth")):
            return f(*args, **kwargs)
        else:
            return jsonify({"error": "Unauthorized"}), 401
            #return redirect("/login"), 401
        '''
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            return redirect('/login', 401)
        '''
    return decorator

from routes import *
from access_policy import AccessPolicy
# access policy class
access_policy_object = AccessPolicy()
from auth import User
session_handler = User()


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port="8000")