import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useHistory } from "react-router-dom";
import { useGlobalState } from "./Context";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SignUp() {
  const { logIn, setLogIn, setUser, setEvents, setHostedEvents } = useGlobalState();
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();

  const formSchema = yup.object().shape({
    firstName: yup.string().required("Must enter first name").max(30),
    lastName: yup.string().required("Must enter last name").max(30),
    email: yup.string().email("Invalid email format").required("Must enter email"),
    username: yup.string().required("Must enter username").min(3).max(20),
    password: yup.string().required("Must enter a password").min(7).max(30),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch("signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => {
          if (!response.ok) {
            setError(true);
            throw new Error("Failed to sign up");
          }
          return response.json();
        })
        .then((user) => {
          setUser(user);
          setEvents(user.invitations);
          setHostedEvents(user.hosted_events);
          history.push("/");
        })
        .catch((error) => {
          console.error("Error during signup:", error);
        });
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="parent-container">
      <div className="form-card">
        <h1 className="form-name">Sign Up</h1>
        <div className="btn-wrapper" style={{ textAlign: 'center' }}>
          <p className="message">
            Have an account already?
            <button
              className="signup-btn"
              type="click"
              onClick={() => setLogIn(!logIn)}
              style={{ color: '#483C32' }}
            >
              Log In
            </button>
          </p>
        </div>
        <br></br>
        <div className="card-body">
          <form onSubmit={formik.handleSubmit}>
            {["firstName", "lastName", "email", "username", "password"].map((field) => (
              <React.Fragment key={field}>
                <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  id={field}
                  name={field}
                  type={field === "email" ? "email" : showPassword ? "text" : "password"}
                  className={formik.errors[field] ? "error-input" : ""}
                  onChange={formik.handleChange}
                  value={formik.values[field]}
                />
                {formik.errors[field] && (
                  <p style={{ color: "red", textAlign: "center" }}>{formik.errors[field]}</p>
                )}
                {formik.errors[field] ? null : <br />}
              </React.Fragment>
            ))}
            {error && (
              <p style={{ color: "red", textAlign: "center" }}>Username already exists</p>
            )}
            <div className="submit-button-wrapper">
              <button className="submit-button">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
