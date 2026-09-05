import React, { useEffect, useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { BarChart, Bar, Cell, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import apiService from '../services/api';
import {
  Badge,
  Button,
  Card,
  CardHeader,
  EmptyState,
  ErrorState,
  Loading,
  Meter,
  PageHeader,
  Stat,
  formatCurrency,
  formatNumber,
  formatPct,
} from '../components/ui/index.jsx';
import { ChartFrame, SERIES, grid, moneyTick, tooltipMoney, xAxis, yAxis } from '../components/ui/charts.jsx';

/* Each diagnosis carries the fix it implies. Written as an instruction the
   operator can act on, not a description of the problem they already saw. */
const POLICIES = {
  SHIPPING:
    'Set a dynamic free-shipping threshold at checkout, or send a shipping waiver link over WhatsApp.',
  PAYMENT:
    'Offer a one-tap retry on an alternative gateway — UPI or netbanking — with the link sent by SMS.',
  PRICE:
    'Send a time-limited 5% offer to this cohort only. A storewide discount costs more margin than it recovers.',
  TECHNICAL:
    'Watch client-side error logs and restore the session with the cart still filled.',
  HESITATION: 'Show review snippets and stock scarcity rather than a discount. This cohort converts on reassurance.',
  TRUST: 'Lead with the returns guarantee, payment security badge, and cash on delivery for first-time high-ticket buyers.',
};

export default function RevenueLeakage({ onNavigate }) {
  const [reasons, setReasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService.getDashboardCharts();
      setReasons(res.reasons || []);
      setError(null);
    } catch (err) {
      console.error('Error loading leakage data:', err);
      setError(err?.message || 'The leakage breakdown did not load.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loading label="Diagnosing leakage" />;
  if (error) return <ErrorState title="Leakage view unavailable" detail={error} onRetry={load} />;

  const totalAtRisk = reasons.reduce((s, r) => s + (Number(r.revenue_at_risk) || 0), 0);
  const ranked = [...reasons].sort((a, b) => b.revenue_at_risk - a.revenue_at_risk);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue leakage"
        description="Every abandoned checkout traced to a root cause, sized in money, with the fix that cause implies."
      />

      {ranked.length === 0 ? (
        <Card>
          <EmptyState title="No leakage recorded" detail="No abandoned checkouts in this window." />
        </Card>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <Card>
              <CardHeader
                title="Loss by root cause"
                description="Total revenue at risk across every dropped checkout"
              />
              <ChartFrame
                className="px-2 pb-4"
                height={280}
                summary={`Revenue at risk by abandonment reason. ${ranked
                  .map((r) => `${r.reason}: ${formatCurrency(r.revenue_at_risk)}`)
                  .join('. ')}`}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ranked} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid {...grid} />
                    <XAxis {...xAxis} dataKey="reason" />
                    <YAxis {...yAxis} tickFormatter={moneyTick} />
                    <Tooltip {...tooltipMoney} />
                    <Bar dataKey="revenue_at_risk" name="At risk" radius={[2, 2, 0, 0]}>
                      {ranked.map((entry, i) => (
                        <Cell key={entry.reason} fill={SERIES[i % SERIES.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartFrame>
            </Card>

            <Card className="flex flex-col justify-between gap-6 p-6">
              <Stat
                label="Total at risk"
                value={formatCurrency(totalAtRisk)}
                tone="loss"
                size="lg"
                note={`Across ${formatNumber(reasons.reduce((s, r) => s + (Number(r.count) || 0), 0))} dropped sessions`}
              />
              <div className="space-y-3 border-t border-line-soft pt-4">
                <p className="eyebrow">Share of loss</p>
                {ranked.slice(0, 3).map((r) => {
                  const share = totalAtRisk ? (r.revenue_at_risk / totalAtRisk) * 100 : 0;
                  return (
                    <div key={r.reason} className="space-y-1.5">
                      <div className="flex items-baseline justify-between gap-2 text-[11px]">
                        <span className="text-fg-dim">{r.reason.toLowerCase()}</span>
                        <span className="figure text-fg">{formatPct(share)}</span>
                      </div>
                      <Meter value={share} tone="loss" label={`${r.reason}: ${formatPct(share)}`} />
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <section aria-labelledby="fixes" className="space-y-3">
            <h2 id="fixes" className="eyebrow">
              What to do about each
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {ranked.map((r) => {
                const share = totalAtRisk ? (r.revenue_at_risk / totalAtRisk) * 100 : 0;
                return (
                  <Card key={r.reason} className="flex flex-col gap-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <Badge tone="neutral">{r.reason}</Badge>
                      <span className="figure text-[11px] text-fg-mute">
                        {formatPct(share)} of loss
                      </span>
                    </div>

                    <div>
                      <p className="figure text-xl text-loss">{formatCurrency(r.revenue_at_risk)}</p>
                      <p className="mt-1 text-[11px] text-fg-mute">
                        across {formatNumber(r.count)} sessions
                      </p>
                    </div>

                    <div className="border-t border-line-soft pt-3">
                      <p className="eyebrow mb-1.5">Recommended fix</p>
                      <p className="text-[11px] leading-relaxed text-fg-dim">
                        {POLICIES[r.reason] || 'Route this cohort through the decision engine for a per-cart action.'}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-line-soft pt-3">
                      <span className="text-[11px] text-fg-mute">
                        Recovering{' '}
                        <span className="figure text-caught">{formatPct(r.recovery_rate_pct)}</span>
                      </span>
                      <Button size="sm" variant="ghost" onClick={() => onNavigate('decision-center')}>
                        Simulate
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
