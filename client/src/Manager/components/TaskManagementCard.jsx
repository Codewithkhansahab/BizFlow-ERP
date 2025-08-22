import React from 'react';
import { Card, Button, Table, Badge, ProgressBar, Spinner } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';

const TaskManagementCard = ({ 
  tasks, 
  tasksLoading, 
  showAllTasks, 
  setShowAllTasks, 
  fetchTasks, 
  viewTaskDetails,
  onCreateTask
}) => {
  return (
    <Card className="shadow-sm h-100">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <Card.Title className="mb-0">Task Management</Card.Title>
        <div className="d-flex gap-2">
          <Button size="sm" variant="outline-primary" onClick={fetchTasks} disabled={tasksLoading}>
            {tasksLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
          {onCreateTask && (
            <Button size="sm" variant="primary" onClick={onCreateTask}>
              New Task
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        {tasksLoading ? (
          <div className="d-flex justify-content-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-muted">No tasks found.</div>
        ) : (
          <>
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Task</th>
                    <th>Assignee</th>
                    <th>Progress</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(showAllTasks ? tasks : tasks.slice(0, 2)).map((task) => (
                    <tr key={task._id}>
                      <td>
                        <div>
                          <div className="fw-semibold text-truncate" style={{ maxWidth: '200px' }} title={task.title}>
                            {task.title}
                          </div>
                          <small className="text-muted">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-secondary rounded-circle text-white d-flex align-items-center justify-content-center me-2" 
                               style={{ width: 28, height: 28, fontSize: '11px' }}>
                            {task.assignedTo?.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div className="text-truncate" style={{ maxWidth: '180px' }}>
                            <div className="text-truncate" title={task.assignedTo?.user?.name}>
                              {task.assignedTo?.user?.name || 'Unassigned'}
                            </div>
                            {task.assignedTo?.designation && (
                              <small className="text-muted text-truncate" title={task.assignedTo.designation}>
                                {task.assignedTo.designation}
                              </small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ width: '80px' }}>
                          <ProgressBar 
                            now={task.progress || 0} 
                            label={`${task.progress || 0}%`}
                            style={{ height: '8px' }}
                            variant={
                              (task.progress || 0) === 100 ? 'success' :
                              (task.progress || 0) >= 50 ? 'info' : 'warning'
                            }
                          />
                        </div>
                      </td>
                      <td>
                        <Badge bg={
                          task.status === 'Completed' ? 'success' : 
                          task.status === 'In Progress' ? 'info' : 'secondary'
                        }>
                          {task.status}
                        </Badge>
                      </td>
                      <td>
                        <Button 
                          size="sm" 
                          variant="outline-info"
                          onClick={() => viewTaskDetails(task)}
                        >
                          <FaEye />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            {tasks.length > 2 && (
              <div className="text-center mt-2">
                <Button 
                  size="sm" 
                  variant="outline-primary" 
                  onClick={() => setShowAllTasks(!showAllTasks)}
                >
                  {showAllTasks ? `Show Less (${tasks.length - 2} hidden)` : `Show More (${tasks.length - 2} more)`}
                </Button>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default TaskManagementCard;
