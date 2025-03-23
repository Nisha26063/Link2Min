import React, { useState, useEffect } from "react";
import '../css/login.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const token = query.get("token");
        if (token) {
            console.log("Token found:", token); // Debug
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('authToken', token);
            navigate('/dashboard', { replace: true }); // Replace to avoid back-button issues
        }
    }, [location, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const validEmail = "user@example.com";
        const validPassword = "password123";
        if (email === validEmail && password === validPassword) {
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/dashboard');
        } else {
            setError('Invalid email or password');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:5000/auth/google";
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="logo-text">Sign in</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        Sign In
                    </button>
                    <div className="form-group google-login-group">
                        <button 
                            type="button"
                            className="google-button" 
                            onClick={handleGoogleLogin}
                        >
                            <i className="fab fa-google google-icon"></i> Continue with Google
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;