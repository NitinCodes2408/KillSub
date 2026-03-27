import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RippleEffect = () => {
  const [ripples, setRipples] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const addRipple = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 1000);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', addRipple);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', addRipple);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Dynamic Cursor Glow (Liquid Distortion fake) */}
      <motion.div
        className="absolute w-96 h-96 bg-neon-blue rounded-full blur-[100px] opacity-20 mix-blend-screen"
        animate={{
          x: mousePos.x - 192,
          y: mousePos.y - 192,
        }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
      />
      
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-electric-green rounded-full opacity-30"
          style={{
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
            left: Math.random() * 100 + 'vw',
            top: Math.random() * 100 + 'vh',
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: Math.random() * 3 + 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Click Ripples */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ width: 300, height: 300, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute rounded-full border border-neon-blue bg-neon-blue/10"
            style={{
              top: ripple.y,
              left: ripple.x,
              x: '-50%',
              y: '-50%',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default RippleEffect;
