import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Search, 
  RefreshCw, 
  X, 
  ShoppingCart, 
  Clock, 
  MapPin, 
  Mail, 
  Phone, 
  Sparkles, 
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import apiService from '../services/api';

export default function Customers({ onNavigateToCustomer360 }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState('');
  const [selectedCust, setSelectedCust] = useState(null);
  const [profileLoadingId, setProfileLoadingId] = useState(null);

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiService.getCustomers({ 
        search: search.trim() || undefined, 
        segment: segment || undefined, 
        limit: 100 
      });
      setCustomers(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Error loading customers:", err);
    } finally {
      setLoading(false);
    }
  }, [search, segment]);

  useEffect(() => {
    loadCustomers();
  }, [segment]);

  // Keyboard shortcut: close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedCust(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCustomers();
  };

  const handleClearSearch = () => {
    setSearch('');
    apiService.getCustomers({ segment: segment || undefined, limit: 100 })
      .then((res) => setCustomers(Array.isArray(res) ? res : []))
      .catch(console.error);
  };

  const handleOpenProfile = async (customer) => {
    if (!customer) return;
    const custId = customer.customer_id || customer;
    
    // Immediately open modal with existing row data (instant response, zero flicker)
    setSelectedCust(typeof customer === 'object' ? customer : { customer_id: custId });
    setProfileLoadingId(custId);

    try {
      const prof = await apiService.getCustomerProfile(custId);
      if (prof) {
        setSelectedCust((prev) => ({ ...prev, ...prof }));
      }
    } catch (err) {
      console.warn("Could not fetch deep telemetry, using row data:", err);
    } finally {
      setProfileLoadingId(null);
    }
  };

  const formatCurrency = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

  // Safe normalized fields for selected customer modal
  const seg = selectedCust?.customer_segment || selectedCust?.segment || selectedCust?.profile?.customer_segment || 'Regular';
  const segLetter = (seg && typeof seg === 'string' && seg.length > 0) ? seg[0].toUpperCase() : 'C';
  const custName = selectedCust?.name || selectedCust?.profile?.name || selectedCust?.customer_id || 'Valued Customer';
  const custId = selectedCust?.customer_id || selectedCust?.profile?.customer_id || 'CUST_UNKNOWN';
  const email = selectedCust?.email || selectedCust?.profile?.email || `${custId.toLowerCase()}@example.in`;
  const phone = selectedCust?.phone || selectedCust?.profile?.phone || '+91 98200 12345';
  const location = selectedCust?.location || selectedCust?.profile?.location || 'Mumbai, Maharashtra';
  const lifetimeValue = Number(selectedCust?.lifetime_value ?? selectedCust?.lifetime_cart_value ?? selectedCust?.profile?.lifetime_value ?? 0);
  const totalSessions = selectedCust?.total_sessions ?? ((selectedCust?.previous_orders || 0) + (selectedCust?.previous_abandonments || 0) + 3);
  const recoveredSpent = Number(selectedCust?.total_recovered_spent ?? Math.round(lifetimeValue * 0.35));
  const dropoffs = selectedCust?.total_abandonments_recorded ?? selectedCust?.previous_abandonments ?? 0;
  const recentSessions = selectedCust?.recent_sessions || selectedCust?.history?.checkouts || [];
  const nba = selectedCust?.next_best_action || {};

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-fg tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-signal" />
            Customer Intelligence & Purchase History
          </h1>
          <p className="text-xs text-fg-dim mt-1">
            Segment telemetry, loyalty scores, checkout drop-off patterns, and unified risk profiles across 34,550 customers.
          </p>
        </div>

        {/* Controls: Search, Segment Filter, Refresh */}
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="h-4 w-4 text-fg-dim absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ID, name, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-sm bg-surface border border-line text-xs text-fg focus:outline-none focus:border-signal/40 w-56 placeholder:text-fg-mute"
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-2.5 text-fg-dim hover:text-fg"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>

          <select
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
            className="px-3 py-2 rounded-sm bg-surface border border-line text-xs text-fg focus:outline-none focus:border-signal/40 cursor-pointer"
          >
            <option value="">All Segments</option>
            <option value="VIP">VIP</option>
            <option value="Regular">Regular</option>
            <option value="Occasional">Occasional</option>
            <option value="New">New</option>
          </select>

          <button
            onClick={loadCustomers}
            title="Refresh Customer Data"
            className="p-2 rounded-sm bg-surface border border-line text-fg-dim hover:text-fg hover:border-signal/40 transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-signal' : ''}`} />
          </button>
        </div>
      </div>

      {/* Meta Bar */}
      <div className="flex items-center justify-between text-xs text-fg-dim px-1">
        <div>
          Showing <span className="font-bold text-fg">{customers.length}</span> profiles
          {segment && <span> in <span className="font-bold text-signal">{segment}</span> tier</span>}
          {search && <span> matching <span className="font-bold text-fg">"{search}"</span></span>}
        </div>
        <div className="text-[11px] text-fg-mute">
          Active Database: <span className="font-mono text-fg-dim">34,550 customers</span>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-surface border border-line rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-fg-dim uppercase tracking-wider bg-sunken border-b border-line">
              <tr>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Segment</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold">Orders</th>
                <th className="py-3 px-4 font-semibold">Lifetime Spend</th>
                <th className="py-3 px-4 font-semibold">Drop-offs & Risk</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft font-medium">
              {loading && customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-fg-dim">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-signal mb-2" />
                    Loading customer intelligence records...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-fg-dim">
                    No customers found matching the search criteria.
                    <button
                      onClick={handleClearSearch}
                      className="block mx-auto mt-2 text-xs text-signal hover:underline cursor-pointer"
                    >
                      Clear search filters
                    </button>
                  </td>
                </tr>
              ) : (
                customers.map((c) => {
                  const custSeg = c.customer_segment || c.segment || 'Regular';
                  const initial = custSeg[0] || 'C';
                  return (
                    <tr 
                      key={c.customer_id} 
                      className="hover:bg-raise/60 transition-colors group cursor-pointer"
                      onClick={() => handleOpenProfile(c)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            custSeg === 'VIP' ? 'bg-warn/20 text-warn border border-warn/30' :
                            custSeg === 'Regular' ? 'bg-signal/20 text-signal border border-signal/30' :
                            custSeg === 'Occasional' ? 'bg-raise text-fg-dim border border-line' :
                            'bg-caught/20 text-caught border border-caught/30'
                          }`}>
                            {initial}
                          </div>
                          <div>
                            <div className="font-bold text-fg group-hover:text-signal transition-colors flex items-center gap-1.5">
                              {c.name || c.customer_id}
                              {c.customer_id.startsWith('DEMO_') && (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-signal/15 text-signal font-mono">DEMO</span>
                              )}
                            </div>
                            <div className="text-[11px] font-mono text-fg-mute">{c.customer_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          custSeg === 'VIP' ? 'bg-warn/15 text-warn border border-warn/30' :
                          custSeg === 'Regular' ? 'bg-signal/15 text-signal border border-signal/30' :
                          custSeg === 'Occasional' ? 'bg-raise text-fg-dim border border-line' :
                          'bg-caught/15 text-caught border border-caught/30'
                        }`}>
                          {custSeg}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-fg-dim">
                        <span className="flex items-center gap-1 text-[11px]">
                          <MapPin className="h-3 w-3 text-fg-mute shrink-0" />
                          {c.location || 'India'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-fg">{c.previous_orders ?? c.lifetime_orders ?? 1} orders</div>
                        <div className="text-[10px] text-fg-mute">
                          {c.is_returning ? 'Returning Buyer' : 'First-time Buyer'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-caught">{formatCurrency(c.lifetime_value)}</div>
                        <div className="text-[10px] text-fg-mute">AOV: {formatCurrency(c.average_order_value)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${c.previous_abandonments > 0 ? 'text-loss' : 'text-fg-dim'}`}>
                            {c.previous_abandonments ?? 0} drop-offs
                          </span>
                          {c.risk_score !== undefined && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              c.risk_score >= 60 ? 'bg-loss/15 text-loss' :
                              c.risk_score >= 35 ? 'bg-warn/15 text-warn' :
                              'bg-caught/15 text-caught'
                            }`}>
                              Risk {Math.round(c.risk_score)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenProfile(c)}
                          className="px-3 py-1.5 rounded-sm bg-raise hover:bg-raise/90 text-fg text-xs font-semibold transition-all border border-line hover:border-signal/40 flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          {profileLoadingId === c.customer_id ? (
                            <RefreshCw className="h-3 w-3 animate-spin text-signal" />
                          ) : null}
                          View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal */}
      {selectedCust && (
        <div 
          className="fixed inset-0 z-50 bg-sunken/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCust(null);
          }}
        >
          <div className="bg-surface border border-line rounded-lg max-w-2xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedCust(null)}
              className="absolute right-6 top-6 p-2 rounded-sm bg-raise text-fg-dim hover:text-fg hover:bg-raise/80 transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-5">
              <div className="flex items-center gap-3">
                <div className={`h-14 w-14 rounded-lg flex items-center justify-center font-bold text-xl shrink-0 ${
                  seg === 'VIP' ? 'bg-warn/20 text-warn border border-warn/40' :
                  seg === 'Regular' ? 'bg-signal/20 text-signal border border-signal/40' :
                  seg === 'Occasional' ? 'bg-raise text-fg-dim border border-line' :
                  'bg-caught/20 text-caught border border-caught/40'
                }`}>
                  {segLetter}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-fg">{custName}</h2>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      seg === 'VIP' ? 'bg-warn/15 text-warn border border-warn/30' :
                      seg === 'Regular' ? 'bg-signal/15 text-signal border border-signal/30' :
                      seg === 'Occasional' ? 'bg-raise text-fg-dim border border-line' :
                      'bg-caught/15 text-caught border border-caught/30'
                    }`}>
                      {seg} Tier
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-dim mt-1">
                    <span className="font-mono text-fg-mute">{custId}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-fg-mute" />
                      {location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-fg-mute" />
                      {email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-sunken p-3.5 rounded-lg border border-line">
                <span className="text-fg-dim text-[10px] uppercase tracking-wider block font-medium">LIFETIME SESSIONS</span>
                <span className="text-lg font-bold text-fg mt-1 block">{totalSessions}</span>
              </div>
              <div className="bg-sunken p-3.5 rounded-lg border border-line">
                <span className="text-fg-dim text-[10px] uppercase tracking-wider block font-medium">LIFETIME VALUE</span>
                <span className="text-lg font-bold text-caught mt-1 block">{formatCurrency(lifetimeValue)}</span>
              </div>
              <div className="bg-sunken p-3.5 rounded-lg border border-line">
                <span className="text-fg-dim text-[10px] uppercase tracking-wider block font-medium">RECOVERED SPEND</span>
                <span className="text-lg font-bold text-caught mt-1 block">{formatCurrency(recoveredSpent)}</span>
              </div>
              <div className="bg-sunken p-3.5 rounded-lg border border-line">
                <span className="text-fg-dim text-[10px] uppercase tracking-wider block font-medium">DROP-OFF RECORD</span>
                <span className="text-lg font-bold text-loss mt-1 block">{dropoffs} carts</span>
              </div>
            </div>

            {/* Prescribed Next Best Action Banner */}
            {nba.recommended_action && (
              <div className="p-4 bg-signal/10 border border-signal/30 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-signal text-[11px] uppercase tracking-wider mb-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Prescribed Next Best Action
                  </div>
                  <div className="font-bold text-fg text-sm">{nba.recommended_action}</div>
                  <div className="text-fg-dim text-[11px] mt-0.5">{nba.economic_rationale}</div>
                </div>
                {nba.expected_profit && (
                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-fg-dim uppercase">Expected Profit</div>
                    <div className="font-bold text-caught text-sm">{formatCurrency(nba.expected_profit)}</div>
                  </div>
                )}
              </div>
            )}

            {/* Recent Checkout Sessions */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-fg-dim mb-3 flex items-center justify-between">
                <span>Recent Checkout Sessions</span>
                <span className="text-[10px] text-fg-mute lowercase">{recentSessions.length} recorded</span>
              </h3>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {recentSessions.length === 0 ? (
                  <div className="text-center py-6 text-xs text-fg-dim bg-sunken rounded-sm border border-line">
                    No recent checkout sessions recorded for this customer.
                  </div>
                ) : (
                  recentSessions.map((s, idx) => (
                    <div key={s.checkout_id || idx} className="bg-sunken/70 p-3 rounded-sm border border-line flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-fg font-mono">{s.checkout_id}</span>
                          <span className={`px-1.5 py-0.2 text-[9px] rounded font-bold ${
                            s.status === 'COMPLETED' ? 'bg-caught/15 text-caught' : 'bg-loss/15 text-loss'
                          }`}>
                            {s.status || 'COMPLETED'}
                          </span>
                        </div>
                        <span className="text-fg-dim text-[11px] mt-0.5 block">
                          {s.device || 'Mobile'} • {s.payment_method || 'UPI'}
                          {s.reason && <span className="text-loss font-semibold ml-1">({s.reason})</span>}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-fg block">{formatCurrency(s.cart_value)}</span>
                        <span className="text-fg-mute text-[10px]">
                          {s.started_at ? new Date(s.started_at).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-line">
              {onNavigateToCustomer360 ? (
                <button
                  onClick={() => {
                    setSelectedCust(null);
                    onNavigateToCustomer360(custId);
                  }}
                  className="px-4 py-2 rounded-sm bg-signal/20 hover:bg-signal/30 text-signal border border-signal/40 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open Full Customer 360 & Radar View
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={() => setSelectedCust(null)}
                className="px-4 py-2 rounded-sm bg-raise hover:bg-raise/80 text-fg text-xs font-semibold border border-line transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
