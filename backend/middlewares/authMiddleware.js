import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
    try {
        // Read token from cookies
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Not Authorized, no token" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from DB (without password)
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (err) {
        console.error("Auth error:", err);
        res.status(401).json({ message: "Token failed or expired" });
    }
};

export default protect;
