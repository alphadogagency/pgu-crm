import { NavLink, Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { getStop } from '../data/stops';
import SocialLinks from './SocialLinks';

const navItems = [
  { to: '',             label: 'Dashboard',          icon: '📊', end: true },
  { to: 'schedule',     label: 'Coaching Schedule',  icon: '📅' },
  { to: 'roster',       label: 'Coach Roster',       icon: '🏀' },
  { to: 'personnel',    label: 'Key Personnel',      icon: '👥' },
  { to: 'sponsors',     label: 'Sponsors',           icon: '🤝' },
  { to: 'volunteers',   label: 'On-Site Roles',      icon: '🙋' },
  { to: 'equipment',    label: 'Equipment List',     icon: '🎒' },
  { to: 'registration', label: 'Registration',       icon: '📋' },
  { to: 'reminders',    label: 'Reminders & Notes',  icon: '📝' },
  { to: 'contacts',     label: 'Contacts',           icon: '📇' },
  { to: 'rollovers',    label: '2027 Rollovers',     icon: '🔄' },
];

export default function Layout({ children }) {
  const { stopId } = useParams();
  const stop = getStop(stopId);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-pgu-navy text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button className="lg:hidden text-white text-2xl cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <Link to="/" className="flex items-center gap-3">
            <img src="/primary-logo.png" alt="Point Guard U" className="h-8 brightness-0 invert" />
            <div className="h-5 w-px bg-pgu-gold" />
            <span className="text-sm font-semibold text-pgu-gold tracking-wide hover:text-pgu-gold-light transition-colors">2026 Tour Hub</span>
          </Link>
          {stop && (
            <>
              <span className="text-pgu-gold/50">—</span>
              <span className="text-sm font-semibold text-white">{stop.label}</span>
            </>
          )}
        </div>
        <Link to="/" className="text-xs text-pgu-gold hover:text-pgu-gold-light font-medium transition-colors hidden lg:block">
          ← All Stops
        </Link>
        <div className="w-8 lg:hidden" />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-56 bg-white border-r border-gray-200 transition-transform duration-200 pt-14 lg:pt-0 shrink-0 flex flex-col`}>
          {/* Mobile back link */}
          <div className="p-3 border-b border-gray-100 lg:hidden">
            <Link to="/" onClick={() => setSidebarOpen(false)} className="text-sm text-pgu-navy font-medium hover:text-pgu-gold">
              ← All Stops
            </Link>
          </div>

          {/* Nav items */}
          <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to === '' ? `/${stopId}` : `/${stopId}/${item.to}`}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-pgu-navy text-white' : 'text-pgu-navy hover:bg-gray-100'
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Social links at bottom of sidebar */}
          <div className="p-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Follow PGU</p>
            <SocialLinks />
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
