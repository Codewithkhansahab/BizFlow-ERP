import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['Admin', 'HR', 'Manager', 'Employee', 'CEO'],
        default: 'Employee'
    },
    profileImage: { type: String, default: '' },
    
    // Email verification fields
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    
    // OTP-based password reset fields
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },
    
    // Token-based password reset fields
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Number },
    
    // Account status
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    
    // Approval workflow
    approvalStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Approved' },
    approvalRequiredRole: { type: String, enum: ['HR', 'Admin'], required: false },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    approvedAt: { type: Date },
    rejectionReason: { type: String },
    
}, { timestamps: true });
 const User = mongoose.models.user || mongoose.model('User',userSchema)

 export default User;
