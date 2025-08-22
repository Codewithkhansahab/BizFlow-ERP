import React from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';

const EmployeeDetailsCard = ({ user, employee, openRequestModal }) => {
  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white border-0 pb-0">
        <Card.Title className="mb-0">Employee Details</Card.Title>
      </Card.Header>
      <Card.Body style={{ maxHeight: '360px', overflowY: 'auto' }}>
        <Row className="g-3">
          <Col xs={12} md={6}>
            <div className="small text-muted">Name</div>
            <div className="fw-semibold text-truncate" title={user?.name}>{user?.name}</div>
          </Col>
          <Col xs={12} md={6}>
            <div className="small text-muted">Email</div>
            <div className="fw-semibold text-truncate" title={user?.email}>{user?.email}</div>
          </Col>
          <Col xs={12} md={6}>
            <div className="small text-muted">Department</div>
            <div className="fw-semibold text-truncate" title={employee?.department}>{employee?.department}</div>
          </Col>
          <Col xs={12} md={6}>
            <div className="small text-muted">Designation</div>
            <div className="fw-semibold text-truncate" title={employee?.designation}>{employee?.designation}</div>
          </Col>
          <Col xs={12} md={6}>
            <div className="small text-muted">Joining Date</div>
            <div className="fw-semibold">{employee?.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : '-'}</div>
          </Col>
          <Col xs={12} md={6}>
            <div className="small text-muted">Phone</div>
            <div className="fw-semibold text-truncate" title={employee?.phone}>{employee?.phone}</div>
          </Col>
          <Col xs={12}>
            <div className="small text-muted">Address</div>
            <div className="fw-semibold" style={{ maxHeight: '4.5em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }} title={employee?.address}>{employee?.address}</div>
          </Col>
          {employee?.status && (
            <Col xs={12}>
              <div className="small text-muted">Status</div>
              <Badge bg={employee.status === 'Active' ? 'success' : 'secondary'}>{employee.status}</Badge>
            </Col>
          )}
        </Row>
      </Card.Body>
      <div className="d-flex justify-content-end mt-2">
        <Button variant="outline-primary" size="sm" onClick={openRequestModal}>Request Profile Update</Button>
      </div>
    </Card>
  );
};

export default EmployeeDetailsCard;
