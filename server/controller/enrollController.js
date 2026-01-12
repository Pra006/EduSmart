import Enrollment from "../model/enrollModel.js";
import User  from "../model/userMlodel.js";

export const createEnrollment = async (req, res) => {
    try {
        const { studentId, courseId, paymentId, amount } = req.body;
        const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
        if (existingEnrollment) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }
        const newEnrollment = await Enrollment.create({
            studentId,
            courseId,
            paymentId,
            amount
        });
        await User.findByIdAndUpdate(studentId, {
            $push: { enrolledCourses: courseId }
        });

        res.status(201).json({ success: true, enrollment: newEnrollment });
    } catch (error) {
        console.error("Enrollment Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getStudentCourses = async (req, res)=> {
  try{
    const {studentId}= req.params;
    const enrolledCourses = await Enrollment.find({studentId})
    .populate('courseId');
    res.status(200).json({
      success: true,
      courses: enrolled
    });
  } catch(error){
    res.status(500).json({message: "Error fetching courses"})
  }
}