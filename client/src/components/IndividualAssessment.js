import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/IndividualAssessment.css';

const IndividualAssessment = () => {
    const [teammate, setTeammate] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [assessment, setAssessment] = useState({
        cooperation: { score: 1, comments: '' },
        conceptualContribution: { score: 1, comments: '' },
        practicalContribution: { score: 1, comments: '' },
        workEthic: { score: 1, comments: '' }
    });
    const { teammateId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const studentId = localStorage.getItem('studentId');
        if (!studentId) {
            navigate('/student-login');
            return;
        }
        fetchTeammate(teammateId);
    }, [navigate, teammateId]);

    const fetchTeammate = async (teammateId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/teammate/${teammateId}`);
            if (response.ok) {
                const data = await response.json();
                setTeammate(data.teammate);
            } else {
                console.error('Error fetching teammate');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAssessmentChange = (dimension, field, value) => {
        setAssessment(prev => ({
            ...prev,
            [dimension]: {
                ...prev[dimension],
                [field]: value
            }
        }));
    };

    const handleSubmitClick = (e) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const handleConfirmSubmit = async () => {
        const studentId = localStorage.getItem('studentId');
        try {
            const response = await fetch('http://localhost:3001/api/submit-assessment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    evaluatorId: studentId,
                    evaluateeId: teammateId,
                    assessment: assessment
                }),
            });

            if (response.ok) {
                navigate('/assessment-confirmation');
            } else {
                alert('Error submitting assessment');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting assessment');
        }
    };

    const handleCancelSubmit = () => {
        setShowConfirmation(false);
    };

    const dimensionLabels = {
        cooperation: 'Cooperation',
        conceptualContribution: 'Conceptual Contribution',
        practicalContribution: 'Practical Contribution',
        workEthic: 'Work Ethic'
    };

    if (!teammate) {
        return <div>Loading...</div>;
    }

    return (
        <div className="individual-assessment">
            <h1>Peer Assessment for {teammate.firstname} {teammate.lastname}</h1>
            <form onSubmit={handleSubmitClick}>
                {Object.entries(dimensionLabels).map(([dimension, label]) => (
                    <div key={dimension} className="assessment-dimension">
                        <h3>{label}</h3>
                        <div className="score-input">
                            <label>Score:</label>
                            <input
                                type="range"
                                min="1"
                                max="7"
                                value={assessment[dimension].score}
                                onChange={(e) => handleAssessmentChange(dimension, 'score', parseInt(e.target.value))}
                            />
                            <span>{assessment[dimension].score}</span>
                        </div>
                        <div className="comments-input">
                            <label>Comments for {label}:</label>
                            <textarea
                                value={assessment[dimension].comments}
                                onChange={(e) => handleAssessmentChange(dimension, 'comments', e.target.value)}
                                placeholder={`Enter your comments about ${label.toLowerCase()}...`}
                            />
                        </div>
                    </div>
                ))}
                <button type="submit">Submit Assessment</button>
            </form>

            {showConfirmation && (
                <div className="confirmation-overlay">
                    <div className="confirmation-dialog">
                        <h2>Confirm Submission</h2>
                        <p>Are you sure you want to submit this assessment?</p>
                        <div className="confirmation-buttons">
                            <button onClick={handleConfirmSubmit}>Yes, Submit</button>
                            <button onClick={handleCancelSubmit}>No, Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IndividualAssessment;
