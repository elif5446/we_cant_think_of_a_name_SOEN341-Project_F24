import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    teamName: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const teamModel = mongoose.model('Team', teamSchema, 'teams');

export default teamModel;
