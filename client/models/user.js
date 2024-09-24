const mongoose = require('mongoose');

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
});

module.exports = mongoose.model('User', UserSchema);
