import React from 'react';
import { Menu, Sparkles } from 'lucide-react';
import { Button, cx, formatCurrency } from './ui/index.jsx';

const HEALTH = {
  healthy: { label: 'All systems live', dot: 'bg-caught', fg: 'text-caught' },
  degraded: { label: 'Degraded', dot: 'bg-warn', fg: 'text-warn' },
  offline: { label: 'Backend unreachable', dot: 'bg-loss', fg: 'text-loss' },
};

/**
 * The leak line — the one signature device in the product.
 *
 * A single hairline bar, always on screen, holding the whole thesis: this
 * much money walked out of the checkout, this much was caught again. It is
 * the reason the palette only has `loss` and `caught` in it.
 */
function LeakLine({ atRisk, recovered }) {
  const risk = Number(atRisk) || 0;
  const rec = Number(recovered) || 0;
  if (risk <= 0) return <div className="h-px bg-line" />;

  const caughtPct = Math.max(0, Math.min(100, (rec / risk) * 100));

  return (
    <div className="border-t border-line bg-sunken px-4 py-2 sm:px-6">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <div className="flex items-baseline gap-2">
          <span className="eyebrow">At risk</span>
          <span className="figure text-xs text-loss">{formatCurrency(risk)}</span>
        </div>

        <div
          className="flex h-1 min-w-[140px] flex-1 overflow-hidden rounded-full bg-loss/25"
          role="img"
          aria-label={`${formatCurrency(rec)} of ${formatCurrency(risk)} at risk has been recovered, ${caughtPct.toFixed(0)} percent`}
        >
          <div
            className="h-full bg-caught transition-[width] duration-700"
            style={{ width: `${caughtPct}%` }}
          />
        </div>

        <div className="flex items-baseline gap-2">
          <span className="figure text-xs text-caught">{formatCurrency(rec)}</span>
          <span className="eyebrow">recovered</span>
          <span className="figure text-[11px] text-fg-mute">{caughtPct.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}

export default function Topbar({ title, health, summary, onOpenNav, onDemo }) {
  const key = health?.status === 'healthy' ? 'healthy' : health ? 'degraded' : 'offline';
  const state = HEALTH[key];

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/85 backdrop-blur">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
        <button
          onClick={onOpenNav}
          className="cursor-pointer rounded-sm p-1.5 text-fg-dim hover:bg-raise hover:text-fg lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>

        <h1 className="truncate text-[13px] font-medium text-fg">{title}</h1>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <span
            className="hidden items-center gap-2 rounded-sm border border-line bg-surface px-2.5 py-1 sm:inline-flex"
            title={
              health
                ? `Database ${health.database} · models ${health.models}`
                : 'No response from the API'
            }
          >
            <span className={cx('h-1.5 w-1.5 rounded-full', state.dot)} aria-hidden="true" />
            <span className={cx('font-mono text-[10px] tracking-wide', state.fg)}>
              {state.label}
            </span>
          </span>

          <Button variant="secondary" size="sm" onClick={onDemo}>
            <Sparkles className="h-3 w-3 text-warn" aria-hidden="true" />
            Demo
          </Button>
        </div>
      </div>

      <LeakLine atRisk={summary?.revenue_at_risk} recovered={summary?.revenue_recovered} />
    </header>
  );
}
