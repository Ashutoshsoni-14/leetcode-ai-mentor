/**
 * Navbar Component
 * Top navigation bar with auth state awareness
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="border-b border-border bg-void-2 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded border border-acid flex items-center justify-center">
              <span className="text-acid font-mono text-xs font-bold">AI</span>
            </div>
            <span className="font-display font-bold text-bright text-sm tracking-wide hidden sm:block">
              LeetCode<span className="text-acid">AI</span>Mentor
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                isActive('/') ? 'text-acid bg-acid/10' : 'text-muted hover:text-bright'
              }`}
            >
              ./home
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                  isActive('/dashboard') ? 'text-acid bg-acid/10' : 'text-muted hover:text-bright'
                }`}
              >
                ./dashboard
              </Link>
            )}
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="text-xs text-muted font-mono hidden sm:block">
                  <span className="text-acid">@</span>{user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-mono border border-border rounded text-muted hover:text-danger hover:border-danger transition-colors"
                >
                  logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-mono text-muted hover:text-bright transition-colors"
                >
                  login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-1.5 text-xs font-mono bg-acid text-void rounded hover:bg-acid-dim transition-colors font-bold"
                >
                  sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
