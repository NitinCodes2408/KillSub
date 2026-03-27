import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

// Magnetic Button Wrapper
const MagneticButton = ({ children, onClick, isLoading }) => {
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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={isLoading}
      className={`relative w-full py-4 mt-6 text-lg font-bold text-black uppercase tracking-widest rounded-xl bg-electric-green overflow-hidden group shadow-[0_0_20px_rgba(0,255,159,0.4)] hover:shadow-[0_0_40px_rgba(0,255,159,0.8)] transition-shadow duration-300 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
    >
      <div className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
      {isLoading ? (
        <span className="flex items-center justify-center space-x-2">
          <Loader2 className="animate-spin" />
          <span>Authenticating...</span>
        </span>
      ) : (
        "Login Securely"
      )}
    </motion.button>
  );
};

const LoginForm = ({ activeTab, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError(false);
    
    // Fake validation
    if (!email || !password) {
      setError(true);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (password === 'wrong') {
        setError(true);
      } else {
        onSuccess();
      }
    }, 1500);
  };

  return (
    <motion.form
      onSubmit={handleLogin}
      animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className={`relative z-10 p-8 w-full max-w-md mx-auto backdrop-blur-xl bg-black/40 border rounded-3xl transition-colors duration-300 ${error ? 'border-light-red shadow-[0_0_30px_rgba(255,77,109,0.3)]' : 'border-white/10 shadow-2xl'}`}
    >
      <h2 className="mb-8 text-3xl font-black text-center text-white">
        Sub<span className="text-electric-green">Zero</span> <span className="text-neon-blue">💸</span>
      </h2>

      <div className="space-y-5">
        <div>
          <label className="block mb-2 text-xs font-semibold tracking-widest text-gray-400 uppercase">
            {activeTab === 'Admin' ? 'Admin ID' : 'Email / Username'}
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-5 py-4 text-white bg-white/5 border rounded-xl outline-none transition-all duration-300 focus:bg-white/10 ${error ? 'border-light-red focus:border-light-red focus:shadow-[0_0_15px_rgba(255,77,109,0.5)]' : 'border-white/10 focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,229,255,0.5)]'}`}
            placeholder={activeTab === 'Admin' ? 'admin@subzero' : 'Enter your email'}
          />
        </div>

        <div>
           <label className="block mb-2 text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-5 pr-12 py-4 text-white bg-white/5 border rounded-xl outline-none transition-all duration-300 focus:bg-white/10 ${error ? 'border-light-red focus:border-light-red focus:shadow-[0_0_15px_rgba(255,77,109,0.5)]' : 'border-white/10 focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,229,255,0.5)]'}`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-400 right-4 top-4 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2 cursor-pointer group">
            <div className="relative w-5 h-5 flex items-center justify-center border-2 border-gray-500 rounded-md group-hover:border-electric-green overflow-hidden">
               <input type="checkbox" className="peer absolute opacity-0 w-full h-full cursor-pointer" />
               <motion.div className="absolute inset-0 bg-electric-green scale-0 peer-checked:scale-100 transition-transform flex items-center justify-center">
                  <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
               </motion.div>
            </div>
            <span className="text-gray-400 group-hover:text-white transition-colors">Remember me</span>
          </label>
          <a href="#" className="text-neon-blue hover:text-white transition-colors">Forgot Password?</a>
        </div>
      </div>

      <MagneticButton onClick={handleLogin} isLoading={loading} />
    </motion.form>
  );
};

export default LoginForm;
