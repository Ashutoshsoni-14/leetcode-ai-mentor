/**
 * DashboardPage
 * Shows user stats, topic breakdown, and attempt history
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { attemptService } from '../services/api';
import AttemptCard from '../components/AttemptCard';
import ScoreBadge from '../components/ScoreBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const StatCard = ({ label, value, sub, accent = false }) => (
  <div className={`border rounded-lg p-4 bg-void-2 ${accent ? 'border-acid/40' : 'border-border'}`}>
    <div className="text-xs font-mono text-muted uppercase tracking-wider mb-1">{label}</div>
    <div className={`font-display font-extrabold text-3xl ${accent ? 'text-acid' : 'text-bright'}`}>{value}</div>
    {sub && <div className="text-xs font-mono text-muted mt-1">{sub}</div>}
  </div>
);

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [attemptsLoading, setAttemptsLoading] = useState(false);
  const [error, setError] = useState('');

  // Load dashboard stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await attemptService.getDashboard(user.id);
        setStats(data);
      } catch (err) {
        setError('Failed to load stats.');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [user.id]);

  // Load paginated attempts
  useEffect(() => {
    const loadAttempts = async () => {
      setAttemptsLoading(true);
      try {
        const { data } = await attemptService.getUserAttempts(user.id, pagination.page);
        setAttempts(data.attempts);
        setPagination(p => ({ ...p, ...data.pagination }));
      } catch (err) {
        // silently fail for pagination
      } finally {
        setAttemptsLoading(false);
      }
    };
    loadAttempts();
  }, [user.id, pagination.page]);

  const changePage = (newPage) => {
    setPagination(p => ({ ...p, page: newPage }));
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-bright">
            <span className="text-acid">./</span>dashboard
          </h1>
          <p className="text-xs text-muted font-mono mt-1">Welcome back, {user.name}</p>
        </div>
        <Link
          to="/"
          className="px-4 py-2 bg-acid text-void font-mono font-bold text-xs rounded hover:bg-acid-dim transition-colors"
        >
          + New Problem
        </Link>
      </div>

      {error && (
        <div className="border border-danger/30 bg-danger/5 rounded px-3 py-2 text-danger text-xs font-mono mb-6">
          {error}
        </div>
      )}

      {stats && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 stagger">
            <StatCard label="Total Attempts" value={stats.totalAttempts} accent />
            <StatCard label="Avg Score" value={`${stats.avgScore}/100`} />
            <StatCard
              label="Strong Topics"
              value={stats.strongTopics.length}
              sub={stats.strongTopics.slice(0, 2).join(', ') || 'None yet'}
            />
            <StatCard
              label="Needs Work"
              value={stats.weakTopics.length}
              sub={stats.weakTopics.slice(0, 2).join(', ') || 'None'}
            />
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Topic breakdown */}
            <div className="border border-border rounded-xl p-5 bg-void-2">
              <h2 className="font-display font-bold text-bright text-sm mb-4">Topic Breakdown</h2>
              {stats.topicStats.length === 0 ? (
                <p className="text-xs text-muted font-mono">No data yet. Submit problems to see topics.</p>
              ) : (
                <div className="space-y-2.5">
                  {stats.topicStats.slice(0, 8).map(({ topic, count, avgScore }) => (
                    <div key={topic}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-mono text-bright">{topic}</span>
                        <span className="text-[10px] font-mono text-muted">{count}x · {avgScore}%</span>
                      </div>
                      <div className="h-1 bg-void-3 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            avgScore >= 70 ? 'bg-acid' : avgScore >= 50 ? 'bg-warn' : 'bg-danger'
                          }`}
                          style={{ width: `${avgScore}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Solution type breakdown */}
            <div className="border border-border rounded-xl p-5 bg-void-2">
              <h2 className="font-display font-bold text-bright text-sm mb-4">Solution Types</h2>
              {Object.keys(stats.solutionTypeBreakdown).length === 0 ? (
                <p className="text-xs text-muted font-mono">No submissions yet.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(stats.solutionTypeBreakdown).map(([type, count]) => {
                    const colors = {
                      'optimal': 'bg-acid/80',
                      'optimized': 'bg-plasma-bright/80',
                      'brute-force': 'bg-warn/80',
                      'unknown': 'bg-muted/50'
                    };
                    const pct = Math.round((count / stats.totalAttempts) * 100);
                    return (
                      <div key={type}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-mono text-bright capitalize">{type}</span>
                          <span className="text-xs font-mono text-muted">{count} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 bg-void-3 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${colors[type] || 'bg-muted'}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Strong / weak summary */}
            <div className="border border-border rounded-xl p-5 bg-void-2">
              <h2 className="font-display font-bold text-bright text-sm mb-4">Strengths & Gaps</h2>
              <div className="mb-3">
                <div className="text-[10px] font-mono text-acid uppercase tracking-wider mb-2">Strong</div>
                {stats.strongTopics.length === 0
                  ? <p className="text-xs text-muted font-mono">Submit more problems to see strengths.</p>
                  : <div className="flex flex-wrap gap-1.5">
                      {stats.strongTopics.map(t => (
                        <span key={t} className="text-[10px] font-mono border border-acid/30 text-acid bg-acid/5 rounded px-2 py-0.5">{t}</span>
                      ))}
                    </div>
                }
              </div>
              <div>
                <div className="text-[10px] font-mono text-danger uppercase tracking-wider mb-2">Needs Work</div>
                {stats.weakTopics.length === 0
                  ? <p className="text-xs text-muted font-mono">Looking good! No weak spots detected.</p>
                  : <div className="flex flex-wrap gap-1.5">
                      {stats.weakTopics.map(t => (
                        <span key={t} className="text-[10px] font-mono border border-danger/30 text-danger bg-danger/5 rounded px-2 py-0.5">{t}</span>
                      ))}
                    </div>
                }
              </div>
            </div>
          </div>
        </>
      )}

      {/* Attempt History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-bright text-base">
            Attempt History
            <span className="text-xs font-mono text-muted ml-2 font-normal">({pagination.total} total)</span>
          </h2>
        </div>

        {attemptsLoading ? (
          <LoadingSpinner message="Loading attempts..." />
        ) : attempts.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-10 text-center">
            <p className="text-muted font-mono text-sm mb-4">No attempts yet.</p>
            <Link to="/" className="text-xs font-mono text-acid hover:underline">
              Submit your first problem →
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5 stagger">
            {attempts.map(attempt => (
              <div key={attempt._id} className="animate-fade-in">
                <AttemptCard attempt={attempt} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => changePage(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 text-xs font-mono border border-border rounded text-muted hover:text-bright disabled:opacity-30 transition-colors"
            >
              ← Prev
            </button>
            <span className="text-xs font-mono text-muted">
              Page {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => changePage(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1.5 text-xs font-mono border border-border rounded text-muted hover:text-bright disabled:opacity-30 transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
