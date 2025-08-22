import React from 'react';
import { Card, Button, Spinner, ListGroup, Badge, ProgressBar, Form } from 'react-bootstrap';

const MyTasksCard = ({ 
  tasks, 
  tasksLoading, 
  showAllTasks, 
  setShowAllTasks, 
  fetchTasks, 
  updateTaskProgress, 
  updatingTaskId 
}) => {
  return (
    <Card className="shadow-sm h-100">
      <Card.Header className="bg-white border-0 pb-0 d-flex justify-content-between align-items-center">
        <Card.Title className="mb-0">My Tasks</Card.Title>
        <Button variant="outline-primary" size="sm" onClick={fetchTasks}>Refresh</Button>
      </Card.Header>
      <Card.Body>
        {tasksLoading ? (
          <div className="d-flex justify-content-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-muted">No tasks assigned yet.</div>
        ) : (
          <>
            <ListGroup variant="flush">
              {(showAllTasks ? tasks : tasks.slice(0, 3)).map((t) => (
                <ListGroup.Item key={t._id} className="px-0">
                  <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                    <div className="flex-grow-1">
                      <div className="fw-semibold text-truncate" title={t.title}>{t.title}</div>
                      <div className="small text-muted text-truncate" title={t.description}>{t.description}</div>
                      <div className="small text-muted">Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'} | Priority: {t.priority || 'Medium'}</div>
                    </div>
                    <Badge bg={t.status === 'Completed' ? 'success' : t.status === 'In Progress' ? 'info' : 'secondary'}>{t.status}</Badge>
                  </div>
                  <div className="mt-2">
                    <ProgressBar now={t.progress || 0} label={`${t.progress ?? 0}%`} style={{ height: 10 }} />
                  </div>
                  <div className="mt-2">
                    <Form.Range
                      min={0}
                      max={100}
                      value={t.progress || 0}
                      onChange={(e) => updateTaskProgress(t._id, Number(e.target.value))}
                      disabled={updatingTaskId === t._id}
                    />
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            {tasks.length > 3 && (
              <div className="text-center mt-2">
                <Button 
                  size="sm" 
                  variant="outline-primary" 
                  onClick={() => setShowAllTasks(!showAllTasks)}
                >
                  {showAllTasks ? `Show Less (${tasks.length - 3} hidden)` : `Show More (${tasks.length - 3} more)`}
                </Button>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default MyTasksCard;
