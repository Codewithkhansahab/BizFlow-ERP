import express from "express";
import {
  createSalary,
  updateSalary,
  deleteSalary,
  listSalaries,
  getSalaryById,
  markAsPaid,
  getMySalaries,
} from "../controllers/salaryController.js";
import protect from "../middlewares/authMiddleware.js";
import roleMidddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Employee: view own salaries
router.get("/my", protect, getMySalaries);

// HR-only management
router.post("/", protect, roleMidddleware(["HR"]), createSalary);
router.get("/", protect, roleMidddleware(["HR"]), listSalaries);
router.get("/:id", protect, roleMidddleware(["HR"]), getSalaryById);
router.put("/:id", protect, roleMidddleware(["HR"]), updateSalary);
router.delete("/:id", protect, roleMidddleware(["HR"]), deleteSalary);
router.patch("/:id/pay", protect, roleMidddleware(["HR"]), markAsPaid);

export default router;
