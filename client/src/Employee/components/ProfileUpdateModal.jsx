import React from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const ProfileUpdateModal = ({ 
  show, 
  onHide, 
  requestForm, 
  setRequestForm, 
  submitUpdateRequest, 
  backendUrl 
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Request Profile Update</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submitUpdateRequest}>
          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Control value={requestForm.department} onChange={(e) => setRequestForm({ ...requestForm, department: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Designation</Form.Label>
            <Form.Control value={requestForm.designation} onChange={(e) => setRequestForm({ ...requestForm, designation: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control value={requestForm.phone} onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control as="textarea" rows={3} value={requestForm.address} onChange={(e) => setRequestForm({ ...requestForm, address: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Joining Date</Form.Label>
            <Form.Control type="date" value={requestForm.joiningDate} onChange={(e) => setRequestForm({ ...requestForm, joiningDate: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <div className="d-flex align-items-center gap-2">
              <Form.Control type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const fd = new FormData();
                  fd.append('image', file);
                  const { data } = await axios.post(`${backendUrl}/api/uploads/profile-image`, fd, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } });
                  setRequestForm((prev) => ({ ...prev, profileImage: data.url }));
                } catch (err) {
                  console.error(err);
                }
              }} />
              {requestForm.profileImage && (
                <img src={requestForm.profileImage} alt="preview" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '50%' }} />
              )}
            </div>
          </Form.Group>
          <div className="text-end">
            <Button variant="secondary" className="me-2" onClick={onHide}>Cancel</Button>
            <Button variant="primary" type="submit">Submit Request</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileUpdateModal;
