// Client-side AI Reason & Decision Optimization Engine
// Mirrors backend/app/decision_engine/engine.py and ml/reason_engine.py

export function diagnoseAbandonmentReason(data) {
  const cartValue = Number(data.cart_value) || 1000;
  const shippingCost = Number(data.shipping_cost) || 0;
  const shippingRatio = shippingCost / Math.max(cartValue, 1);
  const paymentFailed = Boolean(data.payment_failed);
  const paymentAttempts = Number(data.payment_attempts) || 1;
  const technicalErrors = Number(data.technical_errors) || 0;
  const couponViews = Number(data.coupon_views) || 0;
  const timeOnCheckout = Number(data.time_on_checkout_min) || 2.0;
  const customerSegment = String(data.customer_segment || 'Regular');
  const explicitReason = data.abandonment_reason;

  const scores = {
    PAYMENT: 0.0,
    TECHNICAL: 0.0,
    SHIPPING: 0.0,
    PRICE: 0.0,
    HESITATION: 0.0,
    TRUST: 0.0,
  };
  const evidenceMap = {
    PAYMENT: [],
    TECHNICAL: [],
    SHIPPING: [],
    PRICE: [],
    HESITATION: [],
    TRUST: [],
  };

  // 1. Payment Friction
  if (paymentFailed) {
    scores.PAYMENT += 5.0;
    evidenceMap.PAYMENT.push("Payment gateway failure flagged during transaction attempt");
  }
  if (paymentAttempts >= 2) {
    scores.PAYMENT += paymentAttempts * 1.5;
    evidenceMap.PAYMENT.push(`Multiple payment attempts recorded: ${paymentAttempts} attempts`);
  }

  // 2. Technical Friction
  if (technicalErrors > 0) {
    scores.TECHNICAL += technicalErrors * 4.0;
    evidenceMap.TECHNICAL.push(`Client-side technical errors detected: ${technicalErrors} event(s)`);
  }

  // Explicit reason seed
  if (explicitReason && scores[explicitReason] !== undefined) {
    scores[explicitReason] += 6.0;
    evidenceMap[explicitReason].push(`Explicit session telemetry flags root cause: ${explicitReason}`);
  }

  // 3. Shipping Friction
  if (shippingCost >= 500) {
    scores.SHIPPING += 4.5;
    evidenceMap.SHIPPING.push(`High absolute delivery fee (₹${shippingCost.toLocaleString('en-IN')}) at checkout`);
  } else if (shippingRatio > 0.08) {
    scores.SHIPPING += 4.5;
    evidenceMap.SHIPPING.push(`High shipping-to-cart ratio: ${(shippingRatio * 100).toFixed(1)}% of order value`);
  } else if (shippingRatio > 0.03 || shippingCost > 149) {
    scores.SHIPPING += 3.0;
    evidenceMap.SHIPPING.push(`Delivery fee friction: ₹${shippingCost.toLocaleString('en-IN')} (${(shippingRatio * 100).toFixed(1)}% of cart)`);
  }

  // 4. Price Sensitivity
  if (couponViews >= 3) {
    scores.PRICE += 4.0;
    evidenceMap.PRICE.push(`Aggressive coupon code hunting: ${couponViews} coupon views`);
  } else if (couponViews >= 1) {
    scores.PRICE += 1.5;
    evidenceMap.PRICE.push(`Discount code exploration: ${couponViews} view(s)`);
  }
  if (cartValue > 30000 && (customerSegment === 'Occasional' || customerSegment === 'New')) {
    scores.PRICE += 2.0;
    evidenceMap.PRICE.push(`Large cart threshold (₹${cartValue.toLocaleString('en-IN')}) with no applied discount`);
  }

  // 5. Hesitation
  if (timeOnCheckout > 6.0 && !paymentFailed && technicalErrors === 0) {
    scores.HESITATION += 3.5;
    evidenceMap.HESITATION.push(`Extended checkout dwell time: ${timeOnCheckout.toFixed(1)} min with indecision`);
  }

  // 6. Trust
  if (customerSegment === 'New' && cartValue > 20000) {
    scores.TRUST += 2.5;
    evidenceMap.TRUST.push(`First-time buyer with high ticket cart (₹${cartValue.toLocaleString('en-IN')})`);
  }

  // Find winner
  let bestReason = 'SHIPPING';
  let bestScore = -1;
  for (const [r, s] of Object.entries(scores)) {
    if (s > bestScore) {
      bestScore = s;
      bestReason = r;
    }
  }

  const confidence = bestScore > 0 ? Math.min(0.65 + (bestScore / 20.0), 0.96) : 0.72;
  const evidence = evidenceMap[bestReason].length > 0
    ? evidenceMap[bestReason]
    : [`Friction telemetry points to ${bestReason.toLowerCase()} as primary barrier to purchase.`];

  return { primary_reason: bestReason, confidence, evidence };
}

export function evaluateNextBestAction(data) {
  const cartVal = Number(data.cart_value) || 2500;
  const shipCost = Number(data.shipping_cost) || 0;
  const segment = String(data.customer_segment || 'Regular');
  const grossMargin = 0.35;

  const diag = diagnoseAbandonmentReason(data);
  const reason = diag.primary_reason;

  // Base recovery likelihood
  let baseProb = segment === 'VIP' ? 0.65 : (segment === 'Regular' ? 0.50 : 0.38);
  if (data.is_returning) baseProb += 0.08;
  if (diag.confidence > 0.85) baseProb += 0.05;
  baseProb = Math.min(Math.max(baseProb, 0.25), 0.88);

  // Evaluate candidate actions
  const actions = [
    {
      action: 'FREE_SHIPPING',
      channel: cartVal > 3000 ? 'WHATSAPP' : 'EMAIL',
      channelCost: 1.5,
      discountCost: shipCost,
      convLift: reason === 'SHIPPING' ? 0.78 : 0.45,
      rationale: 'Waiving shipping fee removes checkout friction while preserving product gross margin.',
    },
    {
      action: 'PAYMENT_ASSISTANCE',
      channel: 'WHATSAPP',
      channelCost: 1.5,
      discountCost: 0,
      convLift: reason === 'PAYMENT' ? 0.82 : 0.30,
      rationale: 'Provides alternate UPI QR / card link to recover failed payment attempt with zero discount cost.',
    },
    {
      action: 'TECH_SUPPORT',
      channel: 'WHATSAPP',
      channelCost: 1.5,
      discountCost: 0,
      convLift: reason === 'TECHNICAL' ? 0.80 : 0.28,
      rationale: 'Dispatches instant support agent link to bypass address/validation error.',
    },
    {
      action: 'DISCOUNT_5',
      channel: segment === 'VIP' ? 'WHATSAPP' : 'SMS',
      channelCost: 0.8,
      discountCost: Math.round(cartVal * 0.05),
      convLift: reason === 'PRICE' ? 0.68 : 0.48,
      rationale: '5% incentive provides targeted price concession without severe margin erosion.',
    },
    {
      action: 'DISCOUNT_10',
      channel: 'SMS',
      channelCost: 0.8,
      discountCost: Math.round(cartVal * 0.10),
      convLift: reason === 'PRICE' ? 0.76 : 0.54,
      rationale: '10% discount captures price-sensitive shopper but sacrifices significant gross profit.',
    },
    {
      action: 'VIP_CONCIERGE',
      channel: 'WHATSAPP',
      channelCost: 5.0,
      discountCost: Math.min(Math.round(cartVal * 0.05), 1500),
      convLift: segment === 'VIP' ? 0.85 : 0.42,
      rationale: 'Dedicated VIP concierge outreach delivers high-touch white-glove closing experience.',
    },
    {
      action: 'NO_ACTION',
      channel: 'EMAIL',
      channelCost: 0.2,
      discountCost: 0,
      convLift: 0.08,
      rationale: 'Standard passive follow-up; leads to high permanent checkout drop-off.',
    },
  ];

  const evaluated = actions.map((act) => {
    const expectedRevenue = cartVal;
    const expectedProfit = Math.round((cartVal * act.convLift * grossMargin) - act.discountCost - act.channelCost);
    const totalCost = act.discountCost + act.channelCost;
    const roi = totalCost > 0 ? Math.round((expectedProfit / totalCost) * 100) : 0;

    return {
      action: act.action,
      channel: act.channel,
      expected_conversion_pct: `${(act.convLift * 100).toFixed(1)}%`,
      discount_cost: act.discountCost,
      expected_revenue: expectedRevenue,
      expected_profit: expectedProfit,
      roi_pct: Math.max(roi, 0),
      decision: '',
      rationale: act.rationale,
      convLift: act.convLift,
      totalCost,
    };
  });

  // Pick winner by highest net profit (filter out actions that don't match critical failure types)
  let eligible = evaluated;
  if (reason === 'PAYMENT') {
    eligible = evaluated.filter((x) => x.action === 'PAYMENT_ASSISTANCE' || x.action === 'NO_ACTION' || x.action.startsWith('DISCOUNT'));
  } else if (reason === 'TECHNICAL') {
    eligible = evaluated.filter((x) => x.action === 'TECH_SUPPORT' || x.action === 'NO_ACTION');
  }

  eligible.sort((a, b) => b.expected_profit - a.expected_profit);
  const winner = eligible[0] || evaluated[0];

  evaluated.forEach((opt) => {
    if (opt.action === winner.action) {
      opt.decision = 'OPTIMAL (SELECTED)';
    } else if (opt.expected_profit < 0) {
      opt.decision = 'REJECTED (Net Loss)';
    } else if (opt.discount_cost > winner.discount_cost) {
      opt.decision = 'REJECTED (Eats Margin)';
    } else {
      opt.decision = 'SUB-OPTIMAL';
    }
  });

  // Explainability weights
  const positiveDrivers = [];
  const negativeDrivers = [];

  if (segment === 'VIP') {
    positiveDrivers.push({ feature: 'VIP Segment Loyalty', weight: 26, description: 'High lifetime brand loyalty and repeat affinity' });
  } else if (data.is_returning) {
    positiveDrivers.push({ feature: 'Returning Customer Status', weight: 18, description: 'Customer has completed past orders without issue' });
  }

  if (cartVal >= 25000) {
    positiveDrivers.push({ feature: 'High Cart Intent', weight: 22, description: `Substantial basket size (₹${cartVal.toLocaleString('en-IN')}) indicates purchase intent` });
  }

  if (winner.convLift >= 0.75) {
    positiveDrivers.push({ feature: 'High Action Elasticity', weight: 20, description: `${winner.action.replace('_', ' ')} directly eliminates the primary friction barrier` });
  }

  if (data.payment_failed) {
    negativeDrivers.push({ feature: 'Payment Gateway Decline', weight: -30, description: 'Prior transaction failed at payment processing layer' });
  }
  if (data.technical_errors > 0) {
    negativeDrivers.push({ feature: 'DOM / Technical Errors', weight: -25, description: `${data.technical_errors} validation exceptions encountered` });
  }
  if (shipCost > 149) {
    negativeDrivers.push({ feature: 'Delivery Fee Friction', weight: -20, description: `₹${shipCost.toLocaleString('en-IN')} delivery charge caused drop-off` });
  }
  if (data.coupon_views >= 2) {
    negativeDrivers.push({ feature: 'Promo Code Hunting', weight: -15, description: `${data.coupon_views} voucher search attempts before abandonment` });
  }

  return {
    decision: {
      recommended_action: winner.action,
      action: winner.action,
      channel: winner.channel,
      expected_recovery_prob: winner.convLift,
      expected_conversion_pct: winner.expected_conversion_pct,
      timing: 'Immediate (< 15 mins)',
      expected_revenue: winner.expected_revenue,
      action_cost: winner.totalCost,
      expected_cost: winner.totalCost,
      expected_profit: winner.expected_profit,
      roi_pct: winner.roi_pct,
      economic_rationale: `${winner.rationale} Expected net profit ₹${winner.expected_profit.toLocaleString('en-IN')} (${winner.roi_pct}% ROI).`,
      action_comparison_matrix: evaluated,
    },
    reason_diagnosis: diag,
    diagnosis: diag,
    recovery_prediction: {
      recovery_probability: winner.convLift,
      percentage: winner.expected_conversion_pct,
    },
    abandonment_risk: {
      probability: Math.min(0.60 + (negativeDrivers.length * 0.12), 0.95),
      percentage: `${(Math.min(0.60 + (negativeDrivers.length * 0.12), 0.95) * 100).toFixed(1)}%`,
      risk_tier: negativeDrivers.length >= 2 ? 'HIGH' : 'MEDIUM',
    },
    explainable_ai: {
      summary: `${diag.primary_reason} friction is the primary abandonment driver. Prescribing ${winner.action.replace('_', ' ')} via ${winner.channel} achieves ${winner.expected_conversion_pct} conversion lift.`,
      positive_drivers: positiveDrivers,
      negative_drivers: negativeDrivers,
    },
  };
}
