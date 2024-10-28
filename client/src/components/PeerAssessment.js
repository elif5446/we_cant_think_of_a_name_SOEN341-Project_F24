import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PeerAssessment = () => {
    const [teammates, setTeammates] = useState([]);
    const [assessments, setAssessments] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const studentId = localStorage.getItem('studentId');
        if (!studentId) {
            navigate('/student-login');
            return;
        }
        fetchTeammates(studentId);
    }, [navigate]);

    const fetchTeammates = async (studentId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/student-teammates/${studentId}`);
            if (response.ok) {
                const data = await response.json();
                setTeammates(data.teammates);
                initializeAssessments(data.teammates);
            } else {
                console.error('Error fetching teammates');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const initializeAssessments = (teammates) => {
        const initialAssessments = {};
        teammates.forEach(teammate => {
            initialAssessments[teammate._id] = {
                cooperation: 0,
                conceptualContribution: 0,
                practicalContribution: 0,
                workEthic: 0,
                comments: ''
            };
        });
        setAssessments(initialAssessments);
    };

    const handleAssessmentChange = (teammateId, dimension, value) => {
        setAssessments(prev => ({
            ...prev,
            [teammateId]: {
                ...prev[teammateId],
                [dimension]: value
            }
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
                    assessments: assessments
                }),
            });

            if (response.ok) {
                navigate('/assessment-confirmation');
            } else {
                alert('Error submitting assessments');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting assessments');
        }
    };

    return (
        <div className="peer-assessment">
            <h1>Peer Assessment</h1>
            <form onSubmit={handleSubmit}>
                {teammates.map(teammate => (
                    <div key={teammate._id} className="teammate-assessment">
                        <h2>{teammate.firstname} {teammate.lastname}</h2>
                        {['cooperation', 'conceptualContribution', 'practicalContribution', 'workEthic'].map(dimension => (
                            <div key={dimension}>
                                <label>{dimension.charAt(0).toUpperCase() + dimension.slice(1)}:</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="7"
                                    value={assessments[teammate._id][dimension]}
                                    onChange={(e) => handleAssessmentChange(teammate._id, dimension, parseInt(e.target.value))}
                                />
                                <span>{assessments[teammate._id][dimension]}</span>
                            </div>
                        ))}
                        <div>
                            <label>Comments:</label>
                            <textarea
                                value={assessments[teammate._id].comments}
                                onChange={(e) => handleAssessmentChange(teammate._id, 'comments', e.target.value)}
                            />
                        </div>
                    </div>
                ))}
                <button type="submit">Submit Assessments</button>
            </form>
        </div>
    );
};

export default PeerAssessment;