import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SimpleRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            setLoading(true);
            
            const { data } = await axios.post(`${import.meta.env.VITE_API}/register`, {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            if (data.success) {
                toast.success('Registration successful! Please check your email to verify your account.');
                navigate('/login');
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, var(--vanilla-cream) 0%, var(--honey-gold) 100%)' }}>
            <Container>
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
                            <Card.Header className="text-center py-4" style={{ background: 'var(--primary-color)', borderRadius: '20px 20px 0 0' }}>
                                <h3 className="text-white mb-0">
                                    <i className="fas fa-user-plus me-2"></i>
                                    Create Account
                                </h3>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            placeholder="Enter your full name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Password</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Create a password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                            <Button
                                                variant="link"
                                                className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent"
                                                style={{ zIndex: 10, right: '10px' }}
                                                onClick={() => setShowPassword(!showPassword)}
                                                type="button"
                                            >
                                                <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                                            </Button>
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                placeholder="Confirm your password"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required
                                            />
                                            <Button
                                                variant="link"
                                                className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent"
                                                style={{ zIndex: 10, right: '10px' }}
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                type="button"
                                            >
                                                <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                                            </Button>
                                        </div>
                                    </Form.Group>

                                    <Button
                                        type="submit"
                                        className="w-100 mb-3"
                                        style={{ 
                                            background: 'var(--primary-color)',
                                            border: 'none',
                                            borderRadius: '25px',
                                            padding: '12px'
                                        }}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-user-plus me-2"></i>
                                                Create Account
                                            </>
                                        )}
                                    </Button>
                                </Form>

                                <div className="text-center">
                                    <p className="mb-0">
                                        Already have an account?{' '}
                                        <Link 
                                            to="/login" 
                                            className="text-decoration-none fw-bold"
                                            style={{ color: 'var(--primary-color)' }}
                                        >
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default SimpleRegister;
