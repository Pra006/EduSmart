import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    title: String,
    message: String,
    type: {
        type: String,
        enum: ['COURSE_CREATED'],
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    receiverRole:{
        type: String,
        enum: ["STUDENT", "ADMIN"]
    },
    isRead: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

export const notificationModel = mongoose.model('Notification', notificationSchema);