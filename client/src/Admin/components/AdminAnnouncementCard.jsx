import React, { useState } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaBullhorn, FaPaperPlane } from 'react-icons/fa';

const AdminAnnouncementCard = ({ 
  announceForm, 
  setAnnounceForm, 
  announceLoading, 
  onSendAnnouncement 
}) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setAnnounceForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSendAnnouncement();
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const categories = [
    'General',
    'HR',
    'IT',
    'Finance',
    'Operations',
    'Emergency',
    'Policy Update'
  ];

  return (
    <Card className="shadow-sm h-100">
      <Card.Header className="bg-white d-flex align-items-center">
        <FaBullhorn className="text-primary me-2" />
        <Card.Title className="mb-0">Send Company Announcement</Card.Title>
      </Card.Header>
      <Card.Body>
        {showSuccess && (
          <Alert variant="success" className="mb-3">
            Announcement sent successfully to all employees!
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={announceForm.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              required
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter announcement title..."
              value={announceForm.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter your announcement message..."
              value={announceForm.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              required
            />
            <Form.Text className="text-muted">
              This message will be sent to all employees in the system.
            </Form.Text>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            disabled={announceLoading || !announceForm.title || !announceForm.message}
            className="w-100"
          >
            {announceLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Sending...
              </>
            ) : (
              <>
                <FaPaperPlane className="me-2" />
                Send Announcement
              </>
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AdminAnnouncementCard;
