import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA_FoLZNMOJ4IQkXHC5Y8yZawaJ9hFWih4",
    authDomain: "lumiscents-app.firebaseapp.com",
    projectId: "lumiscents-app",
    storageBucket: "lumiscents-app.firebasestorage.app",
    messagingSenderId: "883019846622",
    appId: "1:883019846622:web:0e44c6c08bf8b34f27c34f",
    measurementId: "G-YRLF17VLHV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analyticsInstance = null;

if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
    try {
        analyticsInstance = getAnalytics(app);
    } catch (error) {
        console.warn('Firebase Analytics not initialized:', error);
    }
}

export const analytics = analyticsInstance;
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Provider
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Google Sign In function
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Return user data in a clean format
        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
        };
    } catch (error) {
        console.error('Google Sign-In Error:', error);
        throw error;
    }
};
