import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Main.css';


const Main = () => (
    <section className="main-container">
    <div className = "title-container">
        <h2 className="title">WELCOME TO THE...</h2><br></br>
        <h1 className = "maintitle">PEER ASSESSMENT</h1>
        <h1 className = "maintitle">PROGRAM</h1>
    </div>

    <div className = "button-container">
    <Link to = "/instructor-login">
        <button className="button">INSTRUCTOR LOGIN</button>
    </Link>
    <Link to = "/student-login">
        <button className="button">STUDENT LOGIN</button>
    </Link>
    </div>
  </section>
);

export default Main;



