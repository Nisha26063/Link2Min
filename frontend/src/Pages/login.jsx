import React, { useState } from "react";
import '../css/login.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from '../Assets/bgmlink.svg'; // Adjust the path as needed


const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);

    const handleToggle = () => {
        setIsSignUp(!isSignUp);
    };

    const handleGoogleLogin = () => {
        console.log("Google Login Clicked!");
    };

    return (
        
        <div className="login-container">

            <div className="login-box">
                <h1 className="logo-text">{isSignUp ? "Create your account" : "Sign in"}</h1>
                <form className="login-form">
                    <div className="form-group">
                        <input type="text" placeholder="Email" required />
                    </div>
                    <div className="form-group">
                        <input type="password" placeholder="Password" required />
                    </div>
                    <button type="submit" className="submit-button">
                        {isSignUp ? "Sign Up" : "Next"}
                    </button>
                    <div className="form-group google-login-group">
                        <button className="google-button" onClick={handleGoogleLogin}>
                            <i className="fab fa-google google-icon"></i> Continue with Google
                        </button>
                    </div>
                    <p className="toggle-text" onClick={handleToggle}>
                        {isSignUp ? "Already have an account? Sign in" : "Create an account"}
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;