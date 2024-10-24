import React, {useState, useEffect} from 'react';
import '../styles/InstructorPage.css';


const InstructorPage = () => {
    const [showCreateCourse, setShowCreateCourse] = useState(false);
    const [courseCode, setCourseCode] = useState('');
    const [courseName, setCourseName] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [studentEmail, setStudentEmail] = useState('');


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



}
    

    
;



export default InstructorPage;



