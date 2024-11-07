import React, { useState, useEffect } from 'react';
import '../styles/AssessmentSummary.css';

const AssessmentSummary = () => {
    const [summaryData, setSummaryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        fetchSummaryData();
    }, []);

    const fetchSummaryData = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/instructor/assessment-summary');
            if (response.ok) {
                const data = await response.json();
                setSummaryData(data.data);
                if (data.data.length > 0) {
                    setSelectedCourse(data.data[0].courseId);
                }
            } else {
                console.error('Error fetching summary data');
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

    const selectedCourseData = summaryData.find(course => course.courseId === selectedCourse);

    return (
        <div className="assessment-summary">
            <h1>Assessment Summary</h1>
            
            <div className="course-selector">
                <label>Select Course:</label>
                <select 
                    value={selectedCourse || ''} 
                    onChange={(e) => setSelectedCourse(e.target.value)}
                >
                    {summaryData.map(course => (
                        <option key={course.courseId} value={course.courseId}>
                            {course.courseCode} - {course.courseName}
                        </option>
                    ))}
                </select>
            </div>

            {selectedCourseData && (
                <div className="summary-table-container">
                    <h2>{selectedCourseData.courseCode} - {selectedCourseData.courseName}</h2>
                    <table className="summary-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Team</th>
                                <th>Cooperation</th>
                                <th>Conceptual</th>
                                <th>Practical</th>
                                <th>Work Ethic</th>
                                <th>Overall</th>
                                <th>Responses</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedCourseData.students.map(student => (
                                <tr key={student.studentId}>
                                    <td>{student.studentId}</td>
                                    <td>{student.firstname}</td>
                                    <td>{student.lastname}</td>
                                    <td>{student.team}</td>
                                    <td>{student.cooperationAvg}</td>
                                    <td>{student.conceptualAvg}</td>
                                    <td>{student.practicalAvg}</td>
                                    <td>{student.workEthicAvg}</td>
                                    <td>{student.overallAvg}</td>
                                    <td>{student.evaluators.length}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AssessmentSummary; 