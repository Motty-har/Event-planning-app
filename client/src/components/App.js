import React, { useEffect, useState } from "react";
import { useGlobalState } from "./Context";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Navbar from "./NavBar";
import ParentForm from "./ParentForm";
import DisplayEvents from "./DisplayEvents";

function App() {
  const [loading, setLoading] = useState(true)
  const { user, setUser, events, setEvents, hostedEvents, setHostedEvents } = useGlobalState()

  useEffect(() => {
    fetch('/check_session')
    .then(r => r.json())
    .then(user => {
      setUser(user)
      setEvents([])
      setHostedEvents(user.hoasted_events)
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
      </Switch>
    </Router>
  );
}

export default App;
