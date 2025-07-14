/**
 * Error Boundary Component - Professional error handling
 * Catches JavaScript errors and provides user-friendly fallbacks
 */

'use client';

import React from 'react';
import { logger } from '@/lib/logger';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
  errorId: string | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error | null;
  errorId: string | null;
  retry: () => void;
}

// Default fallback component
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, errorId, retry }) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Error Icon */}
        <div className="text-6xl mb-4">⚠️</div>
        
        {/* Error Title */}
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          حدث خطأ غير متوقع
        </h1>
        
        {/* Error Description */}
        <p className="text-gray-600 mb-6">
          نعتذر عن هذا الخطأ. نحن نعمل على إصلاح المشكلة.
          يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
        </p>

        {/* Error ID for support */}
        {errorId && (
          <div className="bg-gray-100 p-3 rounded-md mb-6">
            <p className="text-xs text-gray-500 mb-1">معرف الخطأ (للدعم الفني):</p>
            <code className="text-xs font-mono text-gray-700">{errorId}</code>
          </div>
        )}

        {/* Development error details */}
        {isDevelopment && error && (
          <details className="text-left bg-red-50 p-4 rounded-md mb-6 border border-red-200">
            <summary className="cursor-pointer text-red-800 font-semibold mb-2">
              تفاصيل الخطأ (وضع التطوير)
            </summary>
            <div className="text-sm">
              <p className="font-semibold text-red-700 mb-2">{error.name}:</p>
              <p className="text-red-600 mb-3">{error.message}</p>
              {error.stack && (
                <pre className="text-xs text-red-500 overflow-auto max-h-32 bg-red-100 p-2 rounded">
                  {error.stack}
                </pre>
              )}
            </div>
          </details>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={retry}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            🔄 المحاولة مرة أخرى
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            🏠 العودة للرئيسية
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            ⟳ إعادة تحميل الصفحة
          </button>
        </div>

        {/* Support Contact */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            إذا استمرت المشكلة، يرجى التواصل مع الدعم الفني
          </p>
          <div className="mt-2">
            <a 
              href="mailto:support@yallasouq.ps"
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              support@yallasouq.ps
            </a>
          </div>
        </div>

        {/* Palestinian Flag */}
        <div className="mt-4 text-sm text-gray-500">
          🇵🇸 يلا سوق الفلسطيني
        </div>
      </div>
    </div>
  );
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Generate unique error ID for tracking
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorId = this.state.errorId;
    
    // Log the error with our logging service
    logger.error(
      `React Error Boundary caught an error: ${error.message}`,
      {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        errorInfo: {
          componentStack: errorInfo.componentStack
        },
        errorId,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      },
      'ErrorBoundary'
    );

    // Update state with error info
    this.setState({
      errorInfo: errorInfo.componentStack || null
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In development, also log to console for easier debugging
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error Boundary Caught Error [${errorId}]`);
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    logger.info('User attempted error recovery', { errorId: this.state.errorId }, 'ErrorBoundary');
    
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });

    // Force a re-render after a short delay to ensure clean state
    this.retryTimeoutId = window.setTimeout(() => {
      this.forceUpdate();
    }, 100);
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <FallbackComponent
          error={this.state.error}
          errorId={this.state.errorId}
          retry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<ErrorFallbackProps>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for handling async errors in components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  // Throw error on next render to trigger error boundary
  if (error) {
    throw error;
  }

  const handleError = React.useCallback((error: Error | string) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    logger.error('Async error caught by useErrorHandler', errorObj, 'useErrorHandler');
    setError(errorObj);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return { handleError, clearError };
}

export default ErrorBoundary;
