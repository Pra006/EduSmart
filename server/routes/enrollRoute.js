import express from 'express';
import { createEnrollment, getStudentCourses } from '../controller/enrollController.js';

const router = express.Router();

router.post('/create', createEnrollment);
router.get('/my-courses/:studentId', getStudentCourses);

export default router;
