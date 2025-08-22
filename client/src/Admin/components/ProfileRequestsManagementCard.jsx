import React from 'react';
import { Card, Table, Button, Spinner, Badge } from 'react-bootstrap';
import { FaSyncAlt, FaCheck, FaTimes, FaEye } from 'react-icons/fa';

const ProfileRequestsManagementCard = ({ 
  requests, 
  loading, 
  showAll, 
  setShowAll, 
  onRefresh,
  onReviewRequest 
}) => {
  const displayedRequests = showAll ? requests : requests.slice(0, 5);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { bg: 'warning', text: 'dark' },
      'Approved': { bg: 'success', text: 'white' },
      'Rejected': { bg: 'danger', text: 'white' }
    };
    return statusConfig[status] || { bg: 'secondary', text: 'white' };
  };

  return (
    <Card className="shadow-sm h-100">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <Card.Title className="mb-0">Profile Update Requests</Card.Title>
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
        ) : requests.length === 0 ? (
          <div className="text-muted text-center py-4">No profile requests found</div>
        ) : (
          <>
            <div className="table-responsive">
              <Table hover size="sm">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Field</th>
                    <th>Current Value</th>
                    <th>Requested Value</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRequests.map((request, index) => {
                    const statusBadge = getStatusBadge(request.status);
                    
                    return (
                      <tr key={request._id || index}>
                        <td className="fw-medium">{request.employee?.user?.name || '—'}</td>
                        <td>
                          <Badge bg="light" text="dark">
                            {request.field || 'Profile Update'}
                          </Badge>
                        </td>
                        <td className="text-muted small">{request.currentValue || '—'}</td>
                        <td className="fw-medium">{request.newValue || request.employee?.user?.email || '—'}</td>
                        <td>
                          <Badge bg={statusBadge.bg} text={statusBadge.text}>
                            {request.status}
                          </Badge>
                        </td>
                        <td>
                          {request.status === 'Pending' ? (
                            <div className="d-flex gap-1">
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => onReviewRequest(request._id, 'Approve')}
                                title="Approve Request"
                              >
                                <FaCheck className="me-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => onReviewRequest(request._id, 'Reject')}
                                title="Reject Request"
                              >
                                <FaTimes className="me-1" />
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <Badge 
                              bg={request.status === 'Approved' ? 'success' : 'danger'}
                              className="px-2 py-1"
                            >
                              {request.status}
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
            {requests.length > 5 && (
              <div className="text-center mt-3">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? 'Show Less' : `Show All (${requests.length})`}
                </Button>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProfileRequestsManagementCard;
