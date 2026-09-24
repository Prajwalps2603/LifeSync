import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, Chrome, AlertCircle, Sparkles } from 'lucide-react';

type AuthMode = 'login' | 'signup';

export const LoginPage: React.FC = () => {
  const { login, signUp, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!displayName.trim()) { setError('Display name is required.'); setIsLoading(false); return; }
        await signUp(email, password, displayName);
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill for demo credentials
  const fillDemo = (role: 'admin' | 'user' | 'guest') => {
    const creds = {
      admin: { email: 'admin@lifesync.app', password: 'admin123' },
      user:  { email: 'prajwal@lifesync.app', password: 'user123' },
      guest: { email: 'guest@lifesync.app', password: 'guest123' },
    };
    setEmail(creds[role].email);
    setPassword(creds[role].password);
    setMode('login');
    setError('');
  };

  return (
    <div className="auth-page">
      {/* Animated background orbs */}
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
      </div>

      {/* Brand */}
      <div className="auth-brand">
        <div className="auth-brand-icon">
          <Sparkles size={22} />
        </div>
        <span className="auth-brand-name">LifeSync AI</span>
      </div>

      {/* Card */}
      <div className="auth-card">
        <div className="auth-card-header">
          <h1 className="auth-title">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Sign in to your Life Operating System'
              : 'Start organizing your life with AI'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="auth-error">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="auth-field">
              <label className="auth-label">Display Name</label>
              <div className="auth-input-wrap">
                <User size={16} className="auth-input-icon" />
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Prajwal Nair"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <div className="auth-input-wrap">
              <Mail size={16} className="auth-input-icon" />
              <input
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus={mode === 'login'}
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="auth-input-toggle"
                onClick={() => setShowPassword(s => !s)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="auth-spinner" />
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>or</span>
        </div>

        {/* Google */}
        <button className="auth-btn-google" onClick={handleGoogle} disabled={isLoading}>
          <Chrome size={17} />
          Continue with Google
        </button>

        {/* Toggle mode */}
        <p className="auth-toggle">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            className="auth-toggle-btn"
            onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(''); }}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        {/* Demo credentials */}
        <div className="auth-demo">
          <p className="auth-demo-title">Demo credentials</p>
          <div className="auth-demo-pills">
            <button className="auth-demo-pill auth-demo-admin" onClick={() => fillDemo('admin')}>
              👑 Admin
            </button>
            <button className="auth-demo-pill auth-demo-user" onClick={() => fillDemo('user')}>
              👤 User
            </button>
            <button className="auth-demo-pill auth-demo-guest" onClick={() => fillDemo('guest')}>
              👁️ Guest
            </button>
          </div>
        </div>
      </div>

      <p className="auth-footer">
        LifeSync AI · Your Life Operating System
      </p>
    </div>
  );
};
