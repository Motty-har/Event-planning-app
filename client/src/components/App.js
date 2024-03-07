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

function App() {
  const [loading, setLoading] = useState(true)
  const { user, setUser, events, setEvents, hostedEvents, setHostedEvents } = useGlobalState()

  useEffect(() => {
    fetch('/check_session')
    .then(r => r.json())
    .then(user => {
      console.log(user)
      setUser(user)
      setEvents(user.invitations)
      setHostedEvents(user.hosted_events)
      setLoading(false)
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      setLoading(false)
    });
  },[])

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
