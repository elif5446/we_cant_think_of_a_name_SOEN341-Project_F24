import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/StudentLogin.css'; 

const StudentLogin = () => {
    async function login() {
        const email = document.querySelector('#email').value
        const password = document.querySelector('#password').value
    }
    
return (
<div className="student-login-page">
    <div className="student-login-container">
        <img src="/images/loginStudent.svg" alt="Sign Up Icon" className="student-icon" />
        <div id = "login-section"><br></br>
        <h1 className="main-title">STUDENT</h1>
        <h1 className="main-title">LOGIN</h1>


            <form id="form-group">
                <div className = "form-group"><br></br>
                    <label htmlFor="studentid">Student ID:</label><br></br>
                    <input type="text" id="studentid" name="ID" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label><br></br>
                    <input type="password" id="password" name="PWD" required />
                </div>
                <div className="form-group">
                    <button className="loginbutton" onClick={login}>Login</button>
                </div>
                <Link to = "/">
                <button className = "returnH">
                <img src="/images/home.svg" alt="Home Icon" className="home-avatar" />
                </button>
                </Link>
            </form>
         </div>  
    </div>
</div>)
};

export default StudentLogin;
