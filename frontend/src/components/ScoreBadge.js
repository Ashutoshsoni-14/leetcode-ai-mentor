import React from 'react';

export default function ScoreBadge({ score, size = 'md' }) {
  const color =
    score >= 80 ? 'text-acid border-acid/40 bg-acid/10' :
    score >= 60 ? 'text-warn border-warn/40 bg-warn/10' :
    'text-danger border-danger/40 bg-danger/10';

  const sizeClass = size === 'lg' ? 'text-3xl w-16 h-16' : 'text-sm w-10 h-10';

  return (
    <div className={`rounded-full border flex items-center justify-center font-mono font-bold ${color} ${sizeClass}`}>
      {score}
    </div>
  );
}
