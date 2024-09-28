import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/createPage.css';

const CreateAccount = () => {
    async function createUser() {
        const email = document.querySelector('#studentid')
        const password = document.querySelector('#password')

        console.log(password)

        await fetch('/api/create-account', {
            method: 'POST',
            body: JSON.stringify({
              email: email,
              password: password
            }),
            headers: {
              'Content-Type': 'application/json'
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
                        <label htmlFor="email">Username: </label>
                        <input type="text" id="email" name="email" required/>
                    </div>
                    <div className="formgroup">
                        <label htmlFor="password">Password: </label>
                        <input type="password" id="password" name="pwd" required/>
                    </div>

                    <div className="formgroup">
                        <label htmlFor="firstname">First Name: </label>
                        <input type="text" id="firstname" name="firstname" required/>
                    </div>
                    <div className="formgroup">
                        <label htmlFor="lastname">Last Name: </label>
                        <input type="text" id="lastname" name="lastname" required/>
                    </div>
                    <div className="formgroup">
                        <label htmlFor="usertype">Instructor or Student?: </label>
                        <input type="text" id="usertype" name="usertype" required/>
                    </div>

                    <div className="formgroup">
                        <Link to="/">
                            <button type="submit" className="signin" onClick={createUser}>Create Account</button>
                        </Link>
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
