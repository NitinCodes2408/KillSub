import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileJson, FileText, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      // Simulate "Scanning finances..." time for extra UX wow factor
      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard");
      }, 2500);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Failed to upload file. Make sure backend is running.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg-dark text-electric-green">
        <Loader2 className="w-20 h-20 animate-spin drop-shadow-[0_0_15px_rgba(0,255,159,0.8)]" />
        <motion.h2 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-6 text-2xl font-black tracking-widest uppercase"
        >
          Scanning your finances...
        </motion.h2>
        <div className="w-64 h-2 mt-8 overflow-hidden bg-gray-800 rounded-full shadow-[0_0_10px_rgba(0,255,159,0.2)]">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "linear" }}
            className="h-full bg-electric-green"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-bg-dark to-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl p-10 border border-white/10 rounded-3xl bg-bg-panel/50 backdrop-blur-xl shadow-2xl"
      >
        <div className="mb-10 text-center">
           <h2 className="text-4xl font-black text-white">
             Upload <span className="text-electric-green">Transactions</span>
           </h2>
           <p className="mt-2 text-gray-400">Drag and drop your bank statment (CSV/JSON) to find hidden subscriptions.</p>
        </div>

        <form 
          onDragEnter={handleDrag} 
          onDragLeave={handleDrag} 
          onDragOver={handleDrag} 
          onDrop={handleDrop}
          onSubmit={(e) => e.preventDefault()}
          className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-300 ${dragActive ? 'border-neon-blue bg-neon-blue/10' : 'border-gray-600 hover:border-electric-green hover:bg-white/5'}`}
        >
          <input 
            type="file" 
            accept=".csv, .json"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <AnimatePresence>
            {file ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center space-x-4 text-electric-green"
              >
                {file.name.endsWith('.json') ? <FileJson size={48} /> : <FileText size={48} />}
                <div className="text-left">
                  <p className="text-lg font-bold text-white">{file.name}</p>
                  <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center text-gray-400 pointer-events-none">
                <UploadCloud size={64} className="mb-4 text-gray-500" />
                <p className="text-lg font-semibold text-white">Drag & drop your file here</p>
                <p className="text-sm">or click to browse</p>
              </div>
            )}
          </AnimatePresence>
        </form>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={uploadFile}
          disabled={!file}
          className={`w-full py-4 mt-8 text-xl font-bold tracking-widest text-black uppercase transition-all duration-300 rounded-xl ${file ? 'bg-electric-green shadow-[0_0_20px_rgba(0,255,159,0.5)] hover:shadow-[0_0_40px_rgba(0,255,159,0.8)]' : 'bg-gray-700 cursor-not-allowed text-gray-500'}`}
        >
          Analyze Data
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Upload;
