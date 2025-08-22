import React from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { FaBullhorn } from 'react-icons/fa';

const QuickAnnouncementCard = ({ 
  announceForm, 
  setAnnounceForm, 
  submitAnnouncement, 
  announceLoading 
}) => {
  return (
    <Card className="shadow-sm h-100">
      <Card.Header className="bg-white">
        <Card.Title className="mb-0">
          <FaBullhorn className="me-2" />
          Quick Announcement
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={submitAnnouncement}>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select 
              value={announceForm.category} 
              onChange={(e) => setAnnounceForm({ ...announceForm, category: e.target.value })}
            >
              <option value="General">General</option>
              <option value="Meeting">Meeting</option>
              <option value="Holiday">Holiday</option>
              <option value="Weekend">Weekend</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control 
              value={announceForm.title} 
              onChange={(e) => setAnnounceForm({ ...announceForm, title: e.target.value })} 
              placeholder="Announcement title" 
              required 
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              value={announceForm.message} 
              onChange={(e) => setAnnounceForm({ ...announceForm, message: e.target.value })} 
              placeholder="Announcement message (optional)" 
            />
          </Form.Group>
          <div className="text-end">
            <Button type="submit" disabled={announceLoading}>
              {announceLoading ? 'Broadcasting...' : 'Broadcast'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default QuickAnnouncementCard;
