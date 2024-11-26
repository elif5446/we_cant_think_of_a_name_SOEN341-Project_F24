import React, { useState, useEffect } from 'react';
import '../styles/DetailedAssessmentView.css';
import { Link } from 'react-router-dom';

const DetailedAssessmentView = () => {
    const [teamsData, setTeamsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedStudent, setExpandedStudent] = useState(null);

    useEffect(() => {
        fetchDetailedData();
    }, []);

    const fetchDetailedData = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/instructor/detailed-assessment');
            if (response.ok) {
                const data = await response.json();
                setTeamsData(data.data);
            } else {
                console.error('Error fetching detailed assessment data');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateOverallAverage = (student) => {
        if (student.cooperationAvg === 'N/A' || 
            student.conceptualAvg === 'N/A' || 
            student.practicalAvg === 'N/A' || 
            student.workEthicAvg === 'N/A') {
            return 'N/A';
        }
        
        const cooperationAvg = parseFloat(student.cooperationAvg);
        const conceptualAvg = parseFloat(student.conceptualAvg);
        const practicalAvg = parseFloat(student.practicalAvg);
        const workEthicAvg = parseFloat(student.workEthicAvg);
        
        return ((cooperationAvg + conceptualAvg + 
                practicalAvg + workEthicAvg) / 4).toFixed(2);
    };

    const renderAssessment = (assessment, member) => {
        const isSelfAssessment = assessment.assessmentType === 'self';
        
        return (
            <div className={`feedback-card ${isSelfAssessment ? 'self-assessment' : ''}`}>
                <div className="feedback-content">
                    <h5>
                        {assessment.evaluator._id === member.studentId ? 
                            'Self Assessment' : 
                            `${assessment.evaluator.firstname} ${assessment.evaluator.lastname}'s Feedback`
                        }
                    </h5>
                    <div className={assessment.evaluator._id === member.studentId ? 'self-assessment-content' : ''}>
                        {assessment.cooperation.comments && (
                            <p><strong>Cooperation:</strong> {assessment.cooperation.comments}</p>
                        )}
                        {assessment.conceptual.comments && (
                            <p><strong>Conceptual:</strong> {assessment.conceptual.comments}</p>
                        )}
                        {assessment.practical.comments && (
                            <p><strong>Practical:</strong> {assessment.practical.comments}</p>
                        )}
                        {assessment.workEthic.comments && (
                            <p><strong>Work Ethic:</strong> {assessment.workEthic.comments}</p>
                        )}
                    </div>
                </div>
                <div className="feedback-overlay">
                    <Link to={"/instructor/comments"} state={{ assessmentId: assessment.id, evaluatorId: "x", assessment: assessment }} className="comments-button">
                        Comments
                    </Link>
                </div>
            </div>
        );
    };

    if (loading) return <div className="loading-state">Loading...</div>;

    return (
        <div className="detailed-assessment">
            <h2 className="title">Team Assessment Details</h2>
            
            {teamsData.map((team) => (
                <div key={team._id} className="team-card">
                    <h3 className="team-name">{team.teamName}</h3>
                    
                    <div className="students-grid">
                        {team.members.map((member) => (
                            <div key={member.studentId} className="student-card">
                                <div className="student-header">
                                    <h4>{member.firstname} {member.lastname}</h4>
                                    <div className="overall-score">
                                        {calculateOverallAverage(member)}
                                    </div>
                                </div>

                                <div className="score-summary">
                                    <div className="metric">
                                        <span>Cooperation</span>
                                        <span>{member.cooperationAvg}</span>
                                    </div>
                                    <div className="metric">
                                        <span>Conceptual</span>
                                        <span>{member.conceptualAvg}</span>
                                    </div>
                                    <div className="metric">
                                        <span>Practical</span>
                                        <span>{member.practicalAvg}</span>
                                    </div>
                                    <div className="metric">
                                        <span>Work Ethic</span>
                                        <span>{member.workEthicAvg}</span>
                                    </div>
                                </div>

                                <button 
                                    className="details-toggle"
                                    onClick={() => setExpandedStudent(
                                        expandedStudent === member.studentId ? null : member.studentId
                                    )}
                                >
                                    {expandedStudent === member.studentId ? 'Hide Details' : 'Show Details'}
                                </button>

                                {expandedStudent === member.studentId && (
                                    <div className="detailed-feedback">
                                        {member.assessments.map((assessment, index) => (
                                            renderAssessment(assessment, member)
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DetailedAssessmentView; 