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



}
    

    
;



export default InstructorPage;



