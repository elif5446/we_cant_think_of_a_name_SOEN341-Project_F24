import express from 'express';
import Database from '../database/database.mjs'
import courseModel from '../database/models/course.mjs'
import teamModel from '../database/models/team.mjs'
import userModel from '../database/models/user.mjs';
import assessmentModel from '../database/models/assessment.mjs';


const router = express.Router()
const database = new Database()
const success = 200
const clientError = 400
const noAuthAccess = 401
const serverError = 500





router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await database.getUser(email, password)
        if (result.result === "success") {
            return res.status(success).json({ message: "Login Successful!", user: result.user});
        } else if (result.result === "fail") {
            return res.status(noAuthAccess).json({ message: "Invalid Credentials" });
        } else {
            return res.status(clientError).json({ message: "User Not Found" });
        }
    } catch (e) {
        res.send(e).status(serverError)
    }

});

// router.get('/user', (req, res) => {
//     try {
//         const user = {
//             name: "Test User",
//             email: "test@example.com",
//         };

//         return res.status(200).json(user);
//     } catch (e) {
//         res.send(e).status(serverError)
//     }

// });

router.get('/teammate/:teammateId', async (req, res) => {
    try {
        const { teammateId } = req.params;
        const result = await database.getTeammate(teammateId);
        if (result.result === "success") {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({ message: "Teammate not found" });
        }
    } catch (e) {
        console.error('Error fetching teammate:', e);
        res.status(500).json({ message: "Internal server error" });
    }
});



router.post('/submit-assessment', async (req, res) => {
    try {
        const { evaluatorId, evaluateeId, assessment } = req.body;
        const result = await database.submitAssessment(evaluatorId, evaluateeId, assessment);
        if (result.result === "success") {
            res.status(200).json({ message: "Assessment submitted successfully" });
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (e) {
        console.error('Error submitting assessment:', e);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/create-account', async (req, res) => {
    try{
        const { email, password, firstName, lastName, userType } = req.body;

        await database.createUser(email, firstName, lastName, password, userType)
        return res.status(success).json({ message: "Login successful!" });
        // return res.status(401).json({ message: "Invalid credentials" });
    }catch(e){
        res.send(e).status(serverError)
    }
    
});

router.post('/create-course', async (req, res) => {
    console.log('Received request to create course:', req.body);
    try {
        const { courseCode, courseName } = req.body;

        if (!courseCode || !courseName) {
            return res.status(400).json({ message: 'Course code and name are required' });
        }

        const result = await database.createCourse(courseCode, courseName);
        if (result.result === "success") {
            return res.status(201).json({ message: "Course created successfully!", course: result.course });
        } else {
            return res.status(400).json({ message: result.message });
        }
    } catch (e) {
        console.error('Error creating course:', e);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/add-student-to-course', async (req, res) => {
    try {
        const { courseId, studentId } = req.body;
        const result = await database.addStudentToCourse(courseId, studentId);
        if (result.result === "success") {
            return res.status(200).json({ message: "Student added to course successfully!", course: result.course });
        } else {
            return res.status(400).json({ message: result.message });
        }
    } catch (e) {
        console.error('Error adding student to course:', e);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/create-team', async (req, res) => {
    try {
        const { courseId, teamName, memberIds } = req.body;
        const result = await database.createTeamForCourse(courseId, teamName, memberIds);
        if (result.result === "success") {
            return res.status(201).json({ message: "Team created successfully!", team: result.team, course: result.course });
        } else {
            return res.status(400).json({ message: result.message });
        }
    } catch (e) {
        console.error('Error creating team:', e);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/courses', async (req, res) => {
    try {
        const courses = await courseModel.find({});
        res.status(success).json({ courses });
    } catch (e) {
        console.error('Error fetching courses:', e);
        res.status(serverError).json({ message: "Internal server error" });
    }
});

router.get('/students', async (req, res) => {
    try {
        const result = await database.getAllStudents();
        if (result.result === "success") {
            res.status(success).json({ students: result.students });
        } else {
            res.status(serverError).json({ message: result.message });
        }
    } catch (e) {
        console.error('Error fetching students:', e);
        res.status(serverError).json({ message: "Internal server error" });
    }
});

router.get('/teams/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;
        const result = await database.getTeamsForCourse(courseId);
        if (result.result === "success") {
            return res.status(200).json({ teams: result.teams });
        } else {
            return res.status(400).json({ message: result.message });
        }
    } catch (e) {
        console.error('Error fetching teams:', e);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/student-login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await database.authenticateStudent(email, password);
        if (result.result === "success") {
            res.status(200).json({ 
                message: "Login successful", 
                user: {
                    _id: result.student._id,
                    usertype: "student"
                }
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (e) {
        console.error('Error during student login:', e);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/student-teammates/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const result = await database.getStudentTeammates(studentId);
        if (result.result === "success") {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({ message: "Teammates not found" });
        }
    } catch (e) {
        console.error('Error fetching student teammates:', e);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/submit-assessment', async (req, res) => {
    try {
        const { evaluatorId, assessments } = req.body;
        const result = await database.submitAssessments(evaluatorId, assessments);
        if (result.result === "success") {
            res.status(200).json({ message: "Assessments submitted successfully" });
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (e) {
        console.error('Error submitting assessments:', e);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/student-data/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const result = await database.getStudentData(studentId);
        if (result.result === "success") {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({ message: "Student not found" });
        }
    } catch (e) {
        console.error('Error fetching student data:', e);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/course-students/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await courseModel.findById(courseId).populate({
            path: 'students',
            model: userModel
        });
        if (course) {
            res.status(success).json({ students: course.students });
        } else {
            res.status(clientError).json({ message: "Course not found" });
        }
    } catch (e) {
        console.error('Error fetching course students:', e);
        res.status(serverError).json({ message: "Internal server error" });
    }
});

router.post('/add-student-to-team', async (req, res) => {
    try {
        const { teamId, studentId } = req.body;
        const result = await database.addStudentToTeam(teamId, studentId);
        if (result.result === "success") {
            return res.status(success).json({ message: "Student added to team successfully!", team: result.team });
        } else {
            return res.status(clientError).json({ message: result.message });
        }
    } catch (e) {
        console.error('Error adding student to team:', e);
        res.status(serverError).json({ message: "Internal server error" });
    }
});

export default router;
