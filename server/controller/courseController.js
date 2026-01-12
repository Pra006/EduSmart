import courseCreate from "../model/courseCreate.js";

export const createCourse = async (req, res) => {
    try {
        // 1. Destructure the text fields from req.body
        const { title, category, instructor, price, duration, thumbnail } = req.body;
        
        // 2. Parse the JSON strings sent from the frontend
        const learn = JSON.parse(req.body.learn || "[]");
        const lessonMetadata = JSON.parse(req.body.lessonMetadata || "[]");

        const lessons = lessonMetadata.map((lesson, index) => {
            const file = req.files && req.files[index];
            return {
                title: lesson.title,
                duration: lesson.duration,
                // We store the relative path for flexibility
                videoUrl: file ? `/uploads/${file.filename}` : "",
                videoName: file ? file.originalname : ""
            };
        });

        // 4. Create the course document with the mapped lessons
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
        // If updating text fields, make sure to handle JSON parsing if sent via FormData
        const updateData = req.body;
        
        const updatedCourse = await courseCreate.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        return res.status(200).json(updatedCourse);
    } catch (error) {
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