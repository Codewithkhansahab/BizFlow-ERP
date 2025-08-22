import React from 'react';
import { Card, Button, Table, Badge, Spinner, Form } from 'react-bootstrap';

const TeamOverviewCard = ({ 
  employees, 
  empLoading, 
  showAllEmployees, 
  setShowAllEmployees, 
  fetchEmployees, 
  viewEmployeeProfile,
  updateEmployeeStatus,
}) => {
  return (
    <Card className="shadow-sm h-100">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <Card.Title className="mb-0">Team Overview</Card.Title>
        <Button size="sm" variant="outline-primary" onClick={fetchEmployees} disabled={empLoading}>
          {empLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Card.Header>
      <Card.Body>
        {empLoading ? (
          <div className="d-flex justify-content-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : employees.length === 0 ? (
          <div className="text-muted">No team members found.</div>
        ) : (
          <>
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(showAllEmployees ? employees : employees.slice(0, 4)).map((emp) => (
                    <tr key={emp._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-secondary rounded-circle text-white d-flex align-items-center justify-content-center me-2" 
                               style={{ width: 32, height: 32, fontSize: '12px' }}>
                            {emp.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div>{emp.user?.name || '—'}</div>
                            <small className="text-muted">{emp.user?.email || '—'}</small>
                          </div>
                        </div>
                      </td>
                      <td>{emp.department || '—'}</td>
                      <td>{emp.designation || '—'}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Badge bg={(emp.status === 'Active' || !emp.status) ? 'success' : 'secondary'}>
                            {emp.status || 'Active'}
                          </Badge>
                          {typeof updateEmployeeStatus === 'function' && (
                            <Form.Select
                              size="sm"
                              style={{ width: 110 }}
                              value={emp.status || 'Active'}
                              onChange={(e) => updateEmployeeStatus(emp._id, e.target.value)}
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
                          onClick={() => viewEmployeeProfile(emp)}
                        >
                          View Profile
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            {employees.length > 4 && (
              <div className="text-center mt-2">
                <Button 
                  size="sm" 
                  variant="outline-primary" 
                  onClick={() => setShowAllEmployees(!showAllEmployees)}
                >
                  {showAllEmployees ? `Show Less (${employees.length - 4} hidden)` : `Show More (${employees.length - 4} more)`}
                </Button>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default TeamOverviewCard;
