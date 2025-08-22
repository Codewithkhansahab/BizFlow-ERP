import express from "express";
import {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployee,
  getDashboardData,
  completeProfile,
  requestProfileUpdate,
  reviewProfileUpdate,
  getMyLatestProfileUpdateRequest,
  listProfileUpdateRequests,
  updateEmployeeStatus,
} from "../controllers/employeeController.js";
import protect from "../middlewares/authMiddleware.js";
import roleMidddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Protect routes for only authorized users
router.post("/employees", protect, addEmployee);           // Only Admin/HR can add
router.get("/employees", protect, getAllEmployees);       // Admin/HR can view all
router.get("/employees/:id", protect, getEmployeeById);   // Protected, individual access check inside controller
router.put("/employees/:id", protect, updateEmployeeById); // PATCH or PUT is better than POST for update
router.put("/employees/:id/status", protect, roleMidddleware(["Admin", "HR", "Manager"]), updateEmployeeStatus);
router.delete("/employees/:id", protect, deleteEmployee); // Only Admin/HR can delete
router.get("/dashboard", protect, getDashboardData);
router.post("/complete-profile",completeProfile)

// Profile update request workflow
router.post("/profile-update/request", protect, requestProfileUpdate);
router.get("/profile-update/my-latest", protect, getMyLatestProfileUpdateRequest);
router.put("/profile-update/:requestId/review", protect, roleMidddleware(["Admin", "HR"]), reviewProfileUpdate);
router.get("/profile-update", protect, roleMidddleware(["Admin", "HR"]), listProfileUpdateRequests);

export default router;
