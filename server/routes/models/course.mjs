import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    courseCode: { type: String, required: true, unique: true },
    courseName: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // References the instructor
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // List of students in the course
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]      // List of teams in the course
});


const teamModel = mongoose.model('team', teamSchema, 'teams');

// Use default export
export default teamModel;
