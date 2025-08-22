import React from 'react';
import { Card, Badge } from 'react-bootstrap';

const AttendanceCard = ({ attendance, attendanceStatus, attendanceVariant }) => {
  return (
    <Card className="shadow-sm h-100">
      <Card.Header className="bg-white border-0 pb-0">
        <Card.Title className="mb-0">Today's Attendance</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="d-flex flex-column gap-2">
          <div>
            <Badge bg={attendanceVariant}>{attendanceStatus}</Badge>
          </div>
          <div className="text-muted">Check-in</div>
          <div className="fw-semibold">{attendance?.checkIn ? new Date(attendance.checkIn).toLocaleTimeString() : '-'}</div>
          <div className="text-muted mt-2">Check-out</div>
          <div className="fw-semibold">{attendance?.checkOut ? new Date(attendance.checkOut).toLocaleTimeString() : '-'}</div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AttendanceCard;
