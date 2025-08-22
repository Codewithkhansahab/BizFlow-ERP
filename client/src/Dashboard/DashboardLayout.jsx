import React, { useContext, useEffect, useState } from 'react';
import { Navbar, Nav, Container, Dropdown, Button, Image } from 'react-bootstrap';
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminProfileUpdateModal from '../Admin/components/ProfileUpdateModal';
// AnnouncementPanel removed as part of rollback

const DashboardLayout = ({ children, roleTitle }) => {
    const { backendUrl, setIsLoggedIn, userData, setUserData } = useContext(AppContent);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [now, setNow] = useState(new Date());
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/users/get-details`, { withCredentials: true });
                if (data.success) {
                    const ud = { ...data.userData };
                    if (ud.profileImage) {
                        ud.profileImage = ud.profileImage.startsWith('http')
                            ? ud.profileImage
                            : `${(backendUrl || '').replace(/\/$/, '')}/${(ud.profileImage || '').replace(/^\/+/, '')}`;
                    }
                    setUser(ud);
                    setUserData(ud);
                } else {
                    toast.error(data.message || "Failed to fetch user data");
                }
            } catch (error) {
                toast.error(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUserDetails();
    }, [backendUrl, setUserData]);

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    const logoutHandler = async () => {
        try {
            await axios.post(`${backendUrl}/api/users/logout`, {}, { withCredentials: true });
            setIsLoggedIn(false);
            setUserData(null);
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const handleVerifyAccount = () => {
        navigate('/email-verify');
        
    };

    const handleProfileUpdateSuccess = (updatedUserData) => {
   
        
        // Ensure the profile image URL is absolute
        const updatedData = { ...updatedUserData };
        console.log('Before update - profileImage:', updatedData.profileImage);
        
        if (updatedData.profileImage) {
            if (!updatedData.profileImage.startsWith('http')) {
                // Add the backend URL if it's a relative path
                updatedData.profileImage = `${backendUrl}${updatedData.profileImage}`;
            }
            console.log('After update - profileImage:', updatedData.profileImage);
        }
        
        // Update user data in state
        setUser(prev => ({
            ...prev,
            ...updatedData
        }));
        
        // Also update in context
        setUserData(prev => ({
            ...prev,
            ...updatedData
        }));
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <>
            <Navbar
                expand="lg"
                className="px-4 shadow-sm"
                style={{
                    background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
                }}
            >
                <Navbar.Brand href="#" className="text-white fw-bold">
                    {roleTitle} Dashboard
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="bg-light" />
                <Navbar.Collapse className="justify-content-end">
                    <Nav className="align-items-center">
                        <span className="text-white me-3 d-none d-md-inline">
                            {now.toLocaleTimeString()}
                        </span>
                        <Button variant="outline-light" onClick={logoutHandler} className="me-3">Logout</Button>
                        <Dropdown align="end">
                            <Dropdown.Toggle variant="light" id="dropdown-profile" className="p-0 rounded-circle">
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#f8f9fa'
                                }}>
                                    <Image
                                        src={
                                            user?.profileImage
                                                ? (user.profileImage.startsWith('http')
                                                    ? user.profileImage
                                                    : `${(backendUrl || '').replace(/\/$/, '')}/${(user.profileImage || '').replace(/^\/+/, '')}`)
                                                : 'https://via.placeholder.com/40'
                                        }
                                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/40'; }}
                                        roundedCircle
                                        width={40}
                                        height={40}
                                        style={{
                                            objectFit: 'cover',
                                            width: '100%',
                                            height: '100%'
                                        }}
                                    />
                                </div>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {!user?.isAccountVerified && (
                                    <Dropdown.Item onClick={handleVerifyAccount}>Verify Account</Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            {/* Single, clean content area below navbar */}
            <div className="container-fluid py-4">
                {/* AnnouncementPanel removed as part of rollback */}
                {children}
            </div>

            {/* Profile Update Modal */}
            <AdminProfileUpdateModal 
                show={showProfileModal} 
                onHide={() => setShowProfileModal(false)}
                onUpdateSuccess={handleProfileUpdateSuccess}
                userData={userData}
            />
        </>
    );
};

export default DashboardLayout;
