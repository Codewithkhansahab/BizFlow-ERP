import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../Dashboard/DashboardLayout';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import WelcomeHeader from '../Employee/components/WelcomeHeader';

const CEODashboard = () => {
    const { backendUrl } = useContext(AppContent);
    const [currentUser, setCurrentUser] = useState(null);
    const [now, setNow] = useState(new Date());
    
    // Attendance state
    const [checkingIn, setCheckingIn] = useState(false);
    const [checkingOut, setCheckingOut] = useState(false);
    const [attendance, setAttendance] = useState(null);
    const [attendanceStatus, setAttendanceStatus] = useState('No record');
    const [attendanceVariant, setAttendanceVariant] = useState('secondary');

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

    useEffect(() => {
        fetchCurrentUser();
        fetchAttendanceData();
        
        // Update time every second for live clock
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <DashboardLayout roleTitle="CEO">
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
            <h2>CEO Dashboard</h2>
            <p>This is your dashboard. Add CEO-specific widgets here.</p>
        </DashboardLayout>
    );
};

export default CEODashboard;
