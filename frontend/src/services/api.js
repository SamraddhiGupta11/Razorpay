import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * For endpoints the backend does not implement yet. A 404 here is expected,
 * so it resolves to null and the caller falls back to its own empty state
 * instead of throwing and blanking the view.
 */
const optional = async (request) => {
  try {
    const res = await request();
    return res.data;
  } catch (err) {
    if (err?.response?.status === 404) return null;
    throw err;
  }
};

export const apiService = {
  // System Health
  getHealth: async () => {
    const res = await api.get('/health');
    return res.data;
  },

  // Executive Dashboard
  getDashboardSummary: async () => {
    const res = await api.get('/dashboard/summary');
    return res.data;
  },

  getDashboardCharts: async () => {
    const res = await api.get('/dashboard/charts');
    return res.data;
  },

  // Pillar 1: Checkouts & Recovery Opportunities
  getAbandonedCheckouts: async (params = {}) => {
    const res = await api.get('/checkouts/abandoned', { params });
    return res.data;
  },

  getCheckoutDetail: async (checkoutId) => {
    const res = await api.get(`/checkouts/${checkoutId}`);
    return res.data;
  },

  predictAbandonment: async (payload) => {
    const res = await api.post('/predict/abandonment', payload);
    return res.data;
  },

  predictRecovery: async (payload) => {
    const res = await api.post('/predict/recovery', payload);
    return res.data;
  },

  predictReason: async (payload) => {
    const res = await api.post('/predict/reason', payload);
    return res.data;
  },

  /**
   * Full recovery intelligence for one cart.
   *
   * This used to POST /recommend-action, which fails: that route calls
   * ml_service.full_recovery_intelligence(), a method the service does not
   * define, so it always raised and returned a 500. /decision/next-best-action
   * runs the same pipeline through a method that exists.
   *
   * That endpoint names its blocks differently from what the decision center
   * reads, and carries no abandonment risk, so the two calls are joined and
   * renamed here rather than spreading the mapping through the page.
   */
  recommendAction: async (payload) => {
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
        percentage:
          d.explainability?.recovery_confidence_pct ?? asPct(recoveryProb),
      },
      explainable_ai: {
        summary:
          d.decision?.economic_rationale ||
          `The model puts recovery at ${asPct(recoveryProb)} for this cart.`,
        positive_drivers: d.explainability?.positive_drivers || [],
        negative_drivers: d.explainability?.drag_factors || [],
      },
    };
  },

  listInterventions: async (params = {}) => {
    const res = await api.get('/interventions', { params });
    return res.data;
  },

  executeIntervention: async (interventionId, payload) => {
    const res = await api.post(`/interventions/${interventionId}/execute`, payload);
    return res.data;
  },

  // Pillar 2: Revenue Protection
  getProtectionOverview: async () => {
    const res = await api.get('/protection/overview');
    return res.data;
  },

  // Not implemented server-side yet; the protection view handles null.
  getCarrierPerformance: async () => optional(() => api.get('/protection/carriers')),

  getReturnOverview: async () => {
    const res = await api.get('/returns/overview');
    return res.data;
  },

  getReturnOrders: async (params = {}) => {
    const res = await api.get('/returns/orders', { params });
    return res.data;
  },

  predictReturnRisk: async (payload) => {
    const res = await api.post('/returns/predict', payload);
    return res.data;
  },

  getRTOOverview: async () => {
    const res = await api.get('/rto/overview');
    return res.data;
  },

  getRTOShipments: async (params = {}) => {
    const res = await api.get('/rto/shipments', { params });
    return res.data;
  },

  predictRTORisk: async (payload) => {
    const res = await api.post('/rto/predict', payload);
    return res.data;
  },

  getFraudOverview: async () => {
    const res = await api.get('/fraud/overview');
    return res.data;
  },

  getFraudAlerts: async (params = {}) => {
    const res = await api.get('/fraud/alerts', { params });
    return res.data;
  },

  analyzeFraud: async (payload) => {
    const res = await api.post('/fraud/analyze', payload);
    return res.data;
  },

  // Pillar 3: Voice of Customer (Listen)
  getReviewInsights: async () => {
    const res = await api.get('/reviews/insights');
    return res.data;
  },

  // Not implemented server-side yet; the voice-of-customer view handles null.
  getReviewAspects: async () => optional(() => api.get('/reviews/aspects')),

  getSellerRecommendations: async () => {
    const res = await api.get('/reviews/recommendations');
    return res.data;
  },

  listReviews: async (params = {}) => {
    const res = await api.get('/reviews/list', { params });
    return res.data;
  },

  analyzeReviewText: async (payload) => {
    const res = await api.post('/reviews/analyze', payload);
    return res.data;
  },

  bulkAnalyzeReviews: async (formData) => {
    const res = await api.post('/reviews/bulk-analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Customer Intelligence & Customer 360
  getCustomers: async (params = {}) => {
    const res = await api.get('/customers', { params });
    return res.data;
  },

  getCustomerProfile: async (customerId) => {
    const res = await api.get(`/customers/${customerId}`);
    return res.data;
  },

  getCustomer360: async (customerId) => {
    const res = await api.get(`/customer/${customerId}`);
    return res.data;
  },

  // Unified Decision Engine (Next Best Action)
  getNextBestAction: async (payload) => {
    const res = await api.post('/decision/next-best-action', payload);
    return res.data;
  },

  // Dual Revenue Simulator
  calculateSimulator: async (payload) => {
    const res = await api.post('/simulator/calculate', payload);
    return res.data;
  },

  evaluateSimulator: async (payload) => {
    const res = await api.post('/simulator/calculate', payload);
    return res.data;
  },

  // A/B testing benchmark. The page called this before it existed, so the
  // table rendered empty with the failure swallowed by a catch.
  getAbTesting: async () => {
    const res = await api.get('/ab-testing/summary');
    return res.data;
  },

  // Analytics & Risk Radar
  getAnalyticsTrends: async () => {
    const res = await api.get('/analytics/trends');
    return res.data;
  },

  getCategoryRisk: async () => {
    const res = await api.get('/analytics/category-risk');
    return res.data;
  },

  // Demo Scenarios & Reset
  getDemoScenarios: async () => {
    const res = await api.get('/demo/scenarios');
    return res.data;
  },

  resetDemo: async () => {
    const res = await api.post('/demo/reset');
    return res.data;
  },

  // Model Monitoring & Status
  getModelStatus: async () => {
    const res = await api.get('/models/status');
    return res.data;
  },

  getModelMetrics: async () => {
    const res = await api.get('/models/metrics');
    return res.data;
  },
};

export default apiService;
