'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WarningScreen from '@/components/WarningScreen';

export default function Home() {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);

  const handleStart = () => {
    setShowWarning(true);
  };

  const handleAcceptWarning = () => {
    router.push('/rating/pre');
  };

  const handleDeclineWarning = () => {
    setShowWarning(false);
  };

  if (showWarning) {
    return (
      <WarningScreen
        onAccept={handleAcceptWarning}
        onDecline={handleDeclineWarning}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Attention Training Technique
          </h1>
          <p className="text-xl text-gray-600">
            Evidence-based attention control training from Metacognitive Therapy
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              What is ATT?
            </h2>

            <div className="space-y-4 text-gray-700 mb-8">
              <p>
                The <strong>Attention Training Technique (ATT)</strong> is a therapeutic
                intervention developed by Adrian Wells as part of Metacognitive Therapy.
                It is designed to enhance flexible, voluntary control of attention.
              </p>

              <p>
                ATT addresses the <strong>Cognitive-Attentional Syndrome (CAS)</strong> -
                a pattern of worry, rumination, and threat monitoring that maintains
                emotional distress in anxiety and depression.
              </p>

              <div className="bg-blue-50 rounded-lg p-6 my-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Session Structure (12 minutes)
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="font-semibold text-blue-600 mr-2">1.</span>
                    <span><strong>Selective Attention (5 min):</strong> Focus on a single
                    sound while ignoring all others</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold text-blue-600 mr-2">2.</span>
                    <span><strong>Rapid Attention Switching (5 min):</strong> Switch
                    between sounds at decreasing intervals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold text-blue-600 mr-2">3.</span>
                    <span><strong>Divided Attention (2 min):</strong> Absorb all sounds
                    simultaneously</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <p className="text-sm">
                  <strong>Note:</strong> You will need headphones or speakers for optimal
                  spatial audio experience. Find a quiet space where you won't be
                  disturbed for 15 minutes.
                </p>
              </div>
            </div>

            {/* Start button */}
            <button
              onClick={handleStart}
              className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-transform"
            >
              Begin ATT Session
            </button>

            {/* Footer info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Based on the protocol in Wells, A. (2009). <em>Metacognitive Therapy for
                Anxiety and Depression</em>. Guilford Press.
              </p>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            For research purposes only. Not a substitute for professional mental health care.
          </p>
        </div>
      </div>
    </main>
  );
}
