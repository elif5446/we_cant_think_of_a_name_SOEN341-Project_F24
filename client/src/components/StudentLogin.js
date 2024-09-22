import React from 'react';
import '../styles/StudentLogin.css'; 

const StudentLogin = () => (
    
<div className="student-login-page">
    <div className="student-login-container">
        <img src="/images/loginStudent.svg" alt="Sign Up Icon" className="student-icon" />
        <div id = "login-section">
        <h1 className="maintitle">Student</h1>
        <h1 className="maintitle">Login</h1>


            <form id="form-group">
                <div className = "form-group">
                    <label htmlFor="studentid">Student ID:</label><br></br>
                    <input type="text" id="studentid" name="studentid" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label><br></br>
                    <input type="password" id="password" name="password" required />
                </div>
                <div className="form-group">
                    <button type="submit">Login</button>
                </div>
            </form>
         </div>  
    </div>
</div>
);

export default StudentLogin;
