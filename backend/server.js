import 'dotenv/config';
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js"
import attendanceRoutes from "./routes/attendanceRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import connectDB from "./config/db.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import path from "path"
import { fileURLToPath } from 'url';
import leaveRoutes from "./routes/leaveRoutes.js"
import salaryRoutes from "./routes/salaryRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
connectDB();

const allwedOrigins = ["http://localhost:5173","https://bizflow-erp-1.onrender.com"]
const app = express();
app.use(express.json())
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allwedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Serve static uploads
app.use("/uploads", express.static(path.resolve("uploads")))

//routes 

app.use("/api/users",userRoutes)
app.use("/api/employee",employeeRoutes)
app.use("/api/attendance",attendanceRoutes)
app.use("/api/tasks",taskRoutes)
app.use("/api/notifications",notificationRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/uploads", uploadRoutes)
app.use("/api/leaves", leaveRoutes)
app.use("/api/salaries", salaryRoutes);
app.use("/uploads", express.static(path.resolve("uploads")))




app.get('/',(req,res)=>res.send("Bizflow erp is running"))


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server started on port ${PORT}`))
