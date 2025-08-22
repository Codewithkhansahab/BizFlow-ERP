import express from "express";
import { applyLeave, myLeaves, listLeaves, reviewLeave } from "../controllers/leaveController.js";
import protect from "../middlewares/authMiddleware.js";
import roleMidddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/apply", protect, applyLeave);
router.get("/my", protect, myLeaves);
router.get("/", protect, roleMidddleware(["Admin", "HR"]), listLeaves);
router.put("/:id/review", protect, roleMidddleware(["Admin", "HR"]), reviewLeave);

export default router;


