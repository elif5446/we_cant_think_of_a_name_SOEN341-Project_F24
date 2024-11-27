import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/InstructorLogin.css';

const InstructorLogin = () => {
    const navigate = useNavigate()

    async function login(e) {
        e.preventDefault()

        const email = document.querySelector('#email').value
        const password = document.querySelector('#password').value

        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                throw new Error("Your password is wrong. Please try again.");
            } else if (response.status === 400) {
                throw new Error("User does not exist.");
            } else if (!response.ok) {
                throw new Error("Something Went Wrong");
            }

            const data = await response.json();
            
            if (data.user.usertype !== "instructor") {
                throw new Error("User type mismatch. Please login as a student.");
            }

            localStorage.setItem('instructorId', data.user._id);
            navigate("/instructor-page");

        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="instructor-login-page">
            <div className="instructor-login-container">
                <img src="/images/teacher.svg" alt="Sign Up Icon" className="instructor-icon" />
                <div id="login-section">
                    <h2 className="main-title">INSTRUCTOR LOGIN</h2>
                    <form id="form-group" onSubmit={login}>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="text" id="email" name="email" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" name="password" required />
                        </div>
                        <div className="form-group">
                            <button className="loginbutton" type="submit">Login</button>
                        </div>
                        <Link to="/">
                            <button className="returnH">
                                <img src="/images/home.svg" alt="Home Icon" className="home-avatar" />
                            </button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InstructorLogin;
