import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-[300px] flex items-center justify-center p-6 bg-slate-50"
        >
          <div className="max-w-md w-full bg-white rounded-xl border border-red-200 p-6 shadow-md text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Application Rendering Encountered an Issue
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {this.state.error?.message ||
                  'An unexpected runtime error occurred while rendering this view.'}
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={this.handleReset}
                className="gap-1.5 text-xs font-semibold"
                aria-label="Attempt to recover component"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Recover View
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="text-xs font-semibold"
                aria-label="Reload entire page"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
