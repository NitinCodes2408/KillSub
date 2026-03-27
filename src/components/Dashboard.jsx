import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Hero from './Hero';
import Charts from './Charts';
import SubscriptionList from './SubscriptionList';
import Recommendations from './Recommendations';
import Chatbot from './Chatbot';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/analyze');
        setData(res.data);
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 400) {
          // No data uploaded yet, redirect to upload
          navigate('/upload');
        } else {
          setError('Failed to fetch dashboard data. Ensure backend is running.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg-dark">
        <Loader2 className="w-16 h-16 animate-spin text-neon-blue drop-shadow-[0_0_15px_rgba(0,229,255,0.8)]" />
        <h2 className="mt-4 text-xl font-semibold text-gray-300 animate-pulse uppercase tracking-widest">Initializing...</h2>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-light-red font-bold text-xl">{error}</div>;
  }

  return (
    <div className="min-h-screen pb-12 font-sans bg-bg-dark text-gray-100 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-electric-green/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-neon-blue/10 rounded-full blur-[150px] pointer-events-none translate-x-1/3 translate-y-1/3"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-bg-panel/80 backdrop-blur-xl border-b border-white/5 shadow-lg">
        <h1 className="text-2xl font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(0,255,159,0.3)]">
          Sub<span className="text-electric-green">kill</span> <span className="text-neon-blue">💸</span>
        </h1>
        <div className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Subscription Slasher</div>
      </header>

      <main className="relative max-w-7xl px-4 mx-auto mt-10 space-y-10 z-10">
        <Hero totalMonthly={data.totalMonthly} />
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <Charts pieData={data.categoryBreakdown} barData={data.trendData} />
            <SubscriptionList subs={data.subs} predictions={data.predictions} />
          </div>
          <div className="lg:col-span-1">
            <Recommendations data={data} setData={setData} />
          </div>
        </div>
      </main>

      <Chatbot />
    </div>
  );
};

export default Dashboard;
