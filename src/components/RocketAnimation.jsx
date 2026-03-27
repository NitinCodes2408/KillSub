import React from 'react';
import { motion } from 'framer-motion';

const RocketAnimation = ({ onAnimationComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      {/* Dynamic Background Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.8, scale: 2 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute w-96 h-96 rounded-full blur-[100px] bg-gradient-to-t from-electric-green to-neon-blue mix-blend-screen"
      />

      <motion.div
        initial={{ y: window.innerHeight / 2 + 200, scale: 0.5 }}
        animate={{ y: -window.innerHeight - 200, scale: 1.5 }}
        transition={{ duration: 1.5, ease: "easeIn" }}
        onAnimationComplete={onAnimationComplete}
        className="relative flex flex-col items-center"
      >
        <span className="text-9xl drop-shadow-[0_0_50px_rgba(0,255,159,1)]">🚀</span>
        
        {/* Flame effect */}
        <motion.div
          animate={{
            scaleY: [1, 1.5, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.1,
          }}
          className="w-8 h-32 mt-[-20px] bg-gradient-to-b from-yellow-400 via-orange-500 to-red-500 rounded-full blur-md origin-top"
        />

        {/* Smoke trail */}
        <motion.div
          animate={{
            scale: [1, 3],
            opacity: [0.5, 0],
          }}
          transition={{
             repeat: Infinity,
             duration: 0.5
          }}
          className="w-16 h-16 mt-4 bg-gray-500 rounded-full blur-xl"
        />
      </motion.div>
    </motion.div>
  );
};

export default RocketAnimation;
