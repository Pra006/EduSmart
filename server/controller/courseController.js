import courseCreate from "../model/courseCreate.js";
import { notificationModel } from "../model/notificationModel.js";
import Enrollment from "../model/enrollModel.js";
import mongoose from "mongoose";

export const createCourse = async (req, res) => {
    try {
  
        const { title, category, instructor, price, duration, thumbnail } = req.body;
        

        const learn = JSON.parse(req.body.learn || "[]");
        const lessonMetadata = JSON.parse(req.body.lessonMetadata || "[]");

        const lessons = lessonMetadata.map((lesson, index) => {
            const file = req.files && req.files[index];
            return {
                title: lesson.title,
                duration: lesson.duration,

                videoUrl: file ? `/uploads/${file.filename}` : "",
                videoName: file ? file.originalname : ""
            };
        });


        const course = await courseCreate.create({
            title,
            category,
            instructor,
            price: Number(price),
            duration,
            thumbnail,
            learn,
            lessons // This will now correctly contain your video paths
        });

        // Create notification for course creation
        await notificationModel.create({
            title: "New Course Added",
            message: `${course.title} has been published by ${course.instructor}`,
            type: "COURSE_CREATED",
            courseId: course._id,
            receiverRole: "STUDENT"
        })

        res.status(201).json(course);
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: error.message });
    }
}

export const getAllCourse = async (req, res) => {
    try {
        const courses = await courseCreate.find().sort({ createdAt: -1 });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await courseCreate.findById(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        return res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, instructor, price, duration, thumbnail } = req.body;
        
        const learn = req.body.learn ? JSON.parse(req.body.learn) : [];
        const lessonMetadata = req.body.lessonMetadata ? JSON.parse(req.body.lessonMetadata) : [];
        const videoIndices = req.body.videoIndices ? JSON.parse(req.body.videoIndices) : [];

        const existingCourse = await courseCreate.findById(id);
        if (!existingCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Map lessons: use new videos if uploaded, otherwise keep old ones
        const lessons = lessonMetadata.map((lesson) => {
            const lessonIndex = lesson.index;
            const videoFileIndex = videoIndices.indexOf(lessonIndex);
            const file = videoFileIndex >= 0 && req.files ? req.files[videoFileIndex] : null;
            
            // If a new file is uploaded, use it; otherwise check if lesson exists and keep old video
            if (file) {
                return {
                    title: lesson.title,
                    duration: lesson.duration,
                    videoUrl: `/uploads/${file.filename}`,
                    videoName: file.originalname
                };
            } else {
                // Keep existing lesson if available
                const existingLesson = existingCourse.lessons[lessonIndex];
                return {
                    title: lesson.title,
                    duration: lesson.duration,
                    videoUrl: existingLesson?.videoUrl || "",
                    videoName: existingLesson?.videoName || ""
                };
            }
        });

        // Prepare update data
        const updateData = {
            title,
            category,
            instructor,
            price: Number(price),
            duration,
            thumbnail,
            learn,
            lessons
        };

        const updatedCourse = await courseCreate.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        return res.status(200).json(updatedCourse);
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCourse = await courseCreate.findByIdAndDelete(id);

        if (!deletedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        return res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
 export const getEnrolledStudentsByCourse = async (req, res) => {
     try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid course ID" });
    }

    const course = await courseCreate.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const enrollments = await Enrollment.find({ courseId })
      .populate({
        path: "studentId",
        select: "fullname email"
      })
      .sort({ enrolledAt: -1 });

    const students = enrollments.map((enroll) => {
      return {
        _id: enroll._id,
        studentId: {
          _id: enroll.studentId?._id,
          name: enroll.studentId?.fullname || "Unknown",
          email: enroll.studentId?.email || "N/A"
        },
        progress: enroll.progress || 0,
        enrolledAt: enroll.enrolledAt,
        status: enroll.status,
      };
    });

    res.status(200).json({
      success: true,
      course: {
        _id: course._id,
        title: course.title
      },
      students,
    });
  } catch (error) {
    console.error("Manage Students Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
