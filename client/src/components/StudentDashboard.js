import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [teams, setTeams] = useState([]);
    const navigate = useNavigate();

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

    return (
        <div className="student-dashboard">
            <h1>Student Dashboard</h1>
            <h2>Your Courses</h2>
            {courses.length > 0 ? (
                <ul>
                    {courses.map(course => (
                        <li key={course._id}>{course.courseCode} - {course.courseName}</li>
                    ))}
                </ul>
            ) : (
                <p>You are not enrolled in any courses.</p>
            )}
            <h2>Your Teams</h2>
            {teams.length > 0 ? (
                teams.map(team => (
                    <div key={team._id}>
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
                                {team.members.map(member => (
                                    <tr key={member._id}>
                                        <td>{member.firstname}</td>
                                        <td>{member.lastname}</td>
                                        <td>{member.email}</td>
                                        <td>
                                            <Link to={`/peer-assessment/${member._id}`}>
                                                Assess {member.firstname}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <p>You are not part of any teams.</p>
            )}
        </div>
    );
};

export default StudentDashboard;