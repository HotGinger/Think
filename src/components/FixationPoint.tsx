'use client';

import React from 'react';

interface FixationPointProps {
  size?: number;
}

/**
 * Minimalist fixation point for ATT session
 * User must keep eyes fixed on this point during entire exercise
 */
export default function FixationPoint({ size = 12 }: FixationPointProps) {
  return (
    <div className="flex items-center justify-center w-full h-full bg-att-dark">
      <div
        className="rounded-full bg-white animate-pulse-slow"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      />
    </div>
  );
}
