import React from "react";
import { NavLink } from "react-router-dom";
import { useGlobalState } from "./Context";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Notifications from "./Notifications";


function Navbar() {
  const { user, setUser } = useGlobalState();

  const handleLogout = () => {
    fetch('/logout', {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          console.log('Logout successful');
          setUser(false);
        } else {
          console.error('Logout failed');
        }
      })
      .catch(error => {
        console.error('Error occurred during logout:', error);
      });
  };

  return (
    <div>
      <div>
        <h1 className="page-header">SimplyPlan</h1>
        {user ? (<div className='notifications'>
        <Notifications />
        </div>) : null}
      </div>
      <div className="navbar">
        <div className="left-links">
          <NavLink to="/" className="nav-link" activeClassName="active-link">
            Home
          </NavLink>
          {user && (
            <>
              <NavLink to="/upcoming-events" className="nav-link" activeClassName="active-link">
                Upcoming Events
              </NavLink>
              <NavLink to="/my-events" className="nav-link" activeClassName="active-link">
                My Events
              </NavLink>
              <NavLink to="/create-event" className="nav-link" activeClassName="active-link">
                Create Event
              </NavLink>
            </>
          )}
        </div>
        <div className="right-links">
          {user ? (
            <NavLink to="/" className="nav-link" activeClassName="active-link" onClick={handleLogout}>
              Logout
            </NavLink>
          ) : (
            <NavLink to="/sign-up-log-in" className="nav-link" activeClassName="active-link">
              Sign Up/Log In
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
