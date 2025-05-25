import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { useNavigate } from 'react-router-dom';

// import { signInWithPopup } from 'firebase/auth';
// import { auth, provider } from '../firebase';

export default function Login() {
  const navigate = useNavigate();
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // Handle signed-in user info here (e.g., redirect, store user, etc.)
      // const user = result.user;
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };
  const handleAppleLogin = () => {
    // Apple login logic here
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-header">Login</div>
        <div className="login-content">
          <img
            src="https://cdn.prod.website-files.com/63994dae1033718bee6949ce/6747983ede6e37cf76d8383f_Twin_Mind_Logo_200.png"
            alt="TwinMind Logo"
            className="login-logo"
          />
          <div className="login-buttons">
            <button className="login-btn google" onClick={handleGoogleLogin}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Icon" className="icon" />
              Continue with Google
              <span className="btn-handle" />
      </button>
          </div>
        </div>
        <div className="login-footer">
          <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}