import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/InstructorLogin.css'; 

const InstructorLogin = () => (
    
<div className="instructor-login-page">
    <div className="instructor-login-container">
        <img src="/images/teacher.svg" alt="Sign Up Icon" className="instructor-icon" />
        <div id = "login-section"><br></br>
        <h1 className="title">INSTRUCTOR</h1>
        <h1 className="title">LOGIN</h1>


            <form id="form-group">
                <div className = "form-group"><br></br>
                    <label htmlFor="email">Email:</label><br></br>
                    <input type="text" id="email" name="email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label><br></br>
                    <input type="password" id="password" name="password" required />
                </div>
                <div className="form-group">
                <Link to = "/instructor-page">
                    <button type="submit" className = "login">Login</button>
                </Link></div>
                <Link to = "/">
                <button className = "return">
                <img src="/images/home.svg" alt="Home Icon" className="home-avatar" />
                </button>
                </Link>
            </form>
         </div>  
    </div>
</div>
);

export default InstructorLogin;
