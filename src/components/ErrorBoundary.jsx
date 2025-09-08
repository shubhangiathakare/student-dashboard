import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log error details to the console (and later to a logging service)
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Error info:', info);
    this.setState({ info });
  }

  render() {
    const { hasError, error, info } = this.state;
    if (hasError) {
      return (
        <div className="min-h-screen flex items-start justify-center bg-gray-50 dark:bg-gray-900 p-8">
          <div className="max-w-3xl w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">An unexpected error occurred while rendering the application. The error has been logged to the console.</p>
            <details className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap border p-2 rounded mb-4">
              <summary className="cursor-pointer font-medium">Error details (click to expand)</summary>
              <div className="mt-2">
                <strong>Message:</strong>
                <div>{error && (error.message || String(error))}</div>
                <strong className="mt-2">Stack / Info:</strong>
                <div>{(error && error.stack) || (info && info.componentStack) || 'No stack available'}</div>
              </div>
            </details>

            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Reload
              </button>
              <button
                onClick={() => {
                  // Copy details to clipboard for easier sharing
                  const payload = `Error: ${error && (error.message || String(error))}\n\nStack:\n${(error && error.stack) || (info && info.componentStack) || ''}`;
                  try {
                    navigator.clipboard.writeText(payload);
                    alert('Error details copied to clipboard');
                  } catch (e) {
                    // fallback
                    console.warn('Clipboard write failed', e);
                  }
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md"
              >
                Copy details
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
