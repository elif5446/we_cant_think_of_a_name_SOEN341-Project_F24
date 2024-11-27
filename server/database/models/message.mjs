import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    courseId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course', 
        required: function() {
            // Only required if it's not a direct message
            return !this.recipientId;
        }
    },
    senderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    recipientId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    message: { 
        type: String, 
        required: true 
    },
    senderType: { 
        type: String, 
        enum: ['student', 'instructor'], 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

const messageModel = mongoose.model('Message', messageSchema, 'messages');

export default messageModel; 