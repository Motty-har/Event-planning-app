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

        return False, 401

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
    
class CreateEvent(Resource):
    def post(self, user_id):
        user_id = session.get('user_id')
        if not user_id:
            return {'error': '401 Unauthorized'}, 401

        event_data = request.get_json()

        title = event_data.get('title')
        description = event_data.get('description')
        date_str = event_data.get('date')
        time_str = event_data.get('time')
        location = event_data.get('location')
        

        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        time = datetime.strptime(time_str, '%H:%M').time()

        event = Event(title=title, description=description, date=date, time=time, location=location, host_id = user_id)
        db.session.add(event)
        db.session.commit()

        return event.to_dict(), 200

class Users(Resource):
    def get(self):

        users = User.query.order_by(User.last_name).all()

        return [user.to_dict() for user in users], 200

class EventInvitations(Resource):
    def get(self, event_id):

        invites = Invitation.query.filter_by(event_id = event_id).all()
        
        return [invite.user.to_dict() for invite in invites], 200
    

class CreateInvitations(Resource):
    def post(self):
        data = request.get_json()
        invitees = data.get('selected_users')
        event_id = data.get('event_id')

        Invitation.query.filter_by(event_id = event_id).delete()
        db.session.commit()

        for user in invitees:
            invitation = Invitation(
                event_id=event_id,
                user_id=user,
                status='pending'
            )
            db.session.add(invitation)
        
        db.session.commit()

        return { 'Success': True }, 200

class CreateTasks(Resource):
    def post(self, event_id):
        tasks = request.get_json()

        for task_data in tasks:
            assigned_to_id = task_data['assignedTo']['id']
            new_task = Task(
                description=task_data['description'],
                due_date=datetime.strptime(task_data['dueDate'], '%Y-%m-%d').date(),
                event_id=event_id,
                assigned_to=assigned_to_id
            )

            db.session.add(new_task)

        db.session.commit()

        return {'success': True}, 200

class GetEvent(Resource):
    def get(self, event_id):
        
        event = Event.query.filter_by(id=event_id).first()
        
       
        return  event.to_dict(), 200

class TaskStatus(Resource):
    def patch(self, task_id):
        task = Task.query.filter_by(id=task_id).first()

        if task:
            task.completed = not task.completed
            db.session.commit()  

            task_dict = task.to_dict()
            return task_dict, 200
        else:
            return {"error": "Task not found"}, 404
        
class AssignTask(Resource):
    def patch(self, task_id, user_id):
        task = Task.query.filter_by(id=task_id).first()

        if task:
            task.assigned_to = user_id
            db.session.commit()

            return task.to_dict(), 200
        else:
             return {'error': 'Task not found'}, 404
        

class DeleteTasks(Resource):
    def delete(self, task_id):
        task = Task.query.get(task_id)

        if task:
            db.session.delete(task)
            db.session.commit()
            return {'message': 'Task deleted successfully'}, 200
        else:
            return {'error': 'Task not found'}, 404
        
class EventStatus(Resource):

    def patch(self, invite_id):
        data = request.get_json()

        status = data.get('eventStatus')
        invite = Invitation.query.filter_by(id=invite_id).first()

        if invite: 
            invite.status = status
            db.session.commit()
            return invite.to_dict(), 200       
        else:
            return {'error': 'Invite not found'}, 404

        
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CreateEvent, '/create_event/<int:user_id>')
api.add_resource(Users, '/users')
api.add_resource(EventInvitations, '/event_invitations/<int:event_id>')
api.add_resource(CreateInvitations, '/create_invitations')
api.add_resource(CreateTasks, '/create_tasks/<int:event_id>')
api.add_resource(GetEvent, '/get_event/<int:event_id>')
api.add_resource(TaskStatus, '/task_status/<int:task_id>')
api.add_resource(DeleteTasks, '/delete_task/<int:task_id>')
api.add_resource(AssignTask, '/assign_task/<int:task_id>/<int:user_id>')
api.add_resource(EventStatus, '/event_status/<int:invite_id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

