import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

const WorkHoursCard = ({ workHours, formatDurationFromHours }) => {
  return (
    <Card className="shadow-sm h-100">
      <Card.Header className="bg-white border-0 pb-0">
        <Card.Title className="mb-0">Work Hours</Card.Title>
      </Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          <ListGroup.Item className="px-0 d-flex justify-content-between">
            <span className="text-muted">Today</span>
            <span className="fw-semibold">{formatDurationFromHours(workHours.today)}</span>
          </ListGroup.Item>
          <ListGroup.Item className="px-0 d-flex justify-content-between">
            <span className="text-muted">This Week</span>
            <span className="fw-semibold">{formatDurationFromHours(workHours.week)}</span>
          </ListGroup.Item>
          <ListGroup.Item className="px-0 d-flex justify-content-between">
            <span className="text-muted">This Month</span>
            <span className="fw-semibold">{formatDurationFromHours(workHours.month)}</span>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default WorkHoursCard;
