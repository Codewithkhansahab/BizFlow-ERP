import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaTasks, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const DashboardStats = ({ stats, loading }) => {
  return (
    <Row className="g-4 mb-4">
      <Col xs={12} sm={6} lg={3}>
        <Card className="shadow-sm h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
              <FaUsers className="text-primary" size={24} />
            </div>
            <div>
              <div className="text-muted small">Team Members</div>
              <div className="h4 mb-0">{loading ? '—' : stats.totalEmployees}</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} sm={6} lg={3}>
        <Card className="shadow-sm h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
              <FaTasks className="text-info" size={24} />
            </div>
            <div>
              <div className="text-muted small">Active Tasks</div>
              <div className="h4 mb-0">{loading ? '—' : stats.activeTasks}</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} sm={6} lg={3}>
        <Card className="shadow-sm h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
              <FaCheckCircle className="text-success" size={24} />
            </div>
            <div>
              <div className="text-muted small">Completed Tasks</div>
              <div className="h4 mb-0">{loading ? '—' : stats.completedTasks}</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} sm={6} lg={3}>
        <Card className="shadow-sm h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
              <FaExclamationCircle className="text-warning" size={24} />
            </div>
            <div>
              <div className="text-muted small">Pending Requests</div>
              <div className="h4 mb-0">{loading ? '—' : stats.pendingRequests}</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardStats;
