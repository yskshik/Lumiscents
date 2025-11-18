import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Visibility, VisibilityOff, Person, Lock, Email, LocalFireDepartment, Facebook, Google, Login as LoginIcon, CloudUpload } from '@mui/icons-material';
import { signInWithPopup } from 'firebase/auth';
import { login, googleLogin, facebookLogin } from '../../api/auth';
import { authenticate } from '../../Utils/helpers';
import { auth, googleProvider } from '../../firebase';
import '../../styles/lumiscents.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Call login API
            const loginData = {
                email,
                password
            };
            
            const response = await login(loginData);
            
            // Store user data and token
            authenticate(response, () => {
                toast.success('Welcome back to Lumiscents!');
                navigate('/');
            });
        } catch (error) {
            toast.error(error.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            // Use Firebase Google OAuth
            const result = await signInWithPopup(auth, googleProvider);

            const user = result.user;
            const googleData = {
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL || '',
                provider: 'google',
                providerId: user.uid,
            };

            const response = await googleLogin(googleData);

            authenticate(response, () => {
                toast.success('Welcome back with Google!');
                navigate('/');
            });
        } catch (error) {
            toast.error(error.message || 'Google sign in failed');
        } finally {
            setLoading(false);
        }
    };

    const handleFacebookSignIn = async () => {
        setLoading(true);
        try {
            // Implement Facebook OAuth - for now, simulate
            // In production, you would integrate with Facebook OAuth API
            toast.success('Facebook sign in will be implemented soon!');
        } catch (error) {
            toast.error('Facebook sign in failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="lumiscents-auth-page">
            <div className="lumiscents-auth-container">
            {/* Floating Decorations */}
            <div className="lumiscents-candles-bg">
            </div>

            {/* Login Form */}
            <div className="lumiscents-auth-card">
                {/* Header */}
                <div className="lumiscents-auth-header">
                    <div className="lumiscents-logo">
                        <LocalFireDepartment className="lumiscents-logo-icon" />
                        <h1>Lumiscents</h1>
                    </div>
                    <h2 className="lumiscents-auth-subtitle">Welcome Back</h2>
                    <p className="lumiscents-auth-description">Sign in to continue your candle journey</p>
                </div>

                {/* Login Form */}
                <form className="lumiscents-auth-form" onSubmit={submitHandler}>
                    {/* Email and Password - Horizontal */}
                    <div className="lumiscents-form-horizontal">
                        <div className="lumiscents-form-group">
                            <label className="lumiscents-form-label">
                                <Email className="lumiscents-field-icon" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                className="lumiscents-form-input"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="lumiscents-form-group">
                            <label className="lumiscents-form-label">
                                <Lock className="lumiscents-field-icon" />
                                Password
                            </label>
                            <div className="lumiscents-password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="lumiscents-form-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="lumiscents-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lumiscents-form-options">
                        <label className="lumiscents-checkbox-label">
                            <input type="checkbox" className="lumiscents-checkbox" />
                            <span>Remember me</span>
                        </label>
                        <Link to="/password/forgot" className="lumiscents-forgot-link">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="lumiscents-btn lumiscents-btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="lumiscents-divider">
                    <span>Or continue with</span>
                </div>

                <div className="lumiscents-social-login">
                    <button 
                        className="lumiscents-social-btn"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                    >
                        <Google className="lumiscents-social-icon" />
                        Continue with Google
                    </button>
                    <button 
                        className="lumiscents-social-btn"
                        onClick={handleFacebookSignIn}
                        disabled={loading}
                    >
                        <Facebook className="lumiscents-social-icon" />
                        Continue with Facebook
                    </button>
                </div>

                <div className="lumiscents-auth-footer">
                    <p>Don't have an account?</p>
                    <Link to="/register" className="lumiscents-btn lumiscents-btn-primary">
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Login;
