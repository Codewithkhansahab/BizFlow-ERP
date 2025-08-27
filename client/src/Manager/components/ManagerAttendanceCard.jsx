import React, { useState, useEffect } from 'react';
import { Card, Badge, Spinner, Button } from 'react-bootstrap';
import { FaClock, FaSignInAlt, FaSignOutAlt, FaSync } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const ManagerAttendanceCard = () => {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { backendUrl } = useAuth();

  useEffect(() => {
    fetchTodaysAttendance();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update time every minute
    return () => clearInterval(timer);
  }, []);

  const fetchTodaysAttendance = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/attendance/today`, {
        withCredentials: true
      });
      setAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/attendance/checkin`,
        {},
        { withCredentials: true }
      );
      toast.success('Checked in successfully');
      await fetchTodaysAttendance();
    } catch (error) {
      console.error('Error checking in:', error);
      toast.error(error.response?.data?.message || 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/attendance/checkout`,
        {},
        { withCredentials: true }
      );
      toast.success('Checked out successfully');
      await fetchTodaysAttendance();
    } catch (error) {
      console.error('Error checking out:', error);
      toast.error(error.response?.data?.message || 'Failed to check out');
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusVariant = () => {
    if (!attendance) return 'secondary';
    if (attendance.checkOut) return 'success';
    if (attendance.checkIn) return 'warning';
    return 'secondary';
  };

  const getStatusText = () => {
    if (!attendance) return 'Not Checked In';
    if (attendance.checkOut) return 'Checked Out';
    if (attendance.checkIn) return 'Checked In';
    return 'Not Checked In';
  };

  return (
    <Card className="shadow-sm h-100">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <Card.Title className="mb-0">
          <FaClock className="me-2" />
          My Attendance
        </Card.Title>
        <Button 
          variant="outline-secondary" 
          size="sm" 
          onClick={fetchTodaysAttendance}
          disabled={loading}
        >
          <FaSync className={loading ? 'fa-spin' : ''} />
        </Button>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div className="d-flex flex-column h-100">
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Status</span>
                <Badge bg={getStatusVariant()} className="px-3 py-2">
                  {getStatusText()}
                </Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Current Time</span>
                <span className="fw-semibold">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">
                  <FaSignInAlt className="me-1" /> Check-in
                </span>
                <span className="fw-semibold">
                  {formatTime(attendance?.checkIn)}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">
                  <FaSignOutAlt className="me-1" /> Check-out
                </span>
                <span className="fw-semibold">
                  {formatTime(attendance?.checkOut)}
                </span>
              </div>
            </div>
            <div className="mt-auto d-grid gap-2">
              {!attendance?.checkIn ? (
                <Button 
                  variant="primary" 
                  onClick={handleCheckIn}
                  disabled={loading}
                >
                  Check In
                </Button>
              ) : !attendance?.checkOut ? (
                <Button 
                  variant="outline-primary" 
                  onClick={handleCheckOut}
                  disabled={loading}
                >
                  Check Out
                </Button>
              ) : (
                <Button variant="outline-secondary" disabled>
                  Completed for Today
                </Button>
              )}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ManagerAttendanceCard;
