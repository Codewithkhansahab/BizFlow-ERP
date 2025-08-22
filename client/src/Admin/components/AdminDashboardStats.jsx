import React from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { FaUsers, FaUserTie, FaTasks } from 'react-icons/fa';

const AdminDashboardStats = ({ stats, loading }) => {
  const statsConfig = [
    {
      title: 'Total Users',
      value: stats.users,
      icon: <FaUsers className="text-primary" size={24} />,
      color: 'primary'
    },
    {
      title: 'Employees',
      value: stats.employees,
      icon: <FaUserTie className="text-success" size={24} />,
      color: 'success'
    },
    {
      title: 'Total Tasks',
      value: stats.tasks,
      icon: <FaTasks className="text-info" size={24} />,
      color: 'info'
    }
  ];

  return (
    <Row className="g-4 mb-4">
      {statsConfig.map((stat, index) => (
        <Col xs={12} md={4} key={index}>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                {stat.icon}
              </div>
              <div className="flex-grow-1">
                <div className="text-muted small">{stat.title}</div>
                <div className="h4 mb-0">
                  {loading ? (
                    <Spinner animation="border" size="sm" variant={stat.color} />
                  ) : (
                    stat.value
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default AdminDashboardStats;
