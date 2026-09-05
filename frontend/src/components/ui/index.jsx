import React from 'react';
import { RefreshCw, Inbox, AlertTriangle } from 'lucide-react';

/* ------------------------------------------------------------------
   Shared primitives.

   Before this existed every page re-typed the same Tailwind strings, so
   a card in one page drifted from a card in the next. Everything visual
   lives here; pages describe content and let these decide how it looks.
   ------------------------------------------------------------------ */

export const cx = (...parts) => parts.filter(Boolean).join(' ');

/* Tone maps the product's three meanings onto colour. Nothing else does. */
const TONES = {
  loss: { fg: 'text-loss', bg: 'bg-loss/10', border: 'border-loss/25', bar: 'bg-loss' },
  caught: { fg: 'text-caught', bg: 'bg-caught/10', border: 'border-caught/25', bar: 'bg-caught' },
  signal: { fg: 'text-signal', bg: 'bg-signal/10', border: 'border-signal/25', bar: 'bg-signal' },
  warn: { fg: 'text-warn', bg: 'bg-warn/10', border: 'border-warn/25', bar: 'bg-warn' },
  neutral: { fg: 'text-fg-dim', bg: 'bg-raise', border: 'border-line', bar: 'bg-fg-mute' },
};
export const tone = (name) => TONES[name] || TONES.neutral;

/* ---------- money ---------- */

/** One currency formatter for the whole product. Indian units, because the
 *  data is Indian: figures cross into lakh and crore fast and ₹85,600,000
 *  is unreadable to the operator this is built for. */
export function formatCurrency(value, { compact = true } = {}) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  const sign = n < 0 ? '-' : '';
  const a = Math.abs(n);
  if (!compact) return `${sign}₹${a.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  if (a >= 1e7) return `${sign}₹${(a / 1e7).toFixed(2)} Cr`;
  if (a >= 1e5) return `${sign}₹${(a / 1e5).toFixed(2)} L`;
  return `${sign}₹${a.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export const formatNumber = (value) =>
  Number.isFinite(Number(value)) ? Number(value).toLocaleString('en-IN') : '—';

export const formatPct = (value, digits = 1) =>
  Number.isFinite(Number(value)) ? `${Number(value).toFixed(digits)}%` : '—';

/* ---------- surfaces ---------- */

export function Card({ as: Tag = 'div', className, children, interactive = false, ...rest }) {
  return (
    <Tag
      className={cx(
        'min-w-0 rounded-lg border border-line bg-surface',
        interactive && 'transition-colors duration-150 hover:border-line/0 hover:bg-raise',
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ title, description, action, className }) {
  return (
    <div className={cx('flex items-start justify-between gap-4 px-5 pt-5 pb-4', className)}>
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold text-fg">{title}</h2>
        {description && <p className="mt-1 text-xs leading-relaxed text-fg-dim">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------- page furniture ---------- */

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-[28px]">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-dim">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

/* ---------- the signature metric ---------- */

/**
 * A figure with its label above it and its context below. The number is the
 * loudest thing on the card; the label and note stay quiet. Colour appears
 * only when the figure means loss or recovery — a neutral metric stays white,
 * which is what stops the KPI row turning into a rainbow.
 */
export function Stat({ label, value, note, tone: t = 'neutral', size = 'md', className }) {
  const c = tone(t);
  const sizes = {
    sm: 'text-lg',
    md: 'text-[26px]',
    lg: 'text-[34px]',
  };
  return (
    <div className={cx('flex flex-col justify-between gap-3', className)}>
      <p className="eyebrow">{label}</p>
      <div>
        <p
          className={cx(
            'figure leading-none',
            sizes[size],
            t === 'neutral' ? 'text-fg' : c.fg
          )}
        >
          {value}
        </p>
        {note && <p className="mt-2 text-[11px] leading-snug text-fg-mute">{note}</p>}
      </div>
    </div>
  );
}

export function StatCard({ className, ...props }) {
  return (
    <Card className={cx('p-5', className)}>
      <Stat {...props} />
    </Card>
  );
}

/* ---------- small parts ---------- */

export function Badge({ tone: t = 'neutral', children, className }) {
  const c = tone(t);
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-xs border px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide uppercase',
        c.bg,
        c.border,
        c.fg,
        className
      )}
    >
      {children}
    </span>
  );
}

const BUTTON_VARIANTS = {
  primary:
    'bg-signal text-ink hover:bg-signal/85 border border-transparent font-semibold',
  secondary: 'bg-raise text-fg border border-line hover:border-fg-mute',
  ghost: 'bg-transparent text-fg-dim border border-transparent hover:bg-raise hover:text-fg',
  danger: 'bg-loss/12 text-loss border border-loss/30 hover:bg-loss/20',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  children,
  as: Tag = 'button',
  ...rest
}) {
  const sizes = {
    sm: 'h-7 px-2.5 text-[11px] gap-1.5',
    md: 'h-9 px-3.5 text-xs gap-2',
  };
  return (
    <Tag
      className={cx(
        'inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-sm transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-45',
        BUTTON_VARIANTS[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Select({ label, className, children, ...rest }) {
  return (
    <label className={cx('inline-flex flex-col gap-1', className)}>
      {label && <span className="eyebrow">{label}</span>}
      <select
        className="h-9 cursor-pointer rounded-sm border border-line bg-surface px-2.5 text-xs text-fg transition-colors hover:border-fg-mute"
        {...rest}
      >
        {children}
      </select>
    </label>
  );
}

/** A labelled proportion bar. Used for the funnel, risk mixes and the
 *  leak strip — anywhere one number is a share of another. */
export function Meter({ value, tone: t = 'signal', className, label }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div
      className={cx('h-1.5 w-full overflow-hidden rounded-full bg-raise', className)}
      role="img"
      aria-label={label || `${pct.toFixed(1)} percent`}
    >
      <div
        className={cx('h-full rounded-full transition-[width] duration-500', tone(t).bar)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ---------- tables ---------- */

export function Table({ head, children, className }) {
  return (
    <div className={cx('w-full min-w-0 overflow-x-auto', className)}>
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-line">
            {head.map((h) => (
              <th
                key={typeof h === 'string' ? h : h.key}
                scope="col"
                className={cx(
                  'eyebrow px-4 py-2.5 whitespace-nowrap',
                  typeof h !== 'string' && h.align === 'right' && 'text-right'
                )}
              >
                {typeof h === 'string' ? h : h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line-soft">{children}</tbody>
      </table>
    </div>
  );
}

export function Row({ children, className, ...rest }) {
  return (
    <tr className={cx('transition-colors duration-100 hover:bg-raise/60', className)} {...rest}>
      {children}
    </tr>
  );
}

export function Cell({ children, align, mono, strong, className, ...rest }) {
  return (
    <td
      className={cx(
        'px-4 py-3 align-middle',
        align === 'right' && 'text-right',
        mono && 'figure',
        strong ? 'text-fg' : 'text-fg-dim',
        className
      )}
      {...rest}
    >
      {children}
    </td>
  );
}

/* ---------- the three states every async view needs ---------- */

export function Loading({ label = 'Loading' }) {
  return (
    <div
      className="flex min-h-[40vh] flex-col items-center justify-center gap-3"
      role="status"
      aria-live="polite"
    >
      <RefreshCw className="h-5 w-5 animate-spin text-signal" aria-hidden="true" />
      <p className="font-mono text-xs tracking-wide text-fg-mute">{label}</p>
    </div>
  );
}

export function SkeletonRows({ rows = 6, className }) {
  return (
    <div className={cx('space-y-2 p-4', className)} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-9 rounded-sm" />
      ))}
    </div>
  );
}

export function ErrorState({ title = 'Could not load this view', detail, onRetry }) {
  return (
    <Card className="flex flex-col items-start gap-4 border-loss/30 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-loss" aria-hidden="true" />
        <div>
          <h3 className="text-sm font-semibold text-fg">{title}</h3>
          {detail && <p className="mt-1 text-xs leading-relaxed text-fg-dim">{detail}</p>}
        </div>
      </div>
      {onRetry && (
        <Button variant="danger" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Try again
        </Button>
      )}
    </Card>
  );
}

export function EmptyState({ title, detail, action }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <Inbox className="h-6 w-6 text-fg-mute" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-fg">{title}</p>
        {detail && <p className="mt-1 text-xs text-fg-dim">{detail}</p>}
      </div>
      {action}
    </div>
  );
}
