import express from 'express';
import { 
    registerUser, 
    loginUser, 
    logout, 
    sendVerifyOtp, 
    verifyEmail, 
    isAuthenticated, 
    sendPasswrodResetOtp, 
    resetUserPassword, 
    userDetails,
    forgotPassword,
    resetPassword,
    sendResetOTP,
    verifyResetOTP,
    updateProfile,
    listPendingApprovals,
    approveUserRegistration,
    rejectUserRegistration
} from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js';
import { uploadProfileImage } from '../middlewares/uploadMiddleware.js';
import roleMidddleware from '../middlewares/roleMiddleware.js';

const userRouter = express.Router();

// Authentication routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logout);

// Email verification routes
userRouter.post("/send-verify-otp", protect, sendVerifyOtp);
userRouter.post("/verify-account", protect, verifyEmail);

// Password reset routes
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

// OTP based password reset
userRouter.post("/send-reset-otp", sendResetOTP);
userRouter.post("/verify-otp", verifyResetOTP);
userRouter.post("/reset-password-otp", resetUserPassword);

// User details and update routes
userRouter.post("/is-auth", protect, isAuthenticated);
userRouter.get('/get-details', protect, userDetails);
userRouter.put('/update-profile', protect, uploadProfileImage, updateProfile);

// Approval workflow routes
userRouter.get('/approvals/pending', protect, roleMidddleware(['HR','Admin']), listPendingApprovals);
userRouter.put('/approvals/:id/approve', protect, roleMidddleware(['HR','Admin']), approveUserRegistration);
userRouter.put('/approvals/:id/reject', protect, roleMidddleware(['HR','Admin']), rejectUserRegistration);


export default userRouter;
