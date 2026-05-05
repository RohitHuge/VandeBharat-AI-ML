import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/overview', label: 'Dashboard', icon: 'dashboard' },
  { path: '/dashboard', label: 'Live Feed', icon: 'videocam' },
  // { path: '/track-analysis', label: 'Track Analysis', icon: 'analytics' },
  { path: '/defect-logs', label: 'Defect Logs', icon: 'warning' },
  // { path: '/maintenance', label: 'Maintenance', icon: 'engineering' },
];

const SideNavBar = () => {
  return (
    <nav className="bg-surface-container-low dark:bg-inverse-surface shadow-lg fixed left-0 top-16 bottom-0 flex flex-col py-md w-[280px] border-r border-outline-variant/30">
      <div className="px-margin mb-8 mt-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-secondary icon-fill">power</span>
          </div>
          <div>
            <h2 className="text-title-sm font-bold text-on-surface">Track Unit 042</h2>
            <p className="text-body-compact text-secondary font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span> Scanning Active
            </p>
          </div>
        </div>
      </div>

      <ul className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-3 mx-2 rounded-lg transition-all hover:translate-x-1 duration-300 flex items-center gap-3 text-body-compact ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-medium shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-variant'
                }`
              }
            >
              <span className={`material-symbols-outlined ${item.icon === 'videocam' ? 'icon-fill' : ''}`}>
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="px-margin mb-6">
        <button className="w-full bg-surface-container-lowest border border-outline-variant/50 text-primary text-title-sm font-medium py-2 rounded-lg hover:bg-surface-variant transition-colors flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">download</span>
          Export Report
        </button>
      </div>

      <div className="mt-auto border-t border-outline-variant/30 pt-4">
        <a href="#" className="text-on-surface-variant px-4 py-3 mx-2 hover:bg-surface-variant rounded-lg transition-all hover:translate-x-1 duration-300 flex items-center gap-3 text-body-compact">
          <span className="material-symbols-outlined">support_agent</span>
          Support
        </a>
        <a href="#" className="text-on-surface-variant px-4 py-3 mx-2 hover:bg-surface-variant rounded-lg transition-all hover:translate-x-1 duration-300 flex items-center gap-3 text-body-compact">
          <span className="material-symbols-outlined">logout</span>
          Sign Out
        </a>
      </div>
    </nav>
  );
};

export default SideNavBar;
