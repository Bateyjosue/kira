import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Stethoscope, AlertTriangle, MessageSquare } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const links = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/patients', label: 'Patients', icon: Users },
    { to: '/consultations', label: 'New Consultation', icon: Stethoscope },
    { to: '/alerts', label: 'Risk Alerts', icon: AlertTriangle },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-65px)] p-4 flex flex-col justify-between">
      <nav className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Clinical Portal
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold mb-1">
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp Integration</span>
        </div>
        <p className="text-xs text-slate-400">
          Automated check-ins active for EN, FR, Kinyarwanda, and Swahili.
        </p>
      </div>
    </aside>
  );
};
