import React, { useEffect, useState, useContext } from 'react';
import { Card, Row, Col, Form, Button, Table, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';
import { AppContent } from '../context/AppContext';

const LeavePanel = () => {
  const { backendUrl } = useContext(AppContent);
  const [applyLoading, setApplyLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ type: 'Casual', startDate: '', endDate: '', reason: '' });

  const fetchMyLeaves = async () => {
    try {
      setListLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/leaves/my`, { withCredentials: true });
      setLeaves(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setListLoading(false);
    }
  };

  const onApply = async (e) => {
    e.preventDefault();
    try {
      setApplyLoading(true);
      await axios.post(`${backendUrl}/api/leaves/apply`, form, { withCredentials: true });
      setForm({ type: 'Casual', startDate: '', endDate: '', reason: '' });
      await fetchMyLeaves();
    } catch (err) {
      console.error(err);
    } finally {
      setApplyLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  return (
    <Card className="shadow-sm h-100">
      <Card.Header className="bg-white border-0 pb-0">
        <Card.Title className="mb-0">Leaves</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={onApply} className="mb-4">
          <Row className="g-3 align-items-end">
            <Col xs={12} md={3}>
              <Form.Label>Type</Form.Label>
              <Form.Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="Sick">Sick</option>
                <option value="Casual">Casual</option>
                <option value="Annual">Annual</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Col>
            <Col xs={12} md={3}>
              <Form.Label>Start</Form.Label>
              <Form.Control type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            </Col>
            <Col xs={12} md={3}>
              <Form.Label>End</Form.Label>
              <Form.Control type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
            </Col>
            <Col xs={12} md={3}>
              <Button type="submit" className="w-100" disabled={applyLoading}>
                {applyLoading ? 'Submitting...' : 'Apply Leave'}
              </Button>
            </Col>
            <Col xs={12}>
              <Form.Label>Reason</Form.Label>
              <Form.Control as="textarea" rows={2} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Optional" />
            </Col>
          </Row>
        </Form>

        {listLoading ? (
          <div className="d-flex justify-content-center py-4"><Spinner animation="border" variant="primary" /></div>
        ) : leaves.length === 0 ? (
          <div className="text-muted">No leaves yet</div>
        ) : (
          <div className="table-responsive">
            <Table hover size="sm">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                  <th>Applied</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map(l => (
                  <tr key={l._id}>
                    <td>{l.type}</td>
                    <td>{l.startDate ? new Date(l.startDate).toLocaleDateString() : '—'}</td>
                    <td>{l.endDate ? new Date(l.endDate).toLocaleDateString() : '—'}</td>
                    <td>
                      <Badge bg={l.status === 'Approved' ? 'success' : l.status === 'Rejected' ? 'danger' : 'warning'}>
                        {l.status}
                      </Badge>
                    </td>
                    <td>{new Date(l.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default LeavePanel;


