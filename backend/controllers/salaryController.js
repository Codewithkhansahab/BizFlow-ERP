import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";

// HR: Create salary record
export const createSalary = async (req, res) => {
  try {
    const { employeeId, month, year, components, deductions, remarks, status } = req.body;

    if (!employeeId || !month || !year) {
      return res.status(400).json({ message: "employeeId, month, and year are required" });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const salary = await Salary.create({
      employee: employee._id,
      month,
      year,
      components,
      deductions,
      remarks,
      status,
      createdBy: req.user?._id,
      updatedBy: req.user?._id,
    });

    return res.status(201).json(salary);
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Salary already exists for this employee and period" });
    }
    console.error("createSalary error:", err);
    return res.status(500).json({ message: "Failed to create salary" });
  }
};

// HR: Update salary record
export const updateSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};
    const allowed = ["components", "deductions", "remarks", "status", "month", "year", "employee"];

    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    updates.updatedBy = req.user?._id;

    const salary = await Salary.findById(id);
    if (!salary) return res.status(404).json({ message: "Salary not found" });

    // Apply basic updates first
    Object.assign(salary, updates);

    // Guardrails: manage payment fields based on status changes via update
    if (Object.prototype.hasOwnProperty.call(updates, 'status')) {
      if (updates.status === 'Paid') {
        // Ensure paymentDate is set when marking as Paid via update
        if (!salary.paymentDate) salary.paymentDate = new Date();
        // Allow passing paymentMethod in body (will be enum-validated by schema)
        if (req.body.paymentMethod !== undefined) {
          salary.paymentMethod = req.body.paymentMethod;
        }
      } else {
        // If moving away from Paid, clear payment metadata
        salary.paymentDate = undefined;
        salary.paymentMethod = undefined;
      }
    }

    await salary.save();

    return res.status(200).json(salary);
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Duplicate salary for employee and period" });
    }
    console.error("updateSalary error:", err);
    return res.status(500).json({ message: "Failed to update salary" });
  }
};

// HR: Delete salary record
export const deleteSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const salary = await Salary.findByIdAndDelete(id);
    if (!salary) return res.status(404).json({ message: "Salary not found" });
    return res.status(200).json({ message: "Salary deleted" });
  } catch (err) {
    console.error("deleteSalary error:", err);
    return res.status(500).json({ message: "Failed to delete salary" });
  }
};

// HR: List salaries with filters and pagination
export const listSalaries = async (req, res) => {
  try {
    const { employeeId, month, year, status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (employeeId) filter.employee = employeeId;
    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Salary.find(filter)
        .populate({ path: "employee", populate: { path: "user", select: "name email" } })
        .sort({ year: -1, month: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Salary.countDocuments(filter),
    ]);

    return res.status(200).json({
      items,
      total,
      page: Number(page),
      pageSize: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error("listSalaries error:", err);
    return res.status(500).json({ message: "Failed to fetch salaries" });
  }
};

// HR: Get a salary by ID
export const getSalaryById = async (req, res) => {
  try {
    const { id } = req.params;
    const salary = await Salary.findById(id).populate({
      path: "employee",
      populate: { path: "user", select: "name email" },
    });
    if (!salary) return res.status(404).json({ message: "Salary not found" });
    return res.status(200).json(salary);
  } catch (err) {
    console.error("getSalaryById error:", err);
    return res.status(500).json({ message: "Failed to fetch salary" });
  }
};

// HR: Mark salary as Paid
export const markAsPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod } = req.body;

    const salary = await Salary.findById(id);
    if (!salary) return res.status(404).json({ message: "Salary not found" });

    salary.status = "Paid";
    salary.paymentDate = new Date();
    if (paymentMethod) salary.paymentMethod = paymentMethod;
    salary.updatedBy = req.user?._id;

    await salary.save();
    return res.status(200).json(salary);
  } catch (err) {
    console.error("markAsPaid error:", err);
    return res.status(500).json({ message: "Failed to mark salary as paid" });
  }
};

// Employee: Get own salaries
export const getMySalaries = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) return res.status(404).json({ message: "Employee profile not found" });

    const items = await Salary.find({ employee: employee._id })
      .sort({ year: -1, month: -1, createdAt: -1 });

    return res.status(200).json(items);
  } catch (err) {
    console.error("getMySalaries error:", err);
    return res.status(500).json({ message: "Failed to fetch your salaries" });
  }
};