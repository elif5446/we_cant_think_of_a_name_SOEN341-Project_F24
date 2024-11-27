import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Main.css';

const Main = () => (
  <section className="main-container">
    <div className="title-container">
      <h1 className="Maintitle">PEER ASSESSMENT PROGRAM</h1>
    </div>

    <img 
      src="/images/stingers.png" 
      alt="StingersIcon" 
      className="stingers" 
    />

    <div className="button-container">
      <Link to="/instructor-login">
        <button className="button">
          <img 
            src="/images/teacherAvatar.svg" 
            alt="Instructor Icon" 
            className="instructor-avatar" 
          />
          INSTRUCTOR LOGIN
        </button>
      </Link>

      <Link to="/student-login">
        <button className="button">
          <img 
            src="/images/studentAvatar.svg" 
            alt="Student Icon" 
            className="student-avatar" 
          />
          STUDENT LOGIN
        </button>
      </Link>

      <Link to="/create-account">
        <button className="button">
          <img 
            src="/images/newuser.png" 
            alt="New User Icon" 
            className="unknown-avatar" 
          />
          CREATE AN ACCOUNT
        </button>
      </Link>
    </div>
  </section>
);

export default Main;



