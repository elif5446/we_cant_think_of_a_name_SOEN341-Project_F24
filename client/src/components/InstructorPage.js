import React, {useState, useEffect} from 'react';
import '../styles/InstructorPage.css';


const InstructorPage = () => {
    const [showCreateCourse, setShowCreateCourse] = useState(false);
    const [courseCode, setCourseCode] = useState('');
    const [courseName, setCourseName] = useState('');
    const [courses, setCourses] = useState([]);
    

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
    


}
    

    
;



export default InstructorPage;



