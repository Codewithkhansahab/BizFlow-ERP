import React, { useState, useEffect, useContext } from 'react';
import { Modal, Form, Button, Image, Row, Col } from 'react-bootstrap';
import { AppContent } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiUpload } from 'react-icons/fi';

const AdminProfileUpdateModal = ({ show, onHide, onUpdateSuccess, userData: initialUserData }) => {
    const { backendUrl, userData, setUserData } = useContext(AppContent);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        profileImage: ''
    });
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (initialUserData) {
            setFormData({
                name: initialUserData.name || '',
                email: initialUserData.email || '',
                phone: initialUserData.phone || '',
                profileImage: initialUserData.profileImage || ''
            });
            if (initialUserData.profileImage) {
                setImagePreview(initialUserData.profileImage);
            }
        }
    }, [initialUserData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        // Create a preview URL for the image
        setImagePreview(URL.createObjectURL(file));
        
        // Store the file in formData to be sent with the form
        setFormData(prev => ({
            ...prev,
            profileImage: file
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            
            // Append text fields
            formDataToSend.append('name', formData.name);
            if (formData.phone) formDataToSend.append('phone', formData.phone);
            
            // Append image file if selected
            if (formData.profileImage && formData.profileImage instanceof File) {
                formDataToSend.append('image', formData.profileImage);
            }

            const { data } = await axios.put(
                `${backendUrl}/api/users/update-profile`,
                formDataToSend,
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (data.success) {
                toast.success('Profile updated successfully');
                // Update user data in context
                setUserData(prev => ({
                    ...prev,
                    ...data.userData
                }));
                onHide();
                
                // Call the success handler with updated data
                if (onUpdateSuccess) {
                    onUpdateSuccess(data.userData);
                }
            } else {
                toast.error(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Update Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-4">
                        <Col xs={12} className="text-center">
                            <div className="position-relative d-inline-block">
                                <Image
                                    src={imagePreview || (userData?.profileImage || 'https://via.placeholder.com/150')}
                                    roundedCircle
                                    width={150}
                                    height={150}
                                    className="border border-3 border-primary object-fit-cover"
                                    style={{ width: '150px', height: '150px' }}
                                />
                                <label 
                                    className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2 cursor-pointer"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <FiUpload className="text-white" size={20} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="d-none"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button variant="secondary" onClick={onHide} disabled={loading}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Saving...
                                </>
                            ) : 'Save Changes'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AdminProfileUpdateModal;
