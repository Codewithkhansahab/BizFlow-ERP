import User from "../models/User.js";
import Employee from "../models/Employee.js";
import Notification from "../models/Notification.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Strong password validator: min 8, upper, lower, number, special char
const isStrongPassword = (password) => {
    if (typeof password !== 'string') return false;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(password);
};

// ===================== APPROVAL WORKFLOW =====================
// List users pending approval for the current approver's role
export const listPendingApprovals = async (req, res) => {
    try {
        const approverRole = req.user.role;
        if (!['HR', 'Admin'].includes(approverRole)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const users = await User.find({
            approvalStatus: 'Pending',
            approvalRequiredRole: approverRole,
        }).select('name email role approvalStatus approvalRequiredRole createdAt');

        return res.json({ success: true, users });
    } catch (error) {
        console.error('Error listing pending approvals:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Approve a pending registration
export const approveUserRegistration = async (req, res) => {
    try {
        const approver = req.user;
        if (!['HR', 'Admin'].includes(approver.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.approvalStatus !== 'Pending' || user.approvalRequiredRole !== approver.role) {
            return res.status(400).json({ message: 'This request is not pending your approval' });
        }

        user.approvalStatus = 'Approved';
        user.approvedBy = approver._id;
        user.approvedAt = new Date();
        await user.save();

        // Notify registrant
        try {
            await Notification.create({
                user: user._id,
                title: 'Account approved',
                message: `Your ${user.role} account has been approved. You can now login.`,
                type: 'General',
                category: 'General',
            });
        } catch (notifyErr) {
            console.error('Failed to notify registrant (approve):', notifyErr);
        }

        return res.json({ success: true, message: 'User approved' });
    } catch (error) {
        console.error('Error approving user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Reject a pending registration
export const rejectUserRegistration = async (req, res) => {
    try {
        const approver = req.user;
        if (!['HR', 'Admin'].includes(approver.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { id } = req.params;
        const { reason } = req.body;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.approvalStatus !== 'Pending' || user.approvalRequiredRole !== approver.role) {
            return res.status(400).json({ message: 'This request is not pending your approval' });
        }

        user.approvalStatus = 'Rejected';
        user.rejectionReason = reason || '';
        user.approvedBy = approver._id; // tracks the reviewer
        user.approvedAt = new Date();
        await user.save();

        // Notify registrant
        try {
            await Notification.create({
                user: user._id,
                title: 'Account rejected',
                message: reason ? `Your ${user.role} account was rejected. Reason: ${reason}` : `Your ${user.role} account was rejected.`,
                type: 'General',
                category: 'General',
            });
        } catch (notifyErr) {
            console.error('Failed to notify registrant (reject):', notifyErr);
        }

        return res.json({ success: true, message: 'User rejected' });
    } catch (error) {
        console.error('Error rejecting user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '30d', // Token expires in 30 days
    });
};
import transporter from "../config/nodeMailer.js";

// ===================== REGISTER =====================
export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExist = await User.findOne({ email });
        console.log(userExist)
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Enforce strong password policy on registration
        if (!isStrongPassword(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Determine approval requirements based on role
        let approvalStatus = 'Approved';
        let approvalRequiredRole = undefined;
        if (role === 'Employee') {
            approvalStatus = 'Pending';
            approvalRequiredRole = 'HR';
        } else if (role === 'HR' || role === 'Manager') {
            approvalStatus = 'Pending';
            approvalRequiredRole = 'Admin';
        }

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            approvalStatus,
            approvalRequiredRole,
        });

        await user.save();

        // Notify approvers if approval is required
        if (approvalStatus === 'Pending' && approvalRequiredRole) {
            try {
                const approvers = await User.find({ role: approvalRequiredRole });
                const docs = approvers.map((u) => ({
                    user: u._id,
                    title: `New ${role} registration pending approval`,
                    message: `${name} (${email}) has registered as ${role}. Please review and approve.`,
                    type: 'General',
                    category: 'General',
                }));
                if (docs.length) await Notification.insertMany(docs);
            } catch (notifyErr) {
                console.error('Failed to notify approvers:', notifyErr);
            }

            // Notify registrant
            try {
                await Notification.create({
                    user: user._id,
                    title: 'Registration submitted',
                    message: `Your account is pending ${approvalRequiredRole} approval. You will be notified once reviewed.`,
                    type: 'General',
                    category: 'General',
                });
            } catch (notifyErr) {
                console.error('Failed to notify registrant:', notifyErr);
            }
        }

        // Send email (optional): tailor content based on approval
        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : email,
            subject : "Welcome to Bizflow",
            text : approvalStatus === 'Pending'
                ? `Hello ${name}, your ${role} account request has been received and is pending ${approvalRequiredRole} approval.`
                : `Hello ${name}, welcome to Bizflow. Your ${role} account has been created successfully.`
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("Email sent:", info.messageId);
        } catch (emailErr) {
            console.error("Email send failed:", emailErr?.message || emailErr);
            // Do not fail registration if email fails
        }

        // Do NOT auto-login here; require explicit login, and block if pending
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            approvalStatus: user.approvalStatus,
            approvalRequiredRole: user.approvalRequiredRole,
            profileImage: user.profileImage || ''
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ===================== LOGIN =====================
export const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body; // get role from request

        if (!email || !password || !role) {
            return res.status(400).json({ message: "Email, password and role are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check role
        if (user.role !== role) {
            return res.status(403).json({ message: `Access denied for role ${role}` });
        }

        // Enforce approval
        if (user.approvalStatus === 'Pending') {
            return res.status(403).json({ message: `Account pending ${user.approvalRequiredRole} approval` });
        }
        if (user.approvalStatus === 'Rejected') {
            return res.status(403).json({ message: 'Your registration was rejected. Please contact support/HR.' });
        }

        const token = generateToken(user._id);

        // Set token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login success",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage || ''
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};


// ===================== LOGOUT =====================
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 0
        });
        return res.status(200).json({ message: "Logged out" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ===================== SEND OTP =====================
export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!userId) {
            return res.status(400).json({ success: false, message: "Missing user ID" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account already verified" });
        }

        // Generate a 6-digit OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // Store as timestamp

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your OTP is ${otp}. Verify your account by entering this OTP on the verification page. This OTP will expire in 24 hours.`
        };

        await transporter.sendMail(mailOption);

        return res.json({ success: true, message: "Verification OTP sent to email" });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ===================== VERIFY OTP =====================
export const verifyEmail = async (req, res) => {
    const { otp } = req.body;

    if (!otp) {
        return res.status(400).json({ success: false, message: "Missing details" });
    }

    try {
           const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check OTP match
        if (!user.verifyOtp || user.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        // Check OTP expiration
        if (Date.now() > user.verifyOtpExpireAt) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        // Update user as verified
        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = null;

        await user.save();

        return res.json({ success: true, message: "Email verified successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const isAuthenticated = async (req,res) =>{
    try {
        return res.json({ success: true, message: "User is authenticated" });
    } catch (error) {
        res.json({success: false, message : error.message})
    }
}



export const sendPasswrodResetOtp = async (req,res)=>{
    const {email} = req.body
    if(!email){
        return res.json({success : false , message :"Email is required"})
    }
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.json({success : false , message :"User not found"})
         }

          // Generate a 6-digit OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // Store as timestamp

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP is ${otp}. This OTP is used for Password resetting`
        };

        await transporter.sendMail(mailOption);
        return res.json({success : true, message :"OTP sent successfully for reset password"})

    } catch (error) {
         res.json({success: false, message : error.message})

    }
}



// ===================== FORGOT PASSWORD =====================
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            // For security reasons, don't reveal if the email exists or not
            return res.status(200).json({ 
                success: true, 
                message: 'If an account with that email exists, a password reset link has been sent.' 
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // Send email with reset link
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <h2>Password Reset Request</h2>
                <p>You requested a password reset. Click the link below to set a new password:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        
        res.status(200).json({ 
            success: true, 
            message: 'If an account with that email exists, a password reset link has been sent.' 
        });
    } catch (error) {
        console.error('Error in forgot password:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred while processing your request.' 
        });
    }
};

// ===================== RESET PASSWORD =====================
export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password reset token is invalid or has expired.' 
            });
        }

        // Validate new password strength
        if (!isStrongPassword(newPassword)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
            });
        }

        // Update password and clear reset token
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Send confirmation email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Changed Successfully',
            html: `
                <h2>Password Updated</h2>
                <p>Your password has been successfully updated.</p>
                <p>If you didn't make this change, please contact us immediately.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ 
            success: true, 
            message: 'Password has been reset successfully.' 
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred while resetting the password.' 
        });
    }
};

// ===================== SEND RESET OTP =====================
export const sendResetOTP = async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            // For security, don't reveal if email exists or not
            return res.json({ 
                success: true, 
                message: 'If an account with this email exists, an OTP has been sent.' 
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes expiry

        // Save OTP and expiry to user document
        user.resetOtp = otp;
        user.resetOtpExpireAt = otpExpiry;
        await user.save();

        // Send OTP via email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            html: `
                <h2>Password Reset OTP</h2>
                <p>Your OTP for password reset is: <strong>${otp}</strong></p>
                <p>This OTP is valid for 15 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ 
            success: true, 
            message: 'If an account with this email exists, an OTP has been sent.' 
        });
    } catch (error) {
        console.error('Error in sendResetOTP:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred while sending OTP.' 
        });
    }
};

// ===================== VERIFY RESET OTP =====================
export const verifyResetOTP = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email and OTP are required' 
        });
    }

    try {
        const user = await User.findOne({ 
            email,
            resetOtp: otp,
            resetOtpExpireAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid or expired OTP' 
            });
        }

        res.json({ 
            success: true, 
            message: 'OTP verified successfully' 
        });
    } catch (error) {
        console.error('Error in verifyResetOTP:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred while verifying OTP.' 
        });
    }
};

// ===================== RESET PASSWORD WITH OTP =====================
export const resetUserPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email, OTP and new password are required' 
        });
    }
    
    try {
        const user = await User.findOne({ 
            email,
            resetOtp: otp,
            resetOtpExpireAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid or expired OTP' 
            });
        }

        // Validate new password strength
        if (!isStrongPassword(newPassword)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
            });
        }

        // Update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        
        // Clear OTP fields
        user.resetOtp = undefined;
        user.resetOtpExpireAt = undefined;
        
        await user.save();

        // Send confirmation email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Changed Successfully',
            html: `
                <h2>Password Updated</h2>
                <p>Your password has been successfully updated.</p>
                <p>If you didn't make this change, please contact us immediately.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ 
            success: true, 
            message: 'Password has been reset successfully' 
        });
    } catch (error) {
        console.error('Error in resetUserPassword:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const userDetails = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        // Get employee details if they exist
        const employee = await Employee.findOne({ user: userId });

        res.json({
            success : true , 
            userData :{
                name : user.name,
                email : user.email,
                phone: user.phone || '',
                role : user.role,
                isAccountVerified : user.isAccountVerified,
                profileImage: user.profileImage || '',
                designation: employee?.designation || user.role,
                department: employee?.department || null
            }
        })
    } catch (error) {
       res.json({success :false,message:error.message}) 
    }
}

// Update user profile

export const updateProfile = async (req, res) => {
    try {
        const { name, phone, currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user._id;
        
        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (phone) user.phone = phone;

        // Optional password change flow
        const anyPasswordFieldProvided = Boolean(currentPassword || newPassword || confirmPassword);
        if (anyPasswordFieldProvided) {
            // Require all fields
            if (!currentPassword || !newPassword || !confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password, new password, and confirm password are required to change password.'
                });
            }

            // Verify current password
            const match = await bcrypt.compare(currentPassword, user.password);
            if (!match) {
                return res.status(400).json({ success: false, message: 'Current password is incorrect' });
            }

            // Check new password strength
            if (!isStrongPassword(newPassword)) {
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
                });
            }

            // Check confirmation
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ success: false, message: 'New passwords do not match' });
            }

            // Prevent reusing the same password
            const sameAsOld = await bcrypt.compare(newPassword, user.password);
            if (sameAsOld) {
                return res.status(400).json({ success: false, message: 'New password must be different from current password' });
            }

            // Update password
            const hashed = await bcrypt.hash(newPassword, 10);
            user.password = hashed;
        }
        
        // Handle file upload if present
        if (req.file) {
            // Create a URL path for the uploaded file
            const filePath = `/uploads/profile-images/${req.file.filename}`;
            user.profileImage = filePath;
        }

        await user.save();

        // Get updated user data
        const updatedUser = await User.findById(userId).select('-password');
        const employee = await Employee.findOne({ user: userId });

        // Construct the full URL for the profile image
        const profileImage = updatedUser.profileImage 
            ? `${process.env.BASE_URL || 'http://localhost:5000'}${updatedUser.profileImage}`
            : '';

        res.json({
            success: true,
            message: 'Profile updated successfully',
            userData: {
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone || '',
                role: updatedUser.role,
                isAccountVerified: updatedUser.isAccountVerified,
                profileImage: profileImage,
                designation: employee?.designation || updatedUser.role,
                department: employee?.department || null
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating profile',
            error: error.message 
        });
    }
};