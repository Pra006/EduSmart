import express from 'express';
import { createEnrollment, getStudentCourses, updateLessonProgress, getCourseProgress } from '../controller/enrollController.js';

const router = express.Router();

router.post('/create', createEnrollment);
router.get('/my-courses/:studentId', getStudentCourses);

router.post('/complete-lesson', updateLessonProgress);
router.post('/update-lesson-progress', updateLessonProgress);
router.get('/progress/:studentId/:courseId', getCourseProgress);

export default router;
