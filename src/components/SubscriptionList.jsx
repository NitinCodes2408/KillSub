import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CalendarDays, Tag } from 'lucide-react';

const SubscriptionList = ({ subs, predictions }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="p-6 bg-bg-panel border border-white/5 shadow-2xl rounded-2xl relative"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-white tracking-wide">Your Subscriptions</h3>
        <span className="px-4 py-1.5 text-sm font-bold tracking-widest text-[#0a0a0a] uppercase rounded-full bg-electric-green shadow-[0_0_15px_rgba(0,255,159,0.4)]">
          {subs.length} Active
        </span>
      </div>

      <div className="space-y-4">
        {subs.map((sub, idx) => (
          <motion.div 
            key={sub.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * idx }}
            whileHover={{ scale: 1.02, x: 10 }}
            className="flex items-center justify-between p-5 transition-all bg-white/5 border border-white/5 rounded-xl hover:border-neon-blue hover:bg-white/10 group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-neon-blue/20 rounded-xl text-neon-blue group-hover:shadow-[0_0_15px_rgba(0,229,255,0.5)] transition-shadow">
                <CreditCard size={24} />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg tracking-wide">{sub.name}</h4>
                <div className="flex items-center mt-1 space-x-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  <span className="flex items-center"><Tag size={12} className="mr-1 text-electric-green"/> {sub.category}</span>
                  <span className="flex items-center"><CalendarDays size={12} className="mr-1 text-neon-blue"/> {sub.frequency}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-xl font-black text-white group-hover:text-neon-blue transition-colors">₹{sub.amount}</span>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Paid {sub.lastPaid}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Future Loss Predictor */}
      <div className="p-6 mt-10 border border-light-red/30 rounded-2xl bg-light-red/5 relative overflow-hidden group">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-light-red to-transparent opacity-50"></div>
        <h4 className="mb-4 text-lg font-black tracking-widest text-light-red uppercase flex items-center">
           <span className="animate-pulse mr-2">🔮</span> Future Loss Predictor
        </h4>
        <div className="grid grid-cols-2 gap-6 text-center">
          <div className="p-4 bg-black/40 border border-white/5 rounded-xl backdrop-blur-md">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">In 1 Year</p>
            <p className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,77,109,0.5)]">₹{predictions.oneYear.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-4 bg-black/40 border border-white/5 rounded-xl backdrop-blur-md group-hover:border-light-red/50 transition-colors">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">In 5 Years</p>
            <p className="text-2xl font-black text-light-red drop-shadow-[0_0_15px_rgba(255,77,109,0.8)]">₹{predictions.fiveYear.toLocaleString('en-IN')} 😳</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriptionList;
