import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Main.css';


const Main = () => (
    <section className="main-container">
    <div className = "title-container">
        <h2 className="title">WELCOME TO THE...</h2><br></br>
        <h1 className = "Maintitle">PEER ASSESSMENT</h1>
        <h1 className = "Maintitle">PROGRAM</h1>
    </div>
    <img src="/images/stingers.png" alt="StingersIcon" className="stingers" />



    <div className = "button-container">
    <Link to = "/instructor-login">

        <button className="button">
        <img src="/images/teacherAvatar.svg" alt="Sign Up Icon" className="instructor-avatar" />

            INSTRUCTOR LOGIN</button>
    </Link>
    <Link to = "/student-login">
        
        <button className="button">
        <img src="/images/studentAvatar.svg" alt="Sign Up Icon" className="student-avatar" />
            STUDENT LOGIN</button>
    </Link>
    <Link to = "/createPage-login">
        <button className="button">
        <img src="/images/newuser.png" alt="Sign Up Icon" className="unknown-avatar" />
            CREATE AN ACCOUNT</button>
    </Link>
    </div>
  </section>
);

export default Main;



