import express from "express";
import { getMyNotifications, markAsRead, broadcastAnnouncement } from "../controllers/notificationController.js";
import protect from "../middlewares/authMiddleware.js";
import roleMidddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyNotifications);
router.put("/my/:id/read", protect, markAsRead);
router.post("/broadcast", protect, roleMidddleware(["Admin", "HR", "Manager", "CEO"]), broadcastAnnouncement);

export default router;


