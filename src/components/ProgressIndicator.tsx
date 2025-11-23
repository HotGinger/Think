'use client';

import React from 'react';
import { AttentionPhase } from '@/types';
import { formatTime, formatPhaseName } from '@/utils/formatters';

interface ProgressIndicatorProps {
  phase: AttentionPhase;
  elapsed: number;
  total: number;
  currentSound?: string;
}

/**
 * Minimal progress indicator for ATT session
 * Shows current phase, time, and progress
 */
export default function ProgressIndicator({
  phase,
  elapsed,
  total,
  currentSound,
}: ProgressIndicatorProps) {
  const percentage = Math.min(100, (elapsed / total) * 100);
  const remaining = total - elapsed;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-90 text-white">
      {/* Progress bar */}
      <div className="h-1 bg-gray-800">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Info */}
      <div className="px-6 py-3 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className="font-semibold">{formatPhaseName(phase)}</span>
          {currentSound && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-gray-300">Focus: {currentSound}</span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-gray-300">
            {formatTime(elapsed)} / {formatTime(total)}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-300">
            {formatTime(remaining)} remaining
          </span>
        </div>
      </div>
    </div>
  );
}
