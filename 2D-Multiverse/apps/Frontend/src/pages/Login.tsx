import React from 'react';
import { User, Lock } from 'lucide-react';
import '../pages/LoginForm.css';
import '../pages/login.css';

export const LoginForm: React.FC = () => {
  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Welcome Back</h1>
        <p>Please sign in to continue</p>
      </div>

      <form>
        <div className="form-group">
          <User className="input-icon" size={20} />
          <input
            type="email"
            className="form-input"
            placeholder="Email address"
          />
        </div>

        <div className="form-group">
          <Lock className="input-icon" size={20} />
          <input
            type="password"
            className="form-input"
            placeholder="Password"
          />
        </div>

        <div className="remember-forgot">
          <label className="checkbox-group">
            <input type="checkbox" className="checkbox-input" />
            <span>Remember me</span>
          </label>
          <a href="#" className="forgot-link">
            Forgot password?
          </a>
        </div>

        <button type="submit" className="submit-button">
          Sign in
        </button>

        <div className="signup-link">
          Don't have an account?{' '}
          <a href="#">Sign up</a>
        </div>
      </form>
    </div>
  );
}