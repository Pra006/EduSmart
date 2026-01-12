import express from 'express';
import multer from 'multer';
import path from 'path';
import{createCourse, getAllCourse,getCourseById, updateCourse, deleteCourse} from '../controller/courseController.js';


const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) =>{
        cb(null, Date.now() + path.extname(file.originalname));
    },
})
const upload = multer({storage: storage});

router.post("/create",upload.array('videos', 10), createCourse);
router.get("/all", getAllCourse);
router.get("/:id", getCourseById);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
