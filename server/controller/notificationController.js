// controller/notificationController.js
import { notificationModel } from "../model/notificationModel.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel.find()
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  await notificationModel.findByIdAndUpdate(req.params.id, {
    isRead: true
  });
  res.json({ success: true });
};
