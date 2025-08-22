import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, ListGroup, Form, Button, Badge } from 'react-bootstrap';
import { AppContent } from '../context/AppContext';
import { FiSend, FiUser, FiClock } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';

const Messages = () => {
    const { backendUrl } = useContext(AppContent);
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                // In a real app, this would fetch messages from your API
                // const { data } = await axios.get(`${backendUrl}/api/messages`, { withCredentials: true });
                // setMessages(data.messages);
                
                // Mock data for now
                setTimeout(() => {
                    setMessages([
                        { id: 1, from: 'Admin', subject: 'Welcome to the system', content: 'Thank you for joining our platform!', read: false, date: '2023-06-15' },
                        { id: 2, from: 'HR Department', subject: 'Important announcement', content: 'Team meeting scheduled for tomorrow at 10 AM.', read: true, date: '2023-06-14' },
                    ]);
                    setLoading(false);
                }, 500);
            } catch (error) {
                toast.error('Failed to load messages');
                setLoading(false);
            }
        };

        fetchMessages();
    }, [backendUrl]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            // In a real app, this would send the message to your API
            // await axios.post(`${backendUrl}/api/messages`, { content: newMessage }, { withCredentials: true });
            
            toast.success('Message sent successfully');
            setNewMessage('');
            
            // In a real app, you would refresh the messages list
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    return (
        <Container className="py-4">
            <h2 className="mb-4">Messages</h2>
            
            <div className="d-flex" style={{ gap: '20px' }}>
                {/* Message List */}
                <Card style={{ width: '300px' }}>
                    <Card.Header className="bg-white border-bottom">
                        <h5 className="mb-0">Inbox</h5>
                    </Card.Header>
                    <ListGroup variant="flush" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {loading ? (
                            <div className="text-center p-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : messages.length > 0 ? (
                            messages.map((message) => (
                                <ListGroup.Item 
                                    key={message.id}
                                    action 
                                    active={selectedMessage?.id === message.id}
                                    onClick={() => setSelectedMessage(message)}
                                    className="d-flex justify-content-between align-items-start"
                                >
                                    <div className="me-3">
                                        <div className="fw-bold">{message.from}</div>
                                        <div className="text-truncate" style={{ maxWidth: '200px' }}>
                                            {message.subject}
                                        </div>
                                    </div>
                                    <div className="text-muted small text-end">
                                        <div>{new Date(message.date).toLocaleDateString()}</div>
                                        {!message.read && <Badge bg="primary" className="ms-2">New</Badge>}
                                    </div>
                                </ListGroup.Item>
                            ))
                        ) : (
                            <ListGroup.Item className="text-center text-muted py-4">
                                No messages found
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Card>

                {/* Message Content */}
                <Card className="flex-grow-1">
                    {selectedMessage ? (
                        <>
                            <Card.Header className="bg-white border-bottom">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-1">{selectedMessage.subject}</h5>
                                        <div className="text-muted small">
                                            <FiUser className="me-1" /> {selectedMessage.from} • 
                                            <FiClock className="ms-2 me-1" /> 
                                            {new Date(selectedMessage.date).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-4" style={{ whiteSpace: 'pre-line' }}>
                                    {selectedMessage.content}
                                </div>
                                <hr />
                                <Form onSubmit={handleSendMessage} className="mt-4">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Reply</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your reply..."
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        <FiSend className="me-2" /> Send Reply
                                    </Button>
                                </Form>
                            </Card.Body>
                        </>
                    ) : (
                        <Card.Body className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                            <div className="text-center text-muted">
                                <h4>Select a message to read</h4>
                                <p>Choose a message from the list to view its contents</p>
                            </div>
                        </Card.Body>
                    )}
                </Card>
            </div>
        </Container>
    );
};

export default Messages;
