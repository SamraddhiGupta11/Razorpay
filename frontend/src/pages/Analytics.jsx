import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  RotateCcw, 
  Truck, 
  MapPin, 
  Package, 
  CreditCard, 
  RefreshCw, 
  Layers 
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
  Cell, 
  LineChart, 
  Line 
} from 'recharts';
import apiService from '../services/api';

const COLORS = ['#10B981', '#6366F1', '#F59E0B', '#EF4444', '#EC4899'];

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState(null);
  const [categoryRisk, setCategoryRisk] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [tr, cat] = await Promise.all([
        apiService.getAnalyticsTrends(),
        apiService.getCategoryRisk()
      ]);
      setTrends(tr);
      setCategoryRisk(cat.categories || []);
    } catch (err) {
      console.error("Failed to load Analytics data:", err);
    } finally {
      setLoading(false);
    }
  };

  /* The API calls this `regions`; reading `regional_corridors` always missed
     and the chart quietly drew the hardcoded sample below instead of real data. */
  const regionalData = trends?.regions || trends?.regional_corridors || [
    { region: 'North', total_shipments: 4200, cod_pct: 38.2, rto_rate_pct: 6.8 },
    { region: 'West', total_shipments: 3800, cod_pct: 31.4, rto_rate_pct: 5.2 },
    { region: 'South', total_shipments: 3500, cod_pct: 34.7, rto_rate_pct: 6.1 },
    { region: 'East', total_shipments: 2100, cod_pct: 52.9, rto_rate_pct: 11.4 },
    { region: 'Central', total_shipments: 1400, cod_pct: 48.1, rto_rate_pct: 9.8 }
  ];

  const usingLiveRegions = Boolean(trends?.regions || trends?.regional_corridors);

  const paymentRiskData = trends?.payment_breakdown || [
    { method: 'UPI', share_pct: 48, dropoff_rate_pct: 28.4, bounce_rate_pct: 4.2 },
    { method: 'Credit Card', share_pct: 24, dropoff_rate_pct: 18.2, bounce_rate_pct: 2.1 },
    { method: 'Debit Card', share_pct: 12, dropoff_rate_pct: 22.1, bounce_rate_pct: 3.5 },
    { method: 'COD', share_pct: 11, dropoff_rate_pct: 12.0, bounce_rate_pct: 18.4 },
    { method: 'Net Banking', share_pct: 5, dropoff_rate_pct: 35.8, bounce_rate_pct: 5.8 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-surface p-6 rounded-lg border border-line backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-sm border border-signal/30 text-signal">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-fg flex items-center gap-2">
                Cross-Pillar Risk & Revenue Analytics
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-signal/10 text-signal border border-signal/30 font-medium">
                  Deep-Dive Telemetry
                </span>
              </h1>
              <p className="text-xs text-fg-dim mt-0.5">
                Multi-dimensional root-cause analysis across Catalog Categories, Regional Corridors, and Payment Gateways.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchAnalyticsData}
          className="p-2 rounded-sm bg-raise hover:bg-raise text-fg-dim border border-line transition-all cursor-pointer self-start md:self-auto"
          title="Refresh Analytics Telemetry"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Grid: Category Return & RTO Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-line p-5 rounded-lg">
          <h2 className="text-sm font-bold text-fg mb-4 flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-caught" />
            Category Return Rate & Size Sensitivity Friction
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryRisk}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="category" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155' }} />
                <Bar dataKey="return_rate_pct" fill="#EF4444" name="Return Rate %" />
                <Bar dataKey="size_sensitive_pct" fill="#6366F1" name="Size Sensitivity %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-fg-mute mt-2">
            Fashion and Footwear account for 74% of total returns due to size ambiguity.
          </p>
        </div>

        <div className="bg-surface border border-line p-5 rounded-lg">
          <h2 className="text-sm font-bold text-fg mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-warn" />
            Regional Delivery Corridors & RTO Exposure
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="region" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155' }} />
                <Bar dataKey="cod_pct" fill="#8b93ff" name="Cash on delivery %" />
                <Bar dataKey="rto_rate_pct" fill="#ff6b54" name="RTO rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-fg-mute mt-2">
            {usingLiveRegions
              ? 'Corridors with a heavier cash-on-delivery mix carry the higher return-to-origin rate.'
              : 'Showing sample corridors — the shipments table returned no regional rows.'}
          </p>
        </div>
      </div>

      {/* Payment Gateway Dropoff & Bounce Patterns */}
      <div className="bg-surface border border-line p-6 rounded-lg">
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 className="text-sm font-bold text-fg flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-signal" />
            Payment method conversion & RTO risk
          </h2>
          {!trends?.payment_breakdown && (
            /* No endpoint supplies this yet. Say so rather than passing a
               fixed table off as measured data. */
            <span className="rounded-xs border border-warn/30 bg-warn/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-warn uppercase">
              Illustrative
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sunken/80 text-fg-dim border-b border-line uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3">Order Share</th>
                <th className="px-4 py-3">Checkout Dropoff Rate</th>
                <th className="px-4 py-3">Post-Checkout Bounce / RTO</th>
                <th className="px-4 py-3">AI Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft text-fg-dim">
              {paymentRiskData.map((item, idx) => (
                <tr key={idx} className="hover:bg-raise/60 transition-all">
                  <td className="px-4 py-3 font-bold text-fg">
                    {item.method}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {item.share_pct}%
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded font-bold ${item.dropoff_rate_pct > 25 ? 'bg-loss/10 text-loss' : 'bg-raise text-fg-dim'}`}>
                      {item.dropoff_rate_pct}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded font-bold ${item.bounce_rate_pct > 10 ? 'bg-warn/10 text-warn' : 'bg-caught/10 text-caught'}`}>
                      {item.bounce_rate_pct}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-fg-dim">
                    {item.method === 'COD' ? 'Incentivize UPI prepayment with Rs. 50 instant cashback' :
                     item.method === 'UPI' ? 'Trigger instant fallback link on intent drop' : 'Seamless 1-click tokenized checkout'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}