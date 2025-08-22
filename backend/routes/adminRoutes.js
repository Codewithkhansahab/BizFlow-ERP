import express from "express";
import { getAdminStats, getAdminOverview } from "../controllers/adminController.js";
import protect from "../middlewares/authMiddleware.js";
import roleMidddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/stats", protect, roleMidddleware(["Admin", "HR"]), getAdminStats);
router.get("/overview", protect, roleMidddleware(["Admin", "HR"]), getAdminOverview);

export default router;


