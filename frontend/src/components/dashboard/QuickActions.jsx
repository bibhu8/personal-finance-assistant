import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, FileText } from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <button
          onClick={() => navigate('/transactions')}
          className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-left"
        >
          <Plus className="w-5 h-5 text-teal-400" />
          <span className="text-slate-200">Add Transaction</span>
        </button>
        
        <button
          onClick={() => navigate('/upload')}
          className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-left"
        >
          <Upload className="w-5 h-5 text-teal-400" />
          <span className="text-slate-200">Upload Receipt</span>
        </button>
        
        <button
          onClick={() => navigate('/reports')}
          className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-left"
        >
          <FileText className="w-5 h-5 text-teal-400" />
          <span className="text-slate-200">View Reports</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;