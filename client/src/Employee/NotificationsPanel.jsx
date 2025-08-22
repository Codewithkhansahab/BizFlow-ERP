import { useEffect, useState } from 'react';
import { Card, ListGroup, Badge, Button } from 'react-bootstrap';
import axios from 'axios';

export default function NotificationsPanel({ backendUrl }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/notifications/my`, { withCredentials: true });
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await axios.put(`${backendUrl}/api/notifications/my/${id}/read`, {}, { withCredentials: true });
      await fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Card className="shadow-sm h-100">
      <Card.Header className="bg-white border-0 pb-0 d-flex justify-content-between align-items-center">
        <Card.Title className="mb-0">Notifications</Card.Title>
        <Button size="sm" variant="outline-primary" onClick={fetchNotifications} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Card.Header>
      <Card.Body>
        {notifications.length === 0 ? (
          <div className="text-muted">No notifications</div>
        ) : (
          <>
            <ListGroup variant="flush">
              {(showAllNotifications ? notifications : notifications.slice(0, 3)).map((n) => (
                <ListGroup.Item key={n._id} className="px-0 d-flex justify-content-between align-items-start gap-3">
                  <div className="flex-grow-1">
                    <div className="fw-semibold text-truncate" title={n.title}>{n.title}</div>
                    <div className="small text-muted text-truncate" title={n.message}>{n.message}</div>
                    <div className="small text-muted">{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    {!n.isRead && <Badge bg="warning" text="dark">New</Badge>}
                    {!n.isRead && (
                      <Button size="sm" variant="outline-secondary" onClick={() => markRead(n._id)}>Mark as read</Button>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            {notifications.length > 3 && (
              <div className="text-center mt-2">
                <Button 
                  size="sm" 
                  variant="outline-primary" 
                  onClick={() => setShowAllNotifications(!showAllNotifications)}
                >
                  {showAllNotifications ? `Show Less (${notifications.length - 3} hidden)` : `Show More (${notifications.length - 3} more)`}
                </Button>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
}


