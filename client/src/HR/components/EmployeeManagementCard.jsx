import React from 'react';
import { Card, Table, Button, Spinner, Badge, Form } from 'react-bootstrap';
import { FaUsers, FaEye } from 'react-icons/fa';

const EmployeeManagementCard = ({ 
  employees, 
  loading, 
  showAll, 
  setShowAll, 
  onRefresh, 
  onViewProfile,
  onUpdateStatus,
}) => {
  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <Card.Title className="mb-0">
          <FaUsers className="me-2" />
          Employee Management
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
        ) : employees.length === 0 ? (
          <div className="text-muted text-center py-4">No employees found.</div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Joining Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(showAll ? employees : employees.slice(0, 6)).map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-secondary rounded-circle text-white d-flex align-items-center justify-content-center me-2" 
                             style={{ width: 32, height: 32, fontSize: '12px' }}>
                          {emp.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div>{emp.user?.name || 'Unknown'}</div>
                          <small className="text-muted">{emp.user?.email || ''}</small>
                        </div>
                      </div>
                    </td>
                    <td>{emp.department || '—'}</td>
                    <td>{emp.designation || '—'}</td>
                    <td>
                      {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <Badge bg={(emp.status === 'Active' || !emp.status) ? 'success' : 'secondary'}>
                          {emp.status || 'Active'}
                        </Badge>
                        {typeof onUpdateStatus === 'function' && (
                          <Form.Select
                            size="sm"
                            style={{ width: 110 }}
                            value={emp.status || 'Active'}
                            onChange={(e) => onUpdateStatus(emp._id, e.target.value)}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </Form.Select>
                        )}
                      </div>
                    </td>
                    
                    <td>
                      <Button 
                        size="sm" 
                        variant="outline-info"
                        onClick={() => onViewProfile(emp)}
                      >
                        <FaEye className="me-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {employees.length > 6 && (
              <div className="text-center mt-3">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? `Show Less (${employees.length - 6} hidden)` : `Show More (${employees.length - 6} more)`}
                </Button>
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default EmployeeManagementCard;
