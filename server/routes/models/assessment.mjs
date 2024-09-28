import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
    evaluator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // The student who is giving the evaluation
    evaluatee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // The student being evaluated
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },    // Reference to the course
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },        // Reference to the team
    cooperation: { type: Number, min: 1, max: 7, required: true },
    conceptualContribution: { type: Number, min: 1, max: 7, required: true },
    practicalContribution: { type: Number, min: 1, max: 7, required: true },
    workEthic: { type: Number, min: 1, max: 7, required: true },
    comments: { type: String },                                          // Optional comment feedback
    createdAt: { type: Date, default: Date.now },
});


const assessmentModel = mongoose.model('assessment', assessmentSchema, 'assessments');

// Use default export
export default assessmentModel;
