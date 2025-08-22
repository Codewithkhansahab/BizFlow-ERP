import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, Card, Button, Spinner, Modal, Badge } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';
import DashboardLayout from '../Dashboard/DashboardLayout';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import CompleteProfile from './CompleteProfile';
import NotificationsPanel from './NotificationsPanel';
import LeavePanel from './LeavePanel';
import UniversalWelcomeHeader from '../Dashboard/components/UniversalWelcomeHeader';
import EmployeeDetailsCard from './components/EmployeeDetailsCard';
import CurrentTaskCard from './components/CurrentTaskCard';
import MyTasksCard from './components/MyTasksCard';
import AttendanceCard from './components/AttendanceCard';
import WorkHoursCard from './components/WorkHoursCard';
import ProfileUpdateModal from './components/ProfileUpdateModal';
import WelcomeHeader from './components/WelcomeHeader';
import { Link } from 'react-router-dom';


const EmployeeDashboard = () => {
  const { backendUrl } = useContext(AppContent);

  const [loading, setLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/employee/dashboard`, { withCredentials: true });
      setEmployeeData(data);
    } catch (error) {
      console.error(error);
      setEmployeeData(null);
    } finally {
      setLoading(false);
    }
  };

  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [summary, setSummary] = useState(null);
  const [now, setNow] = useState(new Date());
  const [currentUser, setCurrentUser] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({
    department: '',
    designation: '',
    phone: '',
    address: '',
    joiningDate: '',
    profileImage: '',
  });

  const openRequestModal = () => {
    setRequestForm({
      department: employeeData?.employee?.department || '',
      designation: employeeData?.employee?.designation || '',
      phone: String(employeeData?.employee?.phone || ''),
      address: employeeData?.employee?.address || '',
      joiningDate: employeeData?.employee?.joiningDate ? new Date(employeeData.employee.joiningDate).toISOString().slice(0,10) : '',
      profileImage: employeeData?.user?.profileImage || '',
    });
    setShowRequestModal(true);
  };

  const submitUpdateRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/api/employee/profile-update/request`, requestForm, { withCredentials: true });
      setShowRequestModal(false);
      await fetchLatestRequest();
    } catch (err) {
      console.error(err);
    }
  };

  const [latestRequest, setLatestRequest] = useState(null);
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

  // Set current user data from employeeData as fallback
  const setCurrentUserFromEmployeeData = () => {
    if (employeeData?.user) {
      setCurrentUser(employeeData.user);
    }
  };

  const fetchLatestRequest = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/employee/profile-update/my-latest`, { withCredentials: true });
      setLatestRequest(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSummary = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/attendance/get-summary`, { withCredentials: true });
      setSummary(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Tasks state & handlers (defined before effects to avoid TDZ issues)
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [showAllTasks, setShowAllTasks] = useState(false);

  const fetchTasks = async () => {
    try {
      setTasksLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/tasks/my`, { withCredentials: true });
      setTasks(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setTasksLoading(false);
    }
  };

  const updateTaskProgress = async (taskId, progress) => {
    try {
      setUpdatingTaskId(taskId);
      await axios.put(`${backendUrl}/api/tasks/my/${taskId}`, { progress }, { withCredentials: true });
      await fetchTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleCheckIn = async () => {
    try {
      setCheckingIn(true);
      await axios.post(`${backendUrl}/api/attendance/check-in`, {}, { withCredentials: true });
      await fetchDashboardData();
      await fetchSummary();
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
      await fetchDashboardData();
      await fetchSummary();
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingOut(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchSummary();
    fetchTasks();
    fetchLatestRequest();
    fetchCurrentUser();
  }, []);

  // Set current user when employeeData is loaded
  useEffect(() => {
    setCurrentUserFromEmployeeData();
  }, [employeeData]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <DashboardLayout roleTitle="Employee">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      </DashboardLayout>
    );
  }

  // If employee profile is missing
  if (!employeeData || !employeeData.employee) {
    return (
      <DashboardLayout roleTitle="Employee">
        <div className="text-center mt-5">
          <FaExclamationTriangle size={60} className="mb-3 text-warning" />
          <h3>Please complete your employee profile</h3>
          <p>Some employee-specific information is missing. Click below to update your profile.</p>
          <Button variant="primary" onClick={() => setShowProfileModal(true)}>Complete Profile</Button>

          {/* Modal for Complete Profile Form */}
         <Modal
  show={showProfileModal}
  onHide={() => setShowProfileModal(false)}
  centered
  size="lg"
>
  <Modal.Header closeButton>
    <Modal.Title>Complete Your Profile</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <CompleteProfile
      userId={employeeData?.user?._id}
      onClose={() => setShowProfileModal(false)}
    />
  </Modal.Body>
</Modal>
        </div>
      </DashboardLayout>
    );
  }

  const { user, employee, attendance } = employeeData;

  const attendanceStatus = attendance?.status || 'No record';
  const attendanceVariant = attendanceStatus === 'Present' ? 'success' : attendanceStatus === 'Absent' ? 'danger' : 'secondary';

  const computeHours = () => {
    if (!summary?.attendance) return { today: 0, week: 0, month: 0 };

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    const day = startOfWeek.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let today = 0, week = 0, month = 0;
    for (const rec of summary.attendance) {
      const recDate = rec.isoDate ? new Date(rec.isoDate) : new Date(rec.date);
      const hours = Number(rec.totalHours || 0);
      if (!isNaN(recDate.getTime())) {
        if (recDate >= startOfMonth) month += hours;
        if (recDate >= startOfWeek) week += hours;
        if (recDate >= startOfToday) today += hours;
      }
    }
    return {
      today: Number(today.toFixed(2)),
      week: Number(week.toFixed(2)),
      month: Number(month.toFixed(2)),
    };
  };

  const workHours = computeHours();

  const getPriorityScore = (p) => {
    if (p === 'High') return 3;
    if (p === 'Medium') return 2;
    if (p === 'Low') return 1;
    return 0;
  };

  const getCurrentTask = (allTasks) => {
    if (!Array.isArray(allTasks) || allTasks.length === 0) return null;
    const active = allTasks.filter((t) => t.status !== 'Completed');
    const pool = active.length > 0 ? active : allTasks;

    const sorted = [...pool].sort((a, b) => {
      const aHasDue = !!a.dueDate;
      const bHasDue = !!b.dueDate;
      if (aHasDue && !bHasDue) return -1;
      if (!aHasDue && bHasDue) return 1;
      if (aHasDue && bHasDue) {
        const aTime = new Date(a.dueDate).getTime();
        const bTime = new Date(b.dueDate).getTime();
        if (!isNaN(aTime) && !isNaN(bTime) && aTime !== bTime) {
          return aTime - bTime; // nearest due date first
        }
      }
      // tie-breaker by priority (High > Medium > Low)
      const pDiff = getPriorityScore(b.priority) - getPriorityScore(a.priority);
      if (pDiff !== 0) return pDiff;
      // then by lower progress (needs more work)
      const aProg = typeof a.progress === 'number' ? a.progress : 0;
      const bProg = typeof b.progress === 'number' ? b.progress : 0;
      if (aProg !== bProg) return aProg - bProg;
      // finally by createdAt (newest first)
      const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bCreated - aCreated;
    });

    return sorted[0] || null;
  };

  const currentTask = getCurrentTask(tasks);


  const formatDurationFromHours = (h) => {
    const totalSeconds = Math.max(0, Math.round((h || 0) * 3600));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
  <DashboardLayout roleTitle="Employee">
    <WelcomeHeader 
      user={currentUser || user}
      now={now}
      attendanceStatus={attendanceStatus}
      attendanceVariant={attendanceVariant}
      checkingIn={checkingIn}
      checkingOut={checkingOut}
      attendance={attendance}
      handleCheckIn={handleCheckIn}
      handleCheckOut={handleCheckOut}
    />
    <Row className="g-4 align-items-start">
      <Col xs={12} lg={6}>
        <EmployeeDetailsCard 
          user={user}
          employee={employee}
          openRequestModal={openRequestModal}
        />
        {latestRequest && (
          <Card className="shadow-sm mt-3">
            <Card.Body className="py-2 d-flex justify-content-between align-items-center">
              <div className="small">
                Last request: <strong>{latestRequest.status}</strong> {latestRequest.reviewedAt ? `on ${new Date(latestRequest.reviewedAt).toLocaleString()}` : ''}
              </div>
              <Badge bg={latestRequest.status === 'Approved' ? 'success' : latestRequest.status === 'Rejected' ? 'danger' : 'warning'}>
                {latestRequest.status}
              </Badge>
            </Card.Body>
          </Card>
        )}
        <CurrentTaskCard 
          currentTask={currentTask}
          tasksLoading={tasksLoading}
          fetchTasks={fetchTasks}
        />

        {/* Move Leaves below Current Task */}
        <div className="mt-4">
          <LeavePanel />
        </div>
      </Col>

      <Col xs={12} lg={6}>
        <Row className="g-4">
          <Col xs={12}>
            <MyTasksCard 
              tasks={tasks}
              tasksLoading={tasksLoading}
              showAllTasks={showAllTasks}
              setShowAllTasks={setShowAllTasks}
              fetchTasks={fetchTasks}
              updateTaskProgress={updateTaskProgress}
              updatingTaskId={updatingTaskId}
            />
          </Col>
          <Col xs={12}>
            <AttendanceCard 
              attendance={attendance}
              attendanceStatus={attendanceStatus}
              attendanceVariant={attendanceVariant}
            />
          </Col>

          <Col xs={12}>
            <WorkHoursCard 
              workHours={workHours}
              formatDurationFromHours={formatDurationFromHours}
            />
          </Col>

          <Col xs={12}>
            <NotificationsPanel backendUrl={backendUrl} />
          </Col>

          <Col xs={12}>
            <Card className="shadow-sm h-100">
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-semibold">Salaries & Payslips</div>
                  <div className="text-muted">View your monthly salary details and payment status.</div>
                </div>
                <Button as={Link} to="/employee/salaries" variant="primary">View</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="fw-semibold">Need to update your details?</div>
                    <div className="text-muted">Contact HR or request an update.</div>
                  </div>
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" onClick={fetchDashboardData}>Refresh</Button>
                    <Button variant="outline-secondary" onClick={fetchSummary}>Refresh Hours</Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>

      <ProfileUpdateModal 
        show={showRequestModal}
        onHide={() => setShowRequestModal(false)}
        requestForm={requestForm}
        setRequestForm={setRequestForm}
        submitUpdateRequest={submitUpdateRequest}
        backendUrl={backendUrl}
      />
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
