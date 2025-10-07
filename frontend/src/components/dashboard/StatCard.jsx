import React from 'react';

const StatCard = ({ title, value, subtitle }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <p className="text-sm text-slate-400 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
};

export default StatCard;