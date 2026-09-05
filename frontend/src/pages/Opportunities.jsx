import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';
import apiService from '../services/api';
import {
  Badge,
  Button,
  Card,
  Cell as Td,
  EmptyState,
  ErrorState,
  Meter,
  PageHeader,
  Row,
  Select,
  SkeletonRows,
  Table,
  formatCurrency,
  formatNumber,
} from '../components/ui/index.jsx';

const REASON_TONE = {
  SHIPPING: 'warn',
  PAYMENT: 'loss',
  TECHNICAL: 'loss',
  PRICE: 'signal',
  HESITATION: 'neutral',
  TRUST: 'neutral',
};

const SEGMENT_TONE = { VIP: 'signal', New: 'caught' };

export default function Opportunities({ onSelectCart }) {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterReason, setFilterReason] = useState('');
  const [filterSegment, setFilterSegment] = useState('');
  const [sortBy, setSortBy] = useState('priority');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.getAbandonedCheckouts({
        limit: 50,
        reason: filterReason || undefined,
        segment: filterSegment || undefined,
        sort_by: sortBy,
      });
      setCarts(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error loading opportunities:', err);
      setError(err?.message || 'The checkout queue did not load.');
    } finally {
      setLoading(false);
    }
  }, [filterReason, filterSegment, sortBy]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtersApplied = Boolean(filterReason || filterSegment);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pillar 1 · Recover"
        title="Recovery queue"
        description="Abandoned carts ranked by cart value against how likely the model thinks each one is to come back, so the highest-value winnable carts sit at the top."
        actions={
          <Button variant="ghost" onClick={loadData} aria-label="Refresh the recovery queue">
            <RefreshCw className={loading ? 'h-3.5 w-3.5 animate-spin' : 'h-3.5 w-3.5'} aria-hidden="true" />
            Refresh
          </Button>
        }
      />

      <div className="flex flex-wrap items-end gap-3">
        <Select
          label="Reason"
          value={filterReason}
          onChange={(e) => setFilterReason(e.target.value)}
        >
          <option value="">All reasons</option>
          <option value="SHIPPING">Shipping cost</option>
          <option value="PAYMENT">Payment decline</option>
          <option value="PRICE">Price hesitation</option>
          <option value="TECHNICAL">Technical error</option>
          <option value="HESITATION">Dwell hesitation</option>
          <option value="TRUST">Trust barrier</option>
        </Select>

        <Select
          label="Segment"
          value={filterSegment}
          onChange={(e) => setFilterSegment(e.target.value)}
        >
          <option value="">All segments</option>
          <option value="VIP">VIP</option>
          <option value="Regular">Regular</option>
          <option value="Occasional">Occasional</option>
          <option value="New">New</option>
        </Select>

        <Select label="Sort by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="priority">Priority score</option>
          <option value="cart_value">Cart value</option>
          <option value="recovery_prob">Recovery probability</option>
          <option value="date">Most recent</option>
        </Select>

        <p className="ml-auto self-center font-mono text-[11px] text-fg-mute">
          {loading ? 'Loading…' : `${formatNumber(carts.length)} carts`}
        </p>
      </div>

      {error ? (
        <ErrorState title="Recovery queue unavailable" detail={error} onRetry={loadData} />
      ) : (
        <Card className="overflow-hidden">
          {loading ? (
            <SkeletonRows rows={8} />
          ) : carts.length === 0 ? (
            <EmptyState
              title={filtersApplied ? 'No carts match these filters' : 'The queue is clear'}
              detail={
                filtersApplied
                  ? 'Widen the reason or segment filter to see more.'
                  : 'Every abandoned cart in this window has been actioned.'
              }
              action={
                filtersApplied ? (
                  <Button
                    onClick={() => {
                      setFilterReason('');
                      setFilterSegment('');
                    }}
                  >
                    Clear filters
                  </Button>
                ) : null
              }
            />
          ) : (
            <Table
              head={[
                { key: 'rank', label: '#' },
                'Customer',
                'Segment',
                { key: 'value', label: 'Cart value', align: 'right' },
                'Diagnosed reason',
                'Recovery likelihood',
                'Context',
                { key: 'action', label: '', align: 'right' },
              ]}
            >
              {carts.map((cart, idx) => {
                const prob = Math.round((Number(cart.recovery_probability) || 0) * 100);
                return (
                  <Row key={cart.abandoned_cart_id ?? idx}>
                    <Td mono className={idx < 3 ? 'text-warn' : undefined}>
                      {idx + 1}
                    </Td>
                    <Td strong mono>
                      {cart.customer_id}
                    </Td>
                    <Td>
                      <Badge tone={SEGMENT_TONE[cart.customer_segment] || 'neutral'}>
                        {cart.customer_segment}
                      </Badge>
                    </Td>
                    <Td align="right" mono strong>
                      {formatCurrency(cart.cart_value, { compact: false })}
                    </Td>
                    <Td>
                      <Badge tone={REASON_TONE[cart.abandonment_reason] || 'neutral'}>
                        {cart.abandonment_reason}
                      </Badge>
                    </Td>
                    <Td>
                      {/* The bar makes the column scannable; the figure keeps
                          it precise. Neither alone is enough here. */}
                      <div className="flex items-center gap-2.5">
                        <Meter
                          value={prob}
                          tone={prob >= 60 ? 'caught' : prob >= 30 ? 'warn' : 'loss'}
                          className="w-16"
                          label={`${prob} percent likely to recover`}
                        />
                        <span className="figure text-[11px] text-fg">{prob}%</span>
                      </div>
                    </Td>
                    <Td className="text-[11px]">
                      {cart.device} · {cart.payment_method}
                    </Td>
                    <Td align="right">
                      <Button
                        size="sm"
                        onClick={() => onSelectCart(cart)}
                        aria-label={`Choose an action for cart ${cart.customer_id}`}
                      >
                        Decide
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </Button>
                    </Td>
                  </Row>
                );
              })}
            </Table>
          )}
        </Card>
      )}
    </div>
  );
}
