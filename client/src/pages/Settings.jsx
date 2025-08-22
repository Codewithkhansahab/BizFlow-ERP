import React, { useState, useContext } from 'react';
import { Container, Card, Form, Button, Tabs, Tab, Alert } from 'react-bootstrap';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Settings = () => {
    const { backendUrl } = useContext(AppContent);
    const [activeTab, setActiveTab] = useState('account');
    const [loading, setLoading] = useState(false);
    
    // Account Settings
    const [accountData, setAccountData] = useState({
        email: '',
        language: 'en',
        timezone: 'UTC',
    });
    
    // Notification Settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        marketingEmails: false,
        securityAlerts: true,
    });
    
    // Security Settings
    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorAuth: false,
    });

    const handleAccountChange = (e) => {
        const { name, value } = e.target;
        setAccountData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;
        setNotificationSettings(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSecurityChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSecurityData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveAccount = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // In a real app, this would update the account settings via API
            // await axios.put(`${backendUrl}/api/settings/account`, accountData, { withCredentials: true });
            toast.success('Account settings updated successfully');
        } catch (error) {
            toast.error('Failed to update account settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNotifications = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // In a real app, this would update the notification settings via API
            // await axios.put(`${backendUrl}/api/settings/notifications`, notificationSettings, { withCredentials: true });
            toast.success('Notification settings updated successfully');
        } catch (error) {
            toast.error('Failed to update notification settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSecurity = async (e) => {
        e.preventDefault();
        
        if (securityData.newPassword && securityData.newPassword !== securityData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        
        setLoading(true);
        try {
            // In a real app, this would update the security settings via API
            // await axios.put(`${backendUrl}/api/settings/security`, securityData, { withCredentials: true });
            
            // Clear password fields
            setSecurityData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
            
            toast.success('Security settings updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update security settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-4">
            <h2 className="mb-4">Settings</h2>
            
            <Card>
                <Card.Body>
                    <Tabs
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                        className="mb-4"
                        fill
                    >
                        <Tab eventKey="account" title="Account">
                            <div className="mt-4">
                                <h5>Account Settings</h5>
                                <p className="text-muted">Update your account information and preferences</p>
                                
                                <Form onSubmit={handleSaveAccount} className="mt-4">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={accountData.email}
                                            onChange={handleAccountChange}
                                            required
                                        />
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-3">
                                        <Form.Label>Language</Form.Label>
                                        <Form.Select
                                            name="language"
                                            value={accountData.language}
                                            onChange={handleAccountChange}
                                        >
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                            <option value="de">German</option>
                                        </Form.Select>
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-3">
                                        <Form.Label>Timezone</Form.Label>
                                        <Form.Select
                                            name="timezone"
                                            value={accountData.timezone}
                                            onChange={handleAccountChange}
                                        >
                                            <option value="UTC">UTC</option>
                                            <option value="EST">Eastern Time (EST)</option>
                                            <option value="PST">Pacific Time (PST)</option>
                                            <option value="CET">Central European Time (CET)</option>
                                        </Form.Select>
                                    </Form.Group>
                                    
                                    <Button variant="primary" type="submit" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </Form>
                            </div>
                        </Tab>
                        
                        <Tab eventKey="notifications" title="Notifications">
                            <div className="mt-4">
                                <h5>Notification Preferences</h5>
                                <p className="text-muted">Choose how you receive notifications</p>
                                
                                <Form onSubmit={handleSaveNotifications} className="mt-4">
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="switch"
                                            id="emailNotifications"
                                            name="emailNotifications"
                                            label="Email Notifications"
                                            checked={notificationSettings.emailNotifications}
                                            onChange={handleNotificationChange}
                                            className="mb-2"
                                        />
                                        <Form.Text className="text-muted">
                                            Receive email notifications for important updates
                                        </Form.Text>
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="switch"
                                            id="pushNotifications"
                                            name="pushNotifications"
                                            label="Push Notifications"
                                            checked={notificationSettings.pushNotifications}
                                            onChange={handleNotificationChange}
                                            className="mb-2"
                                        />
                                        <Form.Text className="text-muted">
                                            Receive push notifications on this device
                                        </Form.Text>
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="switch"
                                            id="marketingEmails"
                                            name="marketingEmails"
                                            label="Marketing Emails"
                                            checked={notificationSettings.marketingEmails}
                                            onChange={handleNotificationChange}
                                            className="mb-2"
                                        />
                                        <Form.Text className="text-muted">
                                            Receive promotional emails and offers
                                        </Form.Text>
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-4">
                                        <Form.Check
                                            type="switch"
                                            id="securityAlerts"
                                            name="securityAlerts"
                                            label="Security Alerts"
                                            checked={notificationSettings.securityAlerts}
                                            onChange={handleNotificationChange}
                                            className="mb-2"
                                        />
                                        <Form.Text className="text-muted">
                                            Receive important security alerts
                                        </Form.Text>
                                    </Form.Group>
                                    
                                    <Button variant="primary" type="submit" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Preferences'}
                                    </Button>
                                </Form>
                            </div>
                        </Tab>
                        
                        <Tab eventKey="security" title="Security">
                            <div className="mt-4">
                                <h5>Security Settings</h5>
                                <p className="text-muted">Manage your account security</p>
                                
                                <Form onSubmit={handleSaveSecurity} className="mt-4">
                                    <h6 className="mb-3">Change Password</h6>
                                    
                                    <Form.Group className="mb-3">
                                        <Form.Label>Current Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="currentPassword"
                                            value={securityData.currentPassword}
                                            onChange={handleSecurityChange}
                                            placeholder="Enter current password"
                                        />
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-3">
                                        <Form.Label>New Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="newPassword"
                                            value={securityData.newPassword}
                                            onChange={handleSecurityChange}
                                            placeholder="Enter new password"
                                        />
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-4">
                                        <Form.Label>Confirm New Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="confirmPassword"
                                            value={securityData.confirmPassword}
                                            onChange={handleSecurityChange}
                                            placeholder="Confirm new password"
                                        />
                                    </Form.Group>
                                    
                                    <div className="mb-4">
                                        <h6 className="mb-3">Two-Factor Authentication</h6>
                                        <Form.Check
                                            type="switch"
                                            id="twoFactorAuth"
                                            name="twoFactorAuth"
                                            label="Enable Two-Factor Authentication"
                                            checked={securityData.twoFactorAuth}
                                            onChange={handleSecurityChange}
                                            className="mb-2"
                                        />
                                        <Form.Text className="text-muted">
                                            Add an extra layer of security to your account
                                        </Form.Text>
                                    </div>
                                    
                                    <Button variant="primary" type="submit" disabled={loading}>
                                        {loading ? 'Saving...' : 'Update Security Settings'}
                                    </Button>
                                </Form>
                            </div>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Settings;
