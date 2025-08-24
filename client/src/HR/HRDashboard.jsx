import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Modal, Table, Badge, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import DashboardLayout from '../Dashboard/DashboardLayout';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import WelcomeHeader from '../Employee/components/WelcomeHeader';
import HRDashboardStats from './components/HRDashboardStats';
import LeaveManagementCard from './components/LeaveManagementCard';
import EmployeeManagementCard from './components/EmployeeManagementCard';
import ProfileRequestsCard from './components/ProfileRequestsCard';
import HRAnnouncementCard from './components/HRAnnouncementCard';
import AttendanceOverviewCard from './components/AttendanceOverviewCard';
import { Link } from 'react-router-dom';
import UniversalCompleteProfile from '../Dashboard/components/UniversalCompleteProfile';

const HRDashboard = () => {
  const { backendUrl, userData } = useContext(AppContent);
  
  // State management
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [profileRequests, setProfileRequests] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  // Approvals state
  const [approvals, setApprovals] = useState([]);
  const [approvalsLoading, setApprovalsLoading] = useState(false);
  const [allAttendanceData, setAllAttendanceData] = useState([]);
  
  // Form states
  const [announceLoading, setAnnounceLoading] = useState(false);
  const [announceForm, setAnnounceForm] = useState({ 
    title: '', 
    message: '', 
    category: 'General'
  });
  
  // Pagination states
  const [showAllLeaves, setShowAllLeaves] = useState(false);
  const [showAllEmployees, setShowAllEmployees] = useState(false);
  const [showAllAttendance, setShowAllAttendance] = useState(false);
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [attendanceFilter, setAttendanceFilter] = useState('today'); // 'today', 'yesterday', 'all'
  
  // Modal states
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [needsProfile, setNeedsProfile] = useState(false);
  
  // Helper to normalize user object for header display
  const mapUser = (u) => u ? ({
    ...u,
    designation: u.designation || u.role || 'HR',
    department: u.department || (u.role === 'HR' ? 'Human Resources' : 'Operations')
  }) : null;

  // User and time state for welcome header
  const [currentUser, setCurrentUser] = useState(() => mapUser(userData));
  const [now, setNow] = useState(new Date());
  
  // Attendance state
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [attendance, setAttendance] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState('No record');
  const [attendanceVariant, setAttendanceVariant] = useState('secondary');
  
  // Dashboard stats
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    profileRequests: 0,
    activeAnnouncements: 0
  });

  // Fetch all data
  const fetchLeaves = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/leaves`, { withCredentials: true });
      setLeaves(Array.isArray(data) ? data : []);
      setStats(prev => ({ ...prev, pendingLeaves: data.filter(l => l.status === 'Pending').length }));
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch pending account approvals (HR sees Employee registrations)
  const fetchApprovals = async () => {
    try {
      setApprovalsLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/users/approvals/pending`, { withCredentials: true });
      setApprovals(Array.isArray(data) ? data : (data.users || []));
    } catch (err) {
      console.error('Error fetching approvals:', err);
      setApprovals([]);
    } finally {
      setApprovalsLoading(false);
    }
  };
  
  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/employee/employees`, { withCredentials: true });
      setEmployees(Array.isArray(data) ? data : []);
      setStats(prev => ({ ...prev, totalEmployees: data.length }));
    } catch (err) {
      console.error(err);
    }
  };
  
  const fetchProfileRequests = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/employee/profile-update`, { withCredentials: true });
      setProfileRequests(Array.isArray(data) ? data : []);
      setStats(prev => ({ ...prev, profileRequests: data.filter(r => r.status === 'Pending').length }));
    } catch (err) {
      console.error(err);
    }
  };
  
  const transformAttendanceRecord = (record, index) => ({
    _id: `attendance-${index}`,
    employee: {
      user: {
        name: record.user || 'Unknown User',
        email: record.email || 'N/A'
      },
      department: 'N/A',
      designation: record.role || 'N/A'
    },
    status: record.status || 'Unknown',
    date: record.date,
    checkInTime: record.checkIn && record.checkIn !== 'N/A' ? 
      (() => {
        try {
          const [time, period] = record.checkIn.split(' ');
          const [hours, minutes] = time.split(':');
          let hour24 = parseInt(hours);
          if (period === 'PM' && hour24 !== 12) hour24 += 12;
          if (period === 'AM' && hour24 === 12) hour24 = 0;
          
          const today = new Date();
          today.setHours(hour24, parseInt(minutes), 0, 0);
          return today;
        } catch {
          return null;
        }
      })() : null,
    checkOutTime: record.checkOut && record.checkOut !== 'N/A' ? 
      (() => {
        try {
          const [time, period] = record.checkOut.split(' ');
          const [hours, minutes] = time.split(':');
          let hour24 = parseInt(hours);
          if (period === 'PM' && hour24 !== 12) hour24 += 12;
          if (period === 'AM' && hour24 === 12) hour24 = 0;
          
          const today = new Date();
          today.setHours(hour24, parseInt(minutes), 0, 0);
          return today;
        } catch {
          return null;
        }
      })() : null,
    hoursWorked: record.totalHours || 0
  });

  const fetchAttendance = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/attendance/get-all`, { withCredentials: true });
      
      // Store all attendance data
      const allTransformed = (data.data || []).map(transformAttendanceRecord);
      setAllAttendanceData(allTransformed);
      
      // Filter based on current filter setting
      filterAttendanceData(allTransformed, attendanceFilter);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setAttendanceData([]);
      setAllAttendanceData([]);
    }
  };

  const filterAttendanceData = (allData, filter) => {
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    const todayMoment = `${today.getFullYear()}-${today.toLocaleString('default', { month: 'long' })}-${String(today.getDate()).padStart(2, '0')}`;
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayFormatted = yesterday.toISOString().split('T')[0];
    const yesterdayMoment = `${yesterday.getFullYear()}-${yesterday.toLocaleString('default', { month: 'long' })}-${String(yesterday.getDate()).padStart(2, '0')}`;

    let filteredData = [];
    
    switch (filter) {
      case 'today':
        filteredData = allData.filter(record => 
          record.date === todayMoment || record.date.startsWith(todayFormatted)
        );
        break;
      case 'yesterday':
        filteredData = allData.filter(record => 
          record.date === yesterdayMoment || record.date.startsWith(yesterdayFormatted)
        );
        break;
      case 'all':
        filteredData = allData;
        break;
      default:
        filteredData = allData.filter(record => 
          record.date === todayMoment || record.date.startsWith(todayFormatted)
        );
    }
    
    setAttendanceData(filteredData);
  };

  const handleAttendanceFilterChange = (filter) => {
    setAttendanceFilter(filter);
    filterAttendanceData(allAttendanceData, filter);
  };

  const exportAttendanceToCSV = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthData = allAttendanceData.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    });

    const csvContent = [
      ['Date', 'Employee', 'Email', 'Role', 'Status', 'Check In', 'Check Out', 'Hours Worked'],
      ...monthData.map(record => [
        record.date,
        record.employee.user.name,
        record.employee.user.email,
        record.employee.designation,
        record.status,
        record.checkInTime ? record.checkInTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A',
        record.checkOutTime ? record.checkOutTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A',
        record.hoursWorked
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance-${new Date().toLocaleString('default', { month: 'long' })}-${currentYear}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };
  
  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchLeaves(),
        fetchEmployees(), 
        fetchProfileRequests(),
        fetchApprovals(),
        fetchAttendance()
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Action handlers
  const reviewLeave = async (id, action) => {
    try {
      await axios.put(`${backendUrl}/api/leaves/${id}/review`, { action }, { withCredentials: true });
      await fetchLeaves();
    } catch (err) {
      console.error(err);
    }
  };
  
  const reviewProfileRequest = async (requestId, action) => {
    try {
      await axios.put(`${backendUrl}/api/employee/profile-update/${requestId}/review`, 
        { action }, 
        { withCredentials: true }
      );
      await fetchProfileRequests();
    } catch (err) {
      console.error(err);
    }
  };

  // Approvals actions
  const approveRegistration = async (userId) => {
    try {
      await axios.put(`${backendUrl}/api/users/approvals/${userId}/approve`, {}, { withCredentials: true });
      toast.success('User approved');
      await fetchApprovals();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Failed to approve user';
      toast.error(msg);
    }
  };

  const rejectRegistration = async (userId) => {
    try {
      const reason = window.prompt('Enter rejection reason (optional):') || '';
      await axios.put(`${backendUrl}/api/users/approvals/${userId}/reject`, { reason }, { withCredentials: true });
      toast.info('User rejected');
      await fetchApprovals();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Failed to reject user';
      toast.error(msg);
    }
  };

  // HR broadcast announcement (simple, no meeting fields)
  const handleAnnouncement = async (formData) => {
    try {
      setAnnounceLoading(true);
      await axios.post(`${backendUrl}/api/notifications/broadcast`, {
        title: formData.title,
        message: formData.message,
        category: formData.category || 'General'
      }, { withCredentials: true });
      // reset form
      setAnnounceForm({ title: '', message: '', category: 'General' });
      toast.success('Announcement sent to all employees');
    } catch (err) {
      console.error('Failed to send announcement', err);
      const msg = err?.response?.data?.message 
        || err?.response?.data?.Message 
        || err?.response?.data?.error 
        || err.message 
        || 'Failed to send announcement';
      toast.error(msg);
    } finally {
      setAnnounceLoading(false);
    }
  };
  
  const viewEmployeeProfile = async (employee) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/employee/employees/${employee._id}`, 
        { withCredentials: true }
      );
      setSelectedEmployee(data);
      setShowProfileModal(true);
    } catch (err) {
      console.error('Error fetching employee profile:', err);
      toast.error('Failed to load employee profile');
    }
  };

  // HR/Admin can update employee status; Manager restrictions handled on backend
  const updateEmployeeStatus = async (employeeId, status) => {
    try {
      await axios.put(
        `${backendUrl}/api/employee/employees/${employeeId}/status`,
        { status },
        { withCredentials: true }
      );
      toast.success('Employee status updated');
      await fetchEmployees();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to update status');
    }
  };

  // Attendance actions for header
  const handleCheckIn = async () => {
    try {
      setCheckingIn(true);
      await axios.post(`${backendUrl}/api/attendance/check-in`, {}, { withCredentials: true });
      await fetchAttendanceData();
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setCheckingOut(true);
      await axios.put(`${backendUrl}/api/attendance/check-out`, {}, { withCredentials: true });
      await fetchAttendanceData();
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingOut(false);
    }
  };

  // Fetch current user data
  const fetchCurrentUser = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/users/get-details`, { withCredentials: true });
      if (data.success && data.userData) {
        setCurrentUser(mapUser(data.userData));
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  // Fetch attendance data
  const fetchAttendanceData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/employee/dashboard`, { withCredentials: true });
      if (data?.attendance) {
        setAttendance(data.attendance);
        const status = data.attendance?.status || 'No record';
        setAttendanceStatus(status);
        setAttendanceVariant(
          status === 'Present' ? 'success' : 
          status === 'Absent' ? 'danger' : 'secondary'
        );
      }
      // Prompt for profile completion if employee profile is missing
      setNeedsProfile(!data?.employee);
    } catch (err) {
      console.error('Error fetching attendance data:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
    fetchCurrentUser();
    fetchAttendanceData();
    
    // Update time every second for live clock
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <DashboardLayout roleTitle="HR">
      <WelcomeHeader 
        user={currentUser}
        now={now}
        attendanceStatus={attendanceStatus}
        attendanceVariant={attendanceVariant}
        checkingIn={checkingIn}
        checkingOut={checkingOut}
        attendance={attendance}
        handleCheckIn={handleCheckIn}
        handleCheckOut={handleCheckOut}
      />
      <HRDashboardStats stats={stats} loading={loading} />

      {needsProfile && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center mt-3">
          <div>
            <strong>Complete your employee profile.</strong> Some features require additional details like department and designation.
          </div>
          <Button variant="primary" onClick={() => setShowCompleteProfile(true)}>
            Complete Profile
          </Button>
        </div>
      )}
      <Row className="mb-3">
        <Col>
          <Button as={Link} to="/hr/salaries" variant="dark">Manage Salaries</Button>
        </Col>
      </Row>

      {/* Account Approvals */}
      <Row className="g-4 mt-1">
        <Col md={12}>
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Account Approvals</h5>
              <Button size="sm" variant="outline-secondary" onClick={fetchApprovals} disabled={approvalsLoading}>
                {approvalsLoading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
            <div className="card-body">
              {approvals.length === 0 ? (
                <p className="mb-0 text-muted">No pending approvals</p>
              ) : (
                <div className="table-responsive">
                  <Table hover size="sm">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Requested</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvals.map((u) => (
                        <tr key={u._id}>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td><Badge bg="secondary">{u.role}</Badge></td>
                          <td>{u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}</td>
                          <td>
                            <Button size="sm" variant="success" className="me-2" onClick={() => approveRegistration(u._id)}>Approve</Button>
                            <Button size="sm" variant="outline-danger" onClick={() => rejectRegistration(u._id)}>Reject</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
      
      <Row className="g-4">
        <Col md={8}>
          <LeaveManagementCard 
            leaves={leaves}
            loading={loading}
            showAll={showAllLeaves}
            setShowAll={setShowAllLeaves}
            onRefresh={fetchLeaves}
            onReview={reviewLeave}
          />
        </Col>
        <Col md={4}>
          <HRAnnouncementCard 
            announceForm={announceForm}
            setAnnounceForm={setAnnounceForm}
            onSubmit={handleAnnouncement}
            loading={announceLoading}
          />
        </Col>
      </Row>
      
      <Row className="g-4 mt-1">
        <Col md={8}>
          <EmployeeManagementCard 
            employees={employees}
            loading={loading}
            showAll={showAllEmployees}
            setShowAll={setShowAllEmployees}
            onRefresh={fetchEmployees}
            onViewProfile={viewEmployeeProfile}
            onUpdateStatus={updateEmployeeStatus}
          />
        </Col>
        <Col md={4}>
          <ProfileRequestsCard 
            requests={profileRequests}
            loading={loading}
            showAll={showAllRequests}
            setShowAll={setShowAllRequests}
            onRefresh={fetchProfileRequests}
            onReview={reviewProfileRequest}
          />
        </Col>
      </Row>
      
      <Row className="g-4 mt-1">
        <Col xs={12}>
          <AttendanceOverviewCard 
            attendanceData={attendanceData}
            loading={loading}
            showAll={showAllAttendance}
            setShowAll={setShowAllAttendance}
            onRefresh={fetchAttendance}
            attendanceFilter={attendanceFilter}
            onFilterChange={handleAttendanceFilterChange}
            onExport={exportAttendanceToCSV}
          />
        </Col>
      </Row>

      {/* Complete Profile Modal */}
      <Modal
        show={showCompleteProfile}
        onHide={() => setShowCompleteProfile(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Complete Your Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UniversalCompleteProfile
            userId={currentUser?._id}
            userRole={currentUser?.role}
            onClose={() => setShowCompleteProfile(false)}
          />
        </Modal.Body>
      </Modal>
      
      {/* Employee Profile Modal */}
      {selectedEmployee && (
        <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Employee Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={4} className="text-center">
                {selectedEmployee.user?.profileImage ? (
                  <img 
                    src={
                      selectedEmployee.user?.profileImage?.startsWith('http')
                        ? selectedEmployee.user.profileImage
                        : `${(backendUrl || '').replace(/\/$/, '')}/${(selectedEmployee.user.profileImage || '').replace(/^\/+/, '')}`
                    }
                    alt={selectedEmployee.user?.name || 'Employee'}
                    className="rounded-circle mb-3"
                    style={{ width: 100, height: 100, objectFit: 'cover', border: '3px solid #007bff' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center mx-auto mb-3" 
                  style={{ 
                    width: 100, 
                    height: 100, 
                    fontSize: '32px',
                    display: selectedEmployee.user?.profileImage ? 'none' : 'flex'
                  }}
                >
                  {selectedEmployee.user?.name?.charAt(0) || 'U'}
                </div>
                
                <h4>{selectedEmployee.user?.name || 'Unknown'}</h4>
                <p className="text-muted mb-2">{selectedEmployee.designation || 'No designation'}</p>
                <Badge bg={selectedEmployee.status === 'Active' ? 'success' : 'secondary'} className="mb-3">
                  {selectedEmployee.status || 'Unknown'}
                </Badge>
              </Col>
              <Col md={8}>
                <h5 className="mb-3">Contact Information</h5>
                <Table borderless size="sm" className="mb-4">
                  <tbody>
                    <tr>
                      <td style={{ width: '30%' }}><strong>Email:</strong></td>
                      <td>{selectedEmployee.user?.email || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Phone:</strong></td>
                      <td>{selectedEmployee.phone || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Address:</strong></td>
                      <td>{selectedEmployee.address || 'N/A'}</td>
                    </tr>
                  </tbody>
                </Table>

                <h5 className="mb-3">Work Information</h5>
                <Table borderless size="sm">
                  <tbody>
                    <tr>
                      <td style={{ width: '30%' }}><strong>Department:</strong></td>
                      <td>{selectedEmployee.department || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Designation:</strong></td>
                      <td>{selectedEmployee.designation || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Joining Date:</strong></td>
                      <td>{selectedEmployee.joiningDate ? new Date(selectedEmployee.joiningDate).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default HRDashboard;
