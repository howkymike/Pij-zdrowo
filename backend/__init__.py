from flask import Flask, session, redirect, request, g
import flask_login
from pymongo import MongoClient
#from flask_cors import CORS
import jwt
from functools import wraps
import datetime
from config import MONDODB_URL, MONGODB_PORT, SECRET_KEY_FLASK

app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY_FLASK

# mongodb
client = MongoClient("localhost", 27017)
db = client["authorization"]
db_data = client["data"]

@app.before_request
def before_request():
    session.permanent = True
    app.permanent_session_lifetime = datetime.timedelta(minutes=60)
    session.modified = True
    g.user = flask_login.current_user

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
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            return redirect('/login')
    return decorator

from routes import *

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port="8000")