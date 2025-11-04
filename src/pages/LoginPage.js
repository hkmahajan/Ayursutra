import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authUser, setSession } from '../utils/auth';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    // Auto-fill demo credentials
    if (newRole === 'patient') {
      setEmail('pat@ayur.com');
      setPassword('pat123');
    } else {
      setEmail('doc@ayur.com');
      setPassword('doc123');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      const user = authUser(email, password);
      
      if (!user) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      if (user.role !== role) {
        setError(`This account is registered as a ${user.role}, not a ${role}`);
        setLoading(false);
        return;
      }

      // Set session and redirect
      setSession(user);
      setLoading(false);

      if (user.role === 'patient') {
        navigate('/patient');
      } else if (user.role === 'doctor') {
        navigate('/doctor');
      }
    }, 500);
  };

  return (
    <div className="login-page">
      {/* Background Animation */}
      <div className="bg-animation">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="login-container">
        {/* Left Panel - Branding */}
        <div className="login-left">
          <div className="brand-content">
            <div className="brand-logo">
              <i className="bi bi-heart-pulse-fill"></i>
              <h2>AyurSutra</h2>
            </div>
            <p className="brand-message">
              Welcome back! Sign in to continue your healing journey with personalized Ayurvedic care.
            </p>
            <ul className="features-list">
              <li>
                <i className="bi bi-check-circle-fill"></i>
                <span>Personalized Panchakarma Therapies</span>
              </li>
              <li>
                <i className="bi bi-check-circle-fill"></i>
                <span>Expert Ayurvedic Consultations</span>
              </li>
              <li>
                <i className="bi bi-check-circle-fill"></i>
                <span>Track Your Wellness Progress</span>
              </li>
              <li>
                <i className="bi bi-check-circle-fill"></i>
                <span>24/7 Support & Guidance</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="login-right">
          <div className="login-header">
            <h3>Welcome Back</h3>
            <p>Please sign in to your account</p>
          </div>

          {/* Role Selector */}
          <div className="role-selector">
            <div
              className={`role-option ${role === 'patient' ? 'active' : ''}`}
              onClick={() => handleRoleChange('patient')}
            >
              <i className="bi bi-person"></i> Patient
            </div>
            <div
              className={`role-option ${role === 'doctor' ? 'active' : ''}`}
              onClick={() => handleRoleChange('doctor')}
            >
              <i className="bi bi-briefcase"></i> Doctor
            </div>
            <div className={`role-slider ${role === 'doctor' ? 'doctor' : ''}`}></div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <i className="bi bi-envelope input-icon"></i>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <i className="bi bi-lock input-icon"></i>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="form-options">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="remember" />
                <label className="form-check-label" htmlFor="remember">
                  Remember me
                </label>
              </div>
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="demo-credentials">
            <p className="text-muted small">
              <strong>Demo Credentials:</strong><br/>
              Patient: pat@ayur.com / pat123<br/>
              Doctor: doc@ayur.com / doc123
            </p>
          </div>

          <div className="signup-link">
            <p>Don't have an account? <a href="#">Sign Up</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
