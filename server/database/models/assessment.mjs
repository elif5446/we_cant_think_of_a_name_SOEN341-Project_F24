import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
    evaluator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    evaluatee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    cooperation: { 
        score: { type: Number, min: 1, max: 7, required: true },
        comments: { type: String }
    },
    conceptualContribution: { 
        score: { type: Number, min: 1, max: 7, required: true },
        comments: { type: String }
    },
    practicalContribution: { 
        score: { type: Number, min: 1, max: 7, required: true },
        comments: { type: String }
    },
    workEthic: { 
        score: { type: Number, min: 1, max: 7, required: true },
        comments: { type: String }
    },
    comments: { type: String },
    createdAt: { type: Date, default: Date.now },
});


const assessmentModel = mongoose.model('assessment', assessmentSchema, 'assessments');

// Use default export
export default assessmentModel;
