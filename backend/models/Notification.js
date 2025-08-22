import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    title: { type: String, required: true },
    message: { type: String },
    type: { type: String, enum: ["Task", "General"], default: "General" },
    category: { type: String, enum: ["Meeting", "Holiday", "Weekend", "General", "Other"], default: "General" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;


