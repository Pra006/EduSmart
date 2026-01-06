import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;  
