import React from 'react';

export default function ComplexityBadge({ label, value }) {
  const isGood = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'].includes(value);
  const color = isGood
    ? 'border-acid/30 text-acid bg-acid/5'
    : 'border-warn/30 text-warn bg-warn/5';

  return (
    <div className={`border rounded px-3 py-2 font-mono`}>
      <div className="text-[10px] text-muted mb-1 uppercase tracking-widest">{label}</div>
      <div className={`text-sm font-bold ${isGood ? 'text-acid' : 'text-warn'}`}>{value}</div>
    </div>
  );
}
