import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import { useGlobalState } from "./Context";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function LogIn() {
  const { logIn, setLogIn, setUser, setEvents, setHostedEvents } = useGlobalState();
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
          setHostedEvents(user.hosted_events);
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
          <p className="message">
            Don't have an account yet? {
              <button
                className="signup-btn"
                type="click"
                onClick={() => setLogIn(!logIn)}
                style={{ color: '#483C32' }}
              >
                Sign Up
              </button>}
          </p>
        </div>
        <br></br>
        <div className="card-body">
          <form onSubmit={formik.handleSubmit}>
            {["username", "password"].map((field) => (
              <div key={field} className="input-wrapper">
                <label htmlFor={field} className="form-label">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                {field === "password" ? (
                  <div className="password-input-wrapper">
                    <input
                      id={field}
                      name={field}
                      type={showPassword ? "text" : "password"}
                      className="form-input"
                      onChange={formik.handleChange}
                      value={formik.values[field]}
                    />
                    <span onClick={togglePasswordVisibility}>
                      {showPassword ? (
                        <FontAwesomeIcon icon={faEyeSlash} />
                      ) : (
                        <FontAwesomeIcon icon={faEye} />
                      )}
                    </span>
                  </div>
                ) : (
                  <input
                    id={field}
                    name={field}
                    className="form-input"
                    onChange={formik.handleChange}
                    value={formik.values[field]}
                  />
                )}
                <br></br>
              </div>
            ))}
            <div className="error-message" style={{ textAlign: 'center', width: '100%', margin: '0 auto' }}>
              {error ? <p>Username or Password is incorrect</p> : null}
            </div>
            <br></br>
            <div className="submit-button-wrapper">
              <button className="submit-button" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
