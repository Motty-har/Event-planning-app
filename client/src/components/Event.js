import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import { useGlobalState } from "./Context";

function Event() {
  const { event_id } = useParams();
  const [event, setEvent] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [invites, setInvites] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hostId, setHostID] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [eventStatus, setEventStatus] = useState('')
  const history = useHistory();
  const { user } = useGlobalState();

  useEffect(() => {
    setIsLoading(true); // Set loading to true before fetching data

    fetch(`/get_event/${event_id}`)
      .then((resp) => resp.json())
      .then((eventData) => {
        setEvent(eventData);
        setTasks(eventData.tasks);
        setHostID(eventData.host_id);
        setInvites(eventData.invitations);
        setIsLoading(false);
      });
  }, [event_id]);

  useEffect(() => {
    if (invites && invites.length > 0 && eventStatus !== "") {
      const i = invites.filter((invite) => invite.user_id === user.id);
      if (i.length > 0) {
        fetch(`/event_status/${i[0].id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventStatus: eventStatus,
          }),
        })
        .then(r => r.json())
        .then((i) => {
          setInvites((prevInvites) =>
            prevInvites.map((invite) =>
              invite.id === i.id ? i : invite
            )
          );
        })
      }
    }
  }, [eventStatus, user.id]);

  function toggleIsCompleted(taskId) {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
    fetch(`/task_status/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  function handleDeleteTask(taskId) {
    fetch(`/delete_task/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((r) => {
        setTasks(tasks.filter((task) => task.id !== taskId));
      });
  }

  const handleSelectionChange = (event) => {
    setSelectedUserId(event.target.value);
  };

  function handleAssign(taskId) {
    fetch(`/assign_task/${taskId}/${selectedUserId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((t) => {
        setTasks((tasks) =>
          tasks.map((task) => (task.id === t.id ? t : task))
        );
      });
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
              {user.id !== event.host_id ?
              (<div> 
                {invites.map((invite) =>
                  <div key={invite.id}>
                  <div className="event-card-status"> 
                  {invite.user.id === user.id ? (<p><strong>Status:</strong> {invite.status}</p>) : null}
                  </div>
                  {invite.user.id === user.id && invite.status === 'pending' ? 
                  (<div className="accept-decline-button">
                  <button onClick={() => setEventStatus('accepted')}>Accept</button> <button onClick={() => setEventStatus('declined')}>Decline</button>
                </div>): null}
                </div>
                )} 
              </div>
              ): null}
            </div>
          </div>
        )}
      </div>
      <div>
        {event && user.id === hostId && (
          <div>
            <hr />
            {invites && invites.length > 0 ? (
              <div>
                <h1 className="invite-header">Invites</h1>
                <div className="add-button-container">
                  <button
                    className="add-button"
                    style={{ padding: "8px", fontSize: "16px" }}
                    onClick={() => history.push(`/invitations/${event_id}`)}
                  >
                    Manage Invitations
                  </button>
                </div>
                {invites.map((invite) => (
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
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <h1>No Invites yet</h1>
                <button
                  style={{ padding: "8px", fontSize: "16px" }}
                  onClick={() => history.push(`/invitations/${event_id}`)}
                >
                  Manage Invitations
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <hr />
      <div>
        {tasks && tasks.length > 0 ? (
          <div>
            <h1 className="invite-header">Tasks</h1>
            <div className="add-button-container">
              {user.id === event.host_id ? (
                <button
                  className="add-button"
                  style={{ padding: "8px", fontSize: "16px" }}
                  onClick={() => history.push(`/create-tasks/${event_id}`)}
                >
                  Add Tasks
                </button>
              ) : null}
            </div>
            {tasks.map((task) => (
              <div key={task.id} className="task-event-card">
                <p>
                  <strong>Description:</strong> {task.description}
                </p>
                <hr />
                <br />
                <p>
                  <strong>Due Date:</strong> {task.due_date}
                </p>
                {task.user ? (
                  <p>
                    <strong>Assigned To:</strong>{" "}
                    {task.user.first_name} {task.user.last_name}
                  </p>
                ) : (
                  <div>
                    {event.host_id === user.id ? (
                      <div>
                        <strong>Unassigned:</strong>
                        <select
                          onChange={handleSelectionChange}
                          value={selectedUserId}
                        >
                          <option value="" label="Select an option" />
                          {invites.map((invite) => (
                            <option
                              key={invite.user.id}
                              value={invite.user.id}
                              label={`${invite.user.first_name} ${invite.user.last_name}`}
                            />
                          ))}
                        </select>
                        <button onClick={() => handleAssign(task.id)}>
                            Assign
                          </button>
                      </div>
                    ) : (
                      <div>
                        <strong>Unassigneds: </strong>
                          No user assigned to task.
                        </div>
                    )}
                  </div>
                )}
                <p>
                  <strong>Completed:</strong> {task.completed ? "✅" : "❌"}
                  {(
                    (user.id === task.assigned_to || user.id === event.host_id) && (
                      <button onClick={() => toggleIsCompleted(task.id)}>
                        {task.completed ? "↩ Undo" : "✅ Mark as Completed"}
                      </button>
                    )
                  )}
                </p>
                {user.id === event.host_id ? (
                  <button onClick={() => handleDeleteTask(task.id)}>
                    Delete Task
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <h1>No Tasks yet</h1>
            <button
              style={{ padding: "8px", fontSize: "16px" }}
              onClick={() => history.push(`/create-tasks/${event_id}`)}
            >
              Add Tasks
            </button>
          </div>
        )}
      </div>
      <hr></hr>
    </div>
  );
}

export default Event;
