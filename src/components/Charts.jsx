import React from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#00FF9F', '#00E5FF', '#FF4D6D', '#A151FF', '#FFBB00', '#10B981', '#3B82F6'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-4 py-2 bg-black border border-white/10 shadow-lg rounded-xl">
        <p className="font-bold text-white">₹{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const Charts = ({ pieData, barData }) => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {/* Category Breakdown */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-6 bg-bg-panel border border-white/5 shadow-2xl rounded-2xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-electric-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <h3 className="mb-4 text-xl font-bold text-white tracking-wide">Category Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={70}
                outerRadius={90}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#9CA3AF' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Spending Trend */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-6 bg-bg-panel border border-white/5 shadow-2xl rounded-2xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <h3 className="mb-4 text-xl font-bold text-white tracking-wide">Spending Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} tick={{ fill: '#9CA3AF' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 4 }} />
              <Bar dataKey="spending" fill="#00E5FF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default Charts;
