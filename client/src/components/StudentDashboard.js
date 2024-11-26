import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Chat from './Chat';
import NotificationBell from './NotificationBell';
import '../styles/StudentDashboard.css';

const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [teams, setTeams] = useState([]);
    const navigate = useNavigate();
    const studentId = localStorage.getItem('studentId');

    useEffect(() => {
        const studentId = localStorage.getItem('studentId');
        if (!studentId) {
            navigate('/student-login');
            return;
        }
    
        fetchStudentData(studentId);
    }, [navigate]);

    const fetchStudentData = async (studentId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/student-data/${studentId}`);
            if (response.ok) {
                const data = await response.json();
                setCourses(data.courses);
                setTeams(data.teams.map(team => ({
                    ...team,
                    members: team.members || []
                })));
            } else {
                console.error('Error fetching student data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchTeams = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/student/teams/${studentId}`);
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched teams:', data.teams);
                setTeams(data.teams || []);
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    }, [studentId]);

    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    return (
        <div className="student-dashboard">
            <div className="dashboard-header">
                <h1>Student Dashboard</h1>
                <NotificationBell courses={courses} studentId={studentId} />
            </div>
            <h2>Your Courses</h2>
            {courses.length > 0 ? (
                <ul>
                    {courses.map(course => (
                        <li key={course._id}>{course.courseCode} - {course.courseName}</li>
                    ))}
                </ul>
            ) : (
                <p className="empty-state">You are not enrolled in any courses.</p>
            )}
            <h2>Your Teams</h2>
            {teams.length > 0 ? (
                teams.map(team => (
                    <div key={team._id} className="team-section">
                        <h3>{team.teamName} (Course: {team.course.courseCode})</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Peer Assessment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {team.members.map(member => {
                                    const isSelfAssessment = member._id === localStorage.getItem('studentId');
                                    return (
                                        <tr key={member._id}>
                                            <td>{member.firstname}</td>
                                            <td>{member.lastname}</td>
                                            <td>{member.email}</td>
                                            <td style={{ padding: '10px' }}>
                                                <Link
                                                    to={`/assessment/${member._id}`}
                                                    className={`assessment-link ${isSelfAssessment ? 'self-assessment-link' : ''}`}
                                                >
                                                    <span className={`assessment-name ${isSelfAssessment ? 'self-assessment-name' : ''}`}>
                                                        {isSelfAssessment ? 'Assess Yourself' : `Assess ${member.firstname}`}
                                                    </span>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <p className="empty-state">You are not part of any teams.</p>
            )}
            <h2>Chat</h2>
            <div className="chat-section">
                <Chat 
                    courses={courses}
                    userId={studentId}
                    userType="student"
                    teams={teams}
                />
            </div>
        </div>
    );
};

export default StudentDashboard;