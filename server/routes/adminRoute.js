import express from 'express';
import { getPendingEducators, updateEducatorStatus } from '../controller/adminController.js';

const router = express.Router();

router.get('/pending-educators', getPendingEducators);

// Change this line to match your Frontend request
router.patch('/approve-user/:id', updateEducatorStatus); 

export default router;