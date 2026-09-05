import React, { useState, useEffect, useCallback } from 'react';
import { Award, Info } from 'lucide-react';
import apiService from '../services/api';
import {
  Badge,
  Card,
  CardHeader,
  Cell as Td,
  ErrorState,
  Loading,
  Meter,
  PageHeader,
  Row,
  Stat,
  Table,
  cx,
  formatCurrency,
  formatNumber,
  formatPct,
} from '../components/ui/index.jsx';

export default function AbTesting() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await apiService.getAbTesting());
      setError(null);
    } catch (err) {
      console.error('Error loading A/B benchmark:', err);
      setError(err?.message || 'The benchmark did not load.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loading label="Loading trial results" />;
  if (error) return <ErrorState title="Benchmark unavailable" detail={error} onRetry={load} />;

  const arms = data?.arms || [];
  const winner = data?.winner;
  const best = arms.reduce(
    (acc, a) => (acc && acc.net_profit > a.net_profit ? acc : a),
    null
  );
  const maxProfit = Math.max(...arms.map((a) => Number(a.net_profit) || 0), 1);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pillar 1 · Recover"
        title="Incrementality trial"
        description={data?.description}
      />

      {/* The methodology note is the point of this page, so it leads rather
          than sitting as a footnote under the table. */}
      <Card className="flex gap-3 p-5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
        <div className="space-y-1.5">
          <h2 className="text-[13px] font-semibold text-fg">Why there is a control group</h2>
          <p className="max-w-3xl text-xs leading-relaxed text-fg-dim">
            {data?.control_group_note ||
              'Some customers who abandon a cart come back on their own. Without a randomised control arm, a platform takes credit for those organic returns. Every lift figure here is measured against control.'}
          </p>
        </div>
      </Card>

      {best && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <Stat
              label="Winning arm"
              value={best.arm}
              size="sm"
              note={`${formatNumber(best.sample_size)} customers`}
            />
          </Card>
          <Card className="p-5">
            <Stat
              label="Incremental lift"
              value={formatPct(best.incremental_lift_pct)}
              tone="caught"
              size="sm"
              note="Over the control arm, not over zero"
            />
          </Card>
          <Card className="p-5">
            <Stat
              label="Net profit"
              value={formatCurrency(best.net_profit)}
              tone="caught"
              size="sm"
              note={data?.incremental_profit_gain_vs_static}
            />
          </Card>
        </div>
      )}

      <Card className="overflow-hidden">
        <CardHeader
          title="Arm by arm"
          description="Identical operating conditions, randomised assignment, equal sample per arm"
        />
        <Table
          head={[
            'Arm',
            { key: 'n', label: 'Sample', align: 'right' },
            { key: 'rate', label: 'Recovery rate', align: 'right' },
            { key: 'lift', label: 'Lift vs control', align: 'right' },
            { key: 'rev', label: 'Recovered', align: 'right' },
            { key: 'cost', label: 'Cost', align: 'right' },
            { key: 'profit', label: 'Net profit', align: 'right' },
          ]}
        >
          {arms.map((a) => {
            const isWinner = a.arm === winner;
            return (
              <Row key={a.arm} className={isWinner ? 'bg-caught/5' : undefined}>
                <Td strong className="min-w-[220px]">
                  <span className="flex items-center gap-2">
                    {isWinner && <Award className="h-3.5 w-3.5 text-warn" aria-hidden="true" />}
                    <span className={cx(isWinner && 'font-medium')}>{a.arm}</span>
                  </span>
                  {/* Profit is the column that decides the page, so it also
                      gets a bar — the eye finds the winner without reading. */}
                  <Meter
                    className="mt-2 max-w-[200px]"
                    value={((Number(a.net_profit) || 0) / maxProfit) * 100}
                    tone={isWinner ? 'caught' : 'neutral'}
                    label={`${a.arm}: net profit ${formatCurrency(a.net_profit)}`}
                  />
                </Td>
                <Td align="right" mono>
                  {formatNumber(a.sample_size)}
                </Td>
                <Td align="right" mono strong>
                  {formatPct(a.natural_recovery_rate_pct)}
                </Td>
                <Td align="right">
                  {a.incremental_lift_pct > 0 ? (
                    <Badge tone="caught">+{a.incremental_lift_pct}%</Badge>
                  ) : (
                    <span className="text-fg-mute">baseline</span>
                  )}
                </Td>
                <Td align="right" mono>
                  {formatCurrency(a.recovered_revenue)}
                </Td>
                <Td align="right" mono className={a.cost > 0 ? 'text-loss' : undefined}>
                  {a.cost > 0 ? formatCurrency(a.cost) : '—'}
                </Td>
                <Td align="right" mono strong className={isWinner ? 'text-caught' : undefined}>
                  {formatCurrency(a.net_profit)}
                </Td>
              </Row>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}
