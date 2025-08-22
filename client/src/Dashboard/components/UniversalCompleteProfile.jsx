import { useState, useContext } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import { toast } from "react-toastify";

export default function UniversalCompleteProfile({ userId, userRole, onClose }) {
  const { backendUrl } = useContext(AppContent);
  const [formData, setFormData] = useState({
    department: "",
    designation: userRole === 'Employee' ? "" : userRole,
    joiningDate: "",
    phone: "",
    address: "",
    profileImage: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await axios.post(`${backendUrl}/api/uploads/profile-image`, fd, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData((prev) => ({ ...prev, profileImage: data.url }));
    } catch (err) {
      console.error(err);
      toast.error('Image upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      await axios.post(`${backendUrl}/api/employee/complete-profile`, {
        userId,
        ...formData
      });
      toast.success("Profile completed successfully!");
      onClose();
      window.location.reload(); // Refresh to show dashboard
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label fw-bold">Department</label>
        <input
          name="department"
          className="form-control"
          placeholder="Enter department"
          value={formData.department}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Designation</label>
        <input
          name="designation"
          className="form-control"
          placeholder="Enter designation"
          value={formData.designation}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Joining Date</label>
        <input
          type="date"
          name="joiningDate"
          className="form-control"
          value={formData.joiningDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Phone</label>
        <input
          name="phone"
          className="form-control"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Address</label>
        <textarea
          name="address"
          className="form-control"
          placeholder="Enter address"
          rows="3"
          value={formData.address}
          onChange={handleChange}
          required
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Profile Image</label>
        <div className="d-flex flex-column gap-2">
          <input
            type="url"
            name="profileImage"
            className="form-control"
            placeholder="Enter image URL (optional)"
            value={formData.profileImage}
            onChange={handleChange}
          />
          <div className="d-flex align-items-center gap-2">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {formData.profileImage && (
              <img 
                src={formData.profileImage} 
                alt="preview" 
                style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '50%' }} 
              />
            )}
          </div>
          <div className="form-text">Upload or paste a URL. This image appears in your profile.</div>
        </div>
      </div>

      <div className="text-end">
        <button type="submit" className="btn btn-success">
          Complete Profile
        </button>
      </div>
    </form>
  );
}
