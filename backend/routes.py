from flask import Flask, request, session
from __init__ import app
from database.models import User
from __init__ import token_needed

@app.route("/dashboard")
@token_needed
def dashboard():
    return "You are in dashboard", 200

@app.route("/signup", methods=['POST'])
def singup():
    return User().signup()

@app.route("/login", methods=['POST'])
def login():
    return User().login()
    
@app.route("/logout")
@token_needed
def logout():
    return User().logout()

