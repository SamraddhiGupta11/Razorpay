import React from 'react';
import { formatCurrency } from './index.jsx';

/* ------------------------------------------------------------------
   Chart theme.

   Recharts styling was previously re-typed with raw hex on every page, so
   grids and tooltips drifted apart. These carry the tokens once.

   Note these are prop spreads, not wrapper components: Recharts identifies
   its children by `child.type`, so a custom component wrapping <XAxis> is
   invisible to it and the chart silently renders nothing. Always write
   `<XAxis {...xAxis} />`, never `<MyAxis />`.
   ------------------------------------------------------------------ */

export const CHART = {
  grid: '#1a232d',
  axis: '#64748b',
  loss: '#ff6b54',
  caught: '#3ddc97',
  signal: '#8b93ff',
  warn: '#e8b14c',
};

/** Categorical ramp for slicing a single measure by category. Deliberately
 *  short — if a chart needs more than six colours it needs a different form. */
export const SERIES = ['#8b93ff', '#3ddc97', '#e8b14c', '#ff6b54', '#5eb0ef', '#c98bff'];

export const grid = {
  stroke: CHART.grid,
  strokeDasharray: '2 4',
  vertical: false,
};

const axisBase = {
  stroke: CHART.axis,
  fontSize: 10,
  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
  tickLine: false,
  axisLine: false,
};

export const xAxis = { ...axisBase, dy: 6 };
export const yAxis = { ...axisBase, width: 56 };

/** Money axis in lakh/crore, matching the rest of the product. */
export const moneyTick = (v) => {
  const a = Math.abs(Number(v) || 0);
  if (a >= 1e7) return `₹${(a / 1e7).toFixed(1)}Cr`;
  if (a >= 1e5) return `₹${Math.round(a / 1e5)}L`;
  if (a >= 1e3) return `₹${Math.round(a / 1e3)}K`;
  return `₹${a}`;
};

export const pctTick = (v) => `${v}%`;

function TooltipBody({ active, payload, label, valueFormatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-line bg-sunken/95 px-3 py-2 shadow-xl backdrop-blur">
      {label != null && <p className="eyebrow mb-1.5">{label}</p>}
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.dataKey ?? entry.name} className="flex items-center gap-2 text-xs">
            <span
              className="h-2 w-2 shrink-0 rounded-xs"
              style={{ background: entry.color || entry.fill }}
              aria-hidden="true"
            />
            <span className="text-fg-dim">{entry.name}</span>
            <span className="figure ml-auto pl-3 text-fg">
              {valueFormatter ? valueFormatter(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Spread onto <Tooltip>. `money` / `plain` pick how values are printed. */
export const tooltip = (valueFormatter = formatCurrency) => ({
  cursor: { fill: 'rgba(255,255,255,0.03)' },
  content: <TooltipBody valueFormatter={valueFormatter} />,
});

export const tooltipMoney = tooltip((v) => formatCurrency(v));
export const tooltipPlain = tooltip((v) => Number(v).toLocaleString('en-IN'));

/**
 * Charts are pictures, so they carry no meaning for a screen reader. Wrap one
 * with the sentence it is meant to convey and hide the canvas itself.
 */
export function ChartFrame({ summary, height = 260, children, className }) {
  return (
    <div className={className}>
      <p className="sr-only">{summary}</p>
      <div style={{ height, width: '100%' }} aria-hidden="true">
        {children}
      </div>
    </div>
  );
}
