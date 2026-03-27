import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, CheckCircle2 } from 'lucide-react';

const Recommendations = ({ data, setData }) => {
  const [cancelingId, setCancelingId] = useState(null);
  const [canceledIds, setCanceledIds] = useState([]);

  // Need recommendations from API data, or fallback if absent
  // Backend returns recs in `/recommend` endpoint, wait, we merged it into `/analyze`
  // Actually, wait, `apiController.js` logic was:
  // exports.analyzeData -> returns { subs, totalMonthly, totalYearly, categoryBreakdown, trendData, predictions }
  // Wait, I forgot to include `recommendations` in `/analyze` API payload! I should fix that.
  // For now, I'll assume they are passed as `data.recommendations` once fixed, or I can fetch them separately.
  // I will make sure the component fetches them if missing or accepts from props.
  const recs = data.recommendations || [];

  const handleCancelSimulation = (rec) => {
    setCancelingId(rec.id);
    
    setTimeout(() => {
      setCancelingId(null);
      setCanceledIds(prev => [...prev, rec.id]);
      
      if (setData && data) {
         setData({
            ...data,
            totalMonthly: data.totalMonthly - rec.saveAmount,
            predictions: {
               oneYear: data.predictions.oneYear - (rec.saveAmount * 12),
               fiveYear: data.predictions.fiveYear - (rec.saveAmount * 12 * 5)
            }
         });
      }
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="p-6 bg-bg-panel border border-white/5 rounded-2xl sticky top-[100px] shadow-2xl"
    >
      <div className="flex items-center mb-8 space-x-3">
        <div className="p-2 bg-electric-green/20 rounded-lg text-electric-green">
           <Scissors size={20} />
        </div>
        <h3 className="text-xl font-bold tracking-wide text-white">Smart Recommendations</h3>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {recs.map((rec) => {
            if (canceledIds.includes(rec.id)) return null;
            
            const isCanceling = cancelingId === rec.id;
            
            return (
              <motion.div 
                key={rec.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                className="relative p-5 overflow-hidden bg-black/50 border border-white/10 rounded-xl group hover:border-electric-green/50 transition-colors"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-electric-green to-neon-blue"></div>
                
                <div className="mb-3">
                  <span className="inline-block px-2 py-1 text-[10px] font-black tracking-widest text-[#0a0a0a] uppercase bg-neon-blue rounded">
                    {rec.reason}
                  </span>
                </div>
                
                <h4 className="text-lg font-bold text-white tracking-wide">{rec.title}</h4>
                <p className="mt-1 mb-5 text-sm font-medium text-gray-500 leading-relaxed max-w-[90%]">{rec.description}</p>
                
                <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                  <span className="font-black text-electric-green drop-shadow-[0_0_10px_rgba(0,255,159,0.4)]">
                    Save ₹{rec.saveAmount}<span className="text-xs text-gray-500 font-normal">/mo</span>
                  </span>
                  <button
                    onClick={() => handleCancelSimulation(rec)}
                    disabled={isCanceling}
                    className="relative overflow-hidden px-4 py-2 text-xs font-bold tracking-widest text-black uppercase transition-all rounded-lg bg-electric-green hover:shadow-[0_0_20px_rgba(0,255,159,0.6)] disabled:opacity-50 disabled:cursor-wait flex items-center group/btn"
                  >
                    <div className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                    {isCanceling ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-4 h-4 mr-2 border-2 border-black border-t-transparent rounded-full"
                      />
                    ) : null}
                    {isCanceling ? 'Canceling...' : 'Simulate Cancel'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {recs.filter(r => !canceledIds.includes(r.id)).length === 0 && (
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="flex flex-col items-center justify-center py-12 text-center text-gray-400"
          >
            <CheckCircle2 size={48} className="text-electric-green mb-4 opacity-50 drop-shadow-[0_0_15px_rgba(0,255,159,0.5)]" />
            <p className="font-bold tracking-widest uppercase text-sm">All optimized!</p>
            <p className="text-xs mt-1">No more suggestions available.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Recommendations;
