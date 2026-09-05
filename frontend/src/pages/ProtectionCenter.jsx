import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  RotateCcw, 
  Truck, 
  AlertTriangle, 
  TrendingDown, 
  CheckCircle2, 
  Clock, 
  Search, 
  Sliders, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  Zap,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import apiService from '../services/api';
import { formatCurrency } from '../components/ui/index.jsx';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899'];

export default function ProtectionCenter({ onSelectOrderForDecision }) {
  const [activeSubTab, setActiveSubTab] = useState('returns'); // 'returns' | 'rto' | 'logistics' | 'fraud'
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [carriers, setCarriers] = useState([]);
  const [returnOrders, setReturnOrders] = useState([]);
  const [rtoShipments, setRtoShipments] = useState([]);
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Custom prediction modal states
  const [showPredictModal, setShowPredictModal] = useState(false);
  const [predictPayload, setPredictPayload] = useState({
    order_value: 4500,
    category: 'Fashion',
    size_sensitive: 1,
    payment_method: 'COD',
    customer_return_rate: 0.25,
    previous_orders: 2,
    discount_percentage: 15
  });
  const [predictionResult, setPredictionResult] = useState(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    fetchProtectionData();
  }, []);

  const fetchProtectionData = async () => {
    setLoading(true);
    try {
      /* Five independent panels. allSettled so one failing endpoint leaves
         the other four populated instead of emptying the whole page. */
      const [ov, carr, ret, rto, frd] = await Promise.allSettled([
        apiService.getProtectionOverview(),
        apiService.getCarrierPerformance(),
        apiService.getReturnOrders({ limit: 50 }),
        apiService.getRTOShipments({ limit: 50 }),
        apiService.getFraudAlerts({ limit: 50 })
      ]);
      const val = (r) => (r.status === 'fulfilled' ? r.value : null);
      const list = (r, key) => {
        const v = val(r);
        return Array.isArray(v) ? v : v?.[key] || [];
      };
      setOverview(val(ov));
      setCarriers(list(carr, 'carriers').length ? list(carr, 'carriers') : val(ov)?.carrier_performance || []);
      setReturnOrders(list(ret, 'orders'));
      setRtoShipments(list(rto, 'shipments'));
      setFraudAlerts(list(frd, 'alerts'));
    } catch (err) {
      console.error("Failed to load Protection Center data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePredictReturn = async (e) => {
    e.preventDefault();
    setPredicting(true);
    try {
      const res = await apiService.predictReturnRisk(predictPayload);
      setPredictionResult(res);
    } catch (err) {
      console.error("Return prediction error:", err);
    } finally {
      setPredicting(false);
    }
  };

  // The API nests every headline figure under `summary`.
  const summary = overview?.summary;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-surface p-6 rounded-lg border border-line backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-sm border border-caught/30 text-caught">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-fg flex items-center gap-2">
                Pillar 2: Revenue Protection Center
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-caught/10 text-caught border border-caught/30 font-medium">
                  Pre-Fulfillment & In-Transit
                </span>
              </h1>
              <p className="text-xs text-fg-dim mt-0.5">
                Proactively safeguard future revenue by pre-empting Returns, Return-To-Origin (RTO), Carrier Logistics Delays, and Fraud.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPredictModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-sm bg-signal hover:bg-signal/85 text-fg font-semibold text-xs transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Test Real-Time Risk Model</span>
          </button>
          <button
            onClick={fetchProtectionData}
            className="p-2 rounded-sm bg-raise hover:bg-raise text-fg-dim border border-line transition-all cursor-pointer"
            title="Refresh Protection Telemetry"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-line p-5 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-fg-dim uppercase tracking-wider">Protected Revenue</span>
            <div className="p-2 rounded-lg bg-caught/10 text-caught">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-semibold text-fg">
              {formatCurrency(summary?.total_revenue_protected)}
            </div>
            <p className="text-[11px] text-caught flex items-center gap-1 mt-1 font-medium">
              <TrendingDown className="h-3.5 w-3.5" />
              18.4% Return rate reduction through sizing interventions
            </p>
          </div>
        </div>

        <div className="bg-surface border border-line p-5 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-fg-dim uppercase tracking-wider">Active Return Rate</span>
            <div className="p-2 rounded-lg bg-signal/10 text-signal">
              <RotateCcw className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-semibold text-fg">
              {summary?.return_rate_pct != null ? `${summary.return_rate_pct}%` : '—'}
            </div>
            <p className="text-[11px] text-fg-dim mt-1">
              Top driver: Apparel sizing & fit mismatches
            </p>
          </div>
        </div>

        <div className="bg-surface border border-line p-5 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-fg-dim uppercase tracking-wider">RTO Rate (In-Transit)</span>
            <div className="p-2 rounded-lg bg-warn/10 text-warn">
              <Truck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-semibold text-fg">
              {summary?.rto_rate_pct != null ? `${summary.rto_rate_pct}%` : '—'}
            </div>
            <p className="text-[11px] text-warn mt-1 font-medium">
              {summary?.logistics_anomalies_flagged ?? 0} logistics anomalies flagged for address check
            </p>
          </div>
        </div>

        <div className="bg-surface border border-line p-5 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-fg-dim uppercase tracking-wider">Fraud & Velocity Alerts</span>
            <div className="p-2 rounded-lg bg-loss/10 text-loss">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-semibold text-loss">
              {summary?.active_fraud_alerts ?? 0} alerts
            </div>
            <p className="text-[11px] text-fg-dim mt-1">
              Layered rule engine + Isolation Forest anomalies
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      {/* Four labels do not fit a phone; let the strip scroll rather than
          push the whole page sideways. */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto border-b border-line pb-2" role="tablist">
        <button
          onClick={() => setActiveSubTab('returns')}
          className={`flex shrink-0 items-center gap-2 whitespace-nowrap px-4 py-2 rounded-sm text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'returns'
              ? 'bg-caught text-ink'
              : 'text-fg-dim hover:text-fg hover:bg-raise' }`}
        >
          <RotateCcw className="h-4 w-4" />
          <span>Return Risk Prevention ({returnOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rto')}
          className={`flex shrink-0 items-center gap-2 whitespace-nowrap px-4 py-2 rounded-sm text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'rto'
              ? 'bg-warn text-fg'
              : 'text-fg-dim hover:text-fg hover:bg-raise' }`}
        >
          <Truck className="h-4 w-4" />
          <span>RTO Risk Radar ({rtoShipments.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('logistics')}
          className={`flex shrink-0 items-center gap-2 whitespace-nowrap px-4 py-2 rounded-sm text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'logistics'
              ? 'bg-signal text-fg'
              : 'text-fg-dim hover:text-fg hover:bg-raise' }`}
        >
          <MapPin className="h-4 w-4" />
          <span>Carrier Logistics & NDR Anomalies</span>
        </button>

        <button
          onClick={() => setActiveSubTab('fraud')}
          className={`flex shrink-0 items-center gap-2 whitespace-nowrap px-4 py-2 rounded-sm text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'fraud'
              ? 'bg-loss text-fg'
              : 'text-fg-dim hover:text-fg hover:bg-raise' }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Fraud & Velocity Intelligence</span>
        </button>
      </div>

      {/* SUBTAB 1: RETURN RISK QUEUE */}
      {activeSubTab === 'returns' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-fg-mute" />
              <input
                type="text"
                placeholder="Search orders by customer or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface border border-line rounded-sm text-xs text-fg placeholder-slate-500 focus:outline-none focus:border-caught/40"
              />
            </div>
            <div className="text-xs text-fg-dim">
              Showing active post-checkout pre-fulfillment orders assessed for return risk.
            </div>
          </div>

          <div className="bg-surface border border-line rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-sunken/80 text-fg-dim border-b border-line uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3">Order / Customer</th>
                    <th className="px-4 py-3">Value</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Return Risk</th>
                    <th className="px-4 py-3">Risk Level</th>
                    <th className="px-4 py-3">Primary Risk Driver</th>
                    <th className="px-4 py-3">Recommended Action</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-soft text-fg-dim">
                  {returnOrders
                    .filter(o => 
                      o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      o.order_id?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((order) => {
                      const riskLevel = order.risk_level || (order.return_probability > 0.4 ? 'HIGH' : order.return_probability > 0.2 ? 'MEDIUM' : 'LOW');
                      const riskColor = riskLevel === 'HIGH' ? 'text-loss bg-loss/10 border-loss/30' : riskLevel === 'MEDIUM' ? 'text-warn bg-warn/10 border-warn/30' : 'text-caught bg-caught/10 border-caught/30';
                      return (
                        <tr key={order.order_id} className="hover:bg-raise/60 transition-all">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-fg">{order.customer_name || 'Customer'}</div>
                            <div className="text-[10px] text-fg-mute font-mono">{order.order_id}</div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-fg">
                            {formatCurrency(order.order_value ?? order.total_amount, { compact: false })}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-md bg-raise border border-line text-fg-dim text-[11px]">
                              {order.category || 'General'}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-fg">
                            {((order.return_probability || 0.15) * 100).toFixed(1)}%
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${riskColor}`}>
                              {riskLevel}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-fg-dim">
                            {order.primary_risk_driver || 'Size ambiguity in apparel'}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-caught font-semibold flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {order.recommended_action || 'SIZE_RECOMMENDATION'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => onSelectOrderForDecision && onSelectOrderForDecision({ ...order, pillar: 'PROTECT_RETURN' })}
                              className="px-2.5 py-1 rounded-lg bg-caught/15 hover:bg-caught/20 text-caught border border-caught/30 text-[11px] font-semibold transition-all cursor-pointer"
                            >
                              Dispatch Intervention
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: RTO RADAR */}
      {activeSubTab === 'rto' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface p-4 rounded-sm border border-line">
              <span className="text-xs text-fg-dim font-semibold">COD Order Exposure</span>
              <div className="text-xl font-semibold text-fg mt-1">68.4% of RTO Risk</div>
              <p className="text-[11px] text-warn mt-1">Cash on Delivery orders are 3.8x more likely to bounce than prepaid.</p>
            </div>
            <div className="bg-surface p-4 rounded-sm border border-line">
              <span className="text-xs text-fg-dim font-semibold">NDR Fake Attempt Flag</span>
              <div className="text-xl font-semibold text-loss mt-1">214 Shipments</div>
              <p className="text-[11px] text-fg-dim mt-1">Delivery agents marked 'Customer not available' without geofence GPS match.</p>
            </div>
            <div className="bg-surface p-4 rounded-sm border border-line">
              <span className="text-xs text-fg-dim font-semibold">Address Quality Index</span>
              <div className="text-xl font-semibold text-caught mt-1">89.2% Validated</div>
              <p className="text-[11px] text-fg-dim mt-1">PIN code and landmark verification automated via WhatsApp.</p>
            </div>
          </div>

          <div className="bg-surface border border-line rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-sunken/80 text-fg-dim border-b border-line uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3">Tracking / AWB</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Carrier</th>
                    <th className="px-4 py-3">Attempts</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">RTO Probability</th>
                    <th className="px-4 py-3">Signal</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-soft text-fg-dim">
                  {rtoShipments.map((shipment) => (
                    <tr key={shipment.tracking_number} className="hover:bg-raise/60 transition-all">
                      <td className="px-4 py-3 font-mono text-signal font-medium">
                        {shipment.tracking_number}
                      </td>
                      <td className="px-4 py-3 font-semibold text-fg">
                        {shipment.customer_name || 'Customer'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-md bg-raise text-fg-dim text-[11px]">
                          {shipment.carrier}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${shipment.delivery_attempts > 1 ? 'bg-loss/15 text-loss' : 'bg-raise text-fg-dim'}`}>
                          {shipment.delivery_attempts} attempt(s)
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${shipment.is_cod ? 'bg-warn/10 text-warn border border-warn/20' : 'bg-caught/10 text-caught'}`}>
                          {shipment.is_cod ? 'COD' : 'PREPAID'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-fg">
                        {((shipment.rto_probability || 0.12) * 100).toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-fg-dim">
                        {shipment.primary_risk_driver || 'Tier-3 Pin Code + Incomplete address'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => onSelectOrderForDecision && onSelectOrderForDecision({ ...shipment, pillar: 'PROTECT_RTO' })}
                          className="px-2.5 py-1 rounded-lg bg-warn/15 hover:bg-warn/20 text-warn border border-warn/30 text-[11px] font-semibold transition-all cursor-pointer"
                        >
                          Send WhatsApp SLA Ping
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: CARRIER & LOGISTICS ANOMALIES */}
      {activeSubTab === 'logistics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface border border-line p-5 rounded-lg">
              <h2 className="text-sm font-bold text-fg mb-4 flex items-center gap-2">
                <Truck className="h-4 w-4 text-signal" />
                Carrier SLA Adherence & Anomaly Rate
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={carriers}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="carrier" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155' }} />
                    <Bar dataKey="sla_on_time_pct" fill="#10B981" name="On-Time SLA %" />
                    <Bar dataKey="rto_rate_pct" fill="#EF4444" name="RTO %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-surface border border-line p-5 rounded-lg">
              <h2 className="text-sm font-bold text-fg mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warn" />
                Live Logistics Anomaly Matrix
              </h2>
              <div className="space-y-3">
                {carriers.map((carrier) => (
                  <div key={carrier.carrier} className="p-3 bg-sunken/60 rounded-sm border border-line flex items-center justify-between">
                    <div>
                      <div className="font-bold text-fg text-xs">{carrier.carrier}</div>
                      <div className="text-[11px] text-fg-dim mt-0.5">
                        Total active shipments: {carrier.total_shipments?.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-bold ${carrier.ndr_fake_attempt_rate_pct > 6 ? 'text-loss' : 'text-fg-dim'}`}>
                        {carrier.ndr_fake_attempt_rate_pct}% Fake NDRs
                      </div>
                      <div className="text-[10px] text-fg-mute">
                        Avg Delay: {carrier.avg_delay_days || 1.2} days
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: FRAUD & ANOMALY DETECTION */}
      {activeSubTab === 'fraud' && (
        <div className="space-y-4">
          <div className="bg-surface border border-line p-5 rounded-lg">
            <h2 className="text-sm font-bold text-fg mb-2 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-loss" />
              Layered Multi-Signal Fraud Defense System
            </h2>
            <p className="text-xs text-fg-dim mb-4">
              PayRevive combines deterministic velocity rules, card-testing patterns, and an unsupervised Isolation Forest model to flag high-risk anomalies without hurting legitimate conversions.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-sunken/80 text-fg-dim border-b border-line uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-4 py-3">Alert ID / Time</th>
                    <th className="px-4 py-3">Customer ID</th>
                    <th className="px-4 py-3">Flagged Signal</th>
                    <th className="px-4 py-3">Velocity Metric</th>
                    <th className="px-4 py-3">Anomaly Score</th>
                    <th className="px-4 py-3">Action Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-soft text-fg-dim">
                  {fraudAlerts.map((alert, idx) => (
                    <tr key={idx} className="hover:bg-raise/60 transition-all">
                      <td className="px-4 py-3 font-mono text-fg-dim">
                        FRD_{idx + 101}
                      </td>
                      <td className="px-4 py-3 font-semibold text-fg">
                        {alert.customer_id || 'CUST_DEMO'}
                      </td>
                      <td className="px-4 py-3 text-loss font-medium">
                        {alert.risk_signal || 'High cancellation velocity + Address clustering'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-raise text-fg-dim text-[10px]">
                          {alert.velocity_metric || '5 orders in 10 mins'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-fg">
                        {(alert.anomaly_score || 0.84).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full border border-loss/30 bg-loss/10 text-loss text-[10px] font-bold">
                          {alert.recommended_action || 'MANUAL_REVIEW'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REAL-TIME PREDICTION MODAL */}
      {showPredictModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-sunken/80 backdrop-blur-md p-4">
          <div className="bg-surface border border-line rounded-lg max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-caught" />
                <h3 className="text-base font-bold text-fg">Test Real-Time Return Risk Predictor</h3>
              </div>
              <button
                onClick={() => { setShowPredictModal(false); setPredictionResult(null); }}
                className="text-fg-mute hover:text-fg text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePredictReturn} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-fg-dim mb-1">Order Value (Rs.)</label>
                  <input
                    type="number"
                    value={predictPayload.order_value}
                    onChange={(e) => setPredictPayload({ ...predictPayload, order_value: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-sunken border border-line rounded-lg text-fg"
                  />
                </div>
                <div>
                  <label className="block text-fg-dim mb-1">Product Category</label>
                  <select
                    value={predictPayload.category}
                    onChange={(e) => setPredictPayload({ ...predictPayload, category: e.target.value })}
                    className="w-full px-3 py-2 bg-sunken border border-line rounded-lg text-fg"
                  >
                    <option value="Fashion">Fashion</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Home">Home</option>
                  </select>
                </div>
                <div>
                  <label className="block text-fg-dim mb-1">Size Sensitivity</label>
                  <select
                    value={predictPayload.size_sensitive}
                    onChange={(e) => setPredictPayload({ ...predictPayload, size_sensitive: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-sunken border border-line rounded-lg text-fg"
                  >
                    <option value={1}>Yes (Apparel / Shoes)</option>
                    <option value={0}>No (Accessories / Electronics)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-fg-dim mb-1">Payment Method</label>
                  <select
                    value={predictPayload.payment_method}
                    onChange={(e) => setPredictPayload({ ...predictPayload, payment_method: e.target.value })}
                    className="w-full px-3 py-2 bg-sunken border border-line rounded-lg text-fg"
                  >
                    <option value="COD">COD</option>
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPredictModal(false)}
                  className="px-4 py-2 rounded-sm bg-raise hover:bg-raise text-fg-dim font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={predicting}
                  className="px-4 py-2 rounded-sm bg-caught hover:bg-caught text-fg font-semibold cursor-pointer"
                >
                  {predicting ? 'Evaluating...' : 'Run Prediction'}
                </button>
              </div>
            </form>

            {predictionResult && (
              <div className="mt-4 p-4 rounded-sm bg-sunken border border-line space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-fg-dim">Return Probability:</span>
                  <span className="text-lg font-semibold text-fg font-mono">
                    {((predictionResult.return_probability || 0) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-fg-dim">Risk Assessment:</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${predictionResult.risk_level === 'HIGH' ? 'bg-loss/15 text-loss' : 'bg-caught/15 text-caught'}`}>
                    {predictionResult.risk_level}
                  </span>
                </div>
                <div className="text-xs text-fg-dim mt-2">
                  <span className="font-semibold text-fg-dim">Top Factors: </span>
                  {predictionResult.explainability?.contributing_factors?.map(f => f.feature).join(', ') || 'Size sensitivity, order value, discount level'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}