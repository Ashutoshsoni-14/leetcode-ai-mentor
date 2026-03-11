/**
 * AttemptDetailPage
 * Shows full analysis result for a single submission
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { attemptService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ScoreBadge from '../components/ScoreBadge';
import ComplexityBadge from '../components/ComplexityBadge';

const solutionTypeConfig = {
  'optimal': { color: 'text-acid border-acid/30 bg-acid/5', label: '✦ Optimal' },
  'optimized': { color: 'text-plasma-bright border-plasma/30 bg-plasma/5', label: '◈ Optimized' },
  'brute-force': { color: 'text-warn border-warn/30 bg-warn/5', label: '⚠ Brute Force' },
  'unknown': { color: 'text-muted border-border', label: '? Unknown' },
};

export default function AttemptDetailPage() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await attemptService.getAttemptById(id);
        setAttempt(data.attempt);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load attempt.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading analysis..." />;
  if (error) return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-center">
      <p className="text-danger font-mono text-sm">{error}</p>
      <Link to="/dashboard" className="text-acid text-xs font-mono hover:underline mt-4 block">← Back to Dashboard</Link>
    </main>
  );

  const typeConfig = solutionTypeConfig[attempt.solutionType] || solutionTypeConfig.unknown;
  const date = new Date(attempt.createdAt).toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back nav */}
      <Link to="/dashboard" className="text-xs font-mono text-muted hover:text-acid transition-colors mb-6 block">
        ← back to dashboard
      </Link>

      {/* Header */}
      <div className="border border-border rounded-xl p-6 bg-void-2 mb-6 animate-fade-in">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-extrabold text-xl text-bright mb-2 leading-tight">
              {attempt.problemTitle}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-xs font-mono border rounded px-2.5 py-1 ${typeConfig.color}`}>
                {typeConfig.label}
              </span>
              <span className="text-xs font-mono text-muted uppercase border border-border rounded px-2 py-0.5">
                {attempt.language}
              </span>
              <span className="text-xs font-mono text-muted">{date}</span>
            </div>
          </div>
          <ScoreBadge score={attempt.score} size="lg" />
        </div>
      </div>

      {/* Complexity badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 stagger">
        <ComplexityBadge label="Time Complexity" value={attempt.timeComplexity} />
        <ComplexityBadge label="Space Complexity" value={attempt.spaceComplexity} />
        <div className="border border-border rounded px-3 py-2 font-mono">
          <div className="text-[10px] text-muted mb-1 uppercase tracking-widest">Pattern</div>
          <div className="text-xs font-bold text-plasma-bright leading-tight">{attempt.algorithmPattern}</div>
        </div>
        <div className="border border-border rounded px-3 py-2 font-mono">
          <div className="text-[10px] text-muted mb-1 uppercase tracking-widest">Score</div>
          <div className="text-sm font-bold text-bright">{attempt.score} / 100</div>
        </div>
      </div>

      {/* Main 2-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* AI Feedback */}
        <div className="border border-acid/20 rounded-xl p-5 bg-void-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse"></div>
            <h2 className="font-display font-bold text-bright text-sm">AI Feedback</h2>
          </div>
          <p className="text-sm font-mono text-muted leading-relaxed">{attempt.feedback}</p>
        </div>

        {/* Problem Description */}
        <div className="border border-border rounded-xl p-5 bg-void-2">
          <h2 className="font-display font-bold text-bright text-sm mb-3">Problem Statement</h2>
          <p className="text-xs font-mono text-muted leading-relaxed whitespace-pre-wrap">
            {attempt.problemDescription}
          </p>
        </div>
      </div>

      {/* Suggestions */}
      {attempt.suggestions && attempt.suggestions.length > 0 && (
        <div className="border border-border rounded-xl p-5 bg-void-2 mb-5 animate-fade-in">
          <h2 className="font-display font-bold text-bright text-sm mb-4">
            💡 Improvement Suggestions
          </h2>
          <div className="space-y-2.5">
            {attempt.suggestions.map((s, i) => (
              <div key={i} className="flex gap-3 text-xs font-mono text-muted leading-relaxed">
                <span className="text-acid font-bold shrink-0">{String(i + 1).padStart(2, '0')}.</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edge Cases */}
      {attempt.edgeCases && attempt.edgeCases.length > 0 && (
        <div className="border border-warn/20 rounded-xl p-5 bg-void-2 mb-5 animate-fade-in">
          <h2 className="font-display font-bold text-bright text-sm mb-4">
            ⚠ Edge Cases to Consider
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {attempt.edgeCases.map((e, i) => (
              <div key={i} className="flex gap-2 items-start text-xs font-mono text-muted">
                <span className="text-warn shrink-0">→</span>
                <span>{e}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topics */}
      {attempt.topics && attempt.topics.length > 0 && (
        <div className="border border-border rounded-xl p-5 bg-void-2 mb-5">
          <h2 className="font-display font-bold text-bright text-sm mb-3">Topics Covered</h2>
          <div className="flex flex-wrap gap-2">
            {attempt.topics.map(t => (
              <span key={t} className="text-xs font-mono border border-border rounded px-2.5 py-1 text-muted hover:text-bright hover:border-bright transition-colors">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Submitted Code */}
      <div className="border border-border rounded-xl overflow-hidden animate-fade-in">
        <div className="bg-panel border-b border-border px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-danger/60"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-warn/60"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-acid/60"></div>
            <span className="text-muted text-[10px] font-mono ml-2">
              solution.{attempt.language === 'python' ? 'py' : attempt.language === 'java' ? 'java' : attempt.language === 'cpp' ? 'cpp' : 'js'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-muted">{attempt.code.length} chars</span>
        </div>
        <pre className="overflow-x-auto p-4 text-xs font-mono text-bright leading-relaxed bg-void-3 max-h-96">
          <code>{attempt.code}</code>
        </pre>
      </div>

      {/* Bottom actions */}
      <div className="flex gap-3 mt-6">
        <Link
          to="/"
          className="px-4 py-2 bg-acid text-void font-mono font-bold text-xs rounded hover:bg-acid-dim transition-colors"
        >
          + Submit Another
        </Link>
        <Link
          to="/dashboard"
          className="px-4 py-2 border border-border text-muted font-mono text-xs rounded hover:text-bright hover:border-bright transition-colors"
        >
          View All Attempts
        </Link>
      </div>
    </main>
  );
}
