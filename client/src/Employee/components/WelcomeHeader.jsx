import React from 'react';
import { Badge, Button } from 'react-bootstrap';

const WelcomeHeader = ({ 
  user, 
  now, 
  attendanceStatus, 
  attendanceVariant, 
  checkingIn, 
  checkingOut, 
  attendance, 
  handleCheckIn, 
  handleCheckOut 
}) => {
  const getWelcomeMessage = () => {
    const hour = now.getHours();
    const name = user?.name || 'Employee';
    
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

  return (
    <div className="pb-3" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            {user?.department || 'Team Member'}
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="bg-dark text-white rounded px-3 py-2 fw-monospace">
            {now.toLocaleTimeString()}
          </div>
          <Badge bg={attendanceVariant} className="fs-6 px-3 py-2">
            Today: {attendanceStatus}
          </Badge>
          <Button
            variant="light"
            disabled={checkingIn || attendance?.status === 'Present'}
            onClick={handleCheckIn}
            className="fw-semibold"
          >
            {checkingIn ? 'Checking in...' : 'Check In'}
          </Button>
          <Button
            variant="outline-light"
            disabled={checkingOut || !attendance || attendance?.checkOut}
            onClick={handleCheckOut}
            className="fw-semibold"
          >
            {checkingOut ? 'Checking out...' : 'Check Out'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
