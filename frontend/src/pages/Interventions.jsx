import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Clock, Mail, MessageSquare, Phone, RefreshCw, XCircle } from 'lucide-react';
import apiService from '../services/api';
import {
  Badge,
  Button,
  Card,
  Cell as Td,
  EmptyState,
  ErrorState,
  PageHeader,
  Row,
  Select,
  SkeletonRows,
  Stat,
  Table,
  formatCurrency,
  formatNumber,
  formatPct,
} from '../components/ui/index.jsx';

const STATUS = {
  CONVERTED: { tone: 'caught', icon: CheckCircle2, label: 'Converted' },
  SENT: { tone: 'signal', icon: Clock, label: 'Sent' },
  PENDING: { tone: 'warn', icon: Clock, label: 'Pending' },
  FAILED: { tone: 'loss', icon: XCircle, label: 'Unconverted' },
};

const CHANNEL_ICON = { WHATSAPP: MessageSquare, SMS: Phone, EMAIL: Mail };

export default function Interventions() {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterChannel, setFilterChannel] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.listInterventions({
        limit: 50,
        status: filterStatus || undefined,
        channel: filterChannel || undefined,
      });
      setInterventions(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error loading interventions:', err);
      setError(err?.message || 'The intervention log did not load.');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterChannel]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const converted = interventions.filter((i) => i.status === 'CONVERTED');
  const recoveredProfit = converted.reduce((sum, i) => sum + (Number(i.recovered_profit) || 0), 0);
  const conversionRate = interventions.length
    ? (converted.length / interventions.length) * 100
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pillar 1 · Recover"
        title="Interventions"
        description="Every recovery message the engine has dispatched, and what came back from it."
        actions={
          <Button variant="ghost" onClick={loadData} aria-label="Refresh interventions">
            <RefreshCw className={loading ? 'h-3.5 w-3.5 animate-spin' : 'h-3.5 w-3.5'} aria-hidden="true" />
            Refresh
          </Button>
        }
      />

      {/* Reading the log is easier once you know what it adds up to. */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <Stat label="Dispatched" value={formatNumber(interventions.length)} size="sm" />
        </Card>
        <Card className="p-5">
          <Stat
            label="Converted"
            value={conversionRate == null ? '—' : formatPct(conversionRate)}
            tone="caught"
            size="sm"
            note={`${formatNumber(converted.length)} of ${formatNumber(interventions.length)} in view`}
          />
        </Card>
        <Card className="p-5">
          <Stat
            label="Profit recovered"
            value={formatCurrency(recoveredProfit)}
            tone="caught"
            size="sm"
            note="Net of discount and channel cost"
          />
        </Card>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <Select label="Status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="CONVERTED">Converted</option>
          <option value="SENT">Sent</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Unconverted</option>
        </Select>

        <Select
          label="Channel"
          value={filterChannel}
          onChange={(e) => setFilterChannel(e.target.value)}
        >
          <option value="">All channels</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="SMS">SMS</option>
          <option value="EMAIL">Email</option>
        </Select>
      </div>

      {error ? (
        <ErrorState title="Interventions unavailable" detail={error} onRetry={loadData} />
      ) : (
        <Card className="overflow-hidden">
          {loading ? (
            <SkeletonRows rows={8} />
          ) : interventions.length === 0 ? (
            <EmptyState
              title="Nothing dispatched yet"
              detail="Interventions appear here as soon as the decision center sends one."
            />
          ) : (
            <Table
              head={[
                'ID',
                'Channel',
                'Action',
                'Segment',
                { key: 'cart', label: 'Cart value', align: 'right' },
                'Status',
                { key: 'profit', label: 'Recovered profit', align: 'right' },
              ]}
            >
              {interventions.map((i) => {
                const status = STATUS[i.status] || { tone: 'neutral', label: i.status };
                const StatusIcon = status.icon;
                const ChannelIcon = CHANNEL_ICON[i.channel];
                return (
                  <Row key={i.intervention_id}>
                    <Td mono strong>
                      {i.intervention_id}
                    </Td>
                    <Td>
                      <span className="inline-flex items-center gap-1.5 text-fg">
                        {ChannelIcon && (
                          <ChannelIcon className="h-3.5 w-3.5 text-fg-mute" aria-hidden="true" />
                        )}
                        {i.channel}
                      </span>
                    </Td>
                    <Td strong>{i.action?.replace(/_/g, ' ').toLowerCase()}</Td>
                    <Td>{i.customer_segment}</Td>
                    <Td align="right" mono strong>
                      {formatCurrency(i.cart_value, { compact: false })}
                    </Td>
                    <Td>
                      <Badge tone={status.tone}>
                        {StatusIcon && <StatusIcon className="h-3 w-3" aria-hidden="true" />}
                        {status.label}
                      </Badge>
                    </Td>
                    <Td align="right" mono className={i.recovered_profit > 0 ? 'text-caught' : undefined}>
                      {i.recovered_profit > 0
                        ? formatCurrency(i.recovered_profit, { compact: false })
                        : '—'}
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
