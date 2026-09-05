import React from 'react';
import {
  Activity,
  BarChart3,
  Cpu,
  Layers,
  MessageSquare,
  Send,
  Settings as SettingsIcon,
  ShieldCheck,
  Sliders,
  Sparkles,
  Split,
  Target,
  TrendingDown,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { cx } from './ui/index.jsx';

/* Grouped by what the product actually does, not by a flat list. The old
   tab strip showed eleven items in a horizontal scroller and four pages
   (leakage, interventions, A/B testing, customers) had no entry at all. */
export const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Executive dashboard', icon: BarChart3 },
      { id: 'leakage', label: 'Revenue leakage', icon: TrendingDown },
    ],
  },
  {
    label: 'Act',
    items: [
      { id: 'decision-center', label: 'Decision center', icon: Cpu },
      { id: 'simulator', label: 'Revenue simulator', icon: Sliders },
    ],
  },
  {
    label: 'Recover',
    note: 'Pillar 1',
    items: [
      { id: 'opportunities', label: 'Recovery queue', icon: Target },
      { id: 'interventions', label: 'Interventions', icon: Send },
      { id: 'ab-testing', label: 'A/B testing', icon: Split },
    ],
  },
  {
    label: 'Protect',
    note: 'Pillar 2',
    items: [{ id: 'protection', label: 'Protection center', icon: ShieldCheck }],
  },
  {
    label: 'Listen',
    note: 'Pillar 3',
    items: [{ id: 'voc', label: 'Customer voice', icon: MessageSquare }],
  },
  {
    label: 'Customers',
    items: [
      { id: 'customer-360', label: 'Customer 360', icon: UserRound },
      { id: 'customers', label: 'All customers', icon: Users },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'analytics', label: 'Analytics', icon: Layers },
      { id: 'models', label: 'Model insights', icon: Activity },
      { id: 'settings', label: 'Settings & health', icon: SettingsIcon },
      { id: 'demo', label: 'Demo scenarios', icon: Sparkles },
    ],
  },
];

export const ALL_NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

export default function Sidebar({ activeTab, setActiveTab, open, onClose }) {
  return (
    <>
      {/* Scrim, mobile only */}
      <div className="app-scrim" data-open={open ? 'true' : 'false'} onClick={onClose} aria-hidden="true" />

      <nav
        aria-label="Main"
        data-open={open ? 'true' : 'false'}
        className="app-rail flex w-[248px] flex-col border-r border-line bg-surface"
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-line px-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[15px] font-bold tracking-tight text-fg">
              PayRevive
            </span>
            <span className="font-mono text-[10px] tracking-wider text-fg-mute">v1.0</span>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-sm p-1 text-fg-mute hover:bg-raise hover:text-fg lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-5 last:mb-0">
              <div className="flex items-baseline gap-1.5 px-3 pb-1.5">
                <span className="eyebrow">{group.label}</span>
                {group.note && (
                  <span className="font-mono text-[9px] text-fg-mute/60">{group.note}</span>
                )}
              </div>

              <ul className="space-y-px">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveTab(item.id);
                          onClose?.();
                        }}
                        aria-current={isActive ? 'page' : undefined}
                        className={cx(
                          'group relative flex w-full cursor-pointer items-center gap-2.5 rounded-sm px-3 py-1.5 text-left text-[13px] transition-colors duration-150',
                          isActive
                            ? 'bg-raise font-medium text-fg'
                            : 'text-fg-dim hover:bg-raise/60 hover:text-fg'
                        )}
                      >
                        {/* The active marker is a rule, not a filled pill —
                            it keeps the rail quiet enough to scan. */}
                        <span
                          className={cx(
                            'absolute left-0 h-4 w-0.5 rounded-full transition-colors',
                            isActive ? 'bg-signal' : 'bg-transparent'
                          )}
                          aria-hidden="true"
                        />
                        <Icon
                          className={cx(
                            'h-3.5 w-3.5 shrink-0 transition-colors',
                            isActive ? 'text-signal' : 'text-fg-mute group-hover:text-fg-dim'
                          )}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="shrink-0 border-t border-line px-4 py-3">
          <p className="font-mono text-[10px] leading-relaxed text-fg-mute">
            Recover · Protect · Listen
            <br />
            <span className="text-fg-mute/60">FastAPI · PostgreSQL · React</span>
          </p>
        </div>
      </nav>
    </>
  );
}
