import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";

export const applyLeave = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) return res.status(404).json({ message: "Employee profile not found" });
    const { type, startDate, endDate, reason } = req.body;
    if (!startDate || !endDate) return res.status(400).json({ message: "Start and end dates are required" });
    const leave = await Leave.create({ employee: employee._id, user: req.user._id, type, startDate, endDate, reason });
    return res.status(201).json(leave);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to apply leave" });
  }
};

export const myLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(leaves);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch leaves" });
  }
};

export const listLeaves = async (_req, res) => {
  try {
    const leaves = await Leave.find({}).populate("user", "name email role").populate("employee").sort({ createdAt: -1 });
    return res.status(200).json(leaves);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch leaves" });
  }
};

export const reviewLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'Approve' | 'Reject'
    const leave = await Leave.findById(id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });
    if (!['Approve', 'Reject'].includes(action)) return res.status(400).json({ message: "Invalid action" });
    leave.status = action === 'Approve' ? 'Approved' : 'Rejected';
    leave.approvedBy = req.user._id;
    leave.approvedAt = new Date();
    await leave.save();
    return res.status(200).json(leave);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to review leave" });
  }
};


