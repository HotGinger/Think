'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const router = useRouter();
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const checklistItems = [
    { id: 'node', text: 'Node.js 18+ installed' },
    { id: 'deps', text: 'Dependencies installed (npm install)' },
    { id: 'audio', text: 'Audio files added to /public/sounds/' },
    { id: 'browser', text: 'Using modern browser (Chrome/Firefox/Safari)' },
    { id: 'headphones', text: 'Headphones or speakers connected' },
  ];

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const allChecked = checklistItems.every(item => checkedItems[item.id]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎧 Setup Required
          </h1>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Before using the ATT application, you need to add audio files.
              The application requires 9 audio files in the <code className="bg-gray-100 px-2 py-1 rounded">/public/sounds/</code> directory.
            </p>
          </div>

          {/* Checklist */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Setup Checklist</h2>
            <div className="space-y-3">
              {checklistItems.map(item => (
                <label
                  key={item.id}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-blue-100 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checkedItems[item.id] || false}
                    onChange={() => toggleCheck(item.id)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className={`text-gray-700 ${checkedItems[item.id] ? 'line-through' : ''}`}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Required Audio Files */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Required Audio Files
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Internal Sounds (3)</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                  <li><code>breath.mp3</code> - Breathing sound</li>
                  <li><code>heartbeat.mp3</code> - Heartbeat sound</li>
                  <li><code>white-noise.mp3</code> - White noise</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Near Sounds (3)</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                  <li><code>clock-tick.mp3</code> - Clock ticking</li>
                  <li><code>water-drip.mp3</code> - Water dripping</li>
                  <li><code>fan-hum.mp3</code> - Fan humming</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Far Sounds (3)</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                  <li><code>bird-distant.mp3</code> - Distant birds</li>
                  <li><code>traffic-distant.mp3</code> - Distant traffic</li>
                  <li><code>wind-distant.mp3</code> - Distant wind</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Start Options */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Quick Setup Options</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                <strong>Option 1:</strong> Download from{' '}
                <a href="https://freesound.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Freesound.org
                </a>
              </p>
              <p>
                <strong>Option 2:</strong> Generate test tones using the Python script in{' '}
                <code className="bg-gray-100 px-1 rounded">GETTING_STARTED.md</code>
              </p>
              <p>
                <strong>Option 3:</strong> Record your own sounds with a microphone
              </p>
            </div>
          </div>

          {/* Documentation Links */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Documentation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a
                href="https://github.com/HotGinger/Think/blob/main/public/sounds/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="font-semibold text-blue-600">Audio Setup Guide</div>
                <div className="text-sm text-gray-600">Detailed audio file instructions</div>
              </a>
              <a
                href="https://github.com/HotGinger/Think/blob/main/GETTING_STARTED.md"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="font-semibold text-blue-600">Getting Started</div>
                <div className="text-sm text-gray-600">Complete setup tutorial</div>
              </a>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </button>
            {allChecked && (
              <button
                onClick={() => router.push('/')}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                ✓ Setup Complete
              </button>
            )}
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? Check the{' '}
            <a
              href="https://github.com/HotGinger/Think"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              documentation on GitHub
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
