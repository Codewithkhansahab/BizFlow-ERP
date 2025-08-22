import React from 'react';
import { Card, Table, Button, Spinner, Badge } from 'react-bootstrap';
import { FaSyncAlt, FaEye } from 'react-icons/fa';

const RecentEmployeesCard = ({ 
  employees, 
  loading, 
  showAll, 
  setShowAll, 
  onRefresh 
}) => {
  const displayedEmployees = showAll ? employees : employees.slice(0, 5);

  return (
    <Card className="shadow-sm h-100">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <Card.Title className="mb-0">Recent Employees</Card.Title>
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
        ) : employees.length === 0 ? (
          <div className="text-muted text-center py-4">No employees found</div>
        ) : (
          <>
            <div className="table-responsive">
              <Table hover size="sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedEmployees.map((employee, index) => (
                    <tr key={employee._id || index}>
                      <td className="fw-medium">{employee.user?.name || '—'}</td>
                      <td className="text-muted">{employee.user?.email || '—'}</td>
                      <td>
                        <Badge bg="light" text="dark">
                          {employee.department || '—'}
                        </Badge>
                      </td>
                      <td>{employee.designation || '—'}</td>
                      <td>
                        <Badge 
                          bg={employee.status === 'Active' ? 'success' : 'secondary'}
                        >
                          {employee.status || 'Active'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            {employees.length > 5 && (
              <div className="text-center mt-3">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? 'Show Less' : `Show All (${employees.length})`}
                </Button>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default RecentEmployeesCard;
