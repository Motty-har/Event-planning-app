import React, { useEffect, useState } from "react";
import { useGlobalState } from "./Context";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Navbar from "./NavBar";
import ParentForm from "./ParentForm";
import DisplayEvents from "./DisplayEvents";
import DisplayMyEvents from "./DisplayMyEvents";
import CreateEventForm from "./CreateEventForm";
import Invitations from "./Invitations";
import CreateTasks from "./CreateTasks";
import Event from "./Event";
import LoadingPage from "./LoadingPage";
import socket from './SocketService'; // Import the Socket.IO service

function App() {
  const [loading, setLoading] = useState(true);
  const { user, setUser, events, setEvents, hostedEvents, setHostedEvents, setNotifications, notifications } = useGlobalState();
  console.log(notifications)
  useEffect(() => {
  fetch('/check_session')
    .then((response) => response.json())
    .then((userData) => {
      setUser(userData);
      setEvents(userData.invitations);
      setHostedEvents(userData.hosted_events);
      setLoading(false);
      
      // Connect to the Socket.IO server after fetching user data
      socket.on('notification', (data) => {
        // Update state with the received notification
        console.log(data)
        setNotifications((prevNotifications) => [...prevNotifications, data]);
      });
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      setLoading(false);
    });

  // Clean up the Socket.IO connection when the app unmounts
  return () => {
    socket.disconnect();
  };
}, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route path='/sign-up-log-in'>
          <ParentForm />
        </Route>
        <Route path='/upcoming-events'>
          <DisplayEvents />
        </Route>
        <Route path='/my-events'>
          <DisplayMyEvents />
        </Route>
        <Route path='/create-event'>
          <CreateEventForm />
        </Route>
        <Route path='/invitations/:event_id'>
          <Invitations />
        </Route>
        <Route path='/create-tasks/:event_id'>
          <CreateTasks />
        </Route>
        <Route path='/upcoming-event/:event_id'>
          <Event />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
