import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Mail } from 'lucide-react';

const LiquidDistortion = ({ mousePos }) => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none mix-blend-screen">
      <motion.div
        animate={{
          x: mousePos.x - 400,
          y: mousePos.y - 400,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 1 }}
        className="w-[800px] h-[800px] bg-electric-green opacity-[0.03] rounded-full blur-[100px]"
      />
      <motion.div
        animate={{
          x: mousePos.x - 250,
          y: mousePos.y - 250,
        }}
        transition={{ type: "tween", ease: "circOut", duration: 0.5 }}
        className="w-[500px] h-[500px] bg-neon-blue opacity-[0.05] rounded-full blur-[80px]"
      />
    </div>
  );
};

const MagneticButton = ({ children, onClick, disabled }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full py-4 text-black font-black tracking-[0.2em] uppercase rounded-xl overflow-hidden group ${disabled ? 'opacity-50 cursor-not-allowed hidden' : ''}`}
    >
      <div className="absolute inset-0 transition-opacity opacity-0 bg-white/20 group-hover:opacity-100 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-electric-green to-neon-blue shadow-[0_0_20px_rgba(0,255,159,0.5)] group-hover:shadow-[0_0_40px_rgba(0,255,159,0.8)] transition-all duration-300"></div>
      <span className="relative z-10 block pointer-events-none drop-shadow-[0_2px_2px_rgba(255,255,255,0.5)]">
        {children}
      </span>
    </motion.button>
  );
};

const RocketAnimation = ({ onComplete }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
    >
      <motion.div
         initial={{ y: 200, scale: 0.5 }}
         animate={{ y: -600, scale: 2 }}
         transition={{ 
           duration: 1.5, 
           ease: [0.6, -0.05, 0.01, 0.99] // dramatic ease in out
         }}
         onAnimationComplete={onComplete}
         className="relative"
      >
         <div className="text-8xl filter drop-shadow-[0_0_40px_rgba(0,255,159,1)]">🚀</div>
         {/* Exhaust Flame */}
         <motion.div 
           animate={{ height: ["40px", "120px", "40px"], opacity: [0.8, 1, 0.8] }}
           transition={{ repeat: Infinity, duration: 0.1 }}
           className="w-8 mx-auto mt-2 bg-gradient-to-b from-[#FFA500] via-[#FF4500] to-transparent rounded-b-full blur-md"
         />
      </motion.div>
    </motion.div>
  );
};

const LoginPage = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);
  
  // Auth state
  const [mode, setMode] = useState('signup'); // 'signup' or 'signin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showRocket, setShowRocket] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleClick = (e) => {
    const newRipple = {
      x: e.clientX,
      y: e.clientY,
      id: Date.now(),
    };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1000);
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (mode === 'signup' && !name) return;
    if (!email || !password) return;
    
    setIsAuthenticating(true);
    setTimeout(() => {
      setShowRocket(true);
    }, 1500);
  };

  const handleRocketComplete = () => {
    navigate('/upload');
  };

  return (
    <div 
      className="relative flex items-center justify-center min-h-screen overflow-hidden bg-black text-white select-none cursor-crosshair font-sans"
      onClick={handleClick}
      style={{
        backgroundImage: `url('/ott_bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>

      <LiquidDistortion mousePos={mousePos} />

      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5, borderWidth: '10px' }}
            animate={{ scale: 4, opacity: 0, borderWidth: '1px' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute rounded-full border-electric-green pointer-events-none"
            style={{
              left: ripple.x - 50,
              top: ripple.y - 50,
              width: 100,
              height: 100,
            }}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {showRocket && <RocketAnimation onComplete={handleRocketComplete} />}
      </AnimatePresence>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-10 bg-black/60 backdrop-blur-xl border border-white/10 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()} // Prevent ripples on form
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(0,255,159,0.5)]">
            Sub<span className="text-electric-green">kill</span> <span className="text-neon-blue inline-block animate-pulse">💸</span>
          </h1>
          <p className="text-xs font-bold tracking-[0.3em] text-gray-500 uppercase mt-2">Subscription Slasher</p>
        </div>

        {/* Toggle Sign Up / Sign In */}
        <div className="relative flex p-1 mb-8 bg-white/5 rounded-full border border-white/10">
          <motion.div 
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-electric-green rounded-full shadow-[0_0_15px_rgba(0,255,159,0.5)]"
            animate={{ left: mode === 'signup' ? '4px' : 'calc(50%)' }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
          <button 
            type="button"
            className={`flex-1 py-2 text-xs font-black tracking-widest text-center uppercase z-10 transition-colors ${mode === 'signup' ? 'text-black' : 'text-gray-400'}`}
            onClick={() => setMode('signup')}
          >
            Create Account
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 text-xs font-black tracking-widest text-center uppercase z-10 transition-colors ${mode === 'signin' ? 'text-black' : 'text-gray-400'}`}
            onClick={() => setMode('signin')}
          >
            Sign In
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          <AnimatePresence mode="wait">
            {mode === 'signup' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1"
              >
                <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase ml-2">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-500 group-focus-within:text-electric-green transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-electric-green focus:bg-white/10 focus:shadow-[0_0_15px_rgba(0,255,159,0.2)] transition-all font-medium placeholder:text-gray-600"
                    placeholder="John Doe"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase ml-2">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Mail size={16} className="text-gray-500 group-focus-within:text-electric-green transition-colors" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-electric-green focus:bg-white/10 focus:shadow-[0_0_15px_rgba(0,255,159,0.2)] transition-all font-medium placeholder:text-gray-600"
                placeholder="test@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase ml-2">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                 <Lock size={16} className="text-gray-500 group-focus-within:text-neon-blue transition-colors" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-neon-blue focus:bg-white/10 focus:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all font-medium placeholder:text-gray-600 font-mono tracking-widest"
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="pt-6">
            {!isAuthenticating ? (
              <MagneticButton onClick={handleAuth}>
                {mode === 'signup' ? 'Create Account' : 'Authenticate'}
              </MagneticButton>
            ) : (
              <div className="w-full py-4 text-black font-black tracking-[0.2em] uppercase rounded-xl overflow-hidden bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center">
                 <motion.div
                   animate={{ rotate: 360 }}
                   transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                   className="w-5 h-5 mr-3 border-2 border-black border-t-transparent rounded-full"
                 />
                 Processing...
              </div>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
