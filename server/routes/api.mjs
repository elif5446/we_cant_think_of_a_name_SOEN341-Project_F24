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
        const { courseCode, courseName, instructorId } = req.body;

        if (!courseCode || !courseName || !instructorId) {
            return res.status(400).json({ message: 'Course code, name, and instructor ID are required' });
        }

        const result = await database.createCourse(courseCode, courseName, instructorId);
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

router.get('/instructor/assessment-summary', async (req, res) => {
    try {
        // First fetch courses without population
        const courses = await courseModel.find();
        const summaryData = [];

        for (const course of courses) {
            const courseData = [];
            
            // Get students for this course
            const students = await userModel.find({ 
                _id: { $in: course.students }
            }, 'firstname lastname email');

            for (const student of students) {
                // Get all assessments where this student was evaluated
                const assessments = await assessmentModel.find({ evaluatee: student._id })
                    .populate('evaluator', 'firstname lastname email');

                if (assessments.length > 0) {
                    // Calculate averages
                    const cooperationAvg = assessments.reduce((sum, a) => sum + a.cooperation.score, 0) / assessments.length;
                    const conceptualAvg = assessments.reduce((sum, a) => sum + a.conceptualContribution.score, 0) / assessments.length;
                    const practicalAvg = assessments.reduce((sum, a) => sum + a.practicalContribution.score, 0) / assessments.length;
                    const workEthicAvg = assessments.reduce((sum, a) => sum + a.workEthic.score, 0) / assessments.length;
                    const overallAvg = (cooperationAvg + conceptualAvg + practicalAvg + workEthicAvg) / 4;

                    // Get student's team
                    const team = await teamModel.findOne({ 
                        course: course._id, 
                        members: student._id 
                    });

                    // Get evaluator names
                    const evaluators = assessments.map(a => ({
                        firstname: a.evaluator.firstname,
                        lastname: a.evaluator.lastname,
                        email: a.evaluator.email
                    }));

                    courseData.push({
                        studentId: student._id,
                        email: student.email,
                        firstname: student.firstname,
                        lastname: student.lastname,
                        team: team ? team.teamName : 'No Team',
                        cooperationAvg: cooperationAvg.toFixed(2),
                        conceptualAvg: conceptualAvg.toFixed(2),
                        practicalAvg: practicalAvg.toFixed(2),
                        workEthicAvg: workEthicAvg.toFixed(2),
                        overallAvg: overallAvg.toFixed(2),
                        evaluators: evaluators
                    });
                }
            }

            if (courseData.length > 0) {
                summaryData.push({
                    courseId: course._id,
                    courseCode: course.courseCode,
                    courseName: course.courseName,
                    students: courseData
                });
            }
        }

        res.json({ result: "success", data: summaryData });
    } catch (error) {
        console.error('Error fetching assessment summary:', error);
        res.status(500).json({ result: "error", message: error.message });
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

router.get('/instructor/detailed-assessment', async (req, res) => {
    try {
        const teams = await teamModel.find()
            .populate('course', 'courseCode courseName')
            .populate('members', 'firstname lastname');

        const detailedData = await Promise.all(teams.map(async (team) => {
            const membersData = await Promise.all(team.members.map(async (member) => {
                const assessments = await assessmentModel.find({ evaluatee: member._id });
                
                if (assessments.length === 0) {
                    return {
                        studentId: member._id,
                        firstname: member.firstname,
                        lastname: member.lastname,
                        cooperationAvg: 'N/A',
                        conceptualAvg: 'N/A',
                        practicalAvg: 'N/A',
                        workEthicAvg: 'N/A',
                        overallAvg: 'N/A',
                        assessments: []
                    };
                }

                const cooperationAvg = assessments.reduce((sum, a) => sum + a.cooperation.score, 0) / assessments.length;
                const conceptualAvg = assessments.reduce((sum, a) => sum + a.conceptualContribution.score, 0) / assessments.length;
                const practicalAvg = assessments.reduce((sum, a) => sum + a.practicalContribution.score, 0) / assessments.length;
                const workEthicAvg = assessments.reduce((sum, a) => sum + a.workEthic.score, 0) / assessments.length;
                const overallAvg = (cooperationAvg + conceptualAvg + practicalAvg + workEthicAvg) / 4;

                const formattedAssessments = assessments.map(assessment => ({
                    cooperation: {
                        score: assessment.cooperation.score,
                        comments: assessment.cooperation.comments
                    },
                    conceptual: {
                        score: assessment.conceptualContribution.score,
                        comments: assessment.conceptualContribution.comments
                    },
                    practical: {
                        score: assessment.practicalContribution.score,
                        comments: assessment.practicalContribution.comments
                    },
                    workEthic: {
                        score: assessment.workEthic.score,
                        comments: assessment.workEthic.comments
                    }
                }));

                return {
                    studentId: member._id,
                    firstname: member.firstname,
                    lastname: member.lastname,
                    cooperationAvg: cooperationAvg.toFixed(2),
                    conceptualAvg: conceptualAvg.toFixed(2),
                    practicalAvg: practicalAvg.toFixed(2),
                    workEthicAvg: workEthicAvg.toFixed(2),
                    overallAvg: overallAvg.toFixed(2),
                    assessments: formattedAssessments
                };
            }));

            return {
                _id: team._id,
                teamName: team.teamName,
                course: team.course,
                members: membersData
            };
        }));

        res.json({ result: "success", data: detailedData });
    } catch (error) {
        console.error('Error fetching detailed assessment:', error);
        res.status(500).json({ result: "error", message: error.message });
    }
});

// Update the chat routes with better error handling
router.get('/chat/messages/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;
        const messages = await database.getChatMessages(courseId);
        res.json({ messages });
    } catch (error) {
        console.error('Error in /chat/messages:', error);
        res.status(500).json({ 
            message: "Error fetching messages",
            error: error.message 
        });
    }
});

router.get('/chat/recipients/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;
        const recipients = await database.getChatRecipients(courseId);
        res.json({ recipients });
    } catch (error) {
        console.error('Error in /chat/recipients:', error);
        res.status(500).json({ 
            message: "Error fetching recipients",
            error: error.message 
        });
    }
});

router.post('/chat/send', async (req, res) => {
    try {
        const { courseId, senderId, recipientId, message, senderType, teamId } = req.body;
        
        if (!courseId || !senderId || !message || !senderType) {
            return res.status(400).json({ 
                message: "Missing required fields" 
            });
        }

        const result = await database.saveChatMessage(
            courseId, 
            senderId, 
            recipientId, 
            message, 
            senderType,
            teamId
        );
        
        if (result.result === "success") {
            res.json({ message: "Message sent successfully" });
        } else {
            res.status(500).json({ message: "Failed to send message" });
        }
    } catch (error) {
        console.error('Error in /chat/send:', error);
        res.status(500).json({ 
            message: "Error sending message",
            error: error.message 
        });
    }
});

router.get('/courses/:instructorId', async (req, res) => {
    try {
        const { instructorId } = req.params;
        
        if (!instructorId || instructorId === 'null' || instructorId === 'undefined') {
            return res.status(400).json({ 
                message: "Invalid instructor ID provided" 
            });
        }

        const result = await database.getAllCourses(instructorId);
        if (result.result === "success") {
            res.json({ courses: result.courses });
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (e) {
        console.error('Error fetching courses:', e);
        res.status(500).json({ 
            message: "Internal server error",
            error: e.message 
        });
    }
});

router.get('/student/teams/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const teams = await database.getTeamsForStudent(studentId);
        res.json({ teams });
    } catch (error) {
        console.error('Error fetching student teams:', error);
        res.status(500).json({ 
            message: "Error fetching teams",
            error: error.message 
        });
    }
});

router.get('/course/teams/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;
        const result = await database.getTeamsForCourse(courseId);
        if (result.result === "success") {
            res.json(result);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error fetching course teams:', error);
        res.status(500).json({ 
            message: "Error fetching teams",
            error: error.message 
        });
    }
});

router.get('/comments/', async (req, res) => {
    try{
        const instructorId = req.query.instructor_id
        const assessmentID = req.query.assessment_id
        const commentObj = database.retrieveComments(instructorId, assessmentID)

        if (commentObj.status === "error") {
            res.status(serverError).json({ 
                message: "Error fetching comments",
                error: error.message 
            })
        } else {
            res.status(success).json({
                comments: commentObj.comments
            })
        }
    } catch(e) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ 
            message: "Error fetching comments",
            error: error.message 
        })
    }
})

router.post('/comments/delete', async (req, res) => {
    try{
        const commentId = req.body.comment_id
        const instructorId = req.body.instructor_id
        const assessmentID = req.body.assessment_id
        const commentObj = database.deleteCommentById(commentId, instructorId, assessmentID)

        if (commentObj.status === "error") {
            res.status(serverError).json({ 
                message: "Error fetching comments",
                error: error.message 
            })
        } else {
            res.status(success).json({
                comments: commentObj.comments
            })
        }
    } catch(e) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ 
            message: "Error fetching comments",
            error: error.message 
        })
    }
})

router.post('/comments/create', async (req, res) => {

})


export default router;
