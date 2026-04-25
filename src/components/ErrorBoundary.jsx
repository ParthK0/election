import React from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-extrabold mb-3 text-dark">Something went wrong</h2>
          <p className="text-gray-500 max-w-md mb-8 text-sm">
            We encountered an unexpected error. Please try refreshing.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 bg-surface-tertiary border border-border px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" /> Refresh
            </button>
            <a 
              href="/"
              className="flex items-center gap-2 bg-purple text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-dark transition-colors"
            >
              <Home className="w-4 h-4" /> Back Home
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
