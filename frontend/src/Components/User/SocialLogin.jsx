import React, { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import FacebookLogin from '@greatsumini/react-facebook-login';
import { signInWithPopup, FacebookAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SocialLogin = ({ onSuccess }) => {
    const [loading, setLoading] = useState({ facebook: false, google: false, firebase: false });
    const navigate = useNavigate();

    // Facebook Login with react-facebook-login package
    const handleFacebookLogin = async (response) => {
        if (response.accessToken) {
            try {
                setLoading(prev => ({ ...prev, facebook: true }));
                
                const userData = {
                    name: response.name,
                    email: response.email,
                    avatar: response.picture?.data?.url || '',
                    provider: 'facebook',
                    providerId: response.id
                };

                const { data } = await axios.post(`http://localhost:4001/api/v1/social-login`, userData);
                
                if (data.success) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    toast.success('Facebook login successful!');
                    if (onSuccess) onSuccess(data.user);
                    navigate('/');
                }
            } catch (error) {
                console.error('Facebook login error:', error);
                toast.error(error.response?.data?.message || 'Facebook login failed');
            } finally {
                setLoading(prev => ({ ...prev, facebook: false }));
            }
        }
    };

    const handleFacebookError = (error) => {
        console.error('Facebook login error:', error);
        toast.error('Facebook login failed');
    };

    // Google Login with custom implementation
    const handleGoogleLogin = async () => {
        try {
            setLoading(prev => ({ ...prev, google: true }));
            const result = await signInWithPopup(auth, googleProvider);
            
            const userData = {
                name: result.user.displayName,
                email: result.user.email,
                avatar: result.user.photoURL || '',
                provider: 'google-package',
                providerId: result.user.uid
            };

            const { data } = await axios.post(`http://localhost:4001/api/v1/social-login`, userData);
            
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                toast.success('Google login successful!');
                if (onSuccess) onSuccess(data.user);
                navigate('/');
            }
        } catch (error) {
            console.error('Google login error:', error);
            toast.error(error.message || 'Google login failed');
        } finally {
            setLoading(prev => ({ ...prev, google: false }));
        }
    };

    // Firebase Social Login
    const handleFirebaseGoogleLogin = async () => {
        try {
            setLoading(prev => ({ ...prev, firebase: true }));
            const result = await signInWithPopup(auth, googleProvider);
            
            const userData = {
                name: result.user.displayName,
                email: result.user.email,
                avatar: result.user.photoURL || '',
                provider: 'firebase-google',
                providerId: result.user.uid,
                firebaseUid: result.user.uid
            };

            const { data } = await axios.post(`http://localhost:4001/api/v1/firebase-auth`, userData);
            
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                toast.success('Firebase Google login successful!');
                if (onSuccess) onSuccess(data.user);
                navigate('/');
            }
        } catch (error) {
            console.error('Firebase Google login error:', error);
            toast.error(error.message || 'Firebase Google login failed');
        } finally {
            setLoading(prev => ({ ...prev, firebase: false }));
        }
    };

    const handleFirebaseFacebookLogin = async () => {
        try {
            setLoading(prev => ({ ...prev, firebase: true }));
            const provider = new FacebookAuthProvider();
            const result = await signInWithPopup(auth, provider);
            
            const userData = {
                name: result.user.displayName,
                email: result.user.email,
                avatar: result.user.photoURL || '',
                provider: 'firebase-facebook',
                providerId: result.user.uid,
                firebaseUid: result.user.uid
            };

            const { data } = await axios.post(`http://localhost:4001/api/v1/firebase-auth`, userData);
            
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                toast.success('Firebase Facebook login successful!');
                if (onSuccess) onSuccess(data.user);
                navigate('/');
            }
        } catch (error) {
            console.error('Firebase Facebook login error:', error);
            toast.error(error.message || 'Firebase Facebook login failed');
        } finally {
            setLoading(prev => ({ ...prev, firebase: false }));
        }
    };

    return (
        <div className="social-login-container">
            <div className="text-center mb-3">
                <small className="text-muted">Or continue with</small>
            </div>

            {/* Package-based Social Login */}
            <div className="mb-4">
                <h6 className="text-center mb-3 text-muted">Using Social Login Packages</h6>
                
                {/* Facebook Login Package */}
                <FacebookLogin
                    appId={import.meta.env.VITE_FACEBOOK_APP_ID || "your-facebook-app-id"}
                    onSuccess={handleFacebookLogin}
                    onFail={handleFacebookError}
                    fields="name,email,picture"
                    scope="public_profile"
                    render={({ onClick, logout }) => (
                        <Button
                            variant="primary"
                            className="w-100 mb-2 social-btn facebook-btn"
                            onClick={onClick}
                            disabled={loading.facebook}
                            style={{
                                backgroundColor: '#1877f2',
                                borderColor: '#1877f2',
                                color: 'white'
                            }}
                        >
                            {loading.facebook ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Connecting...
                                </>
                            ) : (
                                <>
                                    <i className="fab fa-facebook-f me-2"></i>
                                    Continue with Facebook
                                </>
                            )}
                        </Button>
                    )}
                />

                {/* Google Login Package */}
                <Button
                    variant="danger"
                    className="w-100 mb-3 social-btn google-btn"
                    onClick={handleGoogleLogin}
                    disabled={loading.google}
                    style={{
                        backgroundColor: '#db4437',
                        borderColor: '#db4437',
                        color: 'white'
                    }}
                >
                    {loading.google ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Connecting...
                        </>
                    ) : (
                        <>
                            <i className="fab fa-google me-2"></i>
                            Continue with Google
                        </>
                    )}
                </Button>
            </div>

            {/* Firebase Social Login */}
            <div className="firebase-login-section">
                <h6 className="text-center mb-3 text-muted">Using Firebase Authentication</h6>
                
                <Button
                    variant="info"
                    className="w-100 mb-2 social-btn firebase-google-btn"
                    onClick={handleFirebaseGoogleLogin}
                    disabled={loading.firebase}
                    style={{
                        backgroundColor: '#4285f4',
                        borderColor: '#4285f4',
                        color: 'white'
                    }}
                >
                    {loading.firebase ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Connecting...
                        </>
                    ) : (
                        <>
                            <i className="fab fa-google me-2"></i>
                            Firebase Google Login
                        </>
                    )}
                </Button>

                <Button
                    variant="primary"
                    className="w-100 mb-3 social-btn firebase-facebook-btn"
                    onClick={handleFirebaseFacebookLogin}
                    disabled={loading.firebase}
                    style={{
                        backgroundColor: '#1877f2',
                        borderColor: '#1877f2',
                        color: 'white'
                    }}
                >
                    {loading.firebase ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Connecting...
                        </>
                    ) : (
                        <>
                            <i className="fab fa-facebook-f me-2"></i>
                            Firebase Facebook Login
                        </>
                    )}
                </Button>
            </div>

            <Alert variant="info" className="small mt-3">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Demo Note:</strong> Social login requires proper API keys. 
                The buttons above demonstrate both package-based and Firebase authentication methods.
            </Alert>

            <style jsx>{`
                .social-btn {
                    transition: all 0.3s ease;
                    border-radius: 25px;
                    padding: 12px 20px;
                    font-weight: 500;
                    text-transform: none;
                    letter-spacing: 0.5px;
                }
                
                .social-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
                }
                
                .facebook-btn:hover {
                    background-color: #166fe5 !important;
                }
                
                .google-btn:hover {
                    background-color: #c23321 !important;
                }
                
                .firebase-google-btn:hover {
                    background-color: #3367d6 !important;
                }
                
                .firebase-facebook-btn:hover {
                    background-color: #166fe5 !important;
                }
            `}</style>
        </div>
    );
};

export default SocialLogin;
