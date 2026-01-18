import express from "express";
import {getNotifications, markNotificationRead} from "../controller/notificationController.js";

const router = express.Router();
router.get("/notifications", getNotifications);
router.put("/notifications/:id", markNotificationRead);

export default router;
