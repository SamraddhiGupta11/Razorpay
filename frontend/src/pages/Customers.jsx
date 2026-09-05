import React, { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, X, ShoppingCart, Clock } from 'lucide-react';
import apiService from '../services/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState('');
  const [selectedCust, setSelectedCust] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await apiService.getCustomers({ search: search || undefined, segment: segment || undefined, limit: 50 });
      setCustomers(res);
    } catch (err) {
      console.error("Error loading customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [segment]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadCustomers();
  };

  const handleOpenProfile = async (custId) => {
    try {
      setProfileLoading(true);
      const prof = await apiService.getCustomerProfile(custId);
      setSelectedCust(prof);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  const formatCurrency = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-fg tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-signal" />
            Customer Intelligence & Purchase History
          </h1>
          <p className="text-xs text-fg-dim mt-1">
            Segment telemetry, loyalty scores, and individual checkout drop-off patterns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="h-4 w-4 text-fg-dim absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search customer ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-sm bg-surface border border-line text-xs text-fg focus:outline-none focus:border-signal/40 w-52"
            />
          </form>

          <select
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
            className="px-3 py-2 rounded-sm bg-surface border border-line text-xs text-fg-dim focus:outline-none"
          >
            <option value="">All Segments</option>
            <option value="VIP">VIP</option>
            <option value="Regular">Regular</option>
            <option value="Occasional">Occasional</option>
            <option value="New">New</option>
          </select>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-surface border border-line rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-fg-dim uppercase tracking-wider bg-sunken border-b border-line">
              <tr>
                <th className="py-3 px-4 font-semibold">Customer ID</th>
                <th className="py-3 px-4 font-semibold">Segment</th>
                <th className="py-3 px-4 font-semibold">Buyer Type</th>
                <th className="py-3 px-4 font-semibold">Completed Orders</th>
                <th className="py-3 px-4 font-semibold">Prior Abandonments</th>
                <th className="py-3 px-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft font-medium">
              {customers.map((c) => (
                <tr key={c.customer_id} className="hover:bg-raise/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-fg">{c.customer_id}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.customer_segment === 'VIP' ? 'bg-signal/15 text-signal' :
                      c.customer_segment === 'Regular' ? 'bg-signal/15 text-signal' :
                      c.customer_segment === 'Occasional' ? 'bg-raise text-fg-dim' :
                      'bg-caught/15 text-caught' }`}>
                      {c.customer_segment}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-fg-dim">
                    {c.is_returning ? 'Returning Customer' : 'First-Time Buyer'}
                  </td>
                  <td className="py-3 px-4 font-semibold text-caught">{c.previous_orders} orders</td>
                  <td className="py-3 px-4 font-semibold text-loss">{c.previous_abandonments} drop-offs</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenProfile(c.customer_id)}
                      className="px-3 py-1.5 rounded-sm bg-raise hover:bg-raise text-fg text-xs font-semibold transition-all cursor-pointer"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal */}
      {selectedCust && (
        <div className="fixed inset-0 z-50 bg-sunken/80 flex items-center justify-center p-4">
          <div className="bg-surface border border-line rounded-lg max-w-2xl w-full p-6 sm:p-8 space-y-6 relative">
            <button
              onClick={() => setSelectedCust(null)}
              className="absolute right-6 top-6 p-2 rounded-sm bg-raise text-fg-dim hover:text-fg cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-signal/20 border border-signal/30 flex items-center justify-center text-signal font-bold text-lg">
                {selectedCust.customer_segment[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold text-fg">{selectedCust.customer_id}</h2>
                <span className="text-xs text-signal font-semibold">{selectedCust.customer_segment} Customer Profile</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-sunken p-3.5 rounded-lg border border-line">
                <span className="text-fg-dim text-[10px] block">LIFETIME SESSIONS</span>
                <span className="text-lg font-bold text-fg mt-1 block">{selectedCust.total_sessions}</span>
              </div>
              <div className="bg-sunken p-3.5 rounded-lg border border-line">
                <span className="text-fg-dim text-[10px] block">TOTAL VALUE</span>
                <span className="text-lg font-bold text-caught mt-1 block">{formatCurrency(selectedCust.lifetime_cart_value)}</span>
              </div>
              <div className="bg-sunken p-3.5 rounded-lg border border-line">
                <span className="text-fg-dim text-[10px] block">RECOVERED SPEND</span>
                <span className="text-lg font-bold text-caught mt-1 block">{formatCurrency(selectedCust.total_recovered_spent)}</span>
              </div>
              <div className="bg-sunken p-3.5 rounded-lg border border-line">
                <span className="text-fg-dim text-[10px] block">DROP-OFF RECORD</span>
                <span className="text-lg font-bold text-loss mt-1 block">{selectedCust.total_abandonments_recorded}</span>
              </div>
            </div>

            {/* Recent Checkouts */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-fg-dim mb-3">Recent Checkout Sessions</h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {selectedCust.recent_sessions?.map((s) => (
                  <div key={s.checkout_id} className="bg-sunken/60 p-3 rounded-sm border border-line flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-fg block">{s.checkout_id}</span>
                      <span className="text-fg-dim text-[11px]">{s.device} • {s.payment_method}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-fg block">{formatCurrency(s.cart_value)}</span>
                      <span className="text-fg-mute text-[10px]">{new Date(s.started_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
