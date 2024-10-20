import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../styles/StudentLogin.css'; 

const StudentLogin = () => {
    const navigate = useNavigate()
    
    async function login(e) {
        e.preventDefault()

        const email = document.querySelector('#email').value
        const password = document.querySelector('#password').value

        await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            body: JSON.stringify({
              email: email,
              password: password
            }),
            headers: {
              'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status === 401) {
                throw new Error("Your password is wrong. Please try again.");
            } else if (response.status === 400) {
                throw new Error("User does not exist.");
            } else if (!response.ok) {
                throw new Error("Something Went Wrong")
            }

            return response.json();
        }).then(jsonResponse => {
            if (jsonResponse.user.usertype !== "student") {
                throw new Error("User type missmatch. Please login as an instructor.")
            }
            navigate("/student-menu")
            console.log(jsonResponse)
        }).catch(e => {
            alert(e)
        })
    }
    
return (
<div className="student-login-page">
    <div className="student-login-container">
        <img src="/images/loginStudent.svg" alt="Sign Up Icon" className="student-icon" />
        <div id = "login-section"><br></br>
        <h1 className="main-title">STUDENT</h1>
        <h1 className="main-title">LOGIN</h1>


            <form id="form-group" onSubmit={login}>
                <div className = "form-group"><br></br>
                    <label htmlFor="email">Email:</label><br></br>
                    <input type="text" id="email" name="email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label><br></br>
                    <input type="password" id="password" name="PWD" required />
                </div>
                <div className="form-group">
                    <button className="loginbutton" type="submit">Login</button>
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
