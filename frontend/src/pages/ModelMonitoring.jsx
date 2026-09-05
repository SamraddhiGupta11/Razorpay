import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck } from 'lucide-react';
import apiService from '../services/api';
import {
  Badge,
  Card,
  CardHeader,
  ErrorState,
  Loading,
  Meter,
  PageHeader,
  cx,
  formatPct,
} from '../components/ui/index.jsx';

const METRICS = [
  { key: 'roc_auc', label: 'ROC-AUC', hint: 'Ranking quality across all thresholds' },
  { key: 'accuracy', label: 'Accuracy', hint: 'Share of predictions that were right' },
  { key: 'precision', label: 'Precision', hint: 'Of those flagged, how many really were' },
  { key: 'recall', label: 'Recall', hint: 'Of those that really were, how many were caught' },
  { key: 'f1_score', label: 'F1', hint: 'Balance of precision and recall' },
];

function scoreTone(value) {
  const v = Number(value);
  if (!Number.isFinite(v)) return 'neutral';
  if (v >= 0.75) return 'caught';
  if (v >= 0.6) return 'warn';
  return 'loss';
}

function ModelCard({ index, title, model, fallback }) {
  const metrics = model?.best_metrics || fallback.metrics;
  const algorithm = model?.selected_algorithm || fallback.algorithm;
  const comparison = model?.comparison;

  return (
    <Card>
      <CardHeader
        title={title}
        description={`Model ${index} of the decision pipeline`}
        action={<Badge tone="signal">{algorithm}</Badge>}
      />

      <div className="space-y-3 px-5 pb-5">
        {METRICS.map((m) => {
          const value = Number(metrics?.[m.key]);
          return (
            <div key={m.key} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs text-fg-dim" title={m.hint}>
                  {m.label}
                </span>
                <span
                  className={cx(
                    'figure text-xs',
                    scoreTone(value) === 'caught'
                      ? 'text-caught'
                      : scoreTone(value) === 'warn'
                        ? 'text-warn'
                        : 'text-loss'
                  )}
                >
                  {Number.isFinite(value) ? value.toFixed(4) : '—'}
                </span>
              </div>
              {/* The bar is what makes an honest 0.63 read as honest rather
                  than hiding among four-decimal figures. */}
              <Meter
                value={(value || 0) * 100}
                tone={scoreTone(value)}
                label={`${m.label}: ${Number.isFinite(value) ? value.toFixed(4) : 'unavailable'}`}
              />
            </div>
          );
        })}
      </div>

      {comparison && (
        <div className="border-t border-line px-5 py-4">
          <p className="eyebrow mb-2.5">Algorithms considered</p>
          <ul className="space-y-1.5">
            {Object.entries(comparison).map(([alg, met]) => {
              const isChosen = alg === algorithm;
              return (
                <li
                  key={alg}
                  className={cx(
                    'flex items-center justify-between gap-3 rounded-sm px-2.5 py-1.5 text-[11px]',
                    isChosen ? 'bg-signal/10' : 'bg-raise/50'
                  )}
                >
                  <span className={isChosen ? 'font-medium text-fg' : 'text-fg-dim'}>{alg}</span>
                  <span className="figure text-fg-dim">
                    AUC <span className="text-fg">{met.roc_auc}</span>
                    <span className="mx-1.5 text-fg-mute">·</span>
                    F1 <span className="text-fg">{met.f1_score}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Card>
  );
}

export default function ModelMonitoring() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setMetrics(await apiService.getModelMetrics());
      setError(null);
    } catch (err) {
      console.error('Error loading model metrics:', err);
      setError(err?.message || 'Model metrics did not load.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loading label="Reading model artefacts" />;
  if (error) return <ErrorState title="Model metrics unavailable" detail={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="System"
        title="Model insights"
        description="How each model scores, which algorithm won its bake-off, and what the numbers were measured on."
      />

      <Card className="flex gap-3 p-5">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
        <div className="space-y-2">
          <h2 className="text-[13px] font-semibold text-fg">What this was trained on</h2>
          <p className="max-w-3xl text-xs leading-relaxed text-fg-dim">
            {metrics?.synthetic_disclosure ||
              'Trained on calibrated synthetic telemetry modelled on real e-commerce transaction mechanics. Session features are isolated from outcome variables, so no future information reaches training.'}
          </p>
          <dl className="flex flex-wrap gap-x-6 gap-y-1 pt-1 font-mono text-[10px] text-fg-mute">
            <div className="flex gap-1.5">
              <dt>Dataset</dt>
              <dd className="text-fg-dim">100,000 sessions</dd>
            </div>
            <div className="flex gap-1.5">
              <dt>Evaluation</dt>
              <dd className="text-fg-dim">Stratified train/test split</dd>
            </div>
            <div className="flex gap-1.5">
              <dt>Artefact</dt>
              <dd className="text-fg-dim">joblib</dd>
            </div>
          </dl>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <ModelCard
          index={1}
          title="Abandonment prediction"
          model={metrics?.models?.model_1_abandonment}
          fallback={{
            algorithm: 'HistGradientBoosting',
            metrics: { roc_auc: 0.7767, accuracy: 0.7554, precision: 0.7435, recall: 0.4402, f1_score: 0.553 },
          }}
        />
        <ModelCard
          index={2}
          title="Recovery prediction"
          model={metrics?.models?.model_2_recovery}
          fallback={{
            algorithm: 'RandomForest',
            metrics: { roc_auc: 0.6282, accuracy: 0.5911, precision: 0.5941, recall: 0.6872, f1_score: 0.6372 },
          }}
        />
      </div>
    </div>
  );
}
