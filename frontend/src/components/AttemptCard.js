import React from 'react';
import { Link } from 'react-router-dom';
import ScoreBadge from './ScoreBadge';

const solutionColors = {
  'optimal': 'text-acid border-acid/30 bg-acid/5',
  'optimized': 'text-plasma-bright border-plasma/30 bg-plasma/5',
  'brute-force': 'text-warn border-warn/30 bg-warn/5',
  'unknown': 'text-muted border-border'
};

export default function AttemptCard({ attempt }) {
  const date = new Date(attempt.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <Link
      to={`/attempts/${attempt._id}`}
      className="block border border-border rounded-lg p-4 hover:border-acid/50 hover:bg-void-3 transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-bright text-sm truncate group-hover:text-acid transition-colors">
            {attempt.problemTitle}
          </h3>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className={`text-[10px] font-mono border rounded px-2 py-0.5 ${solutionColors[attempt.solutionType] || solutionColors.unknown}`}>
              {attempt.solutionType}
            </span>
            <span className="text-[10px] font-mono text-muted">
              {attempt.timeComplexity}
            </span>
            <span className="text-[10px] font-mono text-muted uppercase">
              {attempt.language}
            </span>
            <span className="text-[10px] font-mono text-muted ml-auto">
              {date}
            </span>
          </div>
          {attempt.topics && attempt.topics.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {attempt.topics.slice(0, 3).map(t => (
                <span key={t} className="text-[9px] font-mono text-muted border border-border rounded px-1.5 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        <ScoreBadge score={attempt.score} />
      </div>
    </Link>
  );
}
