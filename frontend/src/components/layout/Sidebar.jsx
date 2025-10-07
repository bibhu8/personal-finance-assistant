import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Receipt, TrendingUp, FileText, Settings } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Upload Receipt', path: '/upload', icon: Receipt },
    { name: 'Transactions', path: '/transactions', icon: TrendingUp },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 min-h-screen p-6">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white">FinTrack</h1>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-500 text-white'
                  : 'text-slate-300 hover:bg-slate-700'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;