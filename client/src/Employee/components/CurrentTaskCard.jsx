import React from 'react';
import { Card, Button, Spinner, Badge } from 'react-bootstrap';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const CurrentTaskCard = ({ currentTask, tasksLoading, fetchTasks }) => {
  return (
    <Card className="shadow-sm mt-4">
      <Card.Header className="bg-white border-0 pb-0 d-flex justify-content-between align-items-center">
        <Card.Title className="mb-0">Current Task Status</Card.Title>
        <Button size="sm" variant="outline-primary" onClick={fetchTasks} disabled={tasksLoading}>Refresh</Button>
      </Card.Header>
      <Card.Body>
        {tasksLoading ? (
          <div className="d-flex justify-content-center py-4"><Spinner animation="border" variant="primary" /></div>
        ) : !currentTask ? (
          <div className="text-muted">No current tasks.</div>
        ) : (
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 120, height: 120 }}>
              <CircularProgressbar
                value={currentTask.progress || 0}
                text={`${currentTask.progress ?? 0}%`}
                styles={buildStyles({
                  textSize: '16px',
                  pathColor: '#0d6efd',
                  textColor: '#0d6efd',
                  trailColor: '#e9ecef',
                })}
              />
            </div>
            <div className="flex-grow-1">
              <div className="fw-semibold text-truncate" title={currentTask.title}>{currentTask.title}</div>
              <div className="small text-muted text-truncate" title={currentTask.description}>{currentTask.description}</div>
              <div className="small text-muted">Due: {currentTask.dueDate ? new Date(currentTask.dueDate).toLocaleDateString() : '—'} | Priority: {currentTask.priority || 'Medium'}</div>
              <div className="mt-2">
                <Badge bg={currentTask.status === 'Completed' ? 'success' : currentTask.status === 'In Progress' ? 'info' : 'secondary'}>{currentTask.status}</Badge>
              </div>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default CurrentTaskCard;
