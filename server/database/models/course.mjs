import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    courseCode: { type: String, required: true, unique: true },
    courseName: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
});

const courseModel = mongoose.model('Course', courseSchema, 'courses');

export default courseModel;
