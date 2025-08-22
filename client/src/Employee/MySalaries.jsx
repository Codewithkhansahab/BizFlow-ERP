import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Table, Badge, Row, Col, Form, Spinner, Card,Button } from 'react-bootstrap';
import axios from 'axios';
import DashboardLayout from '../Dashboard/DashboardLayout';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const monthNames = ['','January','February','March','April','May','June','July','August','September','October','November','December'];
const currency = (n) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(n || 0));

export default function MySalaries(){
  const navigate = useNavigate()
  const { backendUrl } = useContext(AppContent);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({ month: '', year: '', status: '' });

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/salaries/my`, { withCredentials: true });
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load salaries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return items.filter(i => {
      if (filters.month && String(i.month) !== String(filters.month)) return false;
      if (filters.year && String(i.year) !== String(filters.year)) return false;
      if (filters.status && i.status !== filters.status) return false;
      return true;
    });
  }, [items, filters]);

  return (
    <DashboardLayout roleTitle="Employee">
      <Row className="g-3 align-items-end">
        <Col md={2}>
          <Form.Group>
            <Form.Label>Month</Form.Label>
            <Form.Select value={filters.month} onChange={(e)=>setFilters(f=>({...f, month:e.target.value}))}>
              <option value="">All</option>
              {monthNames.map((m, i) => i>0 && <option key={i} value={i}>{m}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Year</Form.Label>
            <Form.Control type="number" value={filters.year} onChange={(e)=>setFilters(f=>({...f, year:e.target.value}))} />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select value={filters.status} onChange={(e)=>setFilters(f=>({...f, status:e.target.value}))}>
              <option value="">All</option>
              {['Draft','Processed','Paid'].map(s => <option key={s} value={s}>{s}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Card className="mt-4">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5"><Spinner /></div>
          ) : (
            <Table responsive bordered hover size="sm">
              <thead className="table-light">
                <tr>
                  <th>Period</th>
                  <th>Gross</th>
                  <th>Deductions</th>
                  <th>Net</th>
                  <th>Status</th>
                  <th>Paid On</th>
                  <th>Method</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center">No records</td></tr>
                )}
                {filtered.map(item => (
                  <tr key={item._id}>
                    <td>{monthNames[item.month]} {item.year}</td>
                    <td>{currency(item.grossSalary)}</td>
                    <td>{currency(item.totalDeductions)}</td>
                    <td>{currency(item.netSalary)}</td>
                    <td>
                      <Badge bg={item.status === 'Paid' ? 'success' : item.status === 'Processed' ? 'info' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </td>
                    <td>{item.paymentDate ? new Date(item.paymentDate).toLocaleDateString() : '-'}</td>
                    <td>{item.paymentMethod || '-'}</td>
                    <td>{item.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
        <div className="d-flex align-items-center mb-3 mr-3">
              <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}>
                ← Back
              </Button>
            </div>
      </Card>
    </DashboardLayout>
  );
}
