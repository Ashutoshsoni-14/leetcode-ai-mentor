import React from 'react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-border"></div>
        <div className="absolute inset-0 rounded-full border-2 border-acid border-t-transparent animate-spin"></div>
      </div>
      <p className="text-xs text-muted font-mono">{message}</p>
    </div>
  );
}
