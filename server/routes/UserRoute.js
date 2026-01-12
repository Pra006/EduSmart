import { Router } from 'express';
import { Login, Signup, getMe } from '../controller/userController.js';
import upload from '../upload/upload.js';
import authMiddleware from '../middleware/auth.js';

const route = Router();

route.post("/signup", upload.single('document'), Signup);
route.post("/login", Login);
route.get("/me", authMiddleware, getMe);

export default route;