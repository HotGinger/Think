'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RatingScale from '@/components/RatingScale';
import { SelfAttentionRating } from '@/types';
import { createSession, saveCurrentSession } from '@/utils/storage';

export default function PreRatingPage() {
  const router = useRouter();
  const [rating, setRating] = useState<SelfAttentionRating | null>(null);

  const handleContinue = () => {
    if (rating === null) {
      alert('Please select a rating before continuing');
      return;
    }

    // Create new session with pre-rating
    const session = createSession(rating);
    saveCurrentSession(session);

    // Navigate to session
    router.push('/session');
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-700 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12">
          <RatingScale
            value={rating}
            onChange={setRating}
            title="Pre-Session Self-Attention Rating"
            description="Rate your current attentional focus on a scale from -3 (extremely self-focused) to +3 (extremely externally focused)"
          />

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleContinue}
              disabled={rating === null}
              className={`
                px-8 py-3 rounded-lg text-white font-semibold
                transition-all transform
                ${
                  rating !== null
                    ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-lg'
                    : 'bg-gray-400 cursor-not-allowed'
                }
              `}
            >
              Continue to Session
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Step 1 of 3: Pre-Session Rating</p>
        </div>
      </div>
    </main>
  );
}
