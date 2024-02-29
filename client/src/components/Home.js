import React from 'react';
import { useHistory } from "react-router-dom";
import { useGlobalState } from './Context';

const Home = () => { 
  const { user } = useGlobalState()
  const history = useHistory()
  return (
    <div>
    <div className="home-container">
      <section className="hero-features">
        <h2>Simplify Your Event Planning</h2>
      </section>

      <section className="hero-features">
        <h3>Key Features</h3>
        <br></br>
        <div className="feature-cards">
          <div className="feature-card">
            <h4>Create and Manage Events</h4>
            <p>Effortlessly create and manage events with our user-friendly interface.</p>
          </div>
          <div className="feature-card">
            <h4>Real-time Collaboration</h4>
            <p>Collaborate with participants in real-time, making event planning a breeze.</p>
          </div>
          <div className="feature-card">
            <h4>Task Management</h4>
            <p>Stay organized with our task management features for seamless coordination.</p>
          </div>
          <div className="feature-card">
            <h4>Instant Notifications</h4>
            <p>Receive instant notifications and updates to keep you in the loop.</p>
          </div>
        </div>
      </section>
      <br></br>
      {user ? (
      <section className="home-button" style={{ marginBottom: '40px' }}>
        <button className="home-button-style" onClick={() => history.push('/create-event')}>Create Your First Event</button>
      </section>
    ) : (
      <section className="home-button" style={{ marginBottom: '40px' }}>
        <button className="home-button-style" onClick={() => history.push('/sign-up-log-in')}>Sign Up / Log In</button>
      </section>
    )}
      <br></br>
      <div className="divider"></div>
      <br></br>
      <section className="user-testimonials">
        <h3>User Testimonials</h3>
        <div className="square-box-container">
          <div className="square-box">
            <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."</p>
            <p>- John Doe</p>
          </div>
          <div className="square-box">
            <p>"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."</p>
            <p>- Jane Smith</p>
          </div>
        </div>
      </section>
      
      <section className="featured-events">
        <h3>Featured Events</h3>
        <div className="square-box-container">
    
          <div className="square-box">
            <p><strong>Event Name:</strong> Sample Event 1</p>
            <p><strong>Date:</strong> January 15, 2023</p>
            <p><strong>Description:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className="square-box">
            <p><strong>Event Name:</strong> Sample Event 2</p>
            <p><strong>Date:</strong> February 28, 2023</p>
            <p><strong>Description:</strong> Duis aute irure dolor in velit esse cillum dougiat nulla pariatur.</p>
          </div>
        </div>
      </section><br></br>
    </div>
    <div className="divider"></div>

      <footer className="footer">
        <ul className="footer-list">
          <li>About Us</li>
          <li>Contact</li>
          <li>Privacy Policy</li>
        </ul>
      </footer>
    </div>
  );
};

export default Home;
