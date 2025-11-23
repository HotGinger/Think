'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RatingScale from '@/components/RatingScale';
import { SelfAttentionRating } from '@/types';
import {
  getCurrentSession,
  completeSession,
  clearCurrentSession,
} from '@/utils/storage';

export default function PostRatingPage() {
  const router = useRouter();
  const [rating, setRating] = useState<SelfAttentionRating | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const session = getCurrentSession();
    if (!session) {
      router.push('/');
      return;
    }
    setSessionId(session.id);
  }, [router]);

  const handleContinue = () => {
    if (rating === null) {
      alert('Please select a rating before continuing');
      return;
    }

    if (!sessionId) {
      alert('Session not found');
      router.push('/');
      return;
    }

    // Save post-rating and complete session
    completeSession(sessionId, rating);
    clearCurrentSession();

    // Navigate to results
    router.push('/results');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Session Complete
            </h1>
            <p className="text-gray-600">
              Well done! Now please rate your current attentional focus.
            </p>
          </div>

          <RatingScale
            value={rating}
            onChange={setRating}
            title="Post-Session Self-Attention Rating"
            description="Rate your current attentional focus after completing the ATT session"
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
              View Results
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Step 3 of 3: Post-Session Rating</p>
        </div>
      </div>
    </main>
  );
}
