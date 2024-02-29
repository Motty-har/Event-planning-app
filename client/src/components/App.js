import React, { useEffect, useState } from "react";
import { useGlobalState } from "./Context";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Navbar from "./NavBar";
import ParentForm from "./ParentForm";

function App() {
  const [loading, setLoading] = useState(true)
  const { user, setUser } = useGlobalState()

  useEffect(() => {
    fetch('/check_session')
    .then(r => r.json())
    .then(user => {
      console.log(user)
      setLoading(false)
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      setLoading(false)
    });
  })

  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route>
          <ParentForm path='sign-up-log-in'/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
