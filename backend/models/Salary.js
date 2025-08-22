import mongoose from "mongoose";

const componentsSchema = new mongoose.Schema(
  {
    basic: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
  },
  { _id: false }
);

const deductionsSchema = new mongoose.Schema(
  {
    pf: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    tds: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
  },
  { _id: false }
);

const salarySchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    month: { type: Number, min: 1, max: 12, required: true },
    year: { type: Number, required: true },
    components: { type: componentsSchema, default: () => ({}) },
    deductions: { type: deductionsSchema, default: () => ({}) },
    grossSalary: { type: Number, default: 0 },
    netSalary: { type: Number, default: 0 },
    status: { type: String, enum: ["Draft", "Processed", "Paid"], default: "Draft" },
    paymentDate: { type: Date },
    paymentMethod: { type: String, enum: ["BankTransfer", "Cash", "Cheque", "UPI"], default: undefined },
    remarks: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// One salary record per employee per month/year
salarySchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

// Auto-compute gross/net before save
salarySchema.pre("save", function (next) {
  const c = this.components || {};
  const d = this.deductions || {};
  const toNum = (v) => (typeof v === "number" && !isNaN(v) ? v : 0);

  const gross =
    toNum(c.basic) + toNum(c.hra) + toNum(c.allowances) + toNum(c.bonus);
  const totalDeductions =
    toNum(d.pf) + toNum(d.tax) + toNum(d.tds) + toNum(d.other);

  this.grossSalary = gross;
  this.netSalary = Math.max(0, gross - totalDeductions);
  next();
});

const Salary = mongoose.model("Salary", salarySchema);

export default Salary;