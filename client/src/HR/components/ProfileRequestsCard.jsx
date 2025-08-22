import React from 'react';
import { Card, Table, Button, Spinner, Badge } from 'react-bootstrap';
import { FaUserEdit } from 'react-icons/fa';

const ProfileRequestsCard = ({ 
  requests, 
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
          <FaUserEdit className="me-2" />
          Profile Update Requests
        </Card.Title>
        <div className="d-flex align-items-center gap-2">
          <Badge bg="warning">Pending: {requests.filter(r => r.status === 'Pending').length}</Badge>
          <Button size="sm" variant="outline-primary" onClick={onRefresh} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="d-flex justify-content-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-muted text-center py-4">No profile update requests found.</div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Request Type</th>
                  <th>Requested At</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(showAll ? requests : requests.slice(0, 4)).map((request) => (
                  <tr key={request._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-info rounded-circle text-white d-flex align-items-center justify-content-center me-2" 
                             style={{ width: 32, height: 32, fontSize: '12px' }}>
                          {request.employee?.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div>{request.employee?.user?.name || 'Unknown'}</div>
                          <small className="text-muted">{request.employee?.user?.email || ''}</small>
                        </div>
                      </div>
                    </td>
                    <td>{request.employee?.department || '—'}</td>
                    <td>
                      <Badge bg="secondary">Profile Update</Badge>
                    </td>
                    <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Badge bg={
                        request.status === 'Approved' ? 'success' : 
                        request.status === 'Rejected' ? 'danger' : 'warning'
                      }>
                        {request.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          size="sm" 
                          variant="success" 
                          disabled={request.status !== 'Pending'} 
                          onClick={() => onReview(request._id, 'Approve')}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="danger" 
                          disabled={request.status !== 'Pending'} 
                          onClick={() => onReview(request._id, 'Reject')}
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {requests.length > 4 && (
              <div className="text-center mt-3">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? `Show Less (${requests.length - 4} hidden)` : `Show More (${requests.length - 4} more)`}
                </Button>
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProfileRequestsCard;
