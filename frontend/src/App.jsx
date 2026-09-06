import React, { useState, useEffect, useCallback } from 'react';
import Sidebar, { ALL_NAV_ITEMS } from './components/Sidebar';
import Topbar from './components/Topbar';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import DecisionCenter from './pages/DecisionCenter';
import Simulator from './pages/Simulator';
import Opportunities from './pages/Opportunities';
import Customers from './pages/Customers';
import ProtectionCenter from './pages/ProtectionCenter';
import VoiceOfCustomer from './pages/VoiceOfCustomer';
import Customer360 from './pages/Customer360';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import RevenueLeakage from './pages/RevenueLeakage';
import Interventions from './pages/Interventions';
import AbTesting from './pages/AbTesting';
import ModelMonitoring from './pages/ModelMonitoring';
import DemoScenarios from './pages/DemoScenarios';
import apiService from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCheckout, setSelectedCheckout] = useState(null);
  const [health, setHealth] = useState(null);
  const [summary, setSummary] = useState(null);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    /* The shell owns the two things every page's chrome needs: whether the
       backend is up, and the at-risk/recovered pair the leak line draws. */
    (async () => {
      const [healthRes, summaryRes] = await Promise.allSettled([
        apiService.getHealth(),
        apiService.getDashboardSummary(),
      ]);
      if (cancelled) return;
      if (healthRes.status === 'fulfilled') setHealth(healthRes.value);
      if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const navigate = useCallback((tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0 });
  }, []);

  const openDecisionFor = useCallback(
    (cart) => {
      setSelectedCheckout(cart);
      navigate('decision-center');
    },
    [navigate]
  );

  const handleSelectScenario = useCallback(
    (scenario) => {
      openDecisionFor({
        checkout_id: `DEMO_${scenario.id}`,
        cart_value: scenario.cart_value || scenario.order_value,
        shipping_cost: scenario.shipping_cost || 0,
        customer_segment: scenario.customer_segment || 'VIP',
        abandonment_reason: scenario.expected_reason || 'SHIPPING',
        device: 'Mobile',
        payment_method: scenario.expected_reason === 'PAYMENT' ? 'UPI' : 'Credit Card',
        pillar: scenario.pillar || 'RECOVER',
      });
    },
    [openDecisionFor]
  );

  const [selectedCustomerIdFor360, setSelectedCustomerIdFor360] = useState('DEMO_CUST_RAHUL');

  const handleNavigateToCustomer360 = useCallback(
    (customerId) => {
      if (customerId) {
        setSelectedCustomerIdFor360(customerId);
      }
      navigate('customer-360');
    },
    [navigate]
  );

  const PAGES = {
    dashboard: <Dashboard onNavigate={navigate} />,
    'decision-center': <DecisionCenter preselectedCheckout={selectedCheckout} />,
    simulator: <Simulator />,
    opportunities: <Opportunities onSelectCart={openDecisionFor} />,
    protection: <ProtectionCenter onSelectOrderForDecision={openDecisionFor} />,
    voc: <VoiceOfCustomer />,
    'customer-360': (
      <Customer360
        onNavigateToDecision={openDecisionFor}
        initialCustomerId={selectedCustomerIdFor360}
      />
    ),
    customers: (
      <Customers onNavigateToCustomer360={handleNavigateToCustomer360} />
    ),
    analytics: <Analytics />,
    leakage: <RevenueLeakage onNavigate={navigate} />,
    interventions: <Interventions />,
    'ab-testing': <AbTesting />,
    models: <ModelMonitoring />,
    settings: <Settings />,
    demo: (
      <DemoScenarios
        onSelectScenario={handleSelectScenario}
        onNavigateToCustomer360={(custId) => handleNavigateToCustomer360(custId)}
      />
    ),
  };

  const title = ALL_NAV_ITEMS.find((i) => i.id === activeTab)?.label ?? 'PayRevive';

  return (
    <div className="min-h-screen bg-ink text-fg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-100 focus:rounded-sm focus:bg-signal focus:px-3 focus:py-2 focus:text-xs focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={navigate}
        open={navOpen}
        onClose={() => setNavOpen(false)}
      />

      <div className="lg:pl-[248px]">
        <Topbar
          title={title}
          health={health}
          summary={summary}
          onOpenNav={() => setNavOpen(true)}
          onDemo={() => navigate('demo')}
        />

        {/* Keying on the tab restarts the entrance animation per view, so a
            page change reads as a change rather than a silent swap. */}
        <main id="main" key={activeTab} className="animate-fade-in px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1400px]">
            <ErrorBoundary resetKey={activeTab}>{PAGES[activeTab] ?? PAGES.dashboard}</ErrorBoundary>
          </div>
        </main>

        <footer className="border-t border-line px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-1 font-mono text-[10px] text-fg-mute sm:flex-row sm:items-center sm:justify-between">
            <span>PayRevive © {new Date().getFullYear()} — closed-loop revenue intelligence</span>
            <span className="text-fg-mute/60">
              Figures are modelled on a synthetic 100K-session dataset
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
