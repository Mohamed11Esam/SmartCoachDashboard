import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-accent mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-2">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-card text-white font-medium px-6 py-2.5 rounded-lg hover:bg-card/80 transition-colors border border-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-accent text-black font-medium px-6 py-2.5 rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
