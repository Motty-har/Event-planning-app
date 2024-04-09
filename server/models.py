from config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import Date
from sqlalchemy.ext.associationproxy import association_proxy

class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'

    serialize_rules = ('-invitations.event', '-host.hosted_events', '-host.invitations', '-host.tasks', '-host.notifications' '-tasks.event', '-notifications')

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    date = db.Column(Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    location = db.Column(db.String(200), nullable=False)

    host_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    host = db.relationship('User', back_populates='hosted_events')

    tasks = db.relationship('Task', back_populates='event', cascade='all, delete-orphan')
    invitations = db.relationship('Invitation', back_populates='event')
    notifications = db.relationship('Notification', back_populates='event')

    def __repr__(self):
        return f'<Event id={self.id} title={self.title} date={self.date} time={self.time} location={self.location}>'

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-invitations.user', '-invitations.event.tasks', '-invitations.event.host', '-invitations.event.invitations',
                       '-invitations.event.host.invitations', '-invitations.event.host.hosted_events', 
                       '-invitations.event.host.tasks', '-invitations.event.host.notifications',
                       '-hosted_events.host', '-hosted_events.tasks.event','-hosted_events.tasks.user', '-hosted_events.invitations', 
                       '-tasks', '-notifications.user', '-notifications.event.task', '-notifications.event.invitations', 
                       '-notifications.event.notifications', '-notifications.event.host.invitations', '-notification.event.host.hosted_events', 
                       '-notification.event.host.tasks', '-notification.event.host.notifications',)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    first_name = db.Column(db.String(25), nullable=False)
    last_name = db.Column(db.String(25), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    _password_hash = db.Column(db.String(128), nullable=False)

    invitations = db.relationship('Invitation', back_populates='user')
    hosted_events = db.relationship('Event', back_populates='host', cascade='all, delete-orphan')
    tasks = db.relationship('Task', back_populates='user')
    notifications = db.relationship('Notification', back_populates='user')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'<User id={self.id} username={self.username} email={self.email}>'

class Invitation(db.Model, SerializerMixin):
    __tablename__ = 'invitations'

    serialize_rules = ('-event.invitations', '-user.invitations', )

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(20), nullable=False)  

    event = db.relationship('Event', back_populates='invitations')
    user = db.relationship('User', back_populates='invitations')

    def __repr__(self):
        return f'<Invitation id={self.id} event_id={self.event_id} user_id={self.user_id} status={self.status}>'

class Task(db.Model, SerializerMixin):
    __tablename__ = 'tasks'

    serialize_rules = ('-event.tasks', 'event.invitations', 'event.host', '-user.hosted_events', '-user.tasks', '-user.invitations',)

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(100), nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    completed = db.Column(db.Boolean, default=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    event = db.relationship('Event', back_populates='tasks')
    user = db.relationship('User', back_populates='tasks')

    def __repr__(self):
        return f'<Task id={self.id} description={self.description} due_date={self.due_date} ' \
            f'completed={self.completed} event_id={self.event_id} assigned_to={self.assigned_to}>'


class Notification(db.Model, SerializerMixin):
    __tablename__ = 'notifications'

    serialize_rules = ('-user', '-event.tasks', '-event.invitations', '-event.host.invitations', '-event.host.hosted_events', '-event.host.tasks', '-event.host.notifications')
    id = db.Column(db.Integer, primary_key=True)
    invited_user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))

    user = db.relationship('User', back_populates='notifications')
    event = db.relationship('Event', back_populates='notifications')

    def __repr__(self):
        return f"<Notification(id={self.id}, user_id={self.invited_user_id}, event_id={self.event_id})>"


