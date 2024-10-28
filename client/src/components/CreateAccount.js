import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/createPage.css';

const CreateAccount = () => {
    const navigate = useNavigate()
    
    async function createUser() {
        const email = document.querySelector('#email').value
        const password = document.querySelector('#password').value
        const firstName = document.querySelector('#firstname').value
        const lastName = document.querySelector('#lastname').value
        const userType = document.querySelector('#usertype').value

        await fetch('http://localhost:3001/api/create-account', {
            method: 'POST',
            body: JSON.stringify({
              email: email,
              password: password,
              firstName: firstName,
              lastName: lastName,
              userType: userType
            }),
            headers: {
              'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error("Account creation failed.");
            }

            return response.json();
        }).then(successObj => {
            if (userType.toLowerCase() === "student") {
                navigate("/student-menu")
            } else {
                navigate("/instructor-page")
            }
        })
    }

    return (
    <div className="create-login-page">
        <div className="create-login-container">
            <img src="/images/loginimg.svg" alt="Sign Up Icon" className="newuser-icon" />
            <div id="login-section"><br></br>
                <h3 className="main_title">CREATE ACCOUNT</h3>


                <form id="form-group">
                    <div className="formgroup">
                        <label htmlFor="email">Email:  </label>
                        <input type="text" id="email" name="email" required/>
                    </div>
                    <div className="formgroup">
                        <label htmlFor="password">Password:  </label>
                        <input type="password" id="password" name="pwd" required/>
                    </div>

                    <div className="formgroup">
                        <label htmlFor="firstname">First Name:  </label>
                        <input type="text" id="firstname" name="firstname" required/>
                    </div>
                    <div className="formgroup">
                        <label htmlFor="lastname">Last Name:  </label>
                        <input type="text" id="lastname" name="lastname" required/>
                    </div>
                    <div className="formgroup">
                        <label htmlFor="usertype">Account type:  </label>
                        <select id="usertype" name="usertype" required>
                            <option value="instructor">Instructor</option>
                            <option value="student">Student</option>
                        </select>
                    </div>

                    <div className="formgroup">
                        <button type="submit" className="signin" onClick={createUser}>Create Account</button>
                        <Link to="/">
                            <button className="returnHome">
                                <img src="/images/home.svg" alt="Home Icon" className="homeavatar"/>
                            </button>
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    </div>)
};

export default CreateAccount;
