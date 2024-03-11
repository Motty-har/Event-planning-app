import React from "react";
import EventCard from "./EventCard";
import { useGlobalState } from "./Context";
import { Link } from "react-router-dom";

function DisplayEvents() {
  const { events, user } = useGlobalState();

  if (!user || events.length === 0) {
    return (
      <div className="no-events-container">
        <div className="no-events-message">No Events</div>
        {user && (
          <div>
            <p>
              <Link to="/create-event" className="create-event-button">
                Create Event
              </Link>
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="event-container">
      {events.map((event, index) => (
        <EventCard key={index} event={event.event} status={event.status} />
      ))}
    </div>
  );
}

export default DisplayEvents;
