import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../Dashboard/DashboardLayout';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import WelcomeHeader from '../Employee/components/WelcomeHeader';
import { Row, Col, Table, Badge, Button, Modal } from 'react-bootstrap';
import AdminDashboardStats from './components/AdminDashboardStats';
import RecentEmployeesCard from './components/RecentEmployeesCard';
import RecentTasksCard from './components/RecentTasksCard';
import ProfileRequestsManagementCard from './components/ProfileRequestsManagementCard';
import AdminAnnouncementCard from './components/AdminAnnouncementCard';
import AttendanceOverviewCard from '../HR/components/AttendanceOverviewCard';
import { toast } from 'react-toastify';
import UniversalCompleteProfile from '../Dashboard/components/UniversalCompleteProfile';

const AdminDashboard = () => {
  const { backendUrl } = useContext(AppContent);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, employees: 0, tasks: 0, pendingRequests: 0 });
  const [overview, setOverview] = useState({ recentEmployees: [], recentTasks: [] });
  const [requests, setRequests] = useState([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [announceLoading, setAnnounceLoading] = useState(false);
  const [announceForm, setAnnounceForm] = useState({ title: '', message: '', category: 'General' });
  const [showAllEmployees, setShowAllEmployees] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [showAllAttendance, setShowAllAttendance] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [allAttendanceData, setAllAttendanceData] = useState([]);
  const [attendanceFilter, setAttendanceFilter] = useState('today');
  // Approvals state (Admin sees HR and Manager pending accounts)
  const [approvals, setApprovals] = useState([]);
  const [approvalsLoading, setApprovalsLoading] = useState(false);
  
  // User and time state for welcome header
  const [currentUser, setCurrentUser] = useState(null);
  const [now, setNow] = useState(new Date());
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [needsProfile, setNeedsProfile] = useState(false);
  
  // (removed duplicate useEffect that declared local fetchers)
  
  // Attendance state
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [attendance, setAttendance] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState('No record');
  const [attendanceVariant, setAttendanceVariant] = useState('secondary');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [statsRes, overviewRes] = await Promise.all([
        axios.get(`${backendUrl}/api/admin/stats`, { withCredentials: true }),
        axios.get(`${backendUrl}/api/admin/overview`, { withCredentials: true }),
      ]);
      setStats({
        users: statsRes.data?.users || 0,
        employees: statsRes.data?.employees || 0,
        tasks: statsRes.data?.tasks || 0,
        pendingRequests: overviewRes.data?.stats?.pendingRequests || 0,
      });
      setOverview({
        recentEmployees: overviewRes.data?.recentEmployees || [],
        recentTasks: overviewRes.data?.recentTasks || [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileRequests = async () => {
    try {
      setReqLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/employee/profile-update`, { withCredentials: true });
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setReqLoading(false);
    }
  };

  // Approvals: fetch and actions
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

  const reviewRequest = async (id, action) => {
    try {
      await axios.put(`${backendUrl}/api/employee/profile-update/${id}/review`, { action }, { withCredentials: true });
      await fetchProfileRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const sendAnnouncement = async () => {
    try {
      setAnnounceLoading(true);
      await axios.post(`${backendUrl}/api/notifications/broadcast`, announceForm, { withCredentials: true });
      setAnnounceForm({ title: '', message: '', category: 'General' });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setAnnounceLoading(false);
    }
  };

  // Fetch current user data
  const fetchCurrentUser = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/users/get-details`, { withCredentials: true });
      if (data.success && data.userData) {
        setCurrentUser(data.userData);
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
        setAttendanceVariant(status === 'Present' ? 'success' : status === 'Absent' ? 'danger' : 'secondary');
      }
      // Flag if this user has no employee profile yet
      setNeedsProfile(!data?.employee);
    } catch (err) {
      console.error('Error fetching attendance data:', err);
    }
  };

  // Handle check-in
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

  // Handle check-out
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

  // Transform a raw attendance record into UI-friendly shape (same approach as HR)
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
    checkInTime: record.checkIn && record.checkIn !== 'N/A'
      ? (() => {
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
        })()
      : null,
    checkOutTime: record.checkOut && record.checkOut !== 'N/A'
      ? (() => {
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
        })()
      : null,
    hoursWorked: record.totalHours || 0
  });

  // Apply filter to allAttendanceData and update attendanceData
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
          record.date === todayMoment || (typeof record.date === 'string' && record.date.startsWith(todayFormatted))
        );
        break;
      case 'yesterday':
        filteredData = allData.filter(record =>
          record.date === yesterdayMoment || (typeof record.date === 'string' && record.date.startsWith(yesterdayFormatted))
        );
        break;
      case 'all':
        filteredData = allData;
        break;
      default:
        filteredData = allData.filter(record =>
          record.date === todayMoment || (typeof record.date === 'string' && record.date.startsWith(todayFormatted))
        );
    }
    setAttendanceData(filteredData);
  };

  // Fetch attendance records for admin view
  const fetchAttendanceRecords = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/attendance/get-all`, { withCredentials: true });
      const transformedData = (data.data || []).map(transformAttendanceRecord);
      setAllAttendanceData(transformedData);
      filterAttendanceData(transformedData, attendanceFilter);
    } catch (err) {
      console.error('Error fetching attendance records:', err);
      setAttendanceData([]);
    }
  };

  // Handle filter change from UI
  const handleAttendanceFilterChange = (filter) => {
    setAttendanceFilter(filter);
    filterAttendanceData(allAttendanceData, filter);
  };

  // Export current month's attendance to CSV (same as HR)
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

  useEffect(() => {
    fetchStats();
    fetchProfileRequests();
    fetchCurrentUser();
    fetchAttendanceData();
    fetchAttendanceRecords();
    fetchApprovals();
    
    // Update time every second for live clock
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

    return (
        <DashboardLayout roleTitle="Admin">
      <WelcomeHeader 
        user={currentUser || {}} 
        now={now}
        attendanceStatus={attendanceStatus}
        attendanceVariant={attendanceVariant}
        checkingIn={checkingIn}
        checkingOut={checkingOut}
        attendance={attendance}
        handleCheckIn={handleCheckIn}
        handleCheckOut={handleCheckOut}
      />
      
      <AdminDashboardStats stats={stats} loading={loading} />

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

      <Row className="g-4 mt-1">
        <Col xs={12} md={6}>
          <RecentEmployeesCard
            employees={overview.recentEmployees}
            loading={loading}
            showAll={showAllEmployees}
            setShowAll={setShowAllEmployees}
            onRefresh={fetchStats}
          />
        </Col>
        <Col xs={12} md={6}>
          <RecentTasksCard
            tasks={overview.recentTasks}
            loading={loading}
            showAll={showAllTasks}
            setShowAll={setShowAllTasks}
            onRefresh={fetchStats}
          />
        </Col>
      </Row>

      {/* Account Approvals */}
      <Row className="g-4 mt-4">
        <Col xs={12}>
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

      <Row className="g-4 mt-4">
        <Col xs={12} md={8}>
          <ProfileRequestsManagementCard
            requests={requests}
            loading={reqLoading}
            showAll={showAllRequests}
            setShowAll={setShowAllRequests}
            onRefresh={fetchProfileRequests}
            onReviewRequest={reviewRequest}
          />
        </Col>
        <Col xs={12} md={4}>
          <AdminAnnouncementCard
            announceForm={announceForm}
            setAnnounceForm={setAnnounceForm}
            announceLoading={announceLoading}
            onSendAnnouncement={sendAnnouncement}
          />
        </Col>
      </Row>

      <Row className="g-4 mt-4">
        <Col xs={12}>
          <AttendanceOverviewCard 
            attendanceData={attendanceData}
            loading={loading}
            showAll={showAllAttendance}
            setShowAll={setShowAllAttendance}
            onRefresh={fetchAttendanceRecords}
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
        </DashboardLayout>
    );
};

export default AdminDashboard;
