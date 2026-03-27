import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (!end) return;

    let totalDuration = 1500;
    let incrementTime = Math.abs(Math.floor(totalDuration / end));
    incrementTime = incrementTime < 5 ? 5 : incrementTime;
    
    const step = Math.ceil(end / (totalDuration / incrementTime));

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString('en-IN')}</span>;
};

const Hero = ({ totalMonthly }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: 'spring' }}
      className="relative overflow-hidden bg-bg-panel border border-white/5 shadow-2xl rounded-3xl group"
    >
      {/* Background Liquid/Glow */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-light-red/10 to-transparent pointer-events-none mix-blend-screen"></div>
      
      <div className="relative p-12 text-center z-10">
        <h2 className="text-xl font-bold text-gray-400 uppercase tracking-widest mb-4">You are losing</h2>
        <motion.h1 
          className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_0_25px_rgba(255,77,109,0.4)]"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          ₹<AnimatedCounter value={totalMonthly} /> <span className="text-3xl md:text-5xl text-gray-500">/month</span> 💀
        </motion.h1>
      </div>
    </motion.div>
  );
};

export default Hero;
