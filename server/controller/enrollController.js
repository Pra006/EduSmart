import Enrollment from "../model/enrollModel.js";
import User  from "../model/userMlodel.js";
import mongoose from "mongoose";

export const createEnrollment = async (req, res) => {
    try {
        const { studentId, courseId, paymentId, amount } = req.body;
        
        console.log("Received enrollment request:", { studentId, courseId, paymentId, amount });
        
        // Validate that all required fields exist
        if (!studentId) {
            console.error("Missing studentId");
            return res.status(400).json({ message: "Student ID is required" });
        }
        if (!courseId) {
            console.error("Missing courseId");
            return res.status(400).json({ message: "Course ID is required" });
        }
        if (!paymentId) {
            console.error("Missing paymentId");
            return res.status(400).json({ message: "Payment ID is required" });
        }
        
        // Validate that studentId and courseId are valid MongoDB ObjectIds
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            console.error("Invalid studentId format:", studentId);
            return res.status(400).json({ message: "Invalid student ID format" });
        }
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            console.error("Invalid courseId format:", courseId);
            return res.status(400).json({ message: "Invalid course ID format" });
        }
        
        // Check if student exists
        const student = await User.findById(studentId);
        if (!student) {
            console.error("Student not found:", studentId);
            return res.status(400).json({ message: "Student not found" });
        }
        
        const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
        if (existingEnrollment) {
            console.log("Student already enrolled in course");
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

        console.log("Enrollment created successfully:", newEnrollment._id);
        res.status(201).json({ success: true, enrollment: newEnrollment });
    } catch (error) {
        console.error("Enrollment Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
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