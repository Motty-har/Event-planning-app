import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import { useGlobalState } from "./Context";

function Event() {
  const { event_id } = useParams();
  const [event, setEvent] = useState();
  const [tasks, setTasks] = useState();
  const [invites, setInvites] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [hostId, setHostID] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const { user } = useGlobalState();

  useEffect(() => {
    fetch(`/get_event/${event_id}`)
      .then((resp) => resp.json())
      .then((eventData) => {
        setEvent(eventData);
        setTasks(eventData.tasks);
        setHostID(eventData.host_id);
        setInvites(eventData.invitations);
        setIsLoading(false);
      });
  }, []);

  function toggleIsCompleted(taskId) {
    setTasks(tasks.map(task => {
        if(task.id === taskId) {
            return { ...task, completed: !task.completed };
        } else {
            return task;
        }
    }));

    fetch(`/task_status/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })
}

  return (
    <div>
      <div className="centered-container">
        {isLoading ? (
          <LoadingPage />
        ) : (
          <div className="single-event-card">
            <div className="single-event-card-details">
              <h1 className="single-event-card-title">{event.title}</h1>
              <hr />
              <p className="single-event-card-text">
                <strong>Date:</strong> {event.date}
              </p>
              <p className="single-event-card-text">
                <strong>Time:</strong> {event.time}
              </p>
              <p className="single-event-card-text">
                <strong>Location:</strong> {event.location}
              </p>
              <hr />
              <p className="single-event-card-description">
                <strong>Description:</strong> {event.description}
              </p>
              <p className="event-card-status">
                <strong>Status:</strong>{" "}
                {event.invitations.map((invite) => {
                  if (invite.user.id === user.id) {
                    return invite.status;
                  }
                })}
              </p>
            </div>
          </div>
        )}
      </div>
      <div>
        {event && user.id === hostId && (
          <div>
            <hr />
            <h1 className="invite-header">Invites</h1>
            {invites &&
              invites.map((invite) => {
                return (
                  <div key={invite.id} className="invite-card">
                    <h3>
                      {invite.user.first_name} {invite.user.last_name}
                    </h3>
                    <p>
                      <strong>Email:</strong> {invite.user.email}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {invite.status.charAt(0).toUpperCase() +
                        invite.status.slice(1)}
                    </p>
                  </div>
                );
              })}
          </div>
        )}
      </div>
      <hr />
      <h1 className="invite-header">Tasks</h1>
      {tasks &&
  tasks.map((task) => {
    return (
      <div key={task.id} className="invite-card">
        <p>
          <strong>Description:</strong> {task.description}
        </p>
        <hr />
        <br />
        <p>
          <strong>Due Date:</strong> {task.due_date}
        </p>
        <br />
        {task.user && (
          <p>
            <strong>Assigned To:</strong> {task.user.first_name} {task.user.last_name}
          </p>
        )}
        <p>
          <strong>Completed:</strong> {task.completed ? "✅" : "❌"}
          {user.id === task.assigned_to && (
            <button onClick={() => toggleIsCompleted(task.id)}>
              {task.completed ? "↩️ Undo" : "✅ Mark as Completed"}
            </button>
          )}
        </p>
      </div>
    );
  })}
    </div>
  );
}

export default Event;
