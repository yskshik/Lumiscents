import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const VerifyEmail = () => {
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        verifyEmail();
    }, [token]);

    const verifyEmail = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API}/verify-email/${token}`);
            
            if (data.success) {
                setVerified(true);
                toast.success('Email verified successfully!');
                
                // Auto-login user after verification
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redirect to home after 3 seconds
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            }
        } catch (error) {
            console.error('Email verification error:', error);
            setError(error.response?.data?.message || 'Email verification failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card className="text-center border-0 shadow-sm">
                            <Card.Body className="p-5">
                                <Spinner animation="border" variant="primary" className="mb-3" />
                                <h4>Verifying your email...</h4>
                                <p className="text-muted">Please wait while we verify your email address.</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="text-center border-0 shadow-sm">
                        <Card.Body className="p-5">
                            {verified ? (
                                <>
                                    <div className="mb-4">
                                        <i className="fas fa-check-circle fa-4x text-success mb-3"></i>
                                        <h2 className="text-success">Email Verified!</h2>
                                    </div>
                                    <Alert variant="success">
                                        <Alert.Heading>Welcome to Lumiscents! 🕯️</Alert.Heading>
                                        <p>Your email has been successfully verified. You are now logged in and can start exploring our premium candle collection.</p>
                                        <hr />
                                        <p className="mb-0">
                                            <strong>Redirecting to home page in 3 seconds...</strong>
                                        </p>
                                    </Alert>
                                    <div className="d-grid gap-2">
                                        <Button 
                                            as={Link} 
                                            to="/" 
                                            size="lg"
                                            style={{ 
                                                backgroundColor: 'var(--primary-color)', 
                                                borderColor: 'var(--primary-color)' 
                                            }}
                                        >
                                            <i className="fas fa-home me-2"></i>
                                            Go to Home Page
                                        </Button>
                                        <Button 
                                            as={Link} 
                                            to="/me" 
                                            variant="outline-primary"
                                        >
                                            <i className="fas fa-user me-2"></i>
                                            View My Profile
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mb-4">
                                        <i className="fas fa-times-circle fa-4x text-danger mb-3"></i>
                                        <h2 className="text-danger">Verification Failed</h2>
                                    </div>
                                    <Alert variant="danger">
                                        <Alert.Heading>Oops! Something went wrong</Alert.Heading>
                                        <p>{error}</p>
                                        <hr />
                                        <p className="mb-0">
                                            The verification link may have expired or is invalid.
                                        </p>
                                    </Alert>
                                    <div className="d-grid gap-2">
                                        <Button 
                                            as={Link} 
                                            to="/login" 
                                            variant="primary"
                                            size="lg"
                                        >
                                            <i className="fas fa-sign-in-alt me-2"></i>
                                            Go to Login
                                        </Button>
                                        <Button 
                                            as={Link} 
                                            to="/register" 
                                            variant="outline-secondary"
                                        >
                                            <i className="fas fa-user-plus me-2"></i>
                                            Create New Account
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default VerifyEmail;
