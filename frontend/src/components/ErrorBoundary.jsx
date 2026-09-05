import React from 'react';
import { Button, Card } from './ui/index.jsx';

/**
 * Keeps one page's crash inside that page.
 *
 * Without this, a single bad field access unmounted the whole tree and the
 * app went to a black screen with no way back — the nav disappeared too, so
 * the only recovery was a reload.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Page crashed:', error, info);
  }

  componentDidUpdate(prevProps) {
    // Navigating away from a broken page should clear the error.
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <Card className="max-w-2xl border-loss/30 p-6">
        <h2 className="text-base font-semibold text-fg">This view stopped working</h2>
        <p className="mt-2 text-xs leading-relaxed text-fg-dim">
          The rest of the app is fine — pick another view from the sidebar, or try this one again.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-sm bg-sunken p-3 font-mono text-[10px] leading-relaxed text-loss">
          {String(error?.message || error)}
        </pre>
        <Button className="mt-4" onClick={() => this.setState({ error: null })}>
          Try again
        </Button>
      </Card>
    );
  }
}
