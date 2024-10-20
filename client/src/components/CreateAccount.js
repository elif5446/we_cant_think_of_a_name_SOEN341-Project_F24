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
                <div className = "formgroup"><br></br>
                    <label htmlFor="studentid">Username:</label><br></br>
                    <input type="text" id="studentid" name="studentID" required />
                </div>
                <div className="formgroup">
                    <label htmlFor="password">Password:</label><br></br>
                    <input type="password" id="password" name="pwd" required />
                </div>
                <div className="formgroup">
                <Link to = "/">
                    <button type="submit" className = "signin">Login</button>
<<<<<<< HEAD

                </Link>
                </div>
                <Link to = "/">
                <button className = "returnHome">
                <img src="/images/home.svg" alt="Home Icon" className="homeavatar" />
                </button>
                </Link>
=======
                </Link>
                </div>
                {/* <Link to = "/">
                <button className = "returnHome">
                <img src="/images/home.svg" alt="Home Icon" className="homeavatar" />
                </button>
                </Link> */}
>>>>>>> 3fbfc70a73f3959dc2f3fefbcb1481893ab7ce6f
            </form>
         </div>  
    </div>
</div>
);

export default CreateAccount;
