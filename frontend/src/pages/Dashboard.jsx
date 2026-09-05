import React, { useEffect, useState, useCallback } from 'react';
import { ArrowRight, RefreshCw, ShieldCheck, MessageSquare, Target } from 'lucide-react';
import {
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import apiService from '../services/api';

import {
  Badge,
  Button,
  Card,
  CardHeader,
  Cell as Td,
  EmptyState,
  ErrorState,
  Loading,
  Meter,
  PageHeader,
  Row,
  Stat,
  StatCard,
  Table,
  cx,
  formatCurrency,
  formatNumber,
  formatPct,
} from '../components/ui/index.jsx';
import {
  CHART,
  ChartFrame,
  SERIES,
  grid,
  moneyTick,
  tooltipMoney,
  xAxis,
  yAxis,
} from '../components/ui/charts.jsx';

/** The API is inconsistent: reasons and segments carry `revenue_recovered`,
 *  channels carry `recovered_revenue`. Read whichever is present. */
const recovered = (d) => d?.revenue_recovered ?? d?.recovered_revenue ?? 0;

const PILLARS = [
  {
    id: 'opportunities',
    name: 'Recover',
    note: 'Pillar 1',
    icon: Target,
    caption: 'Checkout drop-off caught and converted',
    iconClass: 'text-signal',
  },
  {
    id: 'protection',
    name: 'Protect',
    note: 'Pillar 2',
    icon: ShieldCheck,
    caption: 'Returns, RTO and fraud stopped before fulfilment',
    iconClass: 'text-caught',
  },
  {
    id: 'voc',
    name: 'Listen',
    note: 'Pillar 3',
    icon: MessageSquare,
    caption: 'Review signal mined for product and logistics fixes',
    iconClass: 'text-warn',
  },
];

export default function Dashboard({ onNavigate }) {
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);
  const [protection, setProtection] = useState(null);
  const [voc, setVoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, chartRes] = await Promise.all([
        apiService.getDashboardSummary(),
        apiService.getDashboardCharts(),
      ]);
      setSummary(sumRes);
      setCharts(chartRes);
      setError(null);
    } catch (err) {
      console.error('Dashboard data load error:', err);
      setError(err?.message || 'The analytics API did not respond.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* The pillar strip used to print "Rs. 41.5 Lakhs" and "3,500 Reviews" as
     literals. These are secondary, so a failure here must not take down the
     page — the strip just falls back to a dash. */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [p, v] = await Promise.allSettled([
        apiService.getProtectionOverview(),
        apiService.getReviewInsights(),
      ]);
      if (cancelled) return;
      if (p.status === 'fulfilled') setProtection(p.value);
      if (v.status === 'fulfilled') setVoc(v.value);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Loading label="Aggregating checkout analytics" />;

  if (error) {
    return (
      <ErrorState
        title="Dashboard could not load"
        detail={`${error.replace(/\.?$/, '.')} Check that the API is running on port 8000, then try again.`}
        onRetry={loadData}
      />
    );
  }

  /* Pull the single most useful supporting fact out of the chart payload so
     the headline cards say something beyond the total. */
  const topReason = [...(charts?.reasons || [])].sort(
    (a, b) => b.revenue_at_risk - a.revenue_at_risk
  )[0];
  const bestChannel = [...(charts?.channels || [])].sort(
    (a, b) => b.conversion_rate_pct - a.conversion_rate_pct
  )[0];

  /* The endpoint reports a sentiment breakdown rather than a total, so the
     count is the sum of its buckets. */
  const sentiment = voc?.sentiment_distribution;
  const totalReviews = sentiment
    ? Object.values(sentiment).reduce((a, b) => a + Number(b || 0), 0)
    : (voc?.total_reviews ?? null);

  const pillarValues = {
    Recover: summary?.revenue_recovered != null ? formatCurrency(summary.revenue_recovered) : '—',
    Protect:
      protection?.summary?.total_revenue_protected != null
        ? formatCurrency(protection.summary.total_revenue_protected)
        : '—',
    Listen: totalReviews != null ? `${formatNumber(totalReviews)} reviews` : '—',
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Where revenue is leaking, and what caught it"
        description={`Live across ${formatNumber(summary?.total_checkouts)} checkout sessions. PayRevive diagnoses drop-off, predicts how recoverable each cart is, and picks the intervention with the best expected profit.`}
        actions={
          <>
            <Button onClick={loadData} variant="ghost" aria-label="Refresh dashboard data">
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Refresh
            </Button>
            <Button variant="primary" onClick={() => onNavigate('decision-center')}>
              Open decision center
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </>
        }
      />

      {/* --- The headline pair: what left, what came back ---------------- */}
      <section aria-labelledby="headline" className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
        <h2 id="headline" className="sr-only">
          Headline revenue figures
        </h2>

        <Card className="flex flex-col justify-between gap-6 p-6">
          <Stat
            label="Revenue at risk"
            value={formatCurrency(summary?.revenue_at_risk)}
            tone="loss"
            size="lg"
            note={`Carried by ${formatNumber(summary?.abandoned_checkouts)} abandoned carts · ${formatPct(summary?.abandonment_rate_pct)} of all checkouts`}
          />
          {topReason && (
            <div className="border-t border-line-soft pt-4">
              <p className="text-[11px] text-fg-dim">
                Largest single cause is{' '}
                <span className="font-medium text-fg">{topReason.reason.toLowerCase()}</span>, at{' '}
                <span className="figure text-loss">{formatCurrency(topReason.revenue_at_risk)}</span>{' '}
                across {formatNumber(topReason.count)} sessions.
              </p>
            </div>
          )}
        </Card>

        <Card className="flex flex-col justify-between gap-6 p-6">
          <Stat
            label="Revenue recovered"
            value={formatCurrency(summary?.revenue_recovered)}
            tone="caught"
            size="lg"
            note={`${formatPct(summary?.recovery_rate_pct)} of abandoned carts converted after an intervention`}
          />
          {bestChannel && (
            <div className="border-t border-line-soft pt-4">
              <p className="text-[11px] text-fg-dim">
                Best channel is{' '}
                <span className="font-medium text-fg">{bestChannel.channel.toLowerCase()}</span>,
                converting{' '}
                <span className="figure text-caught">
                  {formatPct(bestChannel.conversion_rate_pct)}
                </span>{' '}
                of everything it is sent.
              </p>
            </div>
          )}
        </Card>

        <Card className="flex flex-col justify-between gap-5 p-6 lg:w-[210px]">
          <Stat
            label="Net profit"
            value={formatCurrency(summary?.net_recovered_profit)}
            size="sm"
            note="After discount and channel cost"
          />
          <div className="border-t border-line-soft pt-4">
            <Stat
              label="Program ROI"
              value={formatPct(summary?.overall_roi_pct)}
              size="sm"
              note={`On ${formatCurrency(summary?.total_intervention_cost)} spent`}
            />
          </div>
        </Card>
      </section>

      {/* --- Three pillars ---------------------------------------------- */}
      <section aria-labelledby="pillars">
        <h2 id="pillars" className="eyebrow mb-3">
          The three engines
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <Card
                key={p.id}
                as="button"
                interactive
                onClick={() => onNavigate(p.id)}
                className="group cursor-pointer p-5 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={cx('h-3.5 w-3.5', p.iconClass)} aria-hidden="true" />
                    <span className="text-[13px] font-semibold text-fg">{p.name}</span>
                    <span className="font-mono text-[9px] text-fg-mute">{p.note}</span>
                  </div>
                  <ArrowRight
                    className="h-3.5 w-3.5 text-fg-mute transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-fg"
                    aria-hidden="true"
                  />
                </div>
                <p className="figure mt-4 text-xl text-fg">{pillarValues[p.name]}</p>
                <p className="mt-2 text-[11px] leading-snug text-fg-dim">{p.caption}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* --- Leakage and segments --------------------------------------- */}
      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Leakage by abandonment reason"
            description="Diagnosed root cause, with what was at risk against what came back"
            action={
              <Button size="sm" variant="ghost" onClick={() => onNavigate('leakage')}>
                Deep dive
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Button>
            }
          />
          <ChartFrame
            className="px-2 pb-4"
            summary={`Revenue at risk against revenue recovered, by abandonment reason. ${(charts?.reasons || [])
              .map(
                (r) =>
                  `${r.reason}: ${formatCurrency(r.revenue_at_risk)} at risk, ${formatCurrency(recovered(r))} recovered`
              )
              .join('. ')}`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.reasons} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid {...grid} />
                <XAxis {...xAxis} dataKey="reason" />
                <YAxis {...yAxis} tickFormatter={moneyTick} />
                <Tooltip {...tooltipMoney} />
                <Bar dataKey="revenue_at_risk" name="At risk" fill={CHART.loss} radius={[2, 2, 0, 0]} />
                <Bar
                  dataKey={recovered}
                  name="Recovered"
                  fill={CHART.caught}
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>
        </Card>

        <Card>
          <CardHeader
            title="Recovery by customer segment"
            description="Which cohorts respond to an intervention"
            action={
              <Button size="sm" variant="ghost" onClick={() => onNavigate('customers')}>
                Customers
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Button>
            }
          />
          <ChartFrame
            className="px-2 pb-4"
            summary={`Revenue recovered by customer segment. ${(charts?.segments || [])
              .map((s) => `${s.segment}: ${formatCurrency(recovered(s))}`)
              .join('. ')}`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.segments} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid {...grid} />
                <XAxis {...xAxis} dataKey="segment" />
                <YAxis {...yAxis} tickFormatter={moneyTick} />
                <Tooltip {...tooltipMoney} />
                <Bar dataKey={recovered} name="Recovered" radius={[2, 2, 0, 0]}>
                  {(charts?.segments || []).map((entry, i) => (
                    <Cell key={entry.segment} fill={SERIES[i % SERIES.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>
        </Card>
      </section>

      {/* --- Channels and funnel ---------------------------------------- */}
      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Channel efficiency"
            description="What each delivery channel returns against what it costs to run"
          />
          {charts?.channels?.length ? (
            <Table
              head={[
                'Channel',
                { key: 'sent', label: 'Sent', align: 'right' },
                { key: 'conv', label: 'Converted', align: 'right' },
                { key: 'rate', label: 'Rate', align: 'right' },
                { key: 'rev', label: 'Recovered', align: 'right' },
                { key: 'profit', label: 'Net profit', align: 'right' },
                { key: 'roi', label: 'ROI', align: 'right' },
              ]}
            >
              {charts.channels.map((ch) => (
                <Row key={ch.channel}>
                  <Td strong className="font-medium">
                    {ch.channel}
                  </Td>
                  <Td align="right" mono>
                    {formatNumber(ch.interventions_sent)}
                  </Td>
                  <Td align="right" mono>
                    {formatNumber(ch.conversions)}
                  </Td>
                  <Td align="right" mono className="text-caught">
                    {formatPct(ch.conversion_rate_pct)}
                  </Td>
                  <Td align="right" mono strong>
                    {formatCurrency(recovered(ch) || ch.revenue_generated)}
                  </Td>
                  <Td align="right" mono className="text-caught">
                    {formatCurrency(ch.net_profit)}
                  </Td>
                  <Td align="right" mono strong>
                    {formatPct(ch.roi_pct, 0)}
                  </Td>
                </Row>
              ))}
            </Table>
          ) : (
            <EmptyState
              title="No channel activity yet"
              detail="Channel economics appear once interventions have been dispatched."
            />
          )}
        </Card>

        <Card className="flex flex-col">
          <CardHeader
            title="Conversion funnel"
            description="Session attrition, stage by stage"
          />
          <div className="space-y-4 px-5 pb-5">
            {(charts?.funnel || []).map((step, i) => {
              const pct = step.pct_of_total ?? step.percentage ?? 0;
              const label = step.stage ?? step.step;
              const stageTone = i === 1 ? 'loss' : i === 3 ? 'caught' : 'signal';
              return (
                <div key={label} className="space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs text-fg-dim">{label}</span>
                    <span className="figure text-xs text-fg">
                      {formatNumber(step.count)}
                      <span className="ml-1.5 text-[10px] text-fg-mute">{formatPct(pct)}</span>
                    </span>
                  </div>
                  <Meter value={pct} tone={stageTone} label={`${label}: ${formatPct(pct)}`} />
                </div>
              );
            })}
          </div>

          <div className="mt-auto border-t border-line px-5 py-4">
            <p className="text-[11px] leading-relaxed text-fg-dim">
              <Badge tone="caught">Result</Badge>{' '}
              <span className="ml-1">
                {formatPct(summary?.recovery_rate_pct)} of abandoned carts convert after an AI-chosen
                intervention.
              </span>
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
