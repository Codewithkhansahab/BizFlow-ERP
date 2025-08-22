import express from "express"
import {
    checkIn,
    checkOut,
    getSummary,
    getAllAttendance
} from "../controllers/attendaceController.js"
import roleMidddleware from "../middlewares/roleMiddleware.js";
import protect from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/check-in",protect,checkIn);
router.put("/check-out",protect,checkOut)
router.get("/get-summary",protect,getSummary)
router.get("/get-all",protect,roleMidddleware(["Admin","HR"]),getAllAttendance)

export default router