import React from 'react';
import { useHistory } from 'react-router-dom';
import { useGlobalState } from './Context';

const Home = () => {
  const { user } = useGlobalState();
  const history = useHistory();

  const renderHomeButton = () => {
    const buttonText = user ? 'Create Your First Event' : 'Sign Up / Log In';
    const onClickHandler = () => (user ? history.push('/create-event') : history.push('/sign-up-log-in'));

    return (
      <section className="home-button" style={{ marginBottom: '40px' }}>
        <button className="home-button-style" onClick={onClickHandler}>
          {buttonText}
        </button>
      </section>
    );
  };

  return (
    <div>
      <div className="home-container">
        <section className="hero-features">
          <h2>Simplify Your Event Planning</h2>
        </section>

        <section className="hero-features">
          <h3>Key Features</h3>
          <br />
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
        <br />
        {renderHomeButton()}
        <br />
        <div className="divider"></div>
        <br />
        <section className="user-testimonials">
          <h3>User Testimonials</h3>
          <div className="square-box-container">
            <div className="square-box">
              <p>"I found the event planning process on this website incredibly intuitive and user-friendly. It made organizing our company retreat a breeze!"</p>
              <p>- Lisa Davis</p>
            </div>
            <div className="square-box">
              <p>"This website has been a game-changer for me as an event organizer. The tools and resources available here have saved me countless hours of planning and coordination."</p>
              <p>- Mark Hayden</p>
            </div>
          </div>
        </section>

        <section className="featured-events">
          <h3>Featured Events</h3>
          <div className="square-box-container">
            <div className="square-box">
              <p><strong>Event Name:</strong> Coding Bootcamp Open House</p>
              <p><strong>Date:</strong> January 15, 2023</p>
              <p><strong>Description:</strong> Learn about our coding bootcamp program and meet the instructors. Snacks and refreshments provided.</p>
            </div>
            <div className="square-box">
              <p><strong>Event Name:</strong> Conference on Artificial Intelligence</p>
              <p><strong>Date:</strong> February 28, 2023</p>
              <p><strong>Description:</strong> Annual conference discussing the latest trends and advancements in AI technology.</p>
            </div>
          </div>
        </section>

        <br />
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
