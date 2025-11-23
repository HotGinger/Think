'use client';

import React from 'react';
import { SelfAttentionRating } from '@/types';
import { getRatingLabel, formatRating } from '@/utils/formatters';

interface RatingScaleProps {
  value: SelfAttentionRating | null;
  onChange: (value: SelfAttentionRating) => void;
  title: string;
  description?: string;
}

const RATINGS: SelfAttentionRating[] = [-3, -2, -1, 0, 1, 2, 3];

export default function RatingScale({
  value,
  onChange,
  title,
  description,
}: RatingScaleProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
      {description && (
        <p className="text-gray-600 mb-8">{description}</p>
      )}

      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Rating buttons */}
        <div className="flex justify-between items-center mb-6">
          {RATINGS.map((rating) => (
            <button
              key={rating}
              onClick={() => onChange(rating)}
              className={`
                w-14 h-14 rounded-full font-semibold text-lg
                transition-all duration-200 transform
                ${
                  value === rating
                    ? 'bg-blue-600 text-white scale-110 shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }
              `}
            >
              {formatRating(rating)}
            </button>
          ))}
        </div>

        {/* Scale labels */}
        <div className="flex justify-between text-sm text-gray-600 mb-8">
          <span className="text-left max-w-[120px]">
            Self-Focused
          </span>
          <span className="text-center">
            Balanced
          </span>
          <span className="text-right max-w-[120px]">
            Externally Focused
          </span>
        </div>

        {/* Selected rating description */}
        {value !== null && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-center text-gray-700">
              <span className="font-semibold">{formatRating(value)}:</span>{' '}
              {getRatingLabel(value)}
            </p>
          </div>
        )}
      </div>

      {/* Explanation */}
      <div className="mt-6 text-sm text-gray-600 space-y-2">
        <p>
          <strong>Negative values (-3 to -1):</strong> Attention is predominantly focused
          internally on thoughts, feelings, or bodily sensations.
        </p>
        <p>
          <strong>Zero (0):</strong> Attention is balanced between internal and external.
        </p>
        <p>
          <strong>Positive values (+1 to +3):</strong> Attention is predominantly focused
          externally on the environment and external stimuli.
        </p>
      </div>
    </div>
  );
}
