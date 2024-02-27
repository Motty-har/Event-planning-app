from random import randint, choice
from datetime import datetime, timedelta

from faker import Faker

from app import app
from models import *
from events import events 

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        db.drop_all()
        db.create_all()

        for event_data in events:
            new_event = Event(
                title=event_data['title'],
                description=event_data['description'],
                date=datetime.strptime(event_data['date'], "%Y-%m-%d").date(),
                time=datetime.strptime(event_data['time'], "%H:%M").time(),
                location=event_data['location'],
                host_id=1
            )

            db.session.add(new_event)

        db.session.commit()

        users = []

        for i in range(20):
            firstname = fake.first_name()
            lastname = fake.last_name()
            random_number_1 = randint(10, 99)

            username = f"{firstname.lower()}{lastname.lower()}{random_number_1}"
            first_name = firstname
            last_name = lastname
            email = f"{username}@mail.com"

            user = User(
                username=username,
                first_name = first_name,
                last_name = last_name,
                email=email,
            )
            user.password_hash = user.username + 'password'

            users.append(user)

        for user in users:
            db.session.add(user)

        db.session.commit()

        invitations = []

        for event in Event.query.all():
            for user in User.query.all():
                status = choice(['accepted', 'declined', 'pending'])
                invitation = Invitation(
                    event_id=event.id,
                    user_id=user.id,
                    status=status
                )
                invitations.append(invitation)

        db.session.add_all(invitations)
        db.session.commit()

        tasks = []

        for event in Event.query.all():
            for user in User.query.all():
                description = f"Task for {event.title}"
                due_date = event.date - timedelta(days=randint(1, 30))
                completed = choice([True, False])
                task = Task(
                    description=description,
                    due_date=due_date,
                    completed=completed,
                    event_id=event.id,
                    assigned_to=user.id
                )
                tasks.append(task)

        db.session.add_all(tasks)
        db.session.commit()

        print("Seed data generated successfully.")