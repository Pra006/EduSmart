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
  amount: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed'],
    default: 'completed',
  },

  // Remove completedLessons; use lessonsProgress instead
  lessonsProgress: [
    {
      lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true,
      },
      watchedSeconds: {
        type: Number,
        default: 0,
      },
      duration: {
        type: Number,
        default: 0, // store total video duration
      },
    }
  ],

  progress: {
    type: Number,
    default: 0, // will calculate based on lessonsProgress
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
