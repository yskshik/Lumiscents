import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Visibility, VisibilityOff, Person, Lock, Email, LocalFireDepartment, Facebook, Google, PersonAdd, CloudUpload } from '@mui/icons-material';
import { register, googleLogin, facebookLogin } from '../../api/auth';
import { authenticate } from '../../Utils/helpers';
import '../../styles/lumiscents.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg');
    const navigate = useNavigate();

    useEffect(() => {
    }, []);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Validate passwords match
            if (password !== confirmPassword) {
                toast.error('Passwords do not match');
                setLoading(false);
                return;
            }

            // Call registration API
            const userData = {
                name,
                email,
                password,
                avatar: avatar || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
            };
            
            const response = await register(userData);
            
            // Registration successful - redirect to login
            toast.success('Registration successful! Please check your email for verification.');
            navigate('/login');
        } catch (error) {
            toast.error(error.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            // Implement Google OAuth
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Successfully registered with Google!');
            navigate('/');
        } catch (error) {
            toast.error('Google registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleFacebookSignIn = async () => {
        setLoading(true);
        try {
            // Implement Facebook OAuth
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Successfully registered with Facebook!');
            navigate('/');
        } catch (error) {
            toast.error('Facebook registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="lumiscents-auth-container">
            {/* Floating Decorations */}
            <div className="lumiscents-candles-bg">
            </div>

            {/* Register Form */}
            <div className="lumiscents-auth-card">
                {/* Header */}
                <div className="lumiscents-auth-header">
                    <div className="lumiscents-logo">
                        <LocalFireDepartment className="lumiscents-logo-icon" />
                        <h1>Lumiscents</h1>
                    </div>
                    <h2 className="lumiscents-auth-subtitle">Create Account</h2>
                    <p className="lumiscents-auth-description">Join our candle community</p>
                </div>

                {/* Register Form */}
                <form className="lumiscents-auth-form" onSubmit={submitHandler}>
                    {/* Avatar and File Upload - Horizontal */}
                    <div className="lumiscents-avatar-horizontal">
                        <div className="lumiscents-avatar-preview">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" className="lumiscents-avatar-img" />
                            ) : (
                                <Person className="lumiscents-avatar-placeholder" />
                            )}
                        </div>
                        <div className="lumiscents-avatar-info">
                            <label className="lumiscents-avatar-label">
                                <input
                                    type="file"
                                    className="lumiscents-avatar-input"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                                <CloudUpload className="lumiscents-upload-icon" />
                                <span>Upload Photo</span>
                            </label>
                        </div>
                    </div>

                    {/* Full Name and Email - Horizontal */}
                    <div className="lumiscents-form-horizontal">
                        <div className="lumiscents-form-group">
                            <label className="lumiscents-form-label">
                                <Person className="lumiscents-field-icon" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                className="lumiscents-form-input"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

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
                    </div>

                    {/* Password and Confirm Password - Horizontal */}
                    <div className="lumiscents-form-horizontal">
                        <div className="lumiscents-form-group">
                            <label className="lumiscents-form-label">
                                <Lock className="lumiscents-field-icon" />
                                Password
                            </label>
                            <div className="lumiscents-password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="lumiscents-form-input"
                                    placeholder="Create a password"
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

                        <div className="lumiscents-form-group">
                            <label className="lumiscents-form-label">
                                <Lock className="lumiscents-field-icon" />
                                Confirm Password
                            </label>
                            <div className="lumiscents-password-wrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="lumiscents-form-input"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="lumiscents-password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lumiscents-form-options">
                        <label className="lumiscents-checkbox-label">
                            <input type="checkbox" className="lumiscents-checkbox" />
                            <span>I agree to the Terms & Conditions</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="lumiscents-btn lumiscents-btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
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
                    <p>Already have an account?</p>
                    <Link to="/login" className="lumiscents-btn lumiscents-btn-primary">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
