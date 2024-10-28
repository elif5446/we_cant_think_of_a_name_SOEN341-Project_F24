import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AssessmentConfirmation.css';

const AssessmentConfirmation = () => {
    return (
        <div className="confirmation-container">
            <div className="confirmation-box">
                <img src="/images/success.svg" alt="Success" className="success-icon" />
                <h1>Assessment Submitted Successfully!</h1>
                <p>Thank you for completing your peer assessment.</p>
                <div className="button-group">
                    <Link to="/student-dashboard">
                        <button className="return-dashboard">Return to Dashboard</button>
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default AssessmentConfirmation;
