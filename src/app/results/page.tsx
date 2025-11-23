'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SessionData } from '@/types';
import { getLatestSession, calculateSessionStats } from '@/utils/storage';
import {
  formatRating,
  getRatingLabel,
  formatRatingChange,
  formatTime,
} from '@/utils/formatters';

export default function ResultsPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    const latestSession = getLatestSession();
    if (!latestSession || !latestSession.completed) {
      router.push('/');
      return;
    }
    setSession(latestSession);
  }, [router]);

  if (!session || !session.postRating) {
    return null;
  }

  const preRating = session.preRating.value;
  const postRating = session.postRating.value;
  const change = formatRatingChange(preRating, postRating);
  const duration = session.endTime ? session.endTime - session.startTime : 0;

  const stats = calculateSessionStats();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Session Complete
          </h1>
          <p className="text-gray-600">
            You have completed the Attention Training Technique
          </p>
        </div>

        {/* Results card */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden mb-6">
          {/* Session summary */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Session Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pre-rating */}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Pre-Session</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {formatRating(preRating)}
                </p>
                <p className="text-xs text-gray-500">
                  {getRatingLabel(preRating)}
                </p>
              </div>

              {/* Post-rating */}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Post-Session</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {formatRating(postRating)}
                </p>
                <p className="text-xs text-gray-500">
                  {getRatingLabel(postRating)}
                </p>
              </div>

              {/* Change */}
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Change</p>
                <p className={`text-3xl font-bold mb-1 ${change.color}`}>
                  {change.change > 0 ? '+' : ''}{change.change}
                </p>
                <p className="text-xs text-gray-500">{change.text}</p>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Session Duration: {formatTime(duration)}</p>
            </div>
          </div>

          {/* Interpretation */}
          <div className="p-8 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Understanding Your Results
            </h3>

            <div className="space-y-3 text-gray-700">
              {change.change > 0 && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <p>
                    <strong>Positive shift detected:</strong> Your attention has shifted
                    more toward external focus. This suggests the ATT exercise successfully
                    interrupted self-focused attention patterns.
                  </p>
                </div>
              )}

              {change.change === 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p>
                    <strong>No change detected:</strong> Your self-attention rating
                    remained the same. ATT effects may develop with regular practice.
                    Consider repeating the exercise daily.
                  </p>
                </div>
              )}

              {change.change < 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <p>
                    <strong>Attention shifted inward:</strong> This occasionally happens
                    and does not indicate failure. The goal of ATT is to develop flexible
                    control, which improves with practice.
                  </p>
                </div>
              )}

              <p className="text-sm mt-4">
                <strong>Important:</strong> Single-session changes are just one data point.
                Regular ATT practice (daily for 2-3 weeks) is recommended to develop
                sustained improvements in attentional control.
              </p>
            </div>
          </div>

          {/* Overall stats */}
          {stats.totalSessions > 1 && (
            <div className="p-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Progress
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.totalSessions}
                  </p>
                  <p className="text-xs text-gray-600">Sessions</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-2xl font-bold text-blue-600">
                    {formatRating(stats.averagePreRating as any)}
                  </p>
                  <p className="text-xs text-gray-600">Avg Pre-Rating</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-2xl font-bold text-blue-600">
                    {formatRating(stats.averagePostRating as any)}
                  </p>
                  <p className="text-xs text-gray-600">Avg Post-Rating</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-2xl font-bold text-green-600">
                    {stats.improvementRate}%
                  </p>
                  <p className="text-xs text-gray-600">Improvement Rate</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/')}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Complete Another Session
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Return Home
          </button>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            ATT is most effective when practiced regularly as part of a structured
            treatment program.
          </p>
          <p className="mt-2">
            If you are experiencing significant emotional distress, please consult with
            a qualified mental health professional.
          </p>
        </div>
      </div>
    </main>
  );
}
