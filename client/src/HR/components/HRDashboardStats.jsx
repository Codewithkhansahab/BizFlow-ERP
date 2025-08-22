import React from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { FaUsers, FaCalendarCheck, FaExclamationTriangle, FaBullhorn } from 'react-icons/fa';

const HRDashboardStats = ({ stats, loading }) => {
  return (
    <Row className="mb-4">
      <Col md={3}>
        <Card className="text-center border-0 shadow-sm h-100">
          <Card.Body>
            {loading ? (
              <Spinner animation="border" size="sm" variant="primary" />
            ) : (
              <>
                <FaUsers className="text-primary mb-2" size={30} />
                <h4 className="mb-1">{stats.totalEmployees}</h4>
                <small className="text-muted">Total Employees</small>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center border-0 shadow-sm h-100">
          <Card.Body>
            {loading ? (
              <Spinner animation="border" size="sm" variant="warning" />
            ) : (
              <>
                <FaCalendarCheck className="text-warning mb-2" size={30} />
                <h4 className="mb-1">{stats.pendingLeaves}</h4>
                <small className="text-muted">Pending Leaves</small>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center border-0 shadow-sm h-100">
          <Card.Body>
            {loading ? (
              <Spinner animation="border" size="sm" variant="success" />
            ) : (
              <>
                <FaExclamationTriangle className="text-success mb-2" size={30} />
                <h4 className="mb-1">{stats.profileRequests}</h4>
                <small className="text-muted">Profile Requests</small>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center border-0 shadow-sm h-100">
          <Card.Body>
            {loading ? (
              <Spinner animation="border" size="sm" variant="info" />
            ) : (
              <>
                <FaBullhorn className="text-info mb-2" size={30} />
                <h4 className="mb-1">{stats.activeAnnouncements}</h4>
                <small className="text-muted">Active Announcements</small>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default HRDashboardStats;
