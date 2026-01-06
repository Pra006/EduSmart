import courseCreate from "../model/courseCreate.js";

export const createCourse = async (req, res) => {
    console.log("incoming Data:", req.body);
    try {
        const course = await courseCreate.create(req.body);
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getAllCourse = async (req, res) => {
    try {
        const courses = await courseCreate.find().sort({ createdAt: -1 })
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message })
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
        const updateCourse = await courseCreate.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        )
        if (!updateCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        return res.status(200).json(updateCourse);
    } catch (error) {
        res.status(500).json({ message: error.messsage });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteCourse = await courseCreate.findByIdAndDelete(id);

        if (!deleteCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        return res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}