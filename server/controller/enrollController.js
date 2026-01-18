import Enrollment from "../model/enrollModel.js";
import User from "../model/userMlodel.js";
import mongoose from "mongoose";
import Course from "../model/courseCreate.js";

/**
 * Create a new enrollment for a student
 * Initializes lessonsProgress for all course lessons
 */
export const createEnrollment = async (req, res) => {
  try {
    const { studentId, courseId, paymentId, amount } = req.body;

    if (!studentId || !courseId || !paymentId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid studentId or courseId" });
    }

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
    if (existingEnrollment) return res.status(400).json({ message: "Already enrolled in this course" });

    // Get course lessons
    const course = await Course.findById(courseId);
    const lessons = course?.lessons || [];

    // Initialize lessonsProgress for each lesson
    const lessonsProgress = lessons.map((lesson) => {
      // Parse duration to number - remove "min" or other text if present
      let durationValue = 0;
      if (lesson.duration) {
        const parsed = parseInt(lesson.duration);
        durationValue = isNaN(parsed) ? 0 : parsed;
      }
      return {
        lessonId: lesson._id,
        watchedSeconds: 0,
        duration: durationValue, // store total video duration as number
      };
    });

    const newEnrollment = await Enrollment.create({
      studentId,
      courseId,
      paymentId,
      amount,
      status: "completed",
      lessonsProgress,
      progress: 0
    });

    await User.findByIdAndUpdate(studentId, {
      $addToSet: { enrolledCourses: courseId }
    });

    res.status(201).json({ success: true, enrollment: newEnrollment });
  } catch (error) {
    console.error("❌ [createEnrollment] ERROR:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

/**
 * Get all courses a student is enrolled in
 */
export const getStudentCourses = async (req, res) => {
  try {
    const { studentId } = req.params;
    const enrolledCourses = await Enrollment.find({ studentId }).populate("courseId");
    res.status(200).json({ success: true, courses: enrolledCourses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error: error.message });
  }
};

/**
 * Update watched seconds for a lesson
 * Body: { studentId, courseId, lessonId, watchedSeconds }
 */
export const updateLessonProgress = async (req, res) => {
  try {
    const { studentId, courseId, lessonId, watchedSeconds } = req.body;

    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid studentId or courseId" });
    }

    const enrollment = await Enrollment.findOne({ studentId, courseId });
    if (!enrollment) return res.status(404).json({ success: false, message: "Enrollment not found" });

    // Find the lesson in lessonsProgress
    const lessonIndex = enrollment.lessonsProgress.findIndex(l => l.lessonId.toString() === lessonId);
    if (lessonIndex === -1) return res.status(404).json({ success: false, message: "Lesson not found in enrollment" });

    // Update watchedSeconds safely
    enrollment.lessonsProgress[lessonIndex].watchedSeconds = Math.min(
      watchedSeconds,
      enrollment.lessonsProgress[lessonIndex].duration
    );

    // Recalculate overall course progress
    const totalLessons = enrollment.lessonsProgress.length;
    const totalPercentage = enrollment.lessonsProgress.reduce((sum, l) => {
      if (l.duration > 0) return sum + (l.watchedSeconds / l.duration) * 100;
      return sum;
    }, 0);

    enrollment.progress = totalLessons === 0 ? 0 : Math.round(totalPercentage / totalLessons);

    await enrollment.save();

    res.status(200).json({
      success: true,
      progress: enrollment.progress,
      lessonsProgress: enrollment.lessonsProgress
    });
  } catch (error) {
    console.error("❌ [updateLessonProgress] Error:", error);
    res.status(500).json({ success: false, message: "Error updating lesson progress", error: error.message });
  }
};

/**
 * Get course progress for a student
 */
export const getCourseProgress = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid studentId or courseId", progress: 0, lessonsProgress: [] });
    }

    const enrollment = await Enrollment.findOne({ studentId, courseId });
    if (!enrollment) {
      return res.status(200).json({ success: true, progress: 0, lessonsProgress: [], completedLessons: [] });
    }

    res.status(200).json({
      success: true,
      progress: enrollment.progress || 0,
      lessonsProgress: enrollment.lessonsProgress || [],
      completedLessons: enrollment.lessonsProgress?.filter(l => l.watchedSeconds >= l.duration) || []
    });
  } catch (error) {
    console.error("❌ [getCourseProgress] Error:", error);
    res.status(500).json({ success: false, message: "Error fetching course progress", error: error.message });
  }
};
