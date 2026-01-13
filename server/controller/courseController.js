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