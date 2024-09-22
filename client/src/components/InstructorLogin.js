import React from 'react';
import '../styles/InstructorLogin.css'; 

const InstructorLogin = () => (
    
<div className="instructor-login-page">
    <div className="instructor-login-container">
        <img src="/images/loginStudent.svg" alt="Sign Up Icon" className="student-icon" />
        <div id = "login-section"><br></br>
        <h1 className="maintitle">INSTRUCTOR</h1>
        <h1 className="maintitle">LOGIN</h1>


            <form id="form-group">
                <div className = "form-group"><br></br>
                    <label htmlFor="studentid">Instructor ID:</label><br></br>
                    <input type="text" id="studentid" name="studentid" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label><br></br>
                    <input type="password" id="password" name="password" required />
                </div>
                <div className="form-group"><br></br>
                    <button type="submit">Login</button>
                </div>
            </form>
         </div>  
    </div>
</div>
);

export default InstructorLogin;
