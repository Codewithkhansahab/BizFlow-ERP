import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Row, Col, Button, Table, Form, Badge, Pagination, Spinner, Modal } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import DashboardLayout from '../Dashboard/DashboardLayout';
import { AppContent } from '../context/AppContext';
import SalaryFormModal from './components/SalaryFormModal';
import { useNavigate } from 'react-router-dom';

const monthNames = ['','January','February','March','April','May','June','July','August','September','October','November','December'];

const statuses = ['Draft','Processed','Paid'];

const currency = (n) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(n || 0));

export default function SalaryManagement(){
  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

  // data
  const [employees, setEmployees] = useState([]);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [payItem, setPayItem] = useState(null);
  const [payMethod, setPayMethod] = useState('BankTransfer');

  // filters
  const currentYear = new Date().getFullYear();
  const [filters, setFilters] = useState({ employeeId: '', month: '', year: currentYear, status: '' });

  // modal
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  // fetch employees for dropdowns
  const loadEmployees = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/employee/employees`, { withCredentials: true });
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to load employees');
    }
  };

  const loadSalaries = async (opts={}) => {
    const q = { page, limit, ...filters, ...opts };
    Object.keys(q).forEach(k => (q[k] === '' || q[k] === undefined) && delete q[k]);
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/salaries`, {
        params: q,
        withCredentials: true,
      });
      setItems(data.items || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setPage(data.page || 1);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to load salaries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEmployees(); }, []);
  useEffect(() => { loadSalaries(); /* eslint-disable-next-line */ }, [page, limit]);

  const onFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setPage(1);
    loadSalaries({ page: 1 });
  };

  const clearFilters = () => {
    setFilters({ employeeId: '', month: '', year: currentYear, status: '' });
    setPage(1);
    loadSalaries({ page: 1, employeeId: '', month: '', status: '' });
  };

  const openCreate = () => { setEditing(null); setShowForm(true); };
  const openEdit = (item) => { setEditing(item); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this salary record?')) return;
    try {
      await axios.delete(`${backendUrl}/api/salaries/${id}`, { withCredentials: true });
      toast.success('Salary deleted');
      loadSalaries();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete');
    }
  };

  const openPay = (item) => {
    if (item.status === 'Paid') return toast.info('Already paid');
    setPayItem(item);
    setPayMethod('BankTransfer');
    setShowPay(true);
  };

  const confirmPay = async () => {
    if (!payItem) return;
    try {
      await axios.patch(`${backendUrl}/api/salaries/${payItem._id}/pay`, { paymentMethod: payMethod }, { withCredentials: true });
      toast.success('Marked as paid');
      setShowPay(false);
      setPayItem(null);
      loadSalaries();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to mark paid');
    }
  };

  const pages = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);

  return (
    <DashboardLayout roleTitle="HR">
      <Row className="align-items-end g-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Employee</Form.Label>
            <Form.Select name="employeeId" value={filters.employeeId} onChange={onFilterChange}>
              <option value="">All</option>
              {employees.map(e => <option key={e._id} value={e._id}>{e.user?.name} ({e.user?.email})</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Month</Form.Label>
            <Form.Select name="month" value={filters.month} onChange={onFilterChange}>
              <option value="">All</option>
              {monthNames.map((m, i) => i>0 && <option key={i} value={i}>{m}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Year</Form.Label>
            <Form.Control name="year" type="number" value={filters.year} onChange={onFilterChange} />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select name="status" value={filters.status} onChange={onFilterChange}>
              <option value="">All</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3} className="d-flex gap-2">
          <Button variant="primary" onClick={applyFilters}>Apply</Button>
          <Button variant="secondary" onClick={clearFilters}>Clear</Button>
          <Button variant="success" className="ms-auto" onClick={openCreate}>+ Create</Button>
        </Col>
      </Row>

      <div className="mt-4">
        {loading ? (
          <div className="text-center py-5"><Spinner /></div>
        ) : (
          <>
            <Table responsive bordered hover size="sm">
              <thead className="table-light">
                <tr>
                  <th>Employee</th>
                  <th>Period</th>
                  <th>Gross</th>
                  <th>Net</th>
                  <th>Status</th>
                  <th>Paid On</th>
                  <th>Method</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr><td colSpan={8} className="text-center">No records</td></tr>
                )}
                {items.map(item => (
                  <tr key={item._id}>
                    <td>{item.employee?.user?.name} <div className="text-muted small">{item.employee?.user?.email}</div></td>
                    <td>{monthNames[item.month]} {item.year}</td>
                    <td>{currency(item.grossSalary)}</td>
                    <td>{currency(item.netSalary)}</td>
                    <td>
                      <Badge bg={item.status === 'Paid' ? 'success' : item.status === 'Processed' ? 'info' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </td>
                    <td>{item.paymentDate ? new Date(item.paymentDate).toLocaleDateString() : '-'}</td>
                    <td>{item.paymentMethod || '-'}</td>
                    <td className="d-flex gap-2">
                      <Button size="sm" variant="outline-primary" onClick={() => openEdit(item)}>Edit</Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(item._id)}>Delete</Button>
                      <Button size="sm" variant={item.status==='Paid'?'success':'outline-success'} onClick={() => openPay(item)}>
                        {item.status==='Paid'?'Paid':'Mark Paid'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted">Total: {total}</div>
              <div className="d-flex align-items-center gap-3">
                <Form.Select size="sm" style={{ width: 80 }} value={limit} onChange={(e)=>{setLimit(Number(e.target.value)); setPage(1);}}>
                  {[10,20,50].map(n => <option key={n} value={n}>{n}/page</option>)}
                </Form.Select>
                <Pagination className="mb-0">
                  {pages.map(p => (
                    <Pagination.Item key={p} active={p===page} onClick={()=>setPage(p)}>{p}</Pagination.Item>
                  ))}
                </Pagination>
              </div>
            </div>
            <div className="d-flex align-items-center mb-3">
        <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}>
          ← Back
        </Button>
      </div>
          </>
        )}
      </div>

      <SalaryFormModal 
        show={showForm}
        onHide={() => setShowForm(false)}
        initialData={editing}
        employees={employees}
        onSaved={() => loadSalaries()}
      />

      <Modal show={showPay} onHide={() => setShowPay(false)} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Mark as Paid</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Payment Method</Form.Label>
            <Form.Select value={payMethod} onChange={(e)=>setPayMethod(e.target.value)}>
              {['BankTransfer','Cash','Cheque','UPI'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShowPay(false)}>Cancel</Button>
          <Button variant="success" onClick={confirmPay}>Confirm & Mark Paid</Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
}
