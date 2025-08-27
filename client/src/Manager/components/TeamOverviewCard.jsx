import React, { useEffect, useState } from 'react';
import { Card, Button, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaUser, FaUserCheck, FaUserClock, FaUserTie } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { AppContent } from '../../context/AppContext';

const TeamOverviewCard = ({ 
  viewEmployeeProfile,
  updateEmployeeStatus,
}) => {
  const { backendUrl } = React.useContext(AppContent);
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(true);
  const [showAllEmployees, setShowAllEmployees] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 4;

  const fetchTeamMembers = async () => {
    try {
      setEmpLoading(true);
      setError(null);
      const response = await axios.get(`${backendUrl}/api/employee/employees`, {
        withCredentials: true,
      });
      // Filter out any employees without user data and exclude admins
      const validEmployees = response.data.filter(emp => 
        emp.user && emp.user.role !== 'Admin'
      );
      console.log('Filtered employees:', validEmployees);
      setEmployees(validEmployees);
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError('Failed to load team members. Please try again.');
    } finally {
      setEmpLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log('Fetching employees...');
      fetchTeamMembers();
    }
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <Badge bg="success">Active</Badge>;
      case 'Inactive':
        return <Badge bg="secondary">Inactive</Badge>;
      case 'On Leave':
        return <Badge bg="warning" text="dark">On Leave</Badge>;
      default:
        return <Badge bg="info">{status}</Badge>;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Manager':
        return <FaUserTie className="text-primary me-1" />;
      case 'Employee':
        return <FaUser className="text-secondary me-1" />;
      default:
        return <FaUser className="text-muted me-1" />;
    }
  };
  return (
    <Card className="shadow-sm h-100">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <Card.Title className="mb-0 d-flex align-items-center">
          <FaUserTie className="me-2" />
          Team Overview
        </Card.Title>
        <div>
          <Button 
            size="sm" 
            variant="outline-primary" 
            onClick={fetchTeamMembers} 
            disabled={empLoading}
            className="me-2"
          >
            {empLoading ? 'Refreshing...' : <><FaUserCheck className="me-1" /> Refresh</>}
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}
        
        {empLoading ? (
          <div className="d-flex justify-content-center py-4">
            <Spinner animation="border" variant="primary" />
            <span className="ms-2">Loading team members...</span>
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-4">
            <FaUserClock size={40} className="text-muted mb-2" />
            <p className="text-muted mb-0">No team members found</p>
            <small className="text-muted">Add team members to see them here</small>
          </div>
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
                  {(showAllEmployees ? employees : employees.slice(0, itemsPerPage)).map((emp) => (
                    <tr key={emp._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center me-2 bg-light"
                            style={{ 
                              width: 36, 
                              height: 36, 
                              backgroundColor: '#e9ecef',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              color: '#495057'
                            }}
                          >
                            {emp.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="d-flex align-items-center">
                              {getRoleIcon(emp.user?.role)}
                              <span className="fw-medium">{emp.user?.name || '—'}</span>
                            </div>
                            <small className="text-muted">{emp.user?.email || '—'}</small>
                          </div>
                        </div>
                      </td>
                      <td>{emp.department || '—'}</td>
                      <td>{emp.designation || '—'}</td>
                      <td>
                        {emp.status ? getStatusBadge(emp.status) : '—'}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline-primary"
                            onClick={() => viewEmployeeProfile(emp)}
                            title="View Profile"
                          >
                            <FaUser className="me-1" /> View
                          </Button>
                          {user?.role === 'Admin' || user?.role === 'HR' ? (
                            <Button 
                              size="sm" 
                              variant={emp.status === 'Active' ? 'outline-danger' : 'outline-success'}
                              onClick={() => updateEmployeeStatus(emp._id, emp.status === 'Active' ? 'Inactive' : 'Active')}
                              title={emp.status === 'Active' ? 'Deactivate' : 'Activate'}
                            >
                              {emp.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            
            {employees.length > itemsPerPage && (
              <div className="text-center mt-3">
                <Button 
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowAllEmployees(!showAllEmployees)}
                  className="d-flex align-items-center mx-auto"
                >
                  {showAllEmployees ? (
                    <>
                      <i className="bi bi-chevron-up me-1"></i>
                      <span>Show Less</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-chevron-down me-1"></i>
                      <span>Show All ({employees.length - itemsPerPage} more)</span>
                    </>
                  )}
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
