import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  ShieldAlert, 
  RotateCcw, 
  ShoppingBag, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Layers, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import apiService from '../services/api';
import { formatCurrency } from '../components/ui/index.jsx';
import { customersList } from '../services/customerData.js';

export default function Customer360({ onNavigateToDecision, initialCustomerId }) {
  const [selectedCustId, setSelectedCustId] = useState(initialCustomerId || 'DEMO_CUST_RAHUL');
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialCustomerId) {
      setSelectedCustId(initialCustomerId);
    }
  }, [initialCustomerId]);

  useEffect(() => {
    fetchCustomer360(selectedCustId);
  }, [selectedCustId]);

  const fetchCustomer360 = async (id) => {
    setLoading(true);
    try {
      const data = await apiService.getCustomer360(id);
      setCustomerData(data);
    } catch (err) {
      console.error("Failed to fetch Customer 360:", err);
    } finally {
      setLoading(false);
    }
  };

  const profile = customerData?.profile || customerData || {};
  const risk = customerData?.unified_revenue_risk || {};
  const riskComponents = risk.components || risk;
  const nba = customerData?.next_best_action || {};
  const history = customerData?.history || {};

  const radarData = [
    { subject: 'Abandonment', A: riskComponents.abandonment_risk ?? 40, fullMark: 100 },
    { subject: 'Return Risk', A: riskComponents.return_risk ?? 30, fullMark: 100 },
    { subject: 'RTO Risk', A: riskComponents.rto_risk ?? 20, fullMark: 100 },
    { subject: 'Fraud / Velocity', A: riskComponents.fraud_risk ?? 15, fullMark: 100 },
    { subject: 'Sentiment Risk', A: riskComponents.cx_friction_risk ?? riskComponents.sentiment_friction_risk ?? 25, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Quick Customer Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-surface p-6 rounded-lg border border-line backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-sm border border-caught/30 text-caught">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-fg flex items-center gap-2">
                Customer 360 Intelligence
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-caught/10 text-caught border border-caught/30 font-medium">
                  Unified Multi-Pillar View
                </span>
              </h1>
              <p className="text-xs text-fg-dim mt-0.5">
                Complete longitudinal profile across Checkouts, Orders, Returns, Shipments, Reviews, and Unified Revenue Risk.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCustId}
            onChange={(e) => setSelectedCustId(e.target.value)}
            className="px-3 py-2 bg-sunken border border-line rounded-sm text-xs text-fg focus:outline-none focus:border-signal/40 cursor-pointer max-w-xs truncate"
          >
            {customersList.map((c) => (
              <option key={c.customer_id} value={c.customer_id}>
                {c.name || c.customer_id} ({c.customer_segment || c.segment || 'Customer'} · {c.location || 'India'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-fg-dim text-xs">
          <Sparkles className="h-8 w-8 text-signal animate-spin mx-auto mb-2" />
          Loading Customer 360 telemetry...
        </div>
      ) : (
        <>
          {/* Customer Demographic Card */}
          <div className="bg-surface border border-line p-6 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-fg">{profile.name || 'Customer'}</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    profile.customer_segment === 'VIP' ? 'bg-warn/15 text-warn border border-warn/30' :
                    profile.customer_segment === 'Regular' ? 'bg-signal/15 text-signal border border-signal/30' : 'bg-raise text-fg-dim' }`}>
                    {profile.customer_segment || 'Regular'} Tier
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-fg-dim mt-1">
                  <span className="flex items-center gap-1 font-mono text-fg-mute">{profile.customer_id}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-fg-mute" />{profile.location || 'Mumbai, Maharashtra'}</span>
                  <span>{profile.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 text-right">
                <div>
                  <span className="text-[10px] text-fg-dim uppercase tracking-wider">Lifetime Value</span>
                  <div className="text-base font-bold text-caught">{formatCurrency(profile.lifetime_value, { compact: false })}</div>
                </div>
                <div>
                  <span className="text-[10px] text-fg-dim uppercase tracking-wider">Total Orders</span>
                  <div className="text-base font-bold text-fg">{profile.lifetime_orders ?? profile.total_orders ?? 0}</div>
                </div>
                <div>
                  <span className="text-[10px] text-fg-dim uppercase tracking-wider">Average Order</span>
                  <div className="text-base font-bold text-fg">{formatCurrency(profile.average_order_value ?? profile.avg_order_value, { compact: false })}</div>
                </div>
              </div>
            </div>

            {/* Middle Grid: Unified Risk Radar & Next Best Action */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Radar Chart */}
              <div className="p-4 bg-sunken/60 rounded-sm border border-line flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-fg flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-warn" />
                    Unified Revenue Risk Radar
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    risk.composite_score > 60 ? 'bg-loss/15 text-loss' :
                    risk.composite_score > 30 ? 'bg-warn/15 text-warn' : 'bg-caught/15 text-caught' }`}>
                    Risk Score: {risk.composite_score || 35}/100 ({risk.risk_tier || 'LOW'})
                  </span>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={11} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
                      <Radar name="Risk" dataKey="A" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[11px] text-fg-mute text-center mt-1">
                  Multivariate decision-support composite: Aggregates checkout, returns, logistics, and feedback signals.
                </p>
              </div>

              {/* Next Best Action Card */}
              <div className="p-5 950 rounded-sm border border-signal/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-signal flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      AI Prescribed Next Best Action
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-signal/15 text-signal font-bold">
                      {nba.priority || 'HIGH'} PRIORITY
                    </span>
                  </div>

                  <div className="text-lg font-semibold text-fg">
                    {nba.recommended_action || 'FREE_SHIPPING'}
                  </div>
                  <p className="text-xs text-fg-dim mt-1 font-medium">
                    {nba.economic_rationale || 'Waive delivery fee to unlock high-ticket cart conversion with maximum expected net profit.'}
                  </p>

                  <div className="grid grid-cols-3 gap-3 my-4 p-3 bg-sunken/80 rounded-lg border border-line text-xs">
                    <div>
                      <span className="text-[10px] text-fg-dim block">Channel</span>
                      <span className="font-bold text-fg">{nba.channel || 'WHATSAPP'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-fg-dim block">Expected Revenue</span>
                      <span className="font-bold text-caught">{formatCurrency(nba.expected_revenue, { compact: false })}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-fg-dim block">Expected Profit</span>
                      <span className="font-bold text-fg">{formatCurrency(nba.expected_profit, { compact: false })}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateToDecision && onNavigateToDecision(profile)}
                  className="w-full py-2 rounded-sm bg-signal hover:bg-signal/85 text-fg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Open in AI Decision Center</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Historical Timeline Across All 3 Pillars */}
          <div className="bg-surface border border-line p-6 rounded-lg">
            <h3 className="text-sm font-bold text-fg mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-caught" />
              Longitudinal Customer Journey Timeline
            </h3>

            <div className="space-y-4">
              {/* Checkouts & Dropoffs */}
              {history.checkouts && history.checkouts.length > 0 && (
                <div className="p-3 bg-sunken rounded-sm border border-line">
                  <div className="flex items-center gap-2 text-xs font-bold text-warn mb-2">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Recent Checkout Sessions ({history.checkouts.length})</span>
                  </div>
                  <div className="space-y-2">
                    {history.checkouts.map((chk, i) => (
                      <div key={i} className="flex items-center justify-between text-xs text-fg-dim">
                        <div>
                          <span className="font-mono text-fg-mute mr-2">{chk.session_id}</span>
                          <span>Cart: {formatCurrency(chk.cart_value, { compact: false })}</span>
                          <span className="text-fg-mute ml-2">({chk.item_count || 1} items)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${chk.abandoned ? 'bg-loss/10 text-loss' : 'bg-caught/10 text-caught'}`}>
                            {chk.abandoned ? 'ABANDONED' : 'CONVERTED'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Returns & Shipments */}
              {history.orders && history.orders.length > 0 && (
                <div className="p-3 bg-sunken rounded-sm border border-line">
                  <div className="flex items-center gap-2 text-xs font-bold text-signal mb-2">
                    <RotateCcw className="h-4 w-4" />
                    <span>Orders & Fulfillment History ({history.orders.length})</span>
                  </div>
                  <div className="space-y-2">
                    {history.orders.map((ord, i) => (
                      <div key={i} className="flex items-center justify-between text-xs text-fg-dim">
                        <div>
                          <span className="font-mono text-fg-mute mr-2">{ord.order_id}</span>
                          <span>Order: {formatCurrency(ord.order_value ?? ord.total_amount, { compact: false })}</span>
                          <span className="text-fg-mute ml-2">({ord.status})</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-fg-dim">Status: {ord.fulfillment_status || 'DELIVERED'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews & Feedback */}
              {history.reviews && history.reviews.length > 0 && (
                <div className="p-3 bg-sunken rounded-sm border border-line">
                  <div className="flex items-center gap-2 text-xs font-bold text-signal mb-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Customer Feedback & Reviews ({history.reviews.length})</span>
                  </div>
                  <div className="space-y-2">
                    {history.reviews.map((rev, i) => (
                      <div key={i} className="p-2 bg-surface rounded-lg text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-fg">{rev.rating} ★ Rating ({rev.language || 'English'})</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            rev.sentiment === 'POSITIVE' ? 'bg-caught/15 text-caught' : 'bg-loss/15 text-loss' }`}>{rev.sentiment}</span>
                        </div>
                        <p className="text-fg-dim mt-1 italic">"{rev.review_text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}