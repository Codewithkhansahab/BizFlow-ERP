import Employee from "../models/Employee.js";
import User from "../models/User.js";

import Attendance from "../models/Attendace.js";
import Task from "../models/Task.js";
import Notification from "../models/Notification.js";
import ProfileUpdateRequest from "../models/ProfileUpdateRequest.js";
// @desc   Add new employee
// @route  POST /api/employees
export const addEmployee = async (req, res) => {
  try {
    const { user, department, designation, phone, address, joiningDate, status } = req.body;

    // Check if employee already exists for this user
    const employeeExist = await Employee.findOne({ user });

    if (employeeExist) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    const employee = await Employee.create({
      user,
      department,
      designation,
      phone,
      address,
      joiningDate,
      status: status || 'Active',
    });

    res.status(201).json(employee); // 201 = created
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllEmployees = async (req,res)=>{
  try {
    let query = {};
    
    // If manager, only show employees in their department or assigned projects
    if (req.user.role === 'Manager') {
      // For now, filter by department (can be enhanced with project-based filtering)
      const managerEmployee = await Employee.findOne({ user: req.user._id });
      if (managerEmployee && managerEmployee.department) {
        query.department = managerEmployee.department;
      }
    }
    
    // Admin and HR can see all employees
    const employees = await Employee.find(query).populate('user',"name email role profileImage isAccountVerified");
    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export const getEmployeeById = async (req,res)=>{

  const id = req.params.id;

  const employee = await Employee.findById(id).populate("user","name email role profileImage isAccountVerified")

  if(!employee){
    res.status(400).json({message : "Employee not found "})
  }
  // Authorization check
if (
  req.user.role !== "Admin" &&
  req.user.role !== "HR" &&
  req.user._id.toString() !== employee.user._id.toString()
) {
  return res.status(403).json({ message: "Access denied" });
}


  res.status(200).json(employee)

}

export const updateEmployeeById = async (req,res)=>{

  const id = req.params.id
  const employee = await Employee.findById(id)
  if(!employee){
    res.status(400).json({message : "Employee not found"})
  }
  if (
  req.user.role !== "Admin" &&
  req.user.role !== "HR" &&
  req.user._id.toString() !== employee.user._id.toString()
) {
  return res.status(403).json({ message: "Access denied" });
}
  const user = await User.findById(employee.user)
  if(user){
    user.name = req.body.name
    await user.save()
  }
    if (req.body.designation) employee.designation = req.body.designation;
    if (req.body.status) employee.status = req.body.status;

    const updatedEmployee = await employee.save()

    res.status(200).json(updatedEmployee)
}

export const deleteEmployee = async (req,res)=>{
  const id = req.params.id;
  const employee = await Employee.findById(id)
  if(!employee){
    res.status(400).json({message : "Employee not found"})
  }
  if (req.user.role !== "Admin" && req.user.role !== "HR") {
  return res.status(403).json({ message: "Access denied" });
}
  await Employee.findByIdAndDelete(id);
  res.status(200).json({message : "Employee Deleted Successfully"})
}


export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Always return base user details
    const user = await User.findById(userId).select("name email role");

    // Employee profile (may be null if not completed)
    const employee = await Employee.findOne({ user: userId });

    // Today's attendance (optional)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const attendance = await Attendance.findOne({ user: userId, date: today });

    // Optionally include counts for tasks and unread notifications to show on dashboard
    let taskCount = 0;
    let unreadNotifications = 0;
    if (employee) {
      taskCount = await Task.countDocuments({ assignedTo: employee._id });
      unreadNotifications = await Notification.countDocuments({ employee: employee._id, isRead: false });
    }

    return res.status(200).json({
      user,
      employee,
      attendance,
      taskCount,
      unreadNotifications,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const completeProfile = async (req, res) => {
  try {
    const { userId, department, position, joiningDate, phone, address, profileImage } = req.body;

    // 1. Basic validation
    if (!userId || !department || !position || !joiningDate || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Check if the profile already exists
    let employee = await Employee.findOne({ user: userId });
    if (employee) {
      return res.status(400).json({ message: "Profile already exists for this user" });
    }

    // 4. Create new employee profile
    employee = new Employee({
      user: userId, // references the User model
      department,
      designation: position, // mapping 'position' from request to schema's 'designation'
      joiningDate,
      phone,
      address,
      status: 'Active',
    });

    await employee.save();

    // persist profile image URL on User if provided
    if (profileImage) {
      const userDoc = await User.findById(userId);
      if (userDoc) {
        userDoc.profileImage = profileImage;
        await userDoc.save();
      }
    }

    // 5. Return success
    return res.status(201).json({
      message: "Profile completed successfully",
      employee,
    });
  } catch (error) {
    console.error("Error in completeProfile:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Employee requests profile update (requires admin/HR approval)
export const requestProfileUpdate = async (req, res) => {
  try {
    const userId = req.user._id;
    const employee = await Employee.findOne({ user: userId });
    if (!employee) return res.status(404).json({ message: "Employee profile not found" });

    const { department, designation, phone, address, joiningDate, profileImage } = req.body;
    const changes = {};
    if (department !== undefined) changes.department = department;
    if (designation !== undefined) changes.designation = designation;
    if (phone !== undefined) changes.phone = phone;
    if (address !== undefined) changes.address = address;
    if (joiningDate !== undefined) changes.joiningDate = joiningDate;

    if (profileImage !== undefined) changes.profileImage = profileImage;

    if (Object.keys(changes).length === 0) {
      return res.status(400).json({ message: "No changes submitted" });
    }

    const reqDoc = await ProfileUpdateRequest.create({
      employee: employee._id,
      user: userId,
      changes,
    });

    return res.status(201).json({ message: "Update request submitted", request: reqDoc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to submit request" });
  }
};

// Admin/HR approve or reject a profile update request
export const reviewProfileUpdate = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action, comment } = req.body; // action: 'Approve' | 'Reject'
    if (!['Approve', 'Reject'].includes(action)) return res.status(400).json({ message: "Invalid action" });

    const reqDoc = await ProfileUpdateRequest.findById(requestId).populate('employee');
    if (!reqDoc) return res.status(404).json({ message: "Request not found" });
    if (reqDoc.status !== 'Pending') return res.status(400).json({ message: "Request already reviewed" });

    reqDoc.status = action === 'Approve' ? 'Approved' : 'Rejected';
    reqDoc.reviewedBy = req.user._id;
    reqDoc.reviewedAt = new Date();
    reqDoc.comment = comment || '';
    await reqDoc.save();

    if (action === 'Approve') {
      const employee = await Employee.findById(reqDoc.employee._id);
      const changes = reqDoc.changes || {};
      if (changes.department !== undefined) employee.department = changes.department;
      if (changes.designation !== undefined) employee.designation = changes.designation;
      if (changes.phone !== undefined) employee.phone = changes.phone;
      if (changes.address !== undefined) employee.address = changes.address;
      if (changes.joiningDate !== undefined) employee.joiningDate = changes.joiningDate;
      await employee.save();

      // update user's profile image if included
      if (changes.profileImage !== undefined) {
        const userDoc = await User.findById(employee.user);
        if (userDoc) {
          userDoc.profileImage = changes.profileImage;
          await userDoc.save();
        }
      }
    }

    return res.status(200).json({ message: `Request ${reqDoc.status.toLowerCase()}`, request: reqDoc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to review request" });
  }
};

// Employee can view their latest request
export const getMyLatestProfileUpdateRequest = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) return res.status(404).json({ message: "Employee profile not found" });
    const latest = await ProfileUpdateRequest.findOne({ employee: employee._id }).sort({ createdAt: -1 });
    return res.status(200).json(latest || null);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch request" });
  }
};

// Admin/HR: list all profile update requests
export const listProfileUpdateRequests = async (req, res) => {
  try {
    const requests = await ProfileUpdateRequest.find()
      .populate({ path: 'employee', populate: { path: 'user', select: 'name email' } })
      .populate({ path: 'user', select: 'name email role' })
      .populate({ path: 'reviewedBy', select: 'name email role' })
      .sort({ createdAt: -1 });
    return res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch requests' });
  }
};

// Admin/HR/Manager: update employee status (Managers limited to their department)
export const updateEmployeeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Allowed: Active, Inactive' });
    }

    const target = await Employee.findById(id);
    if (!target) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // If Manager, enforce same-department policy (Admin/HR unrestricted)
    if (req.user.role === 'Manager') {
      const managerEmp = await Employee.findOne({ user: req.user._id });
      if (!managerEmp || !managerEmp.department || managerEmp.department !== target.department) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const oldStatus = target.status;
    target.status = status;
    const updated = await target.save();

    // Notify the employee if their profile has been set to Inactive
    if (oldStatus !== 'Inactive' && status === 'Inactive') {
      try {
        await Notification.create({
          employee: target._id,
          title: 'Profile set to Inactive',
          message: 'Your employee profile has been set to Inactive. Please contact HR to resolve this.',
          type: 'General',
          category: 'General',
        });
      } catch (notifyErr) {
        console.error('Failed to create inactivity notification:', notifyErr);
        // Do not block the response on notification failure
      }
    }
    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to update status' });
  }
};
