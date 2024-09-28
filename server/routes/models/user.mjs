import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    usertype: {
        type: String,
        enum: ['student', 'instructor'],
        default: 'student',
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course' }],
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    }],
});

const userModel = mongoose.model('user', UserSchema, 'users');

// Use default export
export default userModel;
