import React from "react";
import { useGlobalState } from "./Context";
import EventCard from "./EventCard";
import { Link } from "react-router-dom";
import LoadingPage from './LoadingPage'

function DisplayMyEvents(){
    const { hostedEvents, user } = useGlobalState()
    if(hostedEvents === undefined){
      return <LoadingPage />;
    } else if (!user || hostedEvents.length === 0) {
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
        {hostedEvents.map((event, index) => (
          <EventCard key={index} event={event} status={event.status} />
        ))}
      </div>
    );
}

export default DisplayMyEvents;
