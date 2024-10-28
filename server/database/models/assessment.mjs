import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
    evaluator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    evaluatee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    cooperation: { type: Number, min: 1, max: 7, required: true },
    conceptualContribution: { type: Number, min: 1, max: 7, required: true },
    practicalContribution: { type: Number, min: 1, max: 7, required: true },
    workEthic: { type: Number, min: 1, max: 7, required: true },
    comments: { type: String },
    createdAt: { type: Date, default: Date.now },
});


const assessmentModel = mongoose.model('assessment', assessmentSchema, 'assessments');

// Use default export
export default assessmentModel;
