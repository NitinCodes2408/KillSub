import React from 'react';
import { motion } from 'framer-motion';

const ToggleSwitch = ({ activeTab, setActiveTab }) => {
  return (
    <div className="relative flex items-center p-1 bg-black/40 border border-white/10 rounded-full w-full max-w-[240px] mx-auto mb-8 backdrop-blur-md">
      {['User', 'Admin'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`relative z-10 flex-1 px-4 py-2 text-sm font-bold tracking-widest uppercase transition-colors duration-300 ${
            activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-white'
          }`}
        >
          {tab}
        </button>
      ))}
      <motion.div
        className="absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-electric-green rounded-full shadow-[0_0_15px_rgba(0,255,159,0.5)]"
        animate={{
          x: activeTab === 'User' ? 0 : '100%',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
    </div>
  );
};

export default ToggleSwitch;
