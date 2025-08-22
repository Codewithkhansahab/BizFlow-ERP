import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, Modal, ProgressBar, Badge, Button, Table } from 'react-bootstrap';
import DashboardLayout from '../Dashboard/DashboardLayout';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContent } from '../context/AppContext';
import WelcomeHeader from '../Employee/components/WelcomeHeader';
import DashboardStats from './components/DashboardStats';
import TaskManagementCard from './components/TaskManagementCard';
import TeamOverviewCard from './components/TeamOverviewCard';
import TaskCreationModal from './components/TaskCreationModal';
import ProfileUpdateRequestsCard from './components/ProfileUpdateRequestsCard';
import QuickAnnouncementCard from './components/QuickAnnouncementCard';

const ManagerDashboard = () => {
  const { backendUrl } = useContext(AppContent);
  
  // Task management state
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({ 
    title: '', 
    description: '', 
    assignedTo: '', 
    dueDate: '', 
    priority: 'Medium',
    status: 'Pending'
  });
  const [taskLoading, setTaskLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const viewTaskDetails = (task) => {
    setSelectedTask(task);
  };

  // Update employee status (Admin/HR/Manager; Manager limited by backend to same department)
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

  // Employee overview state
  const [empLoading, setEmpLoading] = useState(false);
  
  // Announcement/broadcast state
  const [announceLoading, setAnnounceLoading] = useState(false);
  const [announceForm, setAnnounceForm] = useState({ title: '', message: '', category: 'General' });
  
  // Profile requests state (missing in original)
  const [requests, setRequests] = useState([]);
  const [reqLoading, setReqLoading] = useState(false);
  
  // Dashboard stats
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeTasks: 0,
    completedTasks: 0,
    pendingRequests: 0
  });
  
  // Modal states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  // User and time state for welcome header
  const [currentUser, setCurrentUser] = useState(null);
  const [now, setNow] = useState(new Date());
  
  // Attendance state
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [attendance, setAttendance] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState('No record');
  const [attendanceVariant, setAttendanceVariant] = useState('secondary');
  
  // Pagination states
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [showAllEmployees, setShowAllEmployees] = useState(false);

  // Fetch employees for task assignment dropdown - backend will filter for managers
  const fetchEmployees = async () => {
    try {
      setEmpLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/employee/employees`, { withCredentials: true });
      setEmployees(Array.isArray(data) ? data : []);
      setStats(prev => ({ ...prev, totalEmployees: data.length }));
    } catch (err) {
      console.error(err);
    } finally {
      setEmpLoading(false);
    }
  };

  // Missing function: fetchProfileRequests
  const fetchProfileRequests = async () => {
    try {
      setReqLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/employee/profile-update`, { withCredentials: true });
      setRequests(Array.isArray(data) ? data : []);
      setStats(prev => ({ ...prev, pendingRequests: data.filter(r => r.status === 'Pending').length }));
    } catch (err) {
      console.error(err);
    } finally {
      setReqLoading(false);
    }
  };

  // Missing function: reviewRequest
  const reviewRequest = async (requestId, action) => {
    try {
      await axios.put(`${backendUrl}/api/employee/profile-update/${requestId}/review`, 
        { action }, 
        { withCredentials: true }
      );
      await fetchProfileRequests(); // Refresh the list
    } catch (err) {
      console.error(err);
    }
  };


  // View employee profile
  const viewEmployeeProfile = async (employee) => {
    try {
      console.log('Fetching profile for employee:', employee._id);
      const { data } = await axios.get(`${backendUrl}/api/employee/employees/${employee._id}`, 
        { withCredentials: true }
      );
      console.log('Profile data received:', data);
      setSelectedEmployee(data);
      setShowProfileModal(true);
    } catch (err) {
      console.error('Error fetching employee profile:', err);
      // Fallback: use the employee data we already have
      setSelectedEmployee(employee);
      setShowProfileModal(true);
    }
  };

  // Fetch tasks created by the manager
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/tasks/my-created`, { withCredentials: true });
      setTasks(Array.isArray(data) ? data : []);
      setStats(prev => ({ 
        ...prev, 
        activeTasks: data.filter(t => t.status !== 'Completed').length,
        completedTasks: data.filter(t => t.status === 'Completed').length
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle task form submission
  const submitTask = async (e) => {
    e.preventDefault();
    try {
      setTaskLoading(true);
      await axios.post(`${backendUrl}/api/tasks`, {
        title: taskForm.title,
        description: taskForm.description,
        assignedToEmployeeId: taskForm.assignedTo,
        dueDate: taskForm.dueDate,
        priority: taskForm.priority
      }, { withCredentials: true });
      setTaskForm({ title: '', description: '', assignedTo: '', dueDate: '', priority: 'Medium', status: 'Pending' });
      setShowTaskModal(false);
      await fetchTasks();
      toast.success('Task created successfully');
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err.message || 'Failed to create task';
      toast.error(msg);
    } finally {
      setTaskLoading(false);
    }
  };

  // Handle announcement/broadcast submission
  const submitAnnouncement = async (e) => {
    e.preventDefault();
    try {
      setAnnounceLoading(true);
      await axios.post(`${backendUrl}/api/notifications/broadcast`, announceForm, { withCredentials: true });
      setAnnounceForm({ title: '', message: '', category: 'General' });
    } catch (err) {
      console.error(err);
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

      // Merge designation/department from employee profile for header display
      if (data?.user || data?.employee) {
        setCurrentUser(prev => {
          const base = prev || data.user || {};
          return {
            ...base,
            designation: data.employee?.designation || base.designation,
            department: data.employee?.department || base.department,
          };
        });
      }
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

  // Initialize data on component mount
  useEffect(() => {
    fetchEmployees();
    fetchTasks();
    fetchProfileRequests();
    fetchCurrentUser();
    fetchAttendanceData();
    
    // Update time every second for live clock
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <DashboardLayout roleTitle="Manager">
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
      <DashboardStats stats={stats} loading={loading} />

      <TaskCreationModal 
        show={showTaskModal}
        onHide={() => setShowTaskModal(false)}
        taskForm={taskForm}
        setTaskForm={setTaskForm}
        employees={employees}
        submitTask={submitTask}
        taskLoading={taskLoading}
      />

      <Row className="g-4">
        <Col md={8}>
          <TaskManagementCard 
            tasks={tasks}
            tasksLoading={loading}
            showAllTasks={showAllTasks}
            setShowAllTasks={setShowAllTasks}
            fetchTasks={fetchTasks}
            viewTaskDetails={viewTaskDetails}
            onCreateTask={() => setShowTaskModal(true)}
          />
        </Col>
        <Col md={4}>
          <QuickAnnouncementCard 
            announceForm={announceForm}
            setAnnounceForm={setAnnounceForm}
            submitAnnouncement={submitAnnouncement}
            announceLoading={announceLoading}
          />
        </Col>
      </Row>

      <Row className="g-4 mt-1">
        <Col md={8}>
          <TeamOverviewCard 
            employees={employees}
            empLoading={empLoading}
            showAllEmployees={showAllEmployees}
            setShowAllEmployees={setShowAllEmployees}
            fetchEmployees={fetchEmployees}
            viewEmployeeProfile={viewEmployeeProfile}
            updateEmployeeStatus={updateEmployeeStatus}
          />
        </Col>
        <Col md={4}>
          <ProfileUpdateRequestsCard 
            requests={requests}
            reqLoading={reqLoading}
            showAllRequests={showAllRequests}
            setShowAllRequests={setShowAllRequests}
            fetchProfileRequests={fetchProfileRequests}
            reviewRequest={reviewRequest}
          />
        </Col>
      </Row>

      {/* Task Detail Modal */}
      {selectedTask && (
        <Modal show={!!selectedTask} onHide={() => setSelectedTask(null)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Task Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={8}>
                <h5>{selectedTask.title}</h5>
                <p className="text-muted">{selectedTask.description || 'No description provided'}</p>
                
                <div className="mb-3">
                  <strong>Assigned To:</strong> {selectedTask.assignedTo?.user?.name || 'Unknown'}
                  {selectedTask.assignedTo?.designation ? (
                    <span className="text-muted"> ({selectedTask.assignedTo.designation})</span>
                  ) : null}
                </div>
                
                <div className="mb-3">
                  <strong>Due Date:</strong> {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'Not set'}
                </div>
                
                <div className="mb-3">
                  <strong>Priority:</strong> 
                  <Badge bg={
                    selectedTask.priority === 'High' ? 'danger' : 
                    selectedTask.priority === 'Medium' ? 'warning' : 'success'
                  } className="ms-2">
                    {selectedTask.priority}
                  </Badge>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center">
                  <h6>Progress</h6>
                  <div style={{ width: 100, height: 100, margin: '0 auto' }}>
                    <ProgressBar 
                      now={selectedTask.progress || 0}
                      label={`${selectedTask.progress || 0}%`}
                      style={{ height: 20 }}
                      variant={
                        (selectedTask.progress || 0) === 100 ? 'success' :
                        (selectedTask.progress || 0) >= 50 ? 'info' : 'warning'
                      }
                    />
                  </div>
                  <Badge bg={
                    selectedTask.status === 'Completed' ? 'success' : 
                    selectedTask.status === 'In Progress' ? 'info' : 'secondary'
                  } className="mt-2">
                    {selectedTask.status}
                  </Badge>
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedTask(null)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

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
                    src={selectedEmployee.user?.profileImage?.startsWith('http')
                      ? selectedEmployee.user.profileImage
                      : `${(backendUrl || '').replace(/\/$/, '')}/${(selectedEmployee.user.profileImage || '').replace(/^\/+/, '')}`}
                    alt={selectedEmployee.user?.name || 'Employee'}
                    className="rounded-circle mb-3"
                    style={{ width: 110, height: 110, objectFit: 'cover', border: '2px solid #e9ecef' }}
                  />
                ) : (
                  <div 
                    className="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center mx-auto mb-3" 
                    style={{ width: 110, height: 110, fontSize: '32px' }}
                  >
                    {selectedEmployee.user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                
                <h4>{selectedEmployee.user?.name || 'Unknown'}</h4>
                <p className="text-muted mb-2">{selectedEmployee.designation || 'No designation'}</p>
                <Badge bg={(selectedEmployee.status === 'Active' || !selectedEmployee.status) ? 'success' : 'secondary'} className="mb-3">
                  {selectedEmployee.status || 'Active'}
                </Badge>
                <div className="text-muted small">
                  Employee ID: {selectedEmployee._id?.slice(-6) || 'N/A'}
                </div>
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
                <Table borderless size="sm" className="mb-4">
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
                    <tr>
                      <td><strong>Role:</strong></td>
                      <td>
                        <Badge bg="info" className="text-white">
                          {selectedEmployee.user?.role || 'N/A'}
                        </Badge>
                      </td>
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

export default ManagerDashboard;
