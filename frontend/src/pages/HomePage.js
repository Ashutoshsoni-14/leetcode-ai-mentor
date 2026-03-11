/**
 * HomePage
 * Landing page with hero section and code submission form
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SubmitForm from '../components/SubmitForm';

const FeatureCard = ({ icon, title, desc }) => (
  <div className="border border-border rounded-lg p-4 bg-void-2 animate-fade-in">
    <div className="text-2xl mb-2">{icon}</div>
    <h3 className="font-display font-semibold text-bright text-sm mb-1">{title}</h3>
    <p className="text-xs text-muted font-mono leading-relaxed">{desc}</p>
  </div>
);

export default function HomePage() {
  const { user } = useAuth();

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="text-center mb-12 animate-fade-in">
        {/* Terminal prompt */}
        <div className="inline-flex items-center gap-2 border border-acid/30 bg-acid/5 rounded-full px-4 py-1.5 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse"></div>
          <span className="text-acid text-xs font-mono">AI-powered code analysis</span>
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-bright mb-4 leading-tight">
          Level Up Your<br />
          <span className="text-acid text-glow-acid">Coding Skills</span>
        </h1>
        <p className="text-muted font-mono text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8">
          Submit your solutions. Get instant feedback on time complexity,<br className="hidden sm:block" />
          algorithm patterns, and optimization suggestions.
        </p>

        {!user && (
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/signup"
              className="px-6 py-2.5 bg-acid text-void font-mono font-bold text-sm rounded hover:bg-acid-dim transition-colors"
            >
              Get Started Free →
            </Link>
            <Link
              to="/login"
              className="px-6 py-2.5 border border-border text-muted font-mono text-sm rounded hover:text-bright hover:border-bright transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 stagger">
        <FeatureCard
          icon="⚡"
          title="Complexity Analysis"
          desc="Automatically detects time & space complexity using heuristic pattern analysis."
        />
        <FeatureCard
          icon="🧠"
          title="Algorithm Detection"
          desc="Identifies patterns like Two Pointers, DP, Binary Search, BFS/DFS, and more."
        />
        <FeatureCard
          icon="📈"
          title="Progress Tracking"
          desc="Track your strong and weak topics over time with your personal dashboard."
        />
      </div>

      {/* Submit Form or CTA */}
      {user ? (
        <div className="max-w-2xl mx-auto">
          <div className="border border-border rounded-xl p-6 bg-void-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded bg-acid/10 border border-acid/30 flex items-center justify-center">
                <span className="text-acid text-xs font-mono">+</span>
              </div>
              <div>
                <h2 className="font-display font-bold text-bright text-base">Submit a Problem</h2>
                <p className="text-xs text-muted font-mono">Paste your solution and get instant AI analysis</p>
              </div>
            </div>
            <SubmitForm />
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto border border-dashed border-border rounded-xl p-10 text-center">
          <div className="text-muted font-mono text-sm mb-4">
            <span className="text-acid">$</span> sign in to submit your first problem
          </div>
          <Link
            to="/signup"
            className="inline-block px-6 py-2.5 bg-acid text-void font-mono font-bold text-sm rounded hover:bg-acid-dim transition-colors"
          >
            Create Free Account →
          </Link>
        </div>
      )}

      {/* Bottom stats */}
      <div className="mt-16 border-t border-border pt-10">
        <div className="grid grid-cols-3 gap-6 text-center max-w-lg mx-auto stagger">
          {[
            { value: '10+', label: 'Algorithm Patterns' },
            { value: '100', label: 'Max Score' },
            { value: '∞', label: 'Problems to Solve' }
          ].map(stat => (
            <div key={stat.label} className="animate-fade-in">
              <div className="font-display font-extrabold text-2xl text-acid text-glow-acid">{stat.value}</div>
              <div className="text-[10px] font-mono text-muted mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
