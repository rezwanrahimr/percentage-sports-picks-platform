import express from "express";
import notificationController from "./notifications.controller";
import { userRole } from "../../constents";
import auth from "../../middleware/auth";

const notificationRouter = express.Router();

// User notification routes
notificationRouter.get("/recent", auth(userRole.admin, userRole.user), notificationController.getRecentNotifications);
notificationRouter.get("/all", auth(userRole.admin, userRole.user), notificationController.getAllNotifications);
notificationRouter.get("/details/:notificationId", auth(userRole.admin, userRole.user), notificationController.viewSpecificNotification);
notificationRouter.put("/status", auth(userRole.admin, userRole.user), notificationController.changeNotificationStatus);
notificationRouter.put("/mark-all-read", auth(userRole.admin, userRole.user), notificationController.markAllAsRead);

// Device token management
notificationRouter.post("/register-device", auth(userRole.admin, userRole.user), notificationController.registerDeviceToken);

// Admin notification routes
notificationRouter.post("/send", auth(userRole.admin, userRole.admin), notificationController.sendNotification);
notificationRouter.post("/send-custom", auth(userRole.admin), notificationController.sendCustomNotification);
notificationRouter.get("/admin/all", auth(userRole.admin), notificationController.getAllNotificationForAdmin);

export default notificationRouter;