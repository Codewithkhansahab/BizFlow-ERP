import User from "../models/User.js";
import Employee from "../models/Employee.js";
import Task from "../models/Task.js";
import ProfileUpdateRequest from "../models/ProfileUpdateRequest.js";

export const getAdminStats = async (_req, res) => {
  try {
    const [users, employees, tasks] = await Promise.all([
      User.countDocuments({}),
      Employee.countDocuments({}),
      Task.countDocuments({}),
    ]);
    return res.status(200).json({ users, employees, tasks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

export const getAdminOverview = async (_req, res) => {
  try {
    const [users, employees, tasks, pendingRequests] = await Promise.all([
      User.countDocuments({}),
      Employee.countDocuments({}),
      Task.countDocuments({}),
      ProfileUpdateRequest.countDocuments({ status: 'Pending' }),
    ]);

    const recentEmployees = await Employee.find({})
      .sort({ joiningDate: -1 })
      .limit(5)
      .populate('user', 'name email role');

    const recentTasks = await Task.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({ path: 'assignedTo', populate: { path: 'user', select: 'name email' } });

    return res.status(200).json({
      stats: { users, employees, tasks, pendingRequests },
      recentEmployees,
      recentTasks,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch overview' });
  }
};


