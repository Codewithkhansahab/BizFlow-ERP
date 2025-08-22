import React from 'react';
import { Card, Table, Button, Spinner, Badge } from 'react-bootstrap';
import { FaCalendarCheck } from 'react-icons/fa';

const LeaveManagementCard = ({ 
  leaves, 
  loading, 
  showAll, 
  setShowAll, 
  onRefresh, 
  onReview 
}) => {
  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <Card.Title className="mb-0">
          <FaCalendarCheck className="me-2" />
          Leave Management
        </Card.Title>
        <Button size="sm" variant="outline-primary" onClick={onRefresh} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="d-flex justify-content-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : leaves.length === 0 ? (
          <div className="text-muted text-center py-4">No leave requests found.</div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(showAll ? leaves : leaves.slice(0, 5)).map((leave) => (
                  <tr key={leave._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center me-2" 
                             style={{ width: 32, height: 32, fontSize: '12px' }}>
                          {leave.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div>{leave.user?.name || 'Unknown'}</div>
                          <small className="text-muted">{leave.user?.email || ''}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge bg="info" className="text-white">
                        {leave.type}
                      </Badge>
                    </td>
                    <td>
                      <div>
                        <small className="text-muted">From:</small> {leave.startDate ? new Date(leave.startDate).toLocaleDateString() : '—'}
                        <br />
                        <small className="text-muted">To:</small> {leave.endDate ? new Date(leave.endDate).toLocaleDateString() : '—'}
                      </div>
                    </td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '200px' }} title={leave.reason}>
                        {leave.reason || 'No reason provided'}
                      </div>
                    </td>
                    <td>
                      <Badge bg={
                        leave.status === 'Approved' ? 'success' : 
                        leave.status === 'Rejected' ? 'danger' : 'warning'
                      }>
                        {leave.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          size="sm" 
                          variant="success" 
                          disabled={leave.status !== 'Pending'} 
                          onClick={() => onReview(leave._id, 'Approve')}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="danger" 
                          disabled={leave.status !== 'Pending'} 
                          onClick={() => onReview(leave._id, 'Reject')}
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {leaves.length > 5 && (
              <div className="text-center mt-3">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? `Show Less (${leaves.length - 5} hidden)` : `Show More (${leaves.length - 5} more)`}
                </Button>
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default LeaveManagementCard;
