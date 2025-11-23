'use client';

import React, { useEffect, useState } from 'react';

interface InstructionDisplayProps {
  text: string;
  duration?: number;
  onComplete?: () => void;
}

/**
 * Display instructions during ATT session
 * Automatically fades in and out
 */
export default function InstructionDisplay({
  text,
  duration = 5000,
  onComplete,
}: InstructionDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in
    setTimeout(() => setIsVisible(true), 100);

    // Fade out before completion
    if (duration) {
      const fadeOutTime = duration - 500;
      setTimeout(() => setIsVisible(false), fadeOutTime);

      // Complete
      setTimeout(() => {
        if (onComplete) onComplete();
      }, duration);
    }
  }, [text, duration, onComplete]);

  if (!text) return null;

  return (
    <div
      className={`
        fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        max-w-2xl w-full px-8
        transition-opacity duration-500
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div className="bg-black bg-opacity-80 rounded-lg p-6 shadow-2xl">
        <p className="text-white text-xl text-center leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}
