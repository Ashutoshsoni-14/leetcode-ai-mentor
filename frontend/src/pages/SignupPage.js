/**
 * SignupPage
 * New user registration form
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authService.signup(form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      if (err.response) {
        // Server responded with an error (4xx, 5xx)
        setError(err.response.data?.error || `Server error: ${err.response.status}`);
      } else if (err.request) {
        // Request was made but no response — backend not running or wrong URL
        setError('Cannot reach the server. Make sure the backend is running on port 5000.');
      } else {
        setError(err.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[90vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-lg bg-acid/10 border border-acid/30 items-center justify-center mb-4">
            <span className="text-acid font-mono font-bold">AI</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-bright">Create your account</h1>
          <p className="text-muted font-mono text-xs mt-1">Start improving your coding skills</p>
        </div>

        {/* Form */}
        <div className="border border-border rounded-xl p-6 bg-void-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Alex Chen"
                required
                className="w-full bg-void-3 border border-border rounded px-3 py-2.5 font-mono text-sm text-bright placeholder-muted focus:outline-none focus:border-acid transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-void-3 border border-border rounded px-3 py-2.5 font-mono text-sm text-bright placeholder-muted focus:outline-none focus:border-acid transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                className="w-full bg-void-3 border border-border rounded px-3 py-2.5 font-mono text-sm text-bright placeholder-muted focus:outline-none focus:border-acid transition-colors"
              />
            </div>

            {error && (
              <div className="border border-danger/30 bg-danger/5 rounded px-3 py-2 text-danger text-xs font-mono">
                ✗ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-acid text-void font-mono font-bold text-sm rounded hover:bg-acid-dim transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-void border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : 'Create Account →'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted font-mono mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-acid hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
