import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/InstructorLogin.css';

const InstructorLogin = () => {
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
            if (jsonResponse.user.usertype !== "instructor") {
                throw new Error("User type missmatch. Please login as an instructor.")
            }
            navigate("/instructor-page")
            console.log(jsonResponse)
        }).catch(e => {
            alert(e)
        })
    }

    return (
        <div className="instructor-login-page">
            <div className="instructor-login-container">
                <img src="/images/teacher.svg" alt="Sign Up Icon" className="instructor-icon" />
                <div id="login-section"><br></br>
                    <h1 className="title">INSTRUCTOR</h1>
                    <h1 className="title">LOGIN</h1>


                    <form id="form-group" onSubmit={login}>
                        <div className="form-group"><br></br>
                            <label htmlFor="email">Email:</label><br></br>
                            <input type="text" id="email" name="email" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label><br></br>
                            <input type="password" id="password" name="password" required />
                        </div>
                        <div className="form-group">
                                <button type="submit" className="login">Login</button>
                            </div>
                        <Link to="/">
                            <button className="return">
                                <img src="/images/home.svg" alt="Home Icon" className="home-avatar" />
                            </button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>)
};

export default InstructorLogin;
