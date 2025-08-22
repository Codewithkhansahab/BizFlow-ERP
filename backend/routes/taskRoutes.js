import express from "express";
import { createTask, getMyTasks, updateMyTask, getMyCreatedTasks } from "../controllers/taskController.js";
import protect from "../middlewares/authMiddleware.js";
import roleMidddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Manager/Admin create tasks
router.post("/", protect, roleMidddleware(["Admin", "Manager"]), createTask);

// Employee: list own tasks
router.get("/my", protect, getMyTasks);

// Employee: update progress/status of own task
router.put("/my/:taskId", protect, updateMyTask);
// Manager/Admin: list tasks created by them
router.get("/my-created", protect, roleMidddleware(["Admin", "Manager"]), getMyCreatedTasks);

export default router;


