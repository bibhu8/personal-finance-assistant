import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#14b8a6', '#3b82f6', '#f97316', '#ec4899', '#8b5cf6'];

const ExpensesPieChart = ({ data }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Expenses by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f1f5f9'
            }}
          />
          <Legend wrapperStyle={{ color: '#94a3b8' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpensesPieChart;