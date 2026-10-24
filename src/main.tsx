import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: unknown) {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'Terjadi kendala saat memuat tampilan.',
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#171918] p-6 text-center text-[#FAF9F6]">
          <h1 className="font-editorial text-3xl font-semibold text-[#FAF9F6]">
            Cafti Coffe Tea &amp; Resto
          </h1>
          <p className="mt-3 max-w-md text-sm text-[#F2EBDD]/75">
            {this.state.message}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded bg-[#B8754D] px-6 py-2.5 text-xs font-semibold tracking-wider text-[#FAF9F6] uppercase"
          >
            Muat Ulang Halaman
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>,
  );
}
