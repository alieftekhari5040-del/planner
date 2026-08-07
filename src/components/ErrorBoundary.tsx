import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('خطای غیرمنتظره در برنامه', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="app-shell flex items-center justify-center min-h-[60vh] text-center p-8">
          <div className="surface-card max-w-lg p-8 space-y-4">
            <h2 className="text-xl font-black text-white">خطایی رخ داد</h2>
            <p className="text-sm text-purple-200/80 leading-relaxed">
              متأسفانه بخشی از برنامه با خطا مواجه شد. اطلاعات شما در حافظه‌ی مرورگر محفوظ است. با بازنشانی می‌توانید ادامه دهید.
            </p>
            {this.state.error && (
              <pre className="text-xs text-left dir-ltr bg-purple-950/60 p-3 rounded-xl overflow-auto text-rose-200 border border-rose-500/20">
                {this.state.error.message}
              </pre>
            )}
            <button
              type="button"
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg hover:shadow-purple-500/30 transition cursor-pointer"
            >
              بارگذاری مجدد
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
