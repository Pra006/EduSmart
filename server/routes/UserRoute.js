import { Router } from 'express';
import { Login, Signup } from '../controller/userController.js';
import upload from '../upload/upload.js';
import authMiddleware from '../middleware/auth.js';

const route = Router();

route.post("/signup", upload.single('document'), Signup);
route.post("/login", Login);

export default route;