import dotenv from "dotenv"
import mongoose from "mongoose"
import readline from "readline-sync"
import bcrypt from "bcryptjs"
import userModel from "./models/user.mjs"
import courseModel from './models/course.mjs';
import teamModel from './models/team.mjs';
import assessmentModel from './models/assessment.mjs';
import messageModel from './models/message.mjs';
import commentModel from "./models/comment.mjs"


// require('dotenv').config();
// const mongoose = require('mongoose');
// const readline = require('readline-sync');
// const bcrypt = require('bcryptjs');

dotenv.config()
let dbName = "test"
let instance

class Database {
    constructor() {
        if (!instance) {
            instance = this
            this.url = process.env.MONGODB_URI
            this.UserModel = userModel
        }
        return instance
    }


    async connect() {
        try {
            mongoose.set('strictQuery', false)
            const options = {
                dbName: dbName
            }
            await mongoose.connect(instance.url, options)
        } catch (e) {
            throw 'Error trying to connect: ' + e
        }
    }

    async close() {
        mongoose.connection.close()
    }

    async getTeammate(teammateId) {
        try {
            const teammate = await userModel.findById(teammateId, 'firstname lastname email');
            return { result: "success", data: { teammate } };
        } catch (e) {
            console.error('Error fetching teammate:', e);
            return { result: "error", message: e.message };
        }
    }
    
    async submitAssessment(evaluatorId, evaluateeId, assessment) {
        try {
            if (evaluatorId.toString() === evaluateeId.toString()) {
                return { 
                    result: "error", 
                    message: "Self-assessment is not allowed" 
                };
            }

            const newAssessment = await assessmentModel.create({
                evaluator: evaluatorId,
                evaluatee: evaluateeId,
                ...assessment
            });
            return { result: "success", assessment: newAssessment };
        } catch (e) {
            console.error('Error submitting assessment:', e);
            return { result: "error", message: e.message };
        }
    }

    async getTeammate(teammateId) {
        try {
            const teammate = await userModel.findById(teammateId, 'firstname lastname email');
            return { result: "success", data: { teammate } };
        } catch (e) {
            console.error('Error fetching teammate:', e);
            return { result: "error", message: e.message };
        }
    }

    async createUser(email, firstname, lastname, password, usertype) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new this.UserModel({
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: hashedPassword,
            usertype: usertype.toLowerCase()
        })

        try {
            user.save()
        } catch (e) {
            throw 'Error trying to save ' + e
        }
    }

    async getStudentTeammates(studentId) {
        try {
            const teams = await teamModel.find({ members: studentId })
                .populate('members', 'firstname lastname email');
            const teammates = teams.flatMap(team => team.members.filter(member => member._id.toString() !== studentId));
            return { result: "success", data: { teammates } };
        } catch (e) {
            console.error('Error fetching student teammates:', e);
            return { result: "error", message: e.message };
        }
    }
    
    async submitAssessments(evaluatorId, assessments) {
        try {
            const assessmentPromises = Object.entries(assessments).map(([evaluateeId, assessment]) => {
                return assessmentModel.create({
                    evaluator: evaluatorId,
                    evaluatee: evaluateeId,
                    ...assessment
                });
            });
            await Promise.all(assessmentPromises);
            return { result: "success" };
        } catch (e) {
            console.error('Error submitting assessments:', e);
            return { result: "error", message: e.message };
        }
    }

    async getUser(email, password) {
        try {
            let user = await this.UserModel.findOne({ email: email })

            if (!user) {
                return { result: "error", user: null }
            }

            const match = await bcrypt.compare(password, user.password)

            if (match) {
                return { result: "success", user: user }
            } else {
                return { result: "fail", user: null }
            }
        } catch (e) {
            return { result: "error", user: null }
        }
    }

    async getAllStudents() {
        try {
            const students = await this.UserModel.find({ usertype: 'student' }, '-password');
            return { result: "success", students: students };
        } catch (e) {
            console.error('Error fetching students:', e);
            return { result: "error", message: e.message };
        }
    }
    async authenticateStudent(email, password) {
        try {
            const student = await userModel.findOne({ email, role: 'student' });
            if (student && await bcrypt.compare(password, student.password)) {
                return { result: "success", student: { _id: student._id, email: student.email } };
            } else {
                return { result: "error", message: "Invalid credentials" };
            }
        } catch (e) {
            console.error('Error authenticating student:', e);
            return { result: "error", message: e.message };
        }
    }
    
    async getStudentData(studentId) {
        try {
            const courses = await courseModel.find({ students: studentId });
            const teams = await teamModel.find({ members: studentId })
                .populate('course', 'courseCode')
                .populate('members', 'firstname lastname email');
            return { result: "success", data: { courses, teams } };
        } catch (e) {
            console.error('Error fetching student data:', e);
            return { result: "error", message: e.message };
        }
    }
    
    async createCourse(courseCode, courseName, instructorId) {
        const course = new courseModel({
            courseCode,
            courseName,
            instructor: instructorId,
        });
    
        try {
            await course.save();
            return { result: "success", course };
        } catch (e) {
            console.error('Error creating course:', e);
            return { result: "error", message: e.message };
        }
    }

    async addStudentToCourse(courseId, studentId) {
        try {
            const course = await courseModel.findByIdAndUpdate(
                courseId,
                { $addToSet: { students: studentId } },
                { new: true }
            );
            return { result: "success", course };
        } catch (e) {
            console.error('Error adding student to course:', e);
            return { result: "error", message: e.message };
        }
    }
    
    async createTeamForCourse(courseId, teamName, memberIds) {
        try {
            const team = new teamModel({
                teamName,
                course: courseId,
                members: memberIds
            });
            await team.save();
    
            const course = await courseModel.findByIdAndUpdate(
                courseId,
                { $push: { teams: team._id } },
                { new: true }
            );
    
            return { result: "success", team, course };
        } catch (e) {
            console.error('Error creating team for course:', e);
            return { result: "error", message: e.message };
        }
    }

    async getAllCourses(instructorId) {
        try {
            // Validate instructorId
            if (!instructorId || instructorId === 'null' || instructorId === 'undefined') {
                return { 
                    result: "error", 
                    message: "Invalid instructor ID" 
                };
            }

            const courses = await courseModel.find({ instructor: instructorId })
                .populate('instructor', 'firstname lastname email');
            return { result: "success", courses };
        } catch (e) {
            console.error('Error fetching courses:', e);
            return { result: "error", message: e.message };
        }
    }

    async addStudentToCourse(courseId, studentId) {
        try {
            const course = await courseModel.findByIdAndUpdate(
                courseId,
                { $addToSet: { students: studentId } },
                { new: true }
            );
            return { result: "success", course };
        } catch (e) {
            console.error('Error adding student to course:', e);
            return { result: "error", message: e.message };
        }
    }
    
    async addStudentToTeam(teamId, studentId) {
        try {
            const team = await teamModel.findByIdAndUpdate(
                teamId,
                { $addToSet: { members: studentId } },
                { new: true }
            );
            return { result: "success", team };
        } catch (e) {
            console.error('Error adding student to team:', e);
            return { result: "error", message: e.message };
        }
    }

    async getTeamsForCourse(courseId) {
        try {
            const teams = await teamModel.find({ course: courseId })
                .populate('members', 'firstname lastname email')
                .populate('course', 'courseCode courseName');
            return { result: "success", teams };
        } catch (e) {
            console.error('Error fetching teams for course:', e);
            return { result: "error", message: e.message };
        }
    }

    async getChatMessages(courseId) {
        try {
            const messages = await messageModel.find({
                $or: [
                    // Course-specific messages (public or team)
                    {
                        courseId,
                        recipientId: null // public messages for the course
                    },
                    {
                        courseId,
                        teamId: { $exists: true, $ne: null } // team messages for the course
                    },
                    // Direct messages (regardless of course)
                    {
                        recipientId: { $exists: true, $ne: null }, // private messages
                        teamId: null // not team messages
                    }
                ]
            })
            .populate('senderId', 'firstname lastname')
            .populate('teamId', 'teamName')
            .sort({ timestamp: 1 });
            
            return messages.map(msg => ({
                _id: msg._id,
                senderId: msg.senderId._id,
                senderName: msg.senderId ? `${msg.senderId.firstname} ${msg.senderId.lastname}` : 'Unknown',
                senderType: msg.senderType,
                message: msg.message,
                timestamp: msg.timestamp,
                recipientId: msg.recipientId,
                teamId: msg.teamId?._id,
                teamName: msg.teamId?.teamName,
                courseId: msg.courseId
            }));
        } catch (e) {
            console.error('Error getting chat messages:', e);
            throw e;
        }
    }

    async getChatRecipients(courseId) {
        try {
            const course = await courseModel.findById(courseId)
                .populate('instructor', 'firstname lastname email usertype')
                .populate('students', 'firstname lastname email usertype');
            
            if (!course) {
                throw new Error('Course not found');
            }

            const recipients = [];
            if (course.instructor) {
                recipients.push(course.instructor);
            }
            if (course.students) {
                recipients.push(...course.students);
            }

            return recipients;
        } catch (e) {
            console.error('Error getting chat recipients:', e);
            throw e;
        }
    }

    async saveChatMessage(courseId, senderId, recipientId, message, senderType, teamId) {
        try {
            const newMessage = new messageModel({
                courseId: recipientId ? null : courseId, // Only set courseId for public/team messages
                senderId,
                recipientId,
                message,
                senderType,
                teamId,
                timestamp: new Date()
            });

            await newMessage.save();
            return { result: "success", message: newMessage };
        } catch (e) {
            console.error('Error saving chat message:', e);
            return { result: "error", message: e.message };
        }
    }

    async getTeamsForStudent(studentId) {
        try {
            const teams = await teamModel.find({ 
                members: studentId 
            })
            .populate('members', 'firstname lastname email _id')
            .populate('course', 'courseCode courseName _id');
            
            console.log('Teams from database:', teams); // Debug log
            return teams;
        } catch (e) {
            console.error('Error fetching teams for student:', e);
            throw e;
        }
    }

    async retrieveComments(instructorId, assessmentID) {
        try {
            const comments = await commentModel.find({
                teacher: instructorId,
                assessment: assessmentID
            })

            if (!comments || comments.length === 0) {
                return {status: "success", comments: []}
            }
            
            return {status: "success", comments: comments}
        } catch (e) {
            console.error('Error fetching comments for teacher:', e)
            return {status: "error", comments: []}
        }
    }

    async createComment(instructorId, assessmentID, body) {
        try {
            await commentModel.create({
                teacher: instructorId,
                assessment: assessmentID,
                body: body
            })

            const allComments = await commentModel.find({
                teacher: instructorId,
                assessment: assessmentID
            })

            return { status: "success", comments: allComments}
        } catch (e) {
            console.error('Error creating comments for teacher:', e);
            return { status: "error", comments: []}
        }
    }

    async deleteCommentById(commentId, instructorId, assessmentID) {
        try {
            const deletedComment = await commentModel.findByIdAndDelete(commentId);

            const allComments = await commentModel.find({
                teacher: instructorId,
                assessment: assessmentID
            })
    
            if (!deletedComment) {
                return { status: "error", comments: []}
            }
    
            return { status: "success", comments: allComments}
        } catch (e) {
            console.error('Error deleting comment:', e);
            return { status: "error", comments: []}
        }
    }

}

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => {
//         console.log('MongoDB Connected');
//         // Start your application logic
//         mainMenu();
//     })
//     .catch(err => console.error('MongoDB Connection Error:', err));


// // Main menu function
// function mainMenu() {
//     console.log('\n--- Peer Assessment System ---\n');
//     console.log('1. Add User');
//     console.log('2. Exit');

//     const choice = readline.question('\nEnter your choice: ');

//     switch (choice) {
//         case '1':
//             addUser();
//             break;
//         case '2':
//             console.log('Exiting...');
//             mongoose.disconnect();
//             process.exit(0);
//         default:
//             console.log('Invalid choice, please try again.');
//             mainMenu();
//     }
// }

// // Function to add a user
// async function addUser() {
//     try {
//         const email = readline.question('Enter email: ');
//         const firstname = readline.question('Enter first name: ');
//         const lastname = readline.question('Enter last name: ');
//         const password = readline.question('Enter password: ', { hideEchoBack: true });
//         const usertype = readline.question('Enter user type (student/instructor): ');

//         // Basic input validation
//         if (!email || !firstname || !lastname || !password || !usertype) {
//             console.log('All fields are required.');
//             return mainMenu();
//         }

//         if (!['student', 'instructor'].includes(usertype.toLowerCase())) {
//             console.log('Invalid user type. Must be "student" or "instructor".');
//             return mainMenu();
//         }

//         // Check if the user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             console.log('Email already in use.');
//             return mainMenu();
//         }

//         // Hash the password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create a new user instance
//         const newUser = new User({
//             email,
//             firstname,
//             lastname,
//             password: hashedPassword,
//             usertype: usertype.toLowerCase(),
//         });

//         // Save the user to the database
//         await newUser.save();
//         console.log('User added successfully!');
//     } catch (err) {
//         console.error('Error adding user:', err.message);
//     } finally {
//         // Return to the main menu
//         mainMenu();
//     }
// }

export default Database


