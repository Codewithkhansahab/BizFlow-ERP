import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AppContent } from '../../context/AppContext';

const emptyComponents = { basic: 0, hra: 0, allowances: 0, bonus: 0 };
const emptyDeductions = { pf: 0, tax: 0, tds: 0, other: 0 };

const months = [
  { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
  { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
  { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
  { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i);

export default function SalaryFormModal({ show, onHide, initialData = null, employees = [], onSaved }) {
  const isEdit = !!(initialData && initialData._id);
  const { backendUrl } = useContext(AppContent);

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    employeeId: '',
    month: new Date().getMonth() + 1,
    year: currentYear,
    components: { ...emptyComponents },
    deductions: { ...emptyDeductions },
    remarks: '',
    status: 'Draft',
    paymentMethod: '',
  });

  useEffect(() => {
    if (show) {
      if (isEdit) {
        setForm({
          employeeId: initialData.employee?._id || initialData.employee,
          month: initialData.month,
          year: initialData.year,
          components: { ...emptyComponents, ...(initialData.components || {}) },
          deductions: { ...emptyDeductions, ...(initialData.deductions || {}) },
          remarks: initialData.remarks || '',
          status: initialData.status || 'Draft',
          paymentMethod: initialData.paymentMethod || '',
        });
      } else {
        setForm((prev) => ({ ...prev, employeeId: '', remarks: '', status: 'Draft', paymentMethod: '' }));
      }
    }
  }, [show, isEdit, initialData]);

  const gross = useMemo(() => {
    const c = form.components || {};
    return Number(c.basic || 0) + Number(c.hra || 0) + Number(c.allowances || 0) + Number(c.bonus || 0);
  }, [form.components]);

  const totalDeductions = useMemo(() => {
    const d = form.deductions || {};
    return Number(d.pf || 0) + Number(d.tax || 0) + Number(d.tds || 0) + Number(d.other || 0);
  }, [form.deductions]);

  const net = useMemo(() => gross - totalDeductions, [gross, totalDeductions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumber = (path, key, value) => {
    setForm((prev) => ({
      ...prev,
      [path]: { ...(prev[path] || {}), [key]: value === '' ? '' : Number(value) }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      if (!form.employeeId || !form.month || !form.year) {
        toast.error('Employee, month and year are required');
        return;
      }

      const payload = {
        employeeId: form.employeeId,
        month: Number(form.month),
        year: Number(form.year),
        components: {
          basic: Number(form.components.basic || 0),
          hra: Number(form.components.hra || 0),
          allowances: Number(form.components.allowances || 0),
          bonus: Number(form.components.bonus || 0),
        },
        deductions: {
          pf: Number(form.deductions.pf || 0),
          tax: Number(form.deductions.tax || 0),
          tds: Number(form.deductions.tds || 0),
          other: Number(form.deductions.other || 0),
        },
        remarks: form.remarks,
        status: form.status,
      };

      if (!isEdit) {
        await axios.post(`${backendUrl}/api/salaries`, payload, { withCredentials: true });
        toast.success('Salary created');
      } else {
        await axios.put(`${backendUrl}/api/salaries/${initialData._id}`, payload, { withCredentials: true });
        toast.success('Salary updated');
      }

      onSaved && onSaved();
      onHide && onHide();
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to save';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit Salary' : 'Create Salary'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Employee</Form.Label>
                <Form.Select name="employeeId" value={form.employeeId} onChange={handleChange} required disabled={isEdit}>
                  <option value="">Select employee</option>
                  {employees.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.user?.name || e.name} ({e.user?.email})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Month</Form.Label>
                <Form.Select name="month" value={form.month} onChange={handleChange} required>
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Year</Form.Label>
                <Form.Select name="year" value={form.year} onChange={handleChange} required>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <hr />
          <h6>Components</h6>
          <Row className="g-3">
            {['basic','hra','allowances','bonus'].map((key) => (
              <Col md={3} key={key}>
                <Form.Group>
                  <Form.Label className="text-capitalize">{key}</Form.Label>
                  <Form.Control type="number" min="0" step="0.01" value={form.components[key]} onChange={(e)=>handleNumber('components', key, e.target.value)} />
                </Form.Group>
              </Col>
            ))}
          </Row>

          <h6 className="mt-3">Deductions</h6>
          <Row className="g-3">
            {['pf','tax','tds','other'].map((key) => (
              <Col md={3} key={key}>
                <Form.Group>
                  <Form.Label className="text-uppercase">{key}</Form.Label>
                  <Form.Control type="number" min="0" step="0.01" value={form.deductions[key]} onChange={(e)=>handleNumber('deductions', key, e.target.value)} />
                </Form.Group>
              </Col>
            ))}
          </Row>

          <Row className="g-3 mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={form.status} onChange={handleChange}>
                  {['Draft','Processed'].map(s => <option key={s} value={s}>{s}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Remarks</Form.Label>
                <Form.Control name="remarks" value={form.remarks} onChange={handleChange} placeholder="Optional remarks" />
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-3">
            <strong>Gross:</strong> {gross.toFixed(2)} | <strong>Deductions:</strong> {totalDeductions.toFixed(2)} | <strong>Net:</strong> {net.toFixed(2)}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={saving}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={saving}>{saving ? 'Saving...' : (isEdit ? 'Update' : 'Create')}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
