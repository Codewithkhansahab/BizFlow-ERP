import React, { useContext, useState } from 'react';
import { Form, Button, Card, Container, Row, Col, InputGroup, Collapse } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
    const { backendUrl, setIsLoggedIn, setUserData } = useContext(AppContent);
    const navigate = useNavigate();
    
    const [state, setState] = useState('Login'); // 'Login' or 'Sign Up'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Employee'); // default role
    const [showPwdRules, setShowPwdRules] = useState(false);

    // Strong password rules for Sign Up view
    const pwdRules = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };
    const isStrongPassword = Object.values(pwdRules).every(Boolean);

    const handleNavigation = (userRole) => {
        switch (userRole) {
            case 'Admin': navigate('/admin'); break;
            case 'HR': navigate('/hr'); break;
            case 'Employee': navigate('/employee'); break;
            case 'CEO': navigate('/ceo'); break;
            case 'Manager': navigate('/manager'); break;
            default: navigate('/'); 
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true;

            if (state === 'Sign Up') {
                // Client-side strong password check
                if (!isStrongPassword) {
                    // Suppress error message on screen; rely on checklist + disabled button
                    return;
                }
                const { data } = await axios.post(`${backendUrl}/api/users/register`, {
                    name, email, password, role
                });

                if (data._id) { // Sign Up successful
                    if (data.approvalStatus === 'Pending') {
                        const approver = data.approvalRequiredRole || 'an approver';
                        toast.info(`Account request submitted. Pending ${approver} approval.`);
                    } else {
                        toast.success("Account created successfully! Please login.");
                    }
                    // Clear fields and switch to login
                    setName('');
                    setEmail('');
                    setPassword('');
                    setRole('Employee');
                    setState('Login');
                } else {
                    // Suppress error message on screen for Sign Up failures
                }
            } else { // Login
                const { data } = await axios.post(`${backendUrl}/api/users/login`, {
                    email, password, role
                });

                if (data.role) { // Login successful
                    setIsLoggedIn(true);
                    setUserData(data);
                    toast.success(data.message || "Login successful!");
                    handleNavigation(data.role);
                } else {
                    toast.error(data.message || "Login failed");
                }
            }
        } catch (error) {
            // Only show errors for Login; suppress for Sign Up
            if (state === 'Login') {
                toast.error(error.response?.data?.message || error.message);
            }
        }
    };

    return (
        <Container
            fluid
            className="d-flex align-items-center justify-content-center min-vh-100"
            style={{ background: 'linear-gradient(135deg, #ff6ec4 0%, #7873f5 50%, #4ADEDE 100%)' }}
        >
            <Row className="w-100 justify-content-center">
                <Col xs={12} md={6} lg={4}>
                    <Card
                        className="shadow-lg p-4 rounded-4 text-white"
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                    >
                        <div className="text-center mb-4">
                            <img
                                onClick={() => navigate("/")}
                                src="/generated-image (3).png"
                                alt="logo"
                                className="img-fluid mb-3"
                                style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                            />
                            <h2 className="fw-bold">
                                {state === 'Sign Up' ? 'Create Account' : 'Login to your Account'}
                            </h2>
                            <p className="text-light opacity-75">
                                {state === 'Sign Up' ? 'Create your Account' : 'Login to your Account'}
                            </p>
                        </div>

                        <Form onSubmit={onSubmitHandler}>
                            {state === 'Sign Up' && (
                                <>
                                    <Form.Group className="mb-3">
                                        <InputGroup>
                                            <InputGroup.Text><FaUser /></InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Full Name"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    {/* <Form.Group className="mb-3">
                                        <InputGroup>
                                            <InputGroup.Text>Role</InputGroup.Text>
                                            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                                                <option value="Admin">Admin</option>
                                                <option value="HR">HR</option>
                                                <option value="Employee">Employee</option>
                                                <option value="CEO">CEO</option>
                                                <option value="Manager">Manager</option>
                                            </Form.Select>
                                        </InputGroup>
                                    </Form.Group> */}
                                </>
                            )}

                            <Form.Group className="mb-3">
                                <InputGroup>
                                    <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                                    <Form.Control
                                        type="email"
                                        placeholder="Email ID"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </InputGroup>
                            </Form.Group>

                            {state === 'Sign Up' && (
                                <></>
                            )}

                            <Form.Group className="mb-2">
                                <InputGroup>
                                    <InputGroup.Text><FaLock /></InputGroup.Text>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </InputGroup>
                            </Form.Group>

                            {state === 'Sign Up' && (
                                <div>
                                    <Button
                                        variant="link"
                                        className="p-0 mt-1 text-white-50"
                                        onClick={() => setShowPwdRules(!showPwdRules)}
                                        aria-controls="pwd-rules"
                                        aria-expanded={showPwdRules}
                                    >
                                        {showPwdRules ? 'Hide password rules' : 'Show password rules'}
                                    </Button>
                                    <Collapse in={showPwdRules}>
                                        <div id="pwd-rules">
                                            <ul className="mt-2 mb-2 small text-light">
                                                <li>At least 8 characters</li>
                                                <li>At least one uppercase letter</li>
                                                <li>At least one lowercase letter</li>
                                                <li>At least one number</li>
                                                <li>At least one special character</li>
                                            </ul>
                                            <div className="small text-warning">
                                                Note: The Sign Up button will enable once all rules are satisfied.
                                            </div>
                                        </div>
                                    </Collapse>
                                </div>
                            )}


                            <Form.Group className="mb-3">
                                <InputGroup>
                                    <InputGroup.Text><FaUser /></InputGroup.Text>
                                    <Form.Select 
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        required
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="HR">HR</option>
                                        <option value="Employee">Employee</option>
                                        <option value="Manager">Manager</option>
                                        <option value="CEO">CEO</option>
                                    </Form.Select>
                                </InputGroup>
                            </Form.Group>

                            {state === 'Login' && (
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="rememberMe" />
                                        <label className="form-check-label" htmlFor="rememberMe">
                                            Remember me
                                        </label>
                                    </div>
                                    <Link to="/forgot-password" className="text-decoration-none text-white">
                                        Forgot Password?
                                    </Link>
                                </div>
                            )}

                            <Button
                                variant="light"
                                type="submit"
                                className="w-100 py-2 fw-semibold rounded-pill"
                                disabled={state === 'Sign Up' && !isStrongPassword}
                            >
                                {state === 'Sign Up' ? 'Sign Up' : 'Login'}
                            </Button>
                        </Form>

                        <div className="text-center mt-4">
                            <small className="text-light opacity-75">
                                {state === 'Sign Up'
                                    ? 'Already have an account? '
                                    : "Don't have an account? "}
                                <Button
                                    variant="link"
                                    className="p-0 text-white fw-bold"
                                    onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
                                >
                                    {state === 'Sign Up' ? 'Login' : 'Sign Up'}
                                </Button>
                            </small>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
