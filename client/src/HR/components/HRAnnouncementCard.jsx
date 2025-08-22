import React from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { FaBullhorn } from 'react-icons/fa';

const HRAnnouncementCard = ({ announceForm, setAnnounceForm, onSubmit, loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title: announceForm.title,
      message: announceForm.message,
      category: announceForm.category || 'General'
    });
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white">
        <Card.Title className="mb-0">
          <FaBullhorn className="me-2" />
          Company Announcements
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col xs={12} md={4}>
              <Form.Label>Category</Form.Label>
              <Form.Select 
                value={announceForm.category} 
                onChange={(e) => setAnnounceForm({ ...announceForm, category: e.target.value })}
                size="sm"
              >
                <option value="General">General</option>
                <option value="Holiday">Holiday</option>
                <option value="Weekend">Weekend</option>
                <option value="Meeting">Meeting</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Col>
            <Col xs={12} md={8}>
              <Form.Label>Title</Form.Label>
              <Form.Control 
                size="sm"
                value={announceForm.title} 
                onChange={(e) => setAnnounceForm({ ...announceForm, title: e.target.value })}
                placeholder="Announcement title"
                required 
              />
            </Col>

            <Col xs={12}>
              <Form.Label>Message</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                size="sm"
                value={announceForm.message} 
                onChange={(e) => setAnnounceForm({ ...announceForm, message: e.target.value })} 
                placeholder="Detailed announcement message..." 
                required
              />
            </Col>

            <Col xs={12} className="d-flex justify-content-between align-items-center">
              <div className="text-muted small">This will be sent to all employees</div>
              <Button 
                type="submit" 
                disabled={loading} 
                variant="primary"
                className="px-4"
              >
                {loading ? (
                  <span className="d-flex align-items-center">
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sending...
                  </span>
                ) : (
                  <span className="d-flex align-items-center">
                    <FaBullhorn className="me-2" />
                    Send Announcement
                  </span>
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default HRAnnouncementCard;
