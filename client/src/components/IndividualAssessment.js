import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const IndividualAssessment = () => {
    const [teammate, setTeammate] = useState(null);
    const [assessment, setAssessment] = useState({
        cooperation: 1,
        conceptualContribution: 1,
        practicalContribution: 1,
        workEthic: 1,
        comments: ''
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

    const handleAssessmentChange = (dimension, value) => {
        setAssessment(prev => ({
            ...prev,
            [dimension]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                alert('Assessment submitted successfully!');
                navigate('/student-dashboard');
            } else {
                alert('Error submitting assessment');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting assessment');
        }
    };

    if (!teammate) {
        return <div>Loading...</div>;
    }

    return (
        <div className="individual-assessment">
            <h1>Peer Assessment for {teammate.firstname} {teammate.lastname}</h1>
            <form onSubmit={handleSubmit}>
                {['cooperation', 'conceptualContribution', 'practicalContribution', 'workEthic'].map(dimension => (
                    <div key={dimension}>
                        <label>{dimension.charAt(0).toUpperCase() + dimension.slice(1)}:</label>
                        <input
                            type="range"
                            min="1"
                            max="7"
                            value={assessment[dimension]}
                            onChange={(e) => handleAssessmentChange(dimension, parseInt(e.target.value))}
                        />
                        <span>{assessment[dimension]}</span>
                    </div>
                ))}
                <div>
                    <label>Comments:</label>
                    <textarea
                        value={assessment.comments}
                        onChange={(e) => handleAssessmentChange('comments', e.target.value)}
                    />
                </div>
                <button type="submit">Submit Assessment</button>
            </form>
        </div>
    );
};

export default IndividualAssessment;