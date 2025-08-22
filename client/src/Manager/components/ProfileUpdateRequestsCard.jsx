import React from 'react';
import { Card, Button, Table, Badge, Spinner } from 'react-bootstrap';

const ProfileUpdateRequestsCard = ({ 
  requests, 
  reqLoading, 
  showAllRequests, 
  setShowAllRequests, 
  fetchProfileRequests, 
  reviewRequest 
}) => {
  return (
    <Card className="shadow-sm h-100">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <Card.Title className="mb-0">Profile Update Requests</Card.Title>
        <Button size="sm" variant="outline-primary" onClick={fetchProfileRequests} disabled={reqLoading}>
          {reqLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Card.Header>
      <Card.Body>
        {reqLoading ? (
          <div className="d-flex justify-content-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-muted">No pending requests.</div>
        ) : (
          <>
            <div className="table-responsive">
              <Table hover size="sm">
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Status</th>
                    <th>Requested</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(showAllRequests ? requests : requests.slice(0, 3)).map((r) => (
                    <tr key={r._id}>
                      <td>
                        <div>
                          <div className="fw-semibold">{r.employee?.user?.name || '—'}</div>
                          <small className="text-muted">{r.employee?.user?.email || '—'}</small>
                        </div>
                      </td>
                      <td>
                        <Badge bg={r.status === 'Approved' ? 'success' : r.status === 'Rejected' ? 'danger' : 'warning'}>
                          {r.status}
                        </Badge>
                      </td>
                      <td>
                        <small>{new Date(r.createdAt).toLocaleDateString()}</small>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button 
                            size="sm" 
                            variant="success" 
                            disabled={r.status !== 'Pending'} 
                            onClick={() => reviewRequest(r._id, 'Approve')}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="danger" 
                            disabled={r.status !== 'Pending'} 
                            onClick={() => reviewRequest(r._id, 'Reject')}
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            {requests.length > 3 && (
              <div className="text-center mt-2">
                <Button 
                  size="sm" 
                  variant="outline-primary" 
                  onClick={() => setShowAllRequests(!showAllRequests)}
                >
                  {showAllRequests ? `Show Less (${requests.length - 3} hidden)` : `Show More (${requests.length - 3} more)`}
                </Button>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProfileUpdateRequestsCard;
