import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, UserRound } from 'lucide-react';
import apiService from '../services/api';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Loading,
  PageHeader,
  cx,
  formatCurrency,
} from '../components/ui/index.jsx';

const FILTERS = [
  { id: 'ALL', label: 'All' },
  { id: 'RECOVER', label: 'Recover' },
  { id: 'PROTECT', label: 'Protect' },
];

const isProtect = (s) => Boolean(s.pillar && s.pillar.startsWith('PROTECT'));

export default function DemoScenarios({ onSelectScenario, onNavigateToCustomer360 }) {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pillarFilter, setPillarFilter] = useState('ALL');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService.getDemoScenarios();
      setScenarios(Array.isArray(res) ? res : []);
      setError(null);
    } catch (err) {
      console.error('Error loading scenarios:', err);
      setError(err?.message || 'The scenarios did not load.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loading label="Loading scenarios" />;
  if (error) return <ErrorState title="Scenarios unavailable" detail={error} onRetry={load} />;

  const counts = {
    ALL: scenarios.length,
    RECOVER: scenarios.filter((s) => !isProtect(s)).length,
    PROTECT: scenarios.filter(isProtect).length,
  };

  const visible = scenarios.filter((s) => {
    if (pillarFilter === 'ALL') return true;
    return pillarFilter === 'PROTECT' ? isProtect(s) : !isProtect(s);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Demo"
        title="Walkthrough scenarios"
        description="Fixed cases with known answers, for showing how the engine reasons. Pick one to run it through the decision center."
        actions={
          /* A segmented control, not three loose buttons — these are one
             choice with three states, and the counts belong on the control. */
          <div
            className="inline-flex rounded-sm border border-line bg-surface p-0.5"
            role="group"
            aria-label="Filter scenarios by pillar"
          >
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setPillarFilter(f.id)}
                aria-pressed={pillarFilter === f.id}
                className={cx(
                  'cursor-pointer rounded-xs px-3 py-1.5 text-[11px] font-medium transition-colors duration-150',
                  pillarFilter === f.id
                    ? 'bg-raise text-fg'
                    : 'text-fg-dim hover:text-fg'
                )}
              >
                {f.label}
                <span className="ml-1.5 font-mono text-[10px] text-fg-mute">{counts[f.id]}</span>
              </button>
            ))}
          </div>
        }
      />

      {visible.length === 0 ? (
        <Card>
          <EmptyState title="No scenarios in this pillar" detail="Switch the filter to see the rest." />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((sc) => {
            const protect = isProtect(sc);
            const value = sc.cart_value ?? sc.order_value;
            const outcome = sc.expected_profit ?? sc.expected_loss_prevented;
            return (
              <Card key={sc.id} className="flex flex-col gap-4 p-5">
                <div className="flex items-center justify-between gap-2">
                  <Badge tone={protect ? 'caught' : 'signal'}>
                    {protect ? 'Protect' : 'Recover'}
                  </Badge>
                  <span className="font-mono text-[10px] text-fg-mute">
                    {sc.customer_segment || 'Regular'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-fg">{sc.customer_name}</h3>
                  <p className="figure mt-1 text-lg text-fg">
                    {formatCurrency(value, { compact: false })}
                  </p>
                  {sc.shipping_cost > 0 && (
                    <p className="mt-1 text-[11px] text-loss">
                      plus {formatCurrency(sc.shipping_cost, { compact: false })} shipping
                    </p>
                  )}
                </div>

                {/* The story is the whole point of a demo card, so it gets
                    room to breathe rather than being crushed into a chip. */}
                <p className="border-l-2 border-line pl-3 text-[11px] leading-relaxed text-fg-dim">
                  {sc.signal || sc.story}
                </p>

                <dl className="space-y-1.5 border-t border-line-soft pt-3 text-[11px]">
                  <div className="flex justify-between gap-2">
                    <dt className="text-fg-mute">Root cause</dt>
                    <dd className="font-mono text-loss">{sc.expected_reason}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-fg-mute">Action</dt>
                    <dd className="font-mono text-signal">
                      {sc.recommended_action?.replace(/_/g, ' ').toLowerCase()}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-fg-mute">
                      {protect ? 'Loss prevented' : 'Expected profit'}
                    </dt>
                    <dd className="figure text-caught">
                      {formatCurrency(outcome, { compact: false })}
                    </dd>
                  </div>
                </dl>

                <div className="mt-auto flex gap-2 pt-1">
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => onSelectScenario(sc)}
                  >
                    Run scenario
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                  {onNavigateToCustomer360 && (
                    <Button
                      onClick={() => onNavigateToCustomer360(sc.customer_id)}
                      aria-label={`Open the customer profile for ${sc.customer_name}`}
                      title="Customer 360"
                    >
                      <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
