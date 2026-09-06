import axios from 'axios';
import { mockData } from './mockData.js';
import { evaluateNextBestAction } from './decisionEngine.js';

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Executes an API request with automatic fallback to mock data when offline or deployed on GitHub Pages.
 */
const safeFetch = async (request, fallback) => {
  try {
    const res = await request();
    return res.data;
  } catch (err) {
    if (fallback !== undefined) {
      return typeof fallback === 'function' ? fallback() : fallback;
    }
    if (err?.response?.status === 404) return null;
    throw err;
  }
};

export const apiService = {
  // System Health
  getHealth: async () => safeFetch(() => api.get('/health'), mockData.health),

  // Executive Dashboard
  getDashboardSummary: async () => safeFetch(() => api.get('/dashboard/summary'), mockData.dashboardSummary),
  getDashboardCharts: async () => safeFetch(() => api.get('/dashboard/charts'), mockData.dashboardCharts),

  // Pillar 1: Checkouts & Recovery Opportunities
  getAbandonedCheckouts: async (params = {}) => safeFetch(() => api.get('/checkouts/abandoned', { params }), mockData.abandonedCheckouts),
  getCheckoutDetail: async (checkoutId) => safeFetch(
    () => api.get(`/checkouts/${checkoutId}`),
    () => mockData.abandonedCheckouts.find((c) => c.checkout_id === checkoutId) || mockData.abandonedCheckouts[0]
  ),

  predictAbandonment: async (payload) => safeFetch(
    () => api.post('/predict/abandonment', payload),
    {
      abandonment_probability: 0.88,
      percentage: '88.0%',
      risk_tier: 'HIGH',
      top_signals: ['Shipping cost is 1.9% of high-ticket cart', 'Customer dropped at delivery step'],
    }
  ),

  predictRecovery: async (payload) => safeFetch(
    () => api.post('/predict/recovery', payload),
    {
      recovery_probability: 0.76,
      percentage: '76.0%',
      recommended_action: 'FREE_SHIPPING',
      channel: 'WHATSAPP',
      expected_profit: 26500.0,
      roi_pct: 1767.0,
    }
  ),

  predictReason: async (payload) => safeFetch(
    () => api.post('/predict/reason', payload),
    {
      predicted_reason: 'SHIPPING',
      confidence: 0.94,
      evidence: 'Shipping fee of ₹1,500 triggered immediate session abandonment at delivery step.',
    }
  ),

  recommendAction: async (payload) => {
    try {
      const [decisionRes, abandonRes] = await Promise.all([
        api.post('/decision/next-best-action', { ...payload, pillar: 'RECOVER' }),
        api.post('/predict/abandonment', payload).catch(() => null),
      ]);

      const d = decisionRes.data;
      const abandonProb = Number(abandonRes?.data?.abandonment_probability);
      const recoveryProb = Number(
        d.recovery_prediction?.recovery_probability ?? d.explainability?.recovery_probability
      );
      const asPct = (v) => (Number.isFinite(v) ? `${(v * 100).toFixed(1)}%` : '—');

      return {
        ...d,
        abandonment_risk: {
          probability: abandonProb,
          percentage: asPct(abandonProb),
          risk_tier: !Number.isFinite(abandonProb)
            ? 'UNKNOWN'
            : abandonProb >= 0.7
              ? 'HIGH'
              : abandonProb >= 0.4
                ? 'MEDIUM'
                : 'LOW',
        },
        reason_diagnosis: d.diagnosis,
        recovery_prediction: {
          ...d.recovery_prediction,
          percentage: d.explainability?.recovery_confidence_pct ?? asPct(recoveryProb),
        },
        explainable_ai: {
          summary:
            d.decision?.economic_rationale ||
            `The model puts recovery at ${asPct(recoveryProb)} for this cart.`,
          positive_drivers: d.explainability?.positive_drivers || [],
          negative_drivers: d.explainability?.drag_factors || [],
        },
      };
    } catch {
      return evaluateNextBestAction(payload);
    }
  },

  listInterventions: async (params = {}) => safeFetch(() => api.get('/interventions', { params }), mockData.abandonedCheckouts),
  executeIntervention: async (interventionId, payload) => safeFetch(
    () => api.post(`/interventions/${interventionId}/execute`, payload),
    { 
      success: true, 
      message: `Intervention (${(payload?.action || 'ACTION').replace('_', ' ')}) dispatched via ${payload?.channel || 'WHATSAPP'} — Customer converted!`, 
      status: 'CONVERTED',
      order_value: payload?.cart_value || 80000
    }
  ),

  // Pillar 2: Revenue Protection
  getProtectionOverview: async () => safeFetch(() => api.get('/protection/overview'), mockData.protectionOverview),
  getCarrierPerformance: async () => safeFetch(() => api.get('/protection/carriers'), mockData.protectionOverview.carriers),

  getReturnOverview: async () => safeFetch(
    () => api.get('/returns/overview'),
    {
      total_orders: 15000,
      total_returns: 1757,
      return_rate_pct: 11.71,
      return_loss_at_risk: 1250000.0,
      prevented_loss: 562500.0,
    }
  ),

  getReturnOrders: async (params = {}) => safeFetch(() => api.get('/returns/orders', { params }), mockData.returnOrders),
  predictReturnRisk: async (payload) => safeFetch(
    () => api.post('/returns/predict', payload),
    {
      return_probability: 0.82,
      risk_tier: 'HIGH',
      recommended_action: 'SIZING_CONSULTATION',
      expected_loss: 5075.0,
    }
  ),

  getRTOOverview: async () => safeFetch(
    () => api.get('/rto/overview'),
    {
      total_shipments: 15000,
      total_rto: 950,
      rto_rate_pct: 6.33,
      rto_loss_at_risk: 850000.0,
      prevented_loss: 442000.0,
    }
  ),

  getRTOShipments: async (params = {}) => safeFetch(() => api.get('/rto/shipments', { params }), mockData.rtoShipments),
  predictRTORisk: async (payload) => safeFetch(
    () => api.post('/rto/predict', payload),
    {
      rto_probability: 0.78,
      risk_tier: 'HIGH',
      recommended_action: 'WHATSAPP_ADDRESS_CONFIRM',
      expected_loss: 2973.50,
    }
  ),

  getFraudOverview: async () => safeFetch(
    () => api.get('/fraud/overview'),
    {
      active_fraud_alerts: 85,
      critical_alerts: 14,
      prevented_loss: 323000.0,
    }
  ),

  getFraudAlerts: async (params = {}) => safeFetch(() => api.get('/fraud/alerts', { params }), mockData.fraudAlerts),
  analyzeFraud: async (payload) => safeFetch(
    () => api.post('/fraud/analyze', payload),
    {
      fraud_score: 0.85,
      risk_level: 'CRITICAL',
      recommendation: 'ENHANCED_VERIFICATION',
      triggers: ['Card-testing velocity', 'Multiple BIN declines'],
    }
  ),

  // Pillar 3: Voice of Customer (Listen)
  getReviewInsights: async () => safeFetch(() => api.get('/reviews/insights'), mockData.reviewInsights),
  getReviewAspects: async () => safeFetch(() => api.get('/reviews/aspects'), mockData.reviewInsights.aspects),
  getSellerRecommendations: async () => safeFetch(() => api.get('/reviews/recommendations'), mockData.reviewInsights.suggestions),
  listReviews: async (params = {}) => safeFetch(
    () => api.get('/reviews/list', { params }),
    [
      {
        review_id: 'REV-1',
        customer_name: 'Rahul Sharma',
        text: 'Product accha hai but delivery bahut late thi',
        sentiment: 'MIXED',
        rating: 4,
        language: 'Hinglish',
        created_at: '2026-03-05',
      },
      {
        review_id: 'REV-2',
        customer_name: 'Kavita Iyer',
        text: 'Size bahut chhota nikla, exchange request daal di',
        sentiment: 'NEGATIVE',
        rating: 2,
        language: 'Hinglish',
        created_at: '2026-03-04',
      },
    ]
  ),

  analyzeReviewText: async (payload) => safeFetch(
    () => api.post('/reviews/analyze', payload),
    {
      text: payload?.text || '',
      sentiment: payload?.text?.toLowerCase().includes('accha') ? 'POSITIVE' : 'NEGATIVE',
      aspects: {
        Delivery: -0.8,
        'Product Quality': 0.6,
      },
      recommendation: 'Escalate carrier delivery SLA in current region.',
    }
  ),

  bulkAnalyzeReviews: async (formData) => safeFetch(
    () => api.post('/reviews/bulk-analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    { processed: 250, positive: 160, negative: 65, neutral: 25 }
  ),

  // Customer Intelligence & Customer 360
  getCustomers: async (params = {}) => safeFetch(
    () => api.get('/customers', { params }),
    () => {
      let list = mockData.customersList || [mockData.customer360];
      if (params?.segment) {
        list = list.filter((c) => (c.customer_segment || c.segment || '').toLowerCase() === params.segment.toLowerCase());
      }
      if (params?.search) {
        const q = params.search.toLowerCase().trim();
        list = list.filter((c) =>
          (c.customer_id || '').toLowerCase().includes(q) ||
          (c.name || '').toLowerCase().includes(q) ||
          (c.customer_segment || c.segment || '').toLowerCase().includes(q) ||
          (c.location || '').toLowerCase().includes(q) ||
          (c.email || '').toLowerCase().includes(q)
        );
      }
      if (params?.limit) {
        list = list.slice(0, params.limit);
      }
      return list;
    }
  ),
  getCustomerProfile: async (customerId) => safeFetch(
    () => api.get(`/customers/${customerId}`),
    () => (mockData.getCustomer360Data ? mockData.getCustomer360Data(customerId) : mockData.customer360)
  ),
  getCustomer360: async (customerId) => safeFetch(
    () => api.get(`/customer/${customerId}`),
    () => (mockData.getCustomer360Data ? mockData.getCustomer360Data(customerId) : mockData.customer360)
  ),

  // Unified Decision Engine (Next Best Action)
  getNextBestAction: async (payload) => safeFetch(() => api.post('/decision/next-best-action', payload), mockData.demoScenarios[0]),

  // Dual Revenue Simulator
  calculateSimulator: async (payload) => safeFetch(
    () => api.post('/simulator/calculate', payload),
    {
      baseline_profit: 21045000.0,
      simulated_profit: 28450000.0,
      net_gain: 7405000.0,
      return_reduction_savings: 850000.0,
      roi_pct: 1845.0,
    }
  ),

  evaluateSimulator: async (payload) => safeFetch(
    () => api.post('/simulator/calculate', payload),
    {
      baseline_profit: 21045000.0,
      simulated_profit: 28450000.0,
      net_gain: 7405000.0,
      return_reduction_savings: 850000.0,
      roi_pct: 1845.0,
    }
  ),

  // A/B Testing Benchmark
  getAbTesting: async () => safeFetch(
    () => api.get('/ab-testing/summary'),
    mockData.abTesting
  ),

  // Analytics & Risk Radar
  getAnalyticsTrends: async () => safeFetch(() => api.get('/analytics/trends'), mockData.dashboardCharts.timeline),
  getCategoryRisk: async () => safeFetch(
    () => api.get('/analytics/category-risk'),
    [
      { category: 'Apparel', return_rate: 28.5, loss: 450000 },
      { category: 'Footwear', return_rate: 21.2, loss: 310000 },
      { category: 'Electronics', return_rate: 6.2, loss: 210000 },
    ]
  ),

  // Demo Scenarios & Reset
  getDemoScenarios: async () => safeFetch(() => api.get('/demo/scenarios'), mockData.demoScenarios),
  resetDemo: async () => safeFetch(() => api.post('/demo/reset'), { success: true, message: 'Demo state reset successfully' }),

  // Model Monitoring & Status
  getModelStatus: async () => safeFetch(() => api.get('/models/status'), mockData.modelsStatus),
  getModelMetrics: async () => safeFetch(
    () => api.get('/models/metrics'),
    {
      abandonment_auc: 0.894,
      recovery_accuracy: 0.842,
      return_f1: 0.861,
      rto_auc: 0.887,
      fraud_f1: 0.948,
    }
  ),
};

export default apiService;
