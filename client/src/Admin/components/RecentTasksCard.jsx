import React from 'react';
import { Card, Table, Button, Spinner, Badge, ProgressBar } from 'react-bootstrap';
import { FaSyncAlt, FaEye } from 'react-icons/fa';

const RecentTasksCard = ({ 
  tasks, 
  loading, 
  showAll, 
  setShowAll, 
  onRefresh 
}) => {
  const displayedTasks = showAll ? tasks : tasks.slice(0, 5);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { bg: 'warning', text: 'dark' },
      'In Progress': { bg: 'primary', text: 'white' },
      'Completed': { bg: 'success', text: 'white' },
      'Overdue': { bg: 'danger', text: 'white' }
    };
    return statusConfig[status] || { bg: 'secondary', text: 'white' };
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'High': { bg: 'danger', text: 'white' },
      'Medium': { bg: 'warning', text: 'dark' },
      'Low': { bg: 'info', text: 'white' }
    };
    return priorityConfig[priority] || { bg: 'secondary', text: 'white' };
  };

  return (
    <Card className="shadow-sm h-100">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <Card.Title className="mb-0">Recent Tasks</Card.Title>
        <Button 
          size="sm" 
          variant="outline-primary" 
          onClick={onRefresh} 
          disabled={loading}
        >
          <FaSyncAlt className={loading ? 'fa-spin' : ''} />
          {loading ? ' Refreshing...' : ' Refresh'}
        </Button>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="d-flex justify-content-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-muted text-center py-4">No tasks found</div>
        ) : (
          <>
            <div className="table-responsive">
              <Table hover size="sm">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Assignee</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedTasks.map((task, index) => {
                    const statusBadge = getStatusBadge(task.status);
                    const priorityBadge = getPriorityBadge(task.priority);
                    
                    return (
                      <tr key={index}>
                        <td className="fw-medium">{task.title}</td>
                        <td className="text-muted">{task.assignedTo?.name || 'Unassigned'}</td>
                        <td>
                          <Badge bg={priorityBadge.bg} text={priorityBadge.text}>
                            {task.priority}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={statusBadge.bg} text={statusBadge.text}>
                            {task.status}
                          </Badge>
                        </td>
                        <td style={{ width: '120px' }}>
                          <ProgressBar 
                            now={task.progress || 0} 
                            size="sm" 
                            variant={task.progress === 100 ? 'success' : 'primary'}
                          />
                          <small className="text-muted">{task.progress || 0}%</small>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
            {tasks.length > 5 && (
              <div className="text-center mt-3">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? 'Show Less' : `Show All (${tasks.length})`}
                </Button>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default RecentTasksCard;
