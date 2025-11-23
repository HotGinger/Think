import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>

          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or may have been moved.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 text-left">
            <p className="text-sm text-gray-700 mb-2">
              <strong>If you're seeing this error after deployment:</strong>
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 ml-2 space-y-1">
              <li>Make sure you've run <code className="bg-gray-100 px-1 rounded">npm install</code></li>
              <li>Verify audio files are in <code className="bg-gray-100 px-1 rounded">/public/sounds/</code></li>
              <li>Check that the build completed successfully</li>
              <li>Try accessing the home page directly</li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Go to Home
            </Link>
            <Link
              href="/setup"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Setup Guide
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
