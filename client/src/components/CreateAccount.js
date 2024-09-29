import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/createPage.css';

const CreateAccount = () => {
    async function createUser() {
        const email = document.querySelector('#email').value
        const password = document.querySelector('#password').value

        console.log(password)

        await fetch('http://localhost:3001/api/create-account', {
            method: 'POST',
            body: JSON.stringify({
              email: email,
              password: password,
              userType: "Instructor"
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
                <h1 className="main_title">CREATE AN</h1>
                <h1 className="main_title">ACCOUNT</h1>


                <form id="form-group">
                    <div className="formgroup"><br></br>
                        <label htmlFor="email">EMAIL:</label><br></br>
                        <input type="email" id="email" name="email" required />
                    </div>
                    <div className="formgroup">
                        <label htmlFor="password">Password:</label><br></br>
                        <input type="password" id="password" name="pwd" required />
                    </div>
                    <div className="formgroup">
                        <Link to="/">
                            <button type="submit" className="signin" onClick={createUser}>Login</button>
                        </Link>
                    </div>
                    <Link to="/">
                        <button className="returnHome">
                            <img src="/images/home.svg" alt="Home Icon" className="homeavatar" />
                        </button>
                    </Link>
                </form>
            </div>
        </div>
    </div>)
};

export default CreateAccount;
