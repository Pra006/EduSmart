import Enrollment from '../model/enrollModel.js';

export const createEnrollment = async (req, res) => {
  try {
    const { studentId, courseId, paymentId } = req.body;

    const existing = await Enrollment.findOne({ studentId, courseId });
    if (existing) {
      return res.status(400).json({ message: 'Student already enrolled' });
    }

    const newEnrollment = new Enrollment({
      studentId,
      courseId,
      paymentId,
    });

    await newEnrollment.save();

    res.status(201).json({
      success: true,
      message: 'Enrolled successfully!',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentCourses = async (req, res) => {
  try {
    const { studentId } = req.params;

    const enrollments = await Enrollment.find({ studentId })
      .populate('courseId');

    const courses = enrollments
      .map(enroll => enroll.courseId)
      .filter(course => course !== null);

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
