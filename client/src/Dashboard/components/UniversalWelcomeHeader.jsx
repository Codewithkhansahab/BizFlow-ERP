import React, { useState, useEffect } from 'react';
import { Badge, Button } from 'react-bootstrap';

const UniversalWelcomeHeader = ({ 
  user, 
  roleTitle,
  attendanceStatus, 
  attendanceVariant, 
  checkingIn, 
  checkingOut, 
  attendance, 
  handleCheckIn, 
  handleCheckOut,
  showAttendanceControls = false
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const getWelcomeMessage = () => {
    const hour = currentTime.getHours();
    const name = user?.name || 'User';
    
    if (hour < 12) {
      return `Good morning, ${name}! ☀️`;
    } else if (hour < 17) {
      return `Good afternoon, ${name}! 🌤️`;
    } else {
      return `Good evening, ${name}! 🌙`;
    }
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Ready to make today amazing!",
      "Let's achieve great things together!",
      "Your dedication makes a difference!",
      "Time to turn ideas into reality!",
      "Every day is a new opportunity!",
      "Success starts with showing up!",
      "Let's make progress happen!"
    ];
    
    const today = new Date().getDate();
    return messages[today % messages.length];
  };

  const getRoleSpecificGradient = () => {
    switch(roleTitle?.toLowerCase()) {
      case 'employee':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'manager':
        return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'hr':
        return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      case 'admin':
        return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
      default:
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  return (
    <div className="pb-3" style={{
      background: getRoleSpecificGradient(),
      borderRadius: '16px',
      color: '#fff',
      padding: '28px',
      marginBottom: '24px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    }}>
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <h2 className="mb-2" style={{ fontSize: '1.8rem', fontWeight: '600' }}>
            {getWelcomeMessage()}
          </h2>
          <div className="opacity-85 mb-1" style={{ fontSize: '1.1rem' }}>
            {getMotivationalMessage()}
          </div>
          <div className="opacity-70" style={{ fontSize: '0.95rem' }}>
            {user?.designation && `${user.designation} • `}
            {user?.department || roleTitle || 'Team Member'}
          </div>
        </div>
        
        <div className="d-flex align-items-center gap-2">
          <div className="bg-dark text-white rounded px-3 py-2 fw-monospace">
            {currentTime.toLocaleTimeString()}
          </div>
          
          {showAttendanceControls && (
            <>
              {attendanceStatus && (
                <Badge bg={attendanceVariant} className="fs-6 px-3 py-2">
                  Today: {attendanceStatus}
                </Badge>
              )}
              
              {handleCheckIn && (
                <Button
                  variant="light"
                  disabled={checkingIn || attendance?.status === 'Present'}
                  onClick={handleCheckIn}
                  className="fw-semibold"
                >
                  {checkingIn ? 'Checking in...' : 'Check In'}
                </Button>
              )}
              
              {handleCheckOut && (
                <Button
                  variant="outline-light"
                  disabled={checkingOut || !attendance || attendance?.checkOut}
                  onClick={handleCheckOut}
                  className="fw-semibold"
                >
                  {checkingOut ? 'Checking out...' : 'Check Out'}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversalWelcomeHeader;
