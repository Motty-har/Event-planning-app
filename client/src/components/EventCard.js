import React from "react";
import { useHistory } from "react-router-dom";
import { useGlobalState } from "./Context";

function EventCard({ event, status }) {
  const { title, description, date, time, location, host_id } = event;
  const { user } = useGlobalState();
  const history = useHistory();

  function handleClick() {
    history.push(`/upcoming-event/${event.id}`);
  }
  return (
    <div className="event-card" onClick={handleClick}>
      <h1 className="event-card-title">{title}</h1>
      <hr />
      <div className="event-card-details">
        <p>
          <strong>Host:</strong> {}
        </p>
        <p>
          <strong>Date:</strong> {date}
        </p>
        <p>
          <strong>Time:</strong> {time}
        </p>
        <p>
          <strong>Location:</strong> {location}
        </p>
      </div>
      <hr />
      <h3 style={{ textAlign: "center" }}>Description</h3>
      <p className="event-card-description">{description}</p>
      {user.id !== host_id && (
        <div>
          <hr />
          <p className="event-card-status">
            <strong>Status:</strong> {status}
          </p>
        </div>
      )}
    </div>
  );
}

export default EventCard;
