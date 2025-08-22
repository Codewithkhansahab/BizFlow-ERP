import Notification from "../models/Notification.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";

export const getMyNotifications = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });
    const query = employee
      ? { $or: [{ employee: employee._id }, { user: req.user._id }] }
      : { user: req.user._id };
    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    return res.status(200).json(notifications);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOne({ user: req.user._id });
    const notification = await Notification.findOne({
      _id: id,
      $or: [
        ...(employee ? [{ employee: employee._id }] : []),
        { user: req.user._id }
      ]
    });
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    notification.isRead = true;
    await notification.save();
    return res.status(200).json(notification);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update notification" });
  }
};

// Admin/HR: create a broadcast announcement to all employees
export const broadcastAnnouncement = async (req, res) => {
  try {
    const { title, message, category } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const users = await User.find({});
    if (!users || users.length === 0) return res.status(404).json({ message: 'No users to notify' });

    const docs = users.map((u) => ({
      user: u._id,
      title: title,
      message: message,
      type: 'General',
      category: category || 'General'
    }));

    await Notification.insertMany(docs);
    return res.status(201).json({ 
      success: true,
      message: 'Announcement sent to all users', 
      count: docs.length 
    });
  } catch (err) {
    console.error('Error in broadcastAnnouncement:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to broadcast announcement',
      error: err.message 
    });
  }
};


