import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Zap, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  HelpCircle,
  Sparkles,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import apiService from '../services/api';

export default function DecisionCenter({ preselectedCheckout }) {
  const [candidates, setCandidates] = useState([]);
  const [selectedCartId, setSelectedCartId] = useState('');
  const [loadingCarts, setLoadingCarts] = useState(true);

  // Form Inputs
  const [formData, setFormData] = useState({
    cart_value: 80000,
    shipping_cost: 1500,
    customer_segment: 'VIP',
    is_returning: true,
    previous_orders: 6,
    previous_abandonments: 0,
    payment_failed: false,
    payment_attempts: 1,
    technical_errors: 0,
    coupon_views: 2,
    time_on_checkout_min: 4.5,
    device: 'Mobile',
    payment_method: 'UPI'
  });

  const [aiResult, setAiResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);
  const [simStep, setSimStep] = useState(0);

  // Load sample abandoned carts for quick-pick
  useEffect(() => {
    const fetchAbandoned = async () => {
      try {
        setLoadingCarts(true);
        const carts = await apiService.getAbandonedCheckouts({ limit: 8 });
        setCandidates(carts);
        if (preselectedCheckout) {
          handleSelectCandidate(preselectedCheckout);
        } else if (carts.length > 0) {
          handleSelectCandidate(carts[0]);
        }
      } catch (err) {
        console.error("Error fetching abandoned carts:", err);
      } finally {
        setLoadingCarts(false);
      }
    };
    fetchAbandoned();
  }, [preselectedCheckout]);

  const handleSelectCandidate = (cart) => {
    setSelectedCartId(cart.abandoned_cart_id || cart.checkout_id);
    const newForm = {
      cart_value: Number(cart.cart_value) || 2500,
      shipping_cost: cart.shipping_cost !== undefined ? Number(cart.shipping_cost) : (cart.abandonment_reason === 'SHIPPING' ? 249 : 49),
      customer_segment: cart.customer_segment || 'Regular',
      is_returning: cart.customer_segment !== 'New',
      previous_orders: cart.customer_segment === 'VIP' ? 8 : cart.customer_segment === 'Regular' ? 3 : 0,
      previous_abandonments: 1,
      payment_failed: cart.abandonment_reason === 'PAYMENT',
      payment_attempts: cart.abandonment_reason === 'PAYMENT' ? 2 : 1,
      technical_errors: cart.abandonment_reason === 'TECHNICAL' ? 1 : 0,
      coupon_views: cart.abandonment_reason === 'PRICE' ? 3 : 0,
      time_on_checkout_min: cart.abandonment_reason === 'HESITATION' ? 8.5 : 3.5,
      device: cart.device || 'Mobile',
      payment_method: cart.payment_method || 'UPI'
    };
    setFormData(newForm);
    runAIAnalysis(newForm);
  };

  const runAIAnalysis = async (dataToAnalyze = formData) => {
    try {
      setAnalyzing(true);
      setSimResult(null);
      setSimStep(0);
      const res = await apiService.recommendAction(dataToAnalyze);
      setAiResult(res);
    } catch (err) {
      console.error("AI Analysis error:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleExecuteRecovery = async () => {
    if (!aiResult) return;
    try {
      setSimulating(true);
      setSimStep(1); // 1. Sending
      await new Promise(r => setTimeout(r, 600));
      setSimStep(2); // 2. Customer Opened
      await new Promise(r => setTimeout(r, 600));
      setSimStep(3); // 3. Cart Resumed
      await new Promise(r => setTimeout(r, 700));
      setSimStep(4); // 4. Converted

      const payload = {
        action: aiResult.decision.recommended_action,
        channel: aiResult.decision.channel,
        discount_cost: aiResult.decision.action_comparison_matrix.find(
          x => x.action === aiResult.decision.recommended_action
        )?.discount_cost || 0
      };

      const targetId = selectedCartId || 'AC_1000001';
      const result = await apiService.executeIntervention(targetId, payload);
      setSimResult(result);
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setSimulating(false);
    }
  };

  const formatCurrency = (val) => {
    if (!val && val !== 0) return '₹0';
    return `₹${Number(val).toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-lg border border-signal/30 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-signal/10 border border-signal/30 text-signal text-xs font-semibold mb-2">
              <Cpu className="h-3.5 w-3.5" />
              Autonomous Decision Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
              Predict, explain, decide
            </h1>
            <p className="text-fg-dim text-sm mt-1 max-w-2xl">
              Inspect any customer session, diagnose drop-off telemetry with quantifiable evidence, review explainable AI factor weights, and optimize net profit via Next Best Action.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => runAIAnalysis()}
              disabled={analyzing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-sm bg-signal hover:bg-signal/85 text-fg font-semibold text-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${analyzing ? 'animate-spin' : ''}`} />
              <span>Run AI Evaluation</span>
            </button>
          </div>
        </div>

        {/* Quick Candidate Picker */}
        <div className="mt-6 pt-5 border-t border-line">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-fg-dim">
              Quick Pick Live Abandoned Carts:
            </span>
            <span className="text-[11px] text-signal font-medium">Click to load telemetry</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {candidates.map((c) => (
              <button
                key={c.abandoned_cart_id}
                onClick={() => handleSelectCandidate(c)}
                className={`p-2.5 rounded-sm text-left border text-xs transition-all cursor-pointer ${
                  selectedCartId === c.abandoned_cart_id
                    ? 'bg-signal/30 border-signal/40 text-fg'
                    : 'bg-surface border-line text-fg-dim hover:border-line hover:bg-raise/50' }`}
              >
                <div className="font-bold text-fg">{formatCurrency(c.cart_value)}</div>
                <div className="text-[10px] text-fg-dim truncate mt-0.5">{c.customer_segment} • {c.abandonment_reason}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Session Telemetry Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface border border-line rounded-lg p-6 space-y-5">
            <h2 className="text-base font-bold text-fg tracking-tight flex items-center justify-between">
              <span>Checkout Telemetry</span>
              <span className="text-xs font-normal text-fg-dim">Input Signals</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-fg-dim font-medium mb-1.5">Cart Order Value (₹)</label>
                <input 
                  type="number"
                  value={formData.cart_value}
                  onChange={(e) => setFormData({ ...formData, cart_value: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-sm bg-sunken border border-line text-fg focus:outline-none focus:border-signal/40 font-semibold"
                />
              </div>

              <div>
                <label className="block text-fg-dim font-medium mb-1.5">Shipping Cost (₹)</label>
                <input 
                  type="number"
                  value={formData.shipping_cost}
                  onChange={(e) => setFormData({ ...formData, shipping_cost: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-sm bg-sunken border border-line text-fg focus:outline-none focus:border-signal/40"
                />
                <span className="text-[10px] text-fg-mute mt-1 block">
                  Shipping Ratio: {((formData.shipping_cost / Math.max(formData.cart_value, 1)) * 100).toFixed(1)}% of cart
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-fg-dim font-medium mb-1.5">Segment</label>
                  <select 
                    value={formData.customer_segment}
                    onChange={(e) => setFormData({ ...formData, customer_segment: e.target.value })}
                    className="w-full px-3 py-2 rounded-sm bg-sunken border border-line text-fg focus:outline-none focus:border-signal/40"
                  >
                    <option value="VIP">VIP</option>
                    <option value="Regular">Regular</option>
                    <option value="Occasional">Occasional</option>
                    <option value="New">New</option>
                  </select>
                </div>
                <div>
                  <label className="block text-fg-dim font-medium mb-1.5">Prior Orders</label>
                  <input 
                    type="number"
                    value={formData.previous_orders}
                    onChange={(e) => setFormData({ ...formData, previous_orders: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-sm bg-sunken border border-line text-fg focus:outline-none focus:border-signal/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-fg-dim font-medium mb-1.5">Payment Declined?</label>
                  <select 
                    value={formData.payment_failed ? "yes" : "no"}
                    onChange={(e) => setFormData({ ...formData, payment_failed: e.target.value === "yes" })}
                    className="w-full px-3 py-2 rounded-sm bg-sunken border border-line text-fg focus:outline-none focus:border-signal/40 font-semibold"
                  >
                    <option value="no">No Decline</option>
                    <option value="yes">Declined (Fail)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-fg-dim font-medium mb-1.5">Technical Errors</label>
                  <input 
                    type="number"
                    value={formData.technical_errors}
                    onChange={(e) => setFormData({ ...formData, technical_errors: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-sm bg-sunken border border-line text-fg focus:outline-none focus:border-signal/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-fg-dim font-medium mb-1.5">Coupon Searches</label>
                  <input 
                    type="number"
                    value={formData.coupon_views}
                    onChange={(e) => setFormData({ ...formData, coupon_views: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-sm bg-sunken border border-line text-fg focus:outline-none focus:border-signal/40"
                  />
                </div>
                <div>
                  <label className="block text-fg-dim font-medium mb-1.5">Checkout Dwell (min)</label>
                  <input 
                    type="number"
                    step="0.5"
                    value={formData.time_on_checkout_min}
                    onChange={(e) => setFormData({ ...formData, time_on_checkout_min: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-sm bg-sunken border border-line text-fg focus:outline-none focus:border-signal/40"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => runAIAnalysis()}
              className="w-full py-2.5 rounded-sm bg-signal hover:bg-signal text-fg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Re-evaluate Signals
            </button>
          </div>
        </div>

        {/* Right Column: AI Insights & Recommendation (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {aiResult ? (
            <>
              {/* 3 Diagnosis & Prediction Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Abandonment Risk */}
                <div className="bg-surface border border-line rounded-lg p-5">
                  <div className="text-xs text-fg-dim font-semibold uppercase tracking-wider flex items-center justify-between">
                    <span>1. Abandonment Risk</span>
                    <AlertTriangle className="h-4 w-4 text-loss" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-semibold text-loss">
                      {aiResult.abandonment_risk?.percentage || '88.0%'}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-loss/10 text-loss border border-loss/20">
                      {aiResult.abandonment_risk?.risk_tier || 'HIGH'}
                    </span>
                  </div>
                  <p className="text-[11px] text-fg-dim mt-2">
                    Model 1 predicts high drop-off probability before session completion.
                  </p>
                </div>

                {/* 2. Diagnosed Reason + Evidence */}
                <div className="bg-surface border border-line rounded-lg p-5">
                  <div className="text-xs text-fg-dim font-semibold uppercase tracking-wider flex items-center justify-between">
                    <span>2. Diagnosed Reason</span>
                    <ShieldCheck className="h-4 w-4 text-signal" />
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-semibold text-fg">
                      {aiResult.reason_diagnosis?.primary_reason || aiResult.diagnosis?.primary_reason || 'SHIPPING'}
                    </span>
                    <span className="text-[11px] text-fg-dim block mt-0.5">
                      Confidence: {(((aiResult.reason_diagnosis?.confidence || aiResult.diagnosis?.confidence || 0.94)) * 100).toFixed(0)}%
                    </span>
                  </div>
                  {/* Evidence Signals */}
                  <div className="mt-2 space-y-1">
                    {(aiResult.reason_diagnosis?.evidence || aiResult.diagnosis?.evidence)?.slice(0, 2).map((ev, idx) => (
                      <div key={idx} className="text-[10px] text-signal bg-signal/10 px-2 py-0.5 rounded border border-signal/20 truncate">
                        • {ev}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Recovery Probability */}
                <div className="bg-surface border border-line rounded-lg p-5">
                  <div className="text-xs text-fg-dim font-semibold uppercase tracking-wider flex items-center justify-between">
                    <span>3. Recovery Elasticity</span>
                    <TrendingUp className="h-4 w-4 text-caught" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-semibold text-caught">
                      {aiResult.recovery_prediction?.percentage || '76.0%'}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-caught/10 text-caught border border-caught/20">
                      High Receptivity
                    </span>
                  </div>
                  <p className="text-[11px] text-fg-dim mt-2">
                    Calibrated likelihood to return with targeted intervention.
                  </p>
                </div>
              </div>

              {/* Explainable AI (XAI) Attribution Breakdown */}
              <div className="bg-surface border border-line rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-fg tracking-tight flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-signal" />
                    Explainable AI (XAI): Why was this recovery probability predicted?
                  </h3>
                  <span className="text-[11px] font-semibold text-fg-dim">Predict → Explain → Decide</span>
                </div>
                <p className="text-xs text-fg-dim mb-4 bg-sunken p-3 rounded-sm border border-line">
                  {aiResult.explainable_ai?.summary || 'Shipping friction is the dominant dropoff signal.'}
                </p>

                {/* Factor Contribution Weights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Positive Drivers */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-caught uppercase tracking-wider">
                      [+] Positive Conversion Drivers
                    </span>
                    {aiResult.explainable_ai?.positive_drivers?.map((factor, idx) => (
                      <div key={idx} className="bg-sunken/60 p-2.5 rounded-sm border border-line text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-fg">{typeof factor === 'string' ? factor : factor?.feature}</span>
                          {factor?.weight !== undefined && <span className="text-caught font-bold">+{factor.weight}%</span>}
                        </div>
                        {factor?.description && <p className="text-[10px] text-fg-dim mt-1">{factor.description}</p>}
                      </div>
                    ))}
                  </div>

                  {/* Dragging Factors */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-loss uppercase tracking-wider">
                      [-] Negative Risk Drag Factors
                    </span>
                    {aiResult.explainable_ai?.negative_drivers?.length > 0 ? (
                      aiResult.explainable_ai.negative_drivers.map((factor, idx) => (
                        <div key={idx} className="bg-sunken/60 p-2.5 rounded-sm border border-line text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-fg">{typeof factor === 'string' ? factor : factor?.feature}</span>
                            {factor?.weight !== undefined && <span className="text-loss font-bold">{factor.weight}%</span>}
                          </div>
                          {factor?.description && <p className="text-[10px] text-fg-dim mt-1">{factor.description}</p>}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 rounded-sm bg-sunken/40 text-fg-mute text-xs italic">
                        No major negative friction factors detected in this session.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Recommendation: The Next Best Action */}
              <div className="relative overflow-hidden rounded-lg 950 border-2 border-signal/40/50 p-6 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-signal/15 border border-signal/30 text-signal text-xs font-bold mb-3">
                      <Zap className="h-3.5 w-3.5 text-signal" />
                      OPTIMAL ECONOMIC ACTION
                    </div>
                    <div className="flex flex-wrap items-baseline gap-3">
                      <h3 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
                        {(aiResult.decision?.recommended_action || aiResult.decision?.action || 'FREE_SHIPPING').replace('_', ' ')}
                      </h3>
                      <span className="px-3 py-1 rounded-lg bg-caught/15 text-caught border border-caught/30 text-xs font-bold">
                        via {aiResult.decision?.channel || 'WHATSAPP'}
                      </span>
                    </div>
                    <p className="text-fg-dim text-xs mt-2 max-w-xl">
                      {aiResult.decision?.economic_rationale}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-fg-dim mt-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-signal" /> {aiResult.decision?.timing || 'Immediate'}
                      </span>
                      <span>•</span>
                      <span>Expected Conv: <strong className="text-fg">{aiResult.decision?.expected_conversion_pct || '76.0%'}</strong></span>
                    </div>
                  </div>

                  {/* Financial Payoff Summary Card */}
                  <div className="bg-sunken/80 p-5 rounded-lg border border-signal/30 text-right min-w-[220px]">
                    <div className="text-[11px] text-fg-dim font-semibold uppercase tracking-wider">
                      Expected Net Profit
                    </div>
                    <div className="text-2xl font-semibold text-caught mt-1">
                      {formatCurrency(aiResult.decision?.expected_profit)}
                    </div>
                    <div className="text-[11px] text-fg-dim mt-1.5">
                      Revenue: <span className="text-fg font-semibold">{formatCurrency(aiResult.decision?.expected_revenue)}</span>
                    </div>
                    <div className="text-[11px] text-fg-dim">
                      Recovery Cost: <span className="text-fg font-semibold">{formatCurrency(aiResult.decision?.expected_cost || aiResult.decision?.action_cost)}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-line text-xs font-bold text-warn">
                      ROI: {aiResult.decision?.roi_pct}%
                    </div>
                  </div>
                </div>

                {/* Execution CTA Button & Simulation Trigger */}
                <div className="mt-6 pt-6 border-t border-signal/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-fg-dim">
                    Execute simulated intervention to transition state machine and record conversion.
                  </span>

                  <button
                    onClick={handleExecuteRecovery}
                    disabled={simulating}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg 500 500 hover:400 hover: text-ink font-semibold text-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    <span>{simulating ? 'Simulating Conversion...' : 'EXECUTE RECOVERY INTERVENTION'}</span>
                  </button>
                </div>

                {/* Simulation Step-by-Step Visualizer */}
                {(simulating || simResult) && (
                  <div className="mt-6 p-5 rounded-lg bg-sunken border border-line space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-fg-dim">
                      Simulated Recovery Lifecycle
                    </span>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className={`p-2 rounded-sm border ${simStep >= 1 ? 'bg-signal/20 border-signal/40 text-signal font-bold' : 'bg-surface border-line text-fg-mute'}`}>
                        1. Dispatched ({aiResult.decision?.channel || 'WHATSAPP'})
                      </div>
                      <div className={`p-2 rounded-sm border ${simStep >= 2 ? 'bg-signal/20 border-signal/40 text-signal font-bold' : 'bg-surface border-line text-fg-mute'}`}>
                        2. Opened Link
                      </div>
                      <div className={`p-2 rounded-sm border ${simStep >= 3 ? 'bg-signal/20 border-signal/40 text-signal font-bold' : 'bg-surface border-line text-fg-mute'}`}>
                        3. Checkout Resumed
                      </div>
                      <div className={`p-2 rounded-sm border ${simStep >= 4 ? 'bg-caught/15 border-caught/40 text-caught font-bold' : 'bg-surface border-line text-fg-mute'}`}>
                        4. Converted & Paid
                      </div>
                    </div>

                    {simResult && (
                      <div className="mt-3 p-3 rounded-sm bg-caught/10 border border-caught/30 text-xs text-caught flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-caught" />
                          <span>{simResult.message}</span>
                        </div>
                        <span className="font-bold text-fg">
                          Order Value: {formatCurrency(simResult.order_value)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Side-by-Side Action Comparison Table */}
              <div className="bg-surface border border-line rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-fg tracking-tight">
                      Next Best Action: Transparent Alternative Comparison
                    </h3>
                    <p className="text-xs text-fg-dim mt-0.5">
                      The Decision Engine evaluates all possible actions and rejects sub-optimal or margin-eroding discounts.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-fg-dim uppercase tracking-wider border-b border-line pb-2">
                      <tr>
                        <th className="py-2.5 font-semibold">Action Option</th>
                        <th className="py-2.5 font-semibold">Channel</th>
                        <th className="py-2.5 font-semibold">Expected Conv.</th>
                        <th className="py-2.5 font-semibold">Discount Cost</th>
                        <th className="py-2.5 font-semibold">Expected Revenue</th>
                        <th className="py-2.5 font-semibold">Net Expected Profit</th>
                        <th className="py-2.5 font-semibold">ROI</th>
                        <th className="py-2.5 font-semibold">Decision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line-soft font-medium">
                      {aiResult.decision?.action_comparison_matrix?.map((opt) => {
                        const isWinner = opt.action === (aiResult.decision?.recommended_action || aiResult.decision?.action);
                        return (
                          <tr key={opt.action} className={isWinner ? 'bg-signal/5 font-bold' : 'hover:bg-raise/60'}>
                            <td className="py-3 text-fg flex items-center gap-2">
                              {isWinner && <Zap className="h-3.5 w-3.5 text-signal fill-indigo-400" />}
                              {opt.action.replace('_', ' ')}
                            </td>
                            <td className="py-3 text-fg-dim">{opt.channel}</td>
                            <td className="py-3 text-caught">{opt.expected_conversion_pct}</td>
                            <td className="py-3 text-fg-dim">{formatCurrency(opt.discount_cost)}</td>
                            <td className="py-3 text-fg-dim">{formatCurrency(opt.expected_revenue)}</td>
                            <td className={`py-3 ${opt.expected_profit > 0 ? 'text-caught' : 'text-loss'}`}>
                              {formatCurrency(opt.expected_profit)}
                            </td>
                            <td className="py-3 text-warn">{opt.roi_pct}%</td>
                            <td className="py-3">
                              {isWinner ? (
                                <span className="px-2 py-0.5 rounded-full bg-caught/15 text-caught border border-caught/30 text-[10px] uppercase tracking-wider font-semibold">
                                  Selected Winner
                                </span>
                              ) : (
                                <span className="text-[11px] text-fg-mute">Sub-optimal</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] rounded-lg bg-surface border border-line text-center p-8">
              <Cpu className="h-10 w-10 text-signal animate-pulse mb-3" />
              <h3 className="font-bold text-fg text-lg">Select a Customer Session</h3>
              <p className="text-fg-dim text-xs mt-1 max-w-sm">
                Choose one of the live abandoned carts above or customize telemetry to initiate the full AI recovery intelligence pipeline.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
