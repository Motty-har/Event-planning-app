from flask import Flask, request, session
from flask_restful import Resource, Api
from config import app, db, api
from models import * 
from datetime import datetime
import ipdb

@app.before_request
def check_if_logged_in():
    open_access_list = ['signup', 'login', 'check_session']

    if request.endpoint not in open_access_list and not session.get('user_id'):
        return {'error': '401 Unauthorized'}, 401

class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')

        if user_id:
            user = User.query.get(user_id)
            return user.to_dict(), 200

        return {}, 401

class Signup(Resource):
    def post(self):
        request_json = request.get_json()

        first_name = request_json.get('firstName')
        last_name = request_json.get('lastName')
        username = request_json.get('username')
        password = request_json.get('password')
        email = request_json.get('email')

        user = User(first_name=first_name, last_name=last_name, username=username, email=email)
        user.password_hash = password
        
        db.session.add(user)
        db.session.commit()

        session['user_id'] = user.id

        return user.to_dict(), 200
    
class Login(Resource):
    def post(self):
        request_json = request.get_json()

        username = request_json.get('username')
        password = request_json.get('password')

        user = User.query.filter_by(username=username).first()
        if user and user.authenticate(password):
            session['user_id'] = user.id
            return user.to_dict(), 200

        return {'error': '401 Unauthorized'}, 401

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return False, 204

    
api.add_resource(CheckSession, '/check_session')
    
@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

