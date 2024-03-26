import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import { useGlobalState } from "./Context";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function LogIn() {
  const { logIn, setLogIn, setUser, setEvents } = useGlobalState();
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      fetch("login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values, null, 2),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            setError(true);
            throw new Error("Failed to log in");
          }
        })
        .then((user) => {
          setUser(user);
          setEvents(user.invitations);
          history.push('/');
        })
        .catch((error) => {
          console.error("Error during login:", error);
        });
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="parent-container">
      <div className="form-card">
        <h1 className="form-name">Log In</h1>
        <div className="btn-wrapper" style={{ textAlign: 'center' }}>
              <p className="message">Don't have an account yet?
              <button
                className="signup-btn"
                type="click"
                onClick={() => setLogIn(!logIn)}
                style={{ color: '#483C32' }}
              >
                Sign Up
              </button>
              </p>
          </div>
        <div className="card-body">
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              onChange={formik.handleChange}
              value={formik.values.username}
            /><br /><br />
            <label htmlFor="password">Password <span onClick={togglePasswordVisibility}>
                      {showPassword ? (
                        <FontAwesomeIcon icon={faEyeSlash} />
                      ) : (
                        <FontAwesomeIcon icon={faEye} />
                      )}
            </span></label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            {error ? <p style={{ color: 'red', textAlign: 'center' }}>Username or Password is incorrect</p> : null}
            <div className="submit-button-wrapper">
              <button className="submit-button" type="submit">Submit</button>
            </div><br />
          </form>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
