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
          history.push('/');
        })
        .catch((error) => {
          console.error("Error during login:", error);
        });
    },
  });

  return (
    <div className="parent-container">
      <div className="form-card">
        <h1 className="form-name">Log In</h1>
        <div className="btn-wrapper" style={{ textAlign: 'center' }}>
              <p className="message">Don't have an account yet? {
                <button
                className="signup-btn"
                type="click"
                onClick={() => setLogIn(!logIn)}
                style={{ color: '#483C32' }}
              >
                Sign Up
              </button>}</p>
            </div><br></br>
        <div className="card-body">
          <form onSubmit={formik.handleSubmit}>
            <div className="input-wrapper">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                id="username"
                name="username"
                className="form-input"
                onChange={formik.handleChange}
                value={formik.values.username}
              />
            </div><br></br>
            <div className="input-wrapper">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
                
              </div>
            </div>
            <div className="error-message" style={{ textAlign: 'center', width: '100%', margin: '0 auto' }}>
                {error ? <p>Username or Password is incorrect</p> : null}
            </div><br></br>
            <div className="submit-button-wrapper">
              <button className="submit-button" type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
