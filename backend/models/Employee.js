import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    manager: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        default: null
    },
    teamMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: false
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;