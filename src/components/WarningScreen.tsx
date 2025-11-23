'use client';

import React from 'react';

interface WarningScreenProps {
  onAccept: () => void;
  onDecline: () => void;
}

/**
 * Pre-session warning screen
 * Clarifies that ATT is NOT relaxation training
 */
export default function WarningScreen({ onAccept, onDecline }: WarningScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-yellow-500 px-8 py-6">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <svg
              className="w-8 h-8 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Important Notice
          </h1>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <p className="text-lg font-semibold text-gray-900">
              ATT is NOT relaxation training
            </p>
          </div>

          <div className="space-y-3 text-gray-700">
            <p>
              The <strong>Attention Training Technique (ATT)</strong> is a scientifically
              validated intervention from Metacognitive Therapy designed to enhance
              executive control over attention.
            </p>

            <p className="font-semibold">This exercise is NOT intended to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Relax you or reduce stress</li>
              <li>Serve as emotion regulation or coping</li>
              <li>Function as meditation or mindfulness practice</li>
              <li>Provide distraction or entertainment</li>
            </ul>

            <p className="font-semibold mt-4">ATT is designed to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Train flexible, voluntary control of attention</li>
              <li>Reduce the Cognitive-Attentional Syndrome (CAS)</li>
              <li>Interrupt worry and rumination patterns</li>
              <li>Strengthen metacognitive awareness</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
              <p className="text-sm">
                <strong>Protocol:</strong> You will complete a 12-minute structured
                exercise consisting of selective attention (5 min), rapid attention
                switching (5 min), and divided attention (2 min). You must keep your
                eyes fixed on a central point throughout the entire exercise.
              </p>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              Based on the protocol described in Adrian Wells' <em>Metacognitive
              Therapy for Anxiety and Depression</em> (Chapter 4).
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 py-6 bg-gray-50 flex justify-end space-x-4">
          <button
            onClick={onDecline}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={onAccept}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            I Understand, Continue
          </button>
        </div>
      </div>
    </div>
  );
}
