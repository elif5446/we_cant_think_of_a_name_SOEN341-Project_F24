import React, {useState, useEffect} from 'react';
import '../styles/InstructorPage.css';


const InstructorPage = () => {
    const [showCreateCourse, setShowCreateCourse] = useState(false);
    const [courseCode, setCourseCode] = useState('');
    const [courseName, setCourseName] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [teamName, setTeamName] = useState('');
    const [teamMembers, setTeamMembers] = useState('');
    const [students, setStudents] = useState([]);


    useEffect(() => {
        fetchCourses();
        fetchStudents();
    }, []);
    useEffect(() => {
        if (selectedCourse) {
            fetchTeams(selectedCourse);
            fetchCourseStudents(selectedCourse);
            fetchStudents();
        }
    }, [selectedCourse]);

    const fetchCourses = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/courses');
            if (response.ok) {
                const data = await response.json();
                setCourses(data.courses);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const getAvailableStudentsForTeam = (teamId) => {
        const team = teams.find(t => t._id === teamId);
        if (!team) return [];
        const teamMemberIds = team.members.map(member => member._id);
        return courseStudents.filter(student => !teamMemberIds.includes(student._id));
    };
    
    const fetchStudents = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/students');
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched students data:', data);
                setStudents(Array.isArray(data.students) ? data.students : []);
            } else {
                console.error('Error fetching students:', response.statusText);
                setStudents([]);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            setStudents([]);
        }
    };
    const getAvailableStudents = () => {
        return students.filter(student => 
            !courseStudents.some(courseStudent => courseStudent._id === student._id)
        );
    };

    const fetchTeams = async (courseId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/teams/${courseId}`);
            if (response.ok) {
                const data = await response.json();
                setTeams(data.teams.map(team => ({
                    ...team,
                    members: team.members || []
                })));
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    const fetchCourseStudents = async (courseId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/course-students/${courseId}`);
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched course students:', data.students);
                setCourseStudents(data.students);
            } else {
                console.error('Error fetching course students:', response.statusText);
                setCourseStudents([]);
            }
        } catch (error) {
            console.error('Error fetching course students:', error);
            setCourseStudents([]);
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/create-course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseCode,
                    courseName,
                }),
            });

            if (response.ok) {
                alert('Course created successfully!');
                setCourseCode('');
                setCourseName('');
                setShowCreateCourse(false);
                fetchCourses();
            } else {
                const errorData = await response.json();
                alert(`Error creating course: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error creating course:', error);
            alert('An error occurred while creating the course.');
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            const promises = selectedStudent.map(studentId => 
                fetch('http://localhost:3001/api/add-student-to-course', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        courseId: selectedCourse,
                        studentId: studentId,
                    }),
                })
            );
    
            const responses = await Promise.all(promises);
            const results = await Promise.all(responses.map(r => r.json()));
    
            const allSuccessful = results.every(result => result.message === 'Student added to course successfully!');
    
            if (allSuccessful) {
                alert('All selected students added to course successfully!');
                setSelectedStudent([]);
                fetchCourseStudents(selectedCourse);
            } else {
                const errorMessages = results.filter(result => result.message !== 'Student added to course successfully!')
                                             .map(result => result.message)
                                             .join(', ');
                alert(`Error adding some students: ${errorMessages}`);
            }
        } catch (error) {
            console.error('Error adding students:', error);
            alert('An error occurred while adding the students.');
        }
    };

    const handleAddStudentToTeam = async (e) => {
        e.preventDefault();
        try {
            const promises = selectedStudentsForTeam.map(studentId => 
                fetch('http://localhost:3001/api/add-student-to-team', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        teamId: selectedTeam,
                        studentId: studentId,
                    }),
                })
            );
    
            const responses = await Promise.all(promises);
            const results = await Promise.all(responses.map(r => r.json()));
    
            const allSuccessful = results.every(result => result.message === 'Student added to team successfully!');
    
            if (allSuccessful) {
                alert('All selected students added to team successfully!');
                setSelectedStudentsForTeam([]);
                setSelectedTeam('');
                fetchTeams(selectedCourse);
            } else {
                const errorMessages = results.filter(result => result.message !== 'Student added to team successfully!')
                                             .map(result => result.message)
                                             .join(', ');
                alert(`Error adding some students to team: ${errorMessages}`);
            }
        } catch (error) {
            console.error('Error adding students to team:', error);
            alert('An error occurred while adding the students to the team.');
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/create-team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseId: selectedCourse,
                    teamName,
                    memberIds: selectedTeamMembers,
                }),
            });
    
            if (response.ok) {
                alert('Team created successfully!');
                setTeamName('');
                setSelectedTeamMembers([]);
                fetchTeams(selectedCourse);
            } else {
                const errorData = await response.json();
                alert(`Error creating team: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error creating team:', error);
            alert('An error occurred while creating the team.');
        }
    };

    return (
        <section className="instructor-page">
            <div className="title-container">
                <h2 className="title">Instructor</h2>
            </div>
            <button onClick={() => setShowCreateCourse(!showCreateCourse)}>
                {showCreateCourse ? 'Cancel' : 'Create Course'}
            </button>
            {showCreateCourse && (
                <form onSubmit={handleCreateCourse}>
                    <div>
                        <label htmlFor="courseCode">Course Code:</label>
                        <input
                            type="text"
                            id="courseCode"
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="courseName">Course Name:</label>
                        <input
                            type="text"
                            id="courseName"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Create Course</button>
                </form>
            )}

        <h3>Manage Courses</h3>
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                <option value="">Select a course</option>
                {courses.map(course => (
                    <option key={course._id} value={course._id}>{course.courseCode} - {course.courseName}</option>
                ))}
            </select>

            {selectedCourse && (
                <>

<h4>Add Student to Course</h4>
<form onSubmit={handleAddStudent}>
    <div>
        <label htmlFor="studentsToAdd">Select Students to Add:</label>
        <select
            id="studentsToAdd"
            multiple
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(Array.from(e.target.selectedOptions, option => option.value))}
            required
        >
            {getAvailableStudents().map(student => (
                <option key={student._id} value={student._id}>
                    {student.firstname} {student.lastname} ({student.email})
                </option>
            ))}
        </select>
    </div>
    <button type="submit">Add Students</button>
</form>

                    <h4>Create Team</h4>
<form onSubmit={handleCreateTeam}>
    <div>
        <label htmlFor="teamName">Team Name:</label>
        <input
            type="text"
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
        />
    </div>
    <div>
        <label htmlFor="teamMembers">Select Team Members:</label>
        <select
            id="teamMembers"
            multiple
            value={selectedTeamMembers}
            onChange={(e) => setSelectedTeamMembers(Array.from(e.target.selectedOptions, option => option.value))}
            required
        >
            {courseStudents.map(student => (
                <option key={student._id} value={student._id}>
                    {student.firstname} {student.lastname} ({student.email})
                </option>
            ))}
        </select>
    </div>
    <button type="submit">Create Team</button>
</form>

    
<h4>Add Student to Team</h4>
<form onSubmit={handleAddStudentToTeam}>
    <div>
        <label htmlFor="teamSelect">Select Team:</label>
        <select
            id="teamSelect"
            value={selectedTeam}
            onChange={(e) => {
                setSelectedTeam(e.target.value);
                setSelectedStudentsForTeam([]);
            }}
            required
        >
            <option value="">Select a team</option>
            {teams.map(team => (
                <option key={team._id} value={team._id}>
                    {team.teamName}
                </option>
            ))}
        </select>
    </div>
    {selectedTeam && (
        <div>
            <label htmlFor="studentsForTeam">Select Students:</label>
            <select
                id="studentsForTeam"
                multiple
                value={selectedStudentsForTeam}
                onChange={(e) => setSelectedStudentsForTeam(Array.from(e.target.selectedOptions, option => option.value))}
                required
            >
                {getAvailableStudentsForTeam(selectedTeam).map(student => (
                    <option key={student._id} value={student._id}>
                        {student.firstname} {student.lastname} ({student.email})
                    </option>
                ))}
            </select>
        </div>
    )}
    <button type="submit" disabled={!selectedTeam || selectedStudentsForTeam.length === 0}>
        Add Students to Team
    </button>
</form>

                    <h4>Students in this Course</h4>
                    {courseStudents && courseStudents.length > 0 ? (
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseStudents.map(student => (
                                        <tr key={student._id}>
                                            <td>{student.firstname}</td>
                                            <td>{student.lastname}</td>
                                            <td>{student.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No students in this course.</p>
                    )}
                    <h4>Teams in this Course</h4>
{teams.length > 0 ? (
    teams.map(team => (
        <div key={team._id}>
            <h5>{team.teamName}</h5>
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {team.members.map(member => (
                        <tr key={member._id}>
                            <td>{member.firstname}</td>
                            <td>{member.lastname}</td>
                            <td>{member.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ))
) : (
    <p>No teams in this course.</p>
)}
                </>
            )}
        </section>
    );
};

export default InstructorPage;
