import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
    teamName: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});


const teamModel = mongoose.model('team', TeamSchema, 'teams');

// Use default export
export default teamModel;
