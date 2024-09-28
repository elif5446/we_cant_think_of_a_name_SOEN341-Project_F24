import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
    teamName: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },    // References the course this team belongs to
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],   // List of students in the team
});


const teamModel = mongoose.model('team', TeamSchema, 'teams');

// Use default export
export default teamModel;
