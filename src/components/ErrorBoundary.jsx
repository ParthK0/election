import React from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4 font-heading">Something went wrong</h2>
          <p className="text-slate-400 max-w-md mb-8">
            We encountered an unexpected error. Please try refreshing the page or return home.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-all"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </button>
            <a 
              href="/"
              className="flex items-center gap-2 bg-gold text-navy px-6 py-3 rounded-xl font-bold hover:bg-gold-light transition-all"
            >
              <Home className="w-4 h-4" />
              Back Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
