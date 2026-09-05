import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Sparkles, 
  ArrowUpRight, 
  ShieldAlert, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import apiService from '../services/api';

export default function Simulator() {
  const [params, setParams] = useState({
    checkout_volume: 100000,
    avg_cart_value: 2800,
    abandonment_rate_pct: 34,
    recovery_rate_pct: 36,
    avg_discount_pct: 4.5,
    cost_per_intervention: 1.20,
    gross_margin_pct: 35
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateSimulation = async (currentParams = params) => {
    try {
      setLoading(true);
      const res = await apiService.evaluateSimulator(currentParams);
      /* The API nests its figures under recovery/protection/totals, but this
         page reads them flat — every output rendered ₹0 before this. */
      setResults(
        res?.recovery || res?.totals
          ? { ...res, ...res.protection, ...res.totals, ...res.recovery }
          : res
      );
      setError(null);
    } catch (err) {
      console.error('Simulation calculation error:', err);
      setError(err?.message || 'The simulator did not respond.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateSimulation(params);
  }, [params]);

  const handleReset = () => {
    const defaults = {
      checkout_volume: 100000,
      avg_cart_value: 2800,
      abandonment_rate_pct: 34,
      recovery_rate_pct: 36,
      avg_discount_pct: 4.5,
      cost_per_intervention: 1.20,
      gross_margin_pct: 35
    };
    setParams(defaults);
    calculateSimulation(defaults);
  };

  const formatCurrency = (val) => {
    if (!val && val !== 0) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${Number(val).toLocaleString('en-IN')}`;
  };

  const comparisonData = results ? [
    {
      metric: 'Revenue Recovered',
      Baseline: 0,
      WithPayRevive: results.gross_recovered_revenue
    },
    {
      metric: 'Net Profit Added',
      Baseline: 0,
      WithPayRevive: results.net_recovered_profit
    },
    {
      metric: 'Intervention Expense',
      Baseline: 0,
      WithPayRevive: results.total_recovery_cost
    }
  ] : [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="rounded-lg border border-signal/30 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-signal/10 border border-signal/30 text-signal text-xs font-semibold mb-2">
              <Sliders className="h-3.5 w-3.5" />
              Executive Business Modeling
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
              Interactive Revenue Recovery Simulator
            </h1>
            <p className="text-fg-dim text-sm mt-1 max-w-2xl">
              Model exactly how much revenue and net margin PayRevive recovers under different monthly checkout volumes, basket sizes, and discount policies.
            </p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded bg-raise text-[11px] text-warn font-medium border border-line">
              * Demo values are based on synthetic assumptions and transparent mathematical formulas.
            </span>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-sm bg-raise hover:bg-raise text-fg-dim text-xs font-semibold border border-line transition-all cursor-pointer w-fit"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Simulator Inputs & Real-Time Impact Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Levers & Controls (5 Cols) */}
        <div className="lg:col-span-5 bg-surface border border-line rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h2 className="text-base font-bold text-fg tracking-tight">Financial Levers & Parameters</h2>
            <span className="text-xs text-signal font-semibold">Real-Time Math</span>
          </div>

          <div className="space-y-5 text-xs">
            {/* 1. Monthly Checkout Volume */}
            <div>
              <div className="flex justify-between font-semibold mb-1.5">
                <span className="text-fg-dim">Monthly Checkouts</span>
                <span className="text-fg font-bold">{params.checkout_volume.toLocaleString()} sessions</span>
              </div>
              <input
                type="range"
                min="10000"
                max="500000"
                step="10000"
                value={params.checkout_volume}
                onChange={(e) => setParams({ ...params, checkout_volume: Number(e.target.value) })}
                className="w-full accent-signal h-1.5 bg-raise rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-fg-mute mt-1">
                <span>10K</span>
                <span>250K</span>
                <span>500K</span>
              </div>
            </div>

            {/* 2. Average Order Value (AOV) */}
            <div>
              <div className="flex justify-between font-semibold mb-1.5">
                <span className="text-fg-dim">Average Cart Value (AOV)</span>
                <span className="text-fg font-bold">{formatCurrency(params.avg_cart_value)}</span>
              </div>
              <input
                type="range"
                min="500"
                max="25000"
                step="250"
                value={params.avg_cart_value}
                onChange={(e) => setParams({ ...params, avg_cart_value: Number(e.target.value) })}
                className="w-full accent-signal h-1.5 bg-raise rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-fg-mute mt-1">
                <span>₹500</span>
                <span>₹12,500</span>
                <span>₹25,000</span>
              </div>
            </div>

            {/* 3. Abandonment Rate */}
            <div>
              <div className="flex justify-between font-semibold mb-1.5">
                <span className="text-fg-dim">Checkout Abandonment Rate</span>
                <span className="text-loss font-bold">{params.abandonment_rate_pct}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="60"
                step="1"
                value={params.abandonment_rate_pct}
                onChange={(e) => setParams({ ...params, abandonment_rate_pct: Number(e.target.value) })}
                className="w-full accent-loss h-1.5 bg-raise rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-fg-mute mt-1">
                <span>15%</span>
                <span>35% (Avg)</span>
                <span>60%</span>
              </div>
            </div>

            {/* 4. AI Recovery Rate */}
            <div>
              <div className="flex justify-between font-semibold mb-1.5">
                <span className="text-fg-dim">AI Recovery Conversion Rate</span>
                <span className="text-caught font-bold">{params.recovery_rate_pct}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="55"
                step="1"
                value={params.recovery_rate_pct}
                onChange={(e) => setParams({ ...params, recovery_rate_pct: Number(e.target.value) })}
                className="w-full accent-caught h-1.5 bg-raise rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-fg-mute mt-1">
                <span>10% (Static Email)</span>
                <span>35% (AI Target)</span>
                <span>55% (VIP/High Intent)</span>
              </div>
            </div>

            {/* 5. Average Discount Concession */}
            <div>
              <div className="flex justify-between font-semibold mb-1.5">
                <span className="text-fg-dim">Average Discount Concession</span>
                <span className="text-warn font-bold">{params.avg_discount_pct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={params.avg_discount_pct}
                onChange={(e) => setParams({ ...params, avg_discount_pct: Number(e.target.value) })}
                className="w-full accent-warn h-1.5 bg-raise rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-fg-mute mt-1">
                <span>0% (No discount)</span>
                <span>5%</span>
                <span>15% (Heavy)</span>
              </div>
            </div>

            {/* 6. Product Gross Margin */}
            <div>
              <div className="flex justify-between font-semibold mb-1.5">
                <span className="text-fg-dim">Product Gross Margin</span>
                <span className="text-caught font-bold">{params.gross_margin_pct}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="70"
                step="1"
                value={params.gross_margin_pct}
                onChange={(e) => setParams({ ...params, gross_margin_pct: Number(e.target.value) })}
                className="w-full accent-caught h-1.5 bg-raise rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-fg-mute mt-1">
                <span>15%</span>
                <span>35%</span>
                <span>70%</span>
              </div>
            </div>

            {/* 7. Cost Per Intervention */}
            <div>
              <div className="flex justify-between font-semibold mb-1.5">
                <span className="text-fg-dim">Blended Channel Delivery Cost</span>
                <span className="text-fg font-bold">₹{params.cost_per_intervention.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.20"
                max="5.00"
                step="0.10"
                value={params.cost_per_intervention}
                onChange={(e) => setParams({ ...params, cost_per_intervention: Number(e.target.value) })}
                className="w-full accent-signal h-1.5 bg-raise rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-fg-mute mt-1">
                <span>₹0.20 (Email)</span>
                <span>₹1.20 (WhatsApp/SMS)</span>
                <span>₹5.00 (Priority)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real-Time Economic Outputs & Sensitivity (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Big Impact KPI Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface border border-line rounded-lg p-5">
              <span className="text-[11px] font-semibold text-fg-dim uppercase tracking-wider block">
                Total Revenue at Risk
              </span>
              <div className="text-2xl font-semibold text-loss mt-2">
                {formatCurrency(results?.revenue_at_risk)}
              </div>
              <span className="text-[10px] text-fg-mute mt-1 block">
                {results?.abandoned_checkouts?.toLocaleString()} dropped checkouts
              </span>
            </div>

            <div className="bg-surface border border-caught/30 rounded-lg p-5 bg-caught/5">
              <span className="text-[11px] font-semibold text-caught uppercase tracking-wider block">
                Recovered Revenue
              </span>
              <div className="text-2xl font-semibold text-caught mt-2">
                {formatCurrency(results?.gross_recovered_revenue)}
              </div>
              <span className="text-[10px] text-caught mt-1 block">
                +{results?.expected_recovered_customers?.toLocaleString()} paying buyers
              </span>
            </div>

            <div className="bg-surface border border-caught/30 rounded-lg p-5 bg-caught/5">
              <span className="text-[11px] font-semibold text-caught uppercase tracking-wider block">
                Net Added Profit
              </span>
              <div className="text-2xl font-semibold text-caught mt-2">
                {formatCurrency(results?.net_recovered_profit)}
              </div>
              <span className="text-[10px] text-warn mt-1 block font-bold">
                ROI: {results?.roi_pct?.toLocaleString()}%
              </span>
            </div>
          </div>

          {/* Financial Breakdown Table Card */}
          <div className="bg-surface border border-line rounded-lg p-6 space-y-4">
            <h3 className="text-base font-bold text-fg tracking-tight">Economic Unit Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-sunken p-3 rounded-sm border border-line">
                <span className="text-fg-dim block text-[10px] uppercase">Gross Margin Yield</span>
                <span className="text-fg font-bold text-sm mt-1 block">
                  {formatCurrency((results?.gross_recovered_revenue || 0) * (params.gross_margin_pct / 100))}
                </span>
              </div>
              <div className="bg-sunken p-3 rounded-sm border border-line">
                <span className="text-fg-dim block text-[10px] uppercase">Discount Cost</span>
                <span className="text-warn font-bold text-sm mt-1 block">
                  {formatCurrency(results?.discount_cost)}
                </span>
              </div>
              <div className="bg-sunken p-3 rounded-sm border border-line">
                <span className="text-fg-dim block text-[10px] uppercase">Channel Dispatch Cost</span>
                <span className="text-fg font-bold text-sm mt-1 block">
                  {formatCurrency(results?.intervention_cost)}
                </span>
              </div>
              <div className="bg-sunken p-3 rounded-sm border border-line">
                <span className="text-fg-dim block text-[10px] uppercase">Net Profit Margin</span>
                <span className="text-caught font-bold text-sm mt-1 block">
                  {results?.gross_recovered_revenue ? ((results.net_recovered_profit / results.gross_recovered_revenue) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Sensitivity Chart: Baseline vs PayRevive */}
          <div className="bg-surface border border-line rounded-lg p-6">
            <h3 className="text-base font-bold text-fg tracking-tight mb-1">Financial Impact Comparison</h3>
            <p className="text-xs text-fg-dim mb-4">Without AI Intervention vs PayRevive Autonomous Recovery</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="metric" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(value) => [formatCurrency(value), '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Baseline" fill="#475569" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="WithPayRevive" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
