import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/createPage.css'; 

const CreateAccount = () => (
    
<div className="create-login-page">
    <div className="create-login-container">
        <img src="/images/newuser.svg" alt="Sign Up Icon" className="newuser-icon" />
        <div id = "login-section"><br></br>
        <h1 className="maintitle">CREATE AN</h1>
        <h1 className="maintitle">ACCOUNT</h1>


            <form id="form-group">
                <div className = "formgroup"><br></br>
                    <label htmlFor="studentid">Username:</label><br></br>
                    <input type="text" id="studentid" name="studentID" required />
                </div>
                <div className="formgroup">
                    <label htmlFor="password">Password:</label><br></br>
                    <input type="password" id="password" name="pwd" required />
                </div>
                <div className="formgroup"><br></br>
                <Link to = "/">
                    <button type="submit">Login</button>

                </Link>
                </div>
                <Link to = "/">
                <button className = "returnHome">
                <img src="/images/home.svg" alt="Home Icon" className="homeavatar" />
                </button>
                </Link>
            </form>
         </div>  
    </div>
</div>
);

export default CreateAccount;
