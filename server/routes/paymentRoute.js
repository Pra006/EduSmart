import express from 'express';
import {createPayment} from '../controller/paymentController.js ';

const router = express.Router();

router.post("/pay", createPayment);

export default router;