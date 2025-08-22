import mongoose from "mongoose";

const profileUpdateRequestSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    changes: { type: Object, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    comment: { type: String },
  },
  { timestamps: true }
);

const ProfileUpdateRequest = mongoose.model("ProfileUpdateRequest", profileUpdateRequestSchema);

export default ProfileUpdateRequest;


