import Task from "../models/Task.js";
import Employee from "../models/Employee.js";
import Notification from "../models/Notification.js";

// Manager/Admin creates a task for an employee
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedToEmployeeId, dueDate, priority } = req.body;
    if (!title || !assignedToEmployeeId) {
      return res.status(400).json({ message: "Title and assigned employee are required" });
    }
    const employee = await Employee.findById(assignedToEmployeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const task = await Task.create({
      title,
      description,
      assignedTo: employee._id,
      createdBy: req.user._id,
      dueDate,
      priority,
    });

    await Notification.create({
      employee: employee._id,
      title: "New Task Assigned",
      message: `You have been assigned a new task: ${title}`,
      type: "Task",
    });

    return res.status(201).json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create task" });
  }
};

// Employee fetches their own tasks
export const getMyTasks = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }
    const tasks = await Task.find({ assignedTo: employee._id }).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// Employee updates progress or status
export const updateMyTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { progress, status } = req.body;
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }
    const task = await Task.findOne({ _id: taskId, assignedTo: employee._id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (typeof progress === "number") {
      task.progress = Math.max(0, Math.min(100, progress));
      if (task.progress === 100) task.status = "Completed";
      else if (task.progress > 0) task.status = "In Progress";
      else task.status = "Pending";
    }
    if (status && ["Pending", "In Progress", "Completed"].includes(status)) {
      task.status = status;
      if (status === "Completed") task.progress = 100;
    }
    await task.save();
    return res.status(200).json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update task" });
  }
};


// Manager/Admin: get tasks created by the manager/admin
export const getMyCreatedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id })
      .populate({ path: 'assignedTo', populate: { path: 'user', select: 'name email' } })
      .sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};
