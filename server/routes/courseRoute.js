import express from 'express';
import{createCourse, getAllCourse,getCourseById, updateCourse, deleteCourse} from '../controller/courseController.js';


const router = express.Router()
router.post("/create", createCourse);
router.get("/all", getAllCourse);
router.get("/:id", getCourseById);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
