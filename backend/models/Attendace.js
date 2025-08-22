import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: () => new Date().setHours(0, 0, 0, 0), // ensures date only (no time)
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
    totalHours: {
      type: Number, // in hours
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Leave"],
      default: "Absent",
    },
  },
  {
    timestamps: false,
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
