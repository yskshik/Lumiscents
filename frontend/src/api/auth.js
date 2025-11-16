import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:4001/api/v1',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Register user
export const register = async (userData) => {
    try {
        const response = await api.post('/register', userData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
        throw new Error(errorMessage);
    }
};

// Login user
export const login = async (loginData) => {
    try {
        const response = await api.post('/login', loginData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Login failed';
        throw new Error(errorMessage);
    }
};

// Verify email
export const verifyEmail = async (token) => {
    try {
        const response = await api.get(`/verify-email/${token}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Email verification failed';
        throw new Error(errorMessage);
    }
};

// Google login
export const googleLogin = async (googleData) => {
    try {
        const response = await api.post('/google-login', googleData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Google login failed';
        throw new Error(errorMessage);
    }
};

// Facebook login
export const facebookLogin = async (facebookData) => {
    try {
        const response = await api.post('/facebook-login', facebookData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Facebook login failed';
        throw new Error(errorMessage);
    }
};

export default api;
