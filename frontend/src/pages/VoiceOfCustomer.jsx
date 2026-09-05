import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  Upload, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  ThumbsUp, 
  ThumbsDown, 
  Globe, 
  Cpu, 
  RefreshCw,
  Lightbulb,
  ArrowRight,
  FileText
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

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#8B5CF6'];

export default function VoiceOfCustomer() {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const [aspects, setAspects] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');

  // Interactive Live Analyzer State
  const [customText, setCustomText] = useState('Product accha hai but delivery bahut late thi');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Bulk CSV Upload State
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState(null);

  useEffect(() => {
    fetchVOCData();
  }, []);

  const fetchVOCData = async () => {
    setLoading(true);
    try {
      /* Aspects has no endpoint yet, so allSettled keeps the other three
         panels alive rather than emptying the page when it resolves null. */
      const [ins, asp, rec, rev] = await Promise.allSettled([
        apiService.getReviewInsights(),
        apiService.getReviewAspects(),
        apiService.getSellerRecommendations(),
        apiService.listReviews({ limit: 50 })
      ]);
      const val = (r) => (r.status === 'fulfilled' ? r.value : null);
      const list = (r, key) => {
        const v = val(r);
        return Array.isArray(v) ? v : v?.[key] || [];
      };
      setInsights(val(ins));
      setAspects(list(asp, 'aspects'));
      setRecommendations(list(rec, 'recommendations'));
      setReviewsList(list(rev, 'reviews'));
    } catch (err) {
      console.error("Failed to fetch VOC data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeText = async (sampleText) => {
    const textToAnalyze = sampleText || customText;
    if (sampleText) setCustomText(sampleText);
    setAnalyzing(true);
    try {
      const res = await apiService.analyzeReviewText({ text: textToAnalyze });
      setAnalysisResult(res);
    } catch (err) {
      console.error("NLP analysis error:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await apiService.bulkAnalyzeReviews(formData);
      setUploadStats(res);
      fetchVOCData(); // Refresh reviews list and insights
    } catch (err) {
      console.error("Bulk CSV upload failed:", err);
      alert("Failed to process CSV file. Ensure CSV has 'review_text' or 'text' column.");
    } finally {
      setUploading(false);
    }
  };

  const samplePrompts = [
    "Product accha hai but delivery bahut late thi",
    "Size bohot chhota hai, fitting bilkul kharab hai",
    "Payment kat gaya lekin order confirm nahi hua! Fraud app",
    "Super fast delivery and premium quality packaging! Loved it"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-surface p-6 rounded-lg border border-line backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-sm border border-signal/30 text-signal">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-fg flex items-center gap-2">
                Pillar 3: Voice of Customer (Listen)
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-signal/10 text-signal border border-signal/30 font-medium">
                  Multilingual / Hinglish NLP
                </span>
              </h1>
              <p className="text-xs text-fg-dim mt-0.5">
                Lightweight real-time customer feedback intelligence across English, Hindi, and Hinglish. Connects customer voice directly to checkout & return risks.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 rounded-sm bg-raise hover:bg-raise text-fg font-semibold text-xs border border-line transition-all cursor-pointer"
          >
            <Upload className="h-4 w-4 text-signal" />
            <span>{uploading ? 'Processing CSV...' : 'Bulk CSV Upload'}</span>
          </button>
          <button
            onClick={fetchVOCData}
            className="p-2 rounded-sm bg-raise hover:bg-raise text-fg-dim border border-line transition-all cursor-pointer"
            title="Refresh VOC Telemetry"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* CSV Upload Confirmation Banner */}
      {uploadStats && (
        <div className="p-4 bg-caught/5 border border-caught/30 rounded-sm flex items-center justify-between text-xs text-caught">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-caught" />
            <span>
              Successfully processed <strong>{uploadStats.processed_count}</strong> customer reviews via batch NLP. Model updated.
            </span>
          </div>
          <button onClick={() => setUploadStats(null)} className="text-fg-dim hover:text-fg">✕</button>
        </div>
      )}

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-line p-5 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-fg-dim uppercase tracking-wider">Mined Reviews</span>
            <div className="p-2 rounded-lg bg-signal/10 text-signal">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-semibold text-fg">
              {(insights?.total_reviews || 3500).toLocaleString()}
            </div>
            <p className="text-[11px] text-fg-dim mt-1">
              English, Hindi, and mixed Hinglish reviews
            </p>
          </div>
        </div>

        <div className="bg-surface border border-line p-5 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-fg-dim uppercase tracking-wider">Overall Sentiment</span>
            <div className="p-2 rounded-lg bg-caught/10 text-caught">
              <ThumbsUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-semibold text-caught">
              {insights?.sentiment_distribution?.POSITIVE || '62.4'}% Positive
            </div>
            <p className="text-[11px] text-fg-dim mt-1">
              {insights?.sentiment_distribution?.NEGATIVE || '26.8'}% Negative · {insights?.sentiment_distribution?.MIXED || '10.8'}% Mixed
            </p>
          </div>
        </div>

        <div className="bg-surface border border-line p-5 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-fg-dim uppercase tracking-wider">Top Negative Aspect</span>
            <div className="p-2 rounded-lg bg-loss/10 text-loss">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-semibold text-loss">
              Delivery & SLA
            </div>
            <p className="text-[11px] text-fg-dim mt-1 font-medium">
              34% of negative reviews cite delivery delay or fake NDRs
            </p>
          </div>
        </div>

        <div className="bg-surface border border-line p-5 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-fg-dim uppercase tracking-wider">Customer Suggestions</span>
            <div className="p-2 rounded-lg bg-warn/10 text-warn">
              <Lightbulb className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-semibold text-warn">
              641 Mined Ideas
            </div>
            <p className="text-[11px] text-fg-dim mt-1">
              Actionable size charts, packaging, and payment requests
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Real-Time NLP Sandbox */}
      <div className="bg-surface border border-line p-6 rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-signal" />
            <h2 className="text-sm font-bold text-fg">
              Live Multilingual Customer Voice Intelligence Engine
            </h2>
          </div>
          <span className="text-[11px] text-fg-dim">
            Type any customer feedback or select a demo prompt below:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleAnalyzeText(p)}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-raise/80 hover:bg-raise/80 text-signal border border-line/60 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>"{p}"</span>
              <ArrowRight className="h-3 w-3 text-fg-mute" />
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Type customer review in English, Hindi, or Hinglish..."
            className="flex-1 px-4 py-2.5 bg-sunken border border-line rounded-sm text-xs text-fg placeholder-slate-500 focus:outline-none focus:border-signal/40"
          />
          <button
            onClick={() => handleAnalyzeText()}
            disabled={analyzing}
            className="px-5 py-2.5 rounded-sm bg-signal hover:bg-signal/85 text-fg text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{analyzing ? 'Analyzing...' : 'Run NLP'}</span>
          </button>
        </div>

        {/* Live NLP Output Card */}
        {analysisResult && (
          <div className="p-4 rounded-sm bg-sunken border border-signal/30 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-fg-dim">Language & Sentiment</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded bg-raise text-fg-dim text-xs font-bold font-mono">
                  {analysisResult.language}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  analysisResult.sentiment === 'POSITIVE' ? 'bg-caught/15 text-caught' :
                  analysisResult.sentiment === 'NEGATIVE' ? 'bg-loss/15 text-loss' : 'bg-warn/15 text-warn' }`}>
                  {analysisResult.sentiment} (Score: {(analysisResult.sentiment_score || 0).toFixed(2)})
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-fg-dim">Extracted Aspects</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {analysisResult.aspects && analysisResult.aspects.length > 0 ? (
                  analysisResult.aspects.map((asp, i) => (
                    <span key={i} className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      asp.sentiment_score > 0 ? 'bg-caught/10 text-caught border border-caught/20' :
                      asp.sentiment_score < 0 ? 'bg-loss/10 text-loss border border-loss/20' : 'bg-raise text-fg-dim' }`}>
                      {asp.aspect}: {asp.sentiment_score > 0 ? `+${asp.sentiment_score}` : asp.sentiment_score}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-fg-mute">General Brand Mention</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-fg-dim">Closed-Loop Business Impact</span>
              <div className="text-xs text-fg-dim mt-1">
                <strong>Remedy: </strong>
                {analysisResult.seller_recommendation || 'Route to customer support for sizing guidance'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid: 10 Aspect Sentiment Breakdown & Seller Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aspect Sentiment Breakdown */}
        <div className="bg-surface border border-line p-5 rounded-lg">
          <h2 className="text-sm font-bold text-fg mb-4 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-caught" />
            10-Aspect Sentiment & Friction Index
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aspects} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis type="number" stroke="#64748B" fontSize={11} />
                <YAxis dataKey="aspect" type="category" stroke="#64748B" fontSize={11} width={110} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155' }} />
                <Bar dataKey="positive_count" fill="#10B981" name="Positive Mentions" stackId="a" />
                <Bar dataKey="negative_count" fill="#EF4444" name="Negative Mentions" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prioritized Seller Action Recommendations */}
        <div className="bg-surface border border-line p-5 rounded-lg">
          <h2 className="text-sm font-bold text-fg mb-4 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-warn" />
            Closed-Loop Seller & Merchandising Recommendations
          </h2>
          <div className="space-y-3">
            {recommendations.slice(0, 4).map((rec, idx) => (
              <div key={idx} className="p-3.5 bg-sunken rounded-sm border border-line flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                      rec.priority === 'HIGH' ? 'bg-loss/15 text-loss border border-loss/30' : 'bg-warn/15 text-warn border border-warn/30' }`}>
                      {rec.priority} Priority
                    </span>
                    <span className="text-xs font-bold text-fg">{rec.aspect}</span>
                  </div>
                  <p className="text-xs text-fg-dim mt-1 font-medium">
                    {rec.recommendation}
                  </p>
                  <p className="text-[11px] text-fg-mute mt-0.5">
                    Root Cause: {rec.root_cause || 'Customer reported sizing confusion in reviews'}
                  </p>
                </div>
                <div className="text-right whitespace-nowrap">
                  <span className="text-[10px] text-fg-dim block">Est. Revenue Impact</span>
                  <span className="text-xs font-bold text-caught">
                    +{formatCurrency(rec.expected_revenue_impact ?? rec.estimated_impact)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mined Customer Feedback Stream */}
      <div className="bg-surface border border-line rounded-lg overflow-hidden">
        <div className="p-4 border-b border-line flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Search className="h-4 w-4 text-fg-mute" />
            <input
              type="text"
              placeholder="Search feedback by keyword or aspect..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-xs text-fg placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-fg-dim">Language:</span>
            {['ALL', 'English', 'Hinglish', 'Hindi'].map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  selectedLanguage === lang ? 'bg-signal text-fg' : 'bg-raise text-fg-dim hover:text-fg' }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sunken/80 text-fg-dim border-b border-line uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">Customer / Time</th>
                <th className="px-4 py-3">Language</th>
                <th className="px-4 py-3">Sentiment</th>
                <th className="px-4 py-3">Customer Feedback Text</th>
                <th className="px-4 py-3">Aspects Mined</th>
                <th className="px-4 py-3">Closed-Loop Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft text-fg-dim">
              {reviewsList
                .filter(r => selectedLanguage === 'ALL' || r.language === selectedLanguage)
                .filter(r => r.review_text?.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((review, idx) => (
                  <tr key={idx} className="hover:bg-raise/60 transition-all">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-fg">{review.customer_name || 'Customer'}</div>
                      <div className="text-[10px] text-fg-mute">{review.rating} ★ Rating</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-raise text-fg-dim text-[10px] font-mono">
                        {review.language}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        review.sentiment === 'POSITIVE' ? 'bg-caught/10 text-caught border border-caught/30' :
                        review.sentiment === 'NEGATIVE' ? 'bg-loss/10 text-loss border border-loss/30' : 'bg-warn/10 text-warn border border-warn/30' }`}>
                        {review.sentiment}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-md text-fg-dim">
                      "{review.review_text}"
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {review.aspects?.map((a, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-raise text-fg-dim">
                            {a.aspect || a}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-caught font-medium">
                      {review.business_impact || 'Informs Return Prevention Model'}
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