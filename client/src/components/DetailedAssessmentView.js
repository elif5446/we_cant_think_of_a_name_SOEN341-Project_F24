import React, { useState, useEffect } from 'react';
import '../styles/DetailedAssessmentView.css';

const DetailedAssessmentView = () => {
    const [teamsData, setTeamsData] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="detailed-assessment">
            <h1>Detailed Team Assessment View</h1>
            
            {teamsData.map((team) => (
                <div key={team._id} className="team-section">
                    <h2>Team: {team.teamName}</h2>
                    
                    {team.members.map((member) => (
                        <div key={member.studentId} className="student-section">
                            <h3>Student: {member.firstname} {member.lastname}</h3>
                            
                            {member.assessments.length > 0 ? (
                                <>
                                    <div className="scores-section">
                                        <table className="scores-table">
                                            <thead>
                                                <tr>
                                                    <th>Evaluator</th>
                                                    <th>Cooperation</th>
                                                    <th>Conceptual</th>
                                                    <th>Practical</th>
                                                    <th>Work Ethic</th>
                                                    <th>Average</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {member.assessments.map((assessment, index) => {
                                                    const avgScore = (
                                                        (assessment.cooperation.score +
                                                        assessment.conceptual.score +
                                                        assessment.practical.score +
                                                        assessment.workEthic.score) / 4
                                                    ).toFixed(2);
                                                    
                                                    return (
                                                        <tr key={index}>
                                                            <td>Peer {index + 1}</td>
                                                            <td>{assessment.cooperation.score}</td>
                                                            <td>{assessment.conceptual.score}</td>
                                                            <td>{assessment.practical.score}</td>
                                                            <td>{assessment.workEthic.score}</td>
                                                            <td>{avgScore}</td>
                                                        </tr>
                                                    );
                                                })}
                                                <tr className="average-row">
                                                    <td><strong>Average</strong></td>
                                                    <td><strong>{member.cooperationAvg}</strong></td>
                                                    <td><strong>{member.conceptualAvg}</strong></td>
                                                    <td><strong>{member.practicalAvg}</strong></td>
                                                    <td><strong>{member.workEthicAvg}</strong></td>
                                                    <td><strong>{member.overallAvg}</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="comments-section">
                                        <h4>Peer Comments</h4>
                                        {member.assessments.map((assessment, index) => (
                                            <div key={index} className="peer-comments">
                                                <h5>Peer {index + 1} Comments:</h5>
                                                <div className="comments-grid">
                                                    {assessment.cooperation.comments && (
                                                        <div className="comment-box">
                                                            <strong>Cooperation:</strong>
                                                            <p>{assessment.cooperation.comments}</p>
                                                        </div>
                                                    )}
                                                    {assessment.conceptual.comments && (
                                                        <div className="comment-box">
                                                            <strong>Conceptual Contribution:</strong>
                                                            <p>{assessment.conceptual.comments}</p>
                                                        </div>
                                                    )}
                                                    {assessment.practical.comments && (
                                                        <div className="comment-box">
                                                            <strong>Practical Contribution:</strong>
                                                            <p>{assessment.practical.comments}</p>
                                                        </div>
                                                    )}
                                                    {assessment.workEthic.comments && (
                                                        <div className="comment-box">
                                                            <strong>Work Ethic:</strong>
                                                            <p>{assessment.workEthic.comments}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p className="no-assessments">No assessments submitted for this student.</p>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default DetailedAssessmentView; 