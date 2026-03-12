import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Car, Lock, User, ChevronRight } from 'lucide-react';

export default function AdminLogin() {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('isAdmin') === 'true') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin/dashboard');
      } else {
        alert(data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Connection error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" 
          alt="Login Background"
          className="w-full h-full object-cover opacity-40 scale-105 animate-float"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
        <div className="absolute inset-0 mesh-gradient opacity-40" />
      </div>

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8 md:mb-12">
          <Link to="/" className="inline-flex items-center gap-4 group mb-8 md:mb-10">
            <div className="relative">
              <div className="absolute -inset-2 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <img 
                src="https://i.ibb.co/cWCR5s0/file-00000000eca07208a364f8764c41ea0a.png" 
                alt="TUSHIT TRAVEL" 
                className="h-16 md:h-20 w-auto object-contain group-hover:scale-110 transition-transform duration-500 relative z-10"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl md:text-3xl font-black tracking-tighter leading-none font-outfit group-hover:text-emerald-400 transition-colors">TUSHIT</span>
              <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-emerald-500 leading-none mt-1 group-hover:text-white transition-colors font-outfit">TRAVEL</span>
            </div>
          </Link>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter font-outfit">ADMIN <span className="gradient-text text-glow animate-rotate-hue inline-block hover:scale-105 transition-transform duration-500 cursor-default">CONSOLE</span></h1>
          <p className="opacity-40 text-[10px] md:text-xs mt-4 font-black uppercase tracking-[0.3em]">Secure Access Required</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <form onSubmit={handleLogin} className="space-y-6 md:space-y-8 relative z-10">
            <div className="space-y-3 md:space-y-4">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center gap-3 font-outfit">
                <User size={14} className="md:size-4" /> Username
              </label>
              <input 
                type="text" 
                placeholder="Enter username" 
                className="input-field py-4 md:py-5 px-6 md:px-8 text-base md:text-lg"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-3 md:space-y-4">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center gap-3 font-outfit">
                <Lock size={14} className="md:size-4" /> Password
              </label>
              <input 
                type="password" 
                placeholder="Enter password" 
                className="input-field py-4 md:py-5 px-6 md:px-8 text-base md:text-lg"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn-vibrant w-full flex items-center justify-center gap-4 group mt-8 md:mt-10 py-4 md:py-6 text-lg md:text-xl">
              Authenticate
              <ChevronRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </form>
        </motion.div>

        <div className="text-center mt-12">
          <Link to="/" className="opacity-20 hover:opacity-100 transition-colors text-xs font-black uppercase tracking-[0.4em] font-outfit">
            {t('common.backToWeb')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
