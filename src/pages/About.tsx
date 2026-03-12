import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Award, Users, Target, Car, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[var(--bg)] pt-40 pb-32 relative overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000" 
          alt="About Background"
          className="w-full h-full object-cover opacity-40 scale-105 animate-float"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
        <div className="absolute inset-0 mesh-gradient opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-32">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-emerald-500 font-black tracking-[0.5em] uppercase text-xs font-outfit"
          >
            {t('about.badge')}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-9xl font-black mt-8 tracking-tighter leading-none font-outfit"
          >
            {t('about.title1')}<br />
            <span className="text-vibrant-gradient text-glow animate-rotate-hue inline-block hover:scale-105 transition-transform duration-500 cursor-default">{t('about.title2')}</span>
          </motion.h1>
        </div>

        {/* Founder Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center mb-40">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -inset-10 bg-emerald-500/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <img 
              src="https://lh3.googleusercontent.com/d/1XCuGcNsTr08lpcZw_W146Q6zgg_1_ysd" 
              className="relative rounded-[3.5rem] w-full shadow-2xl group-hover:scale-105 transition-all duration-700 border border-white/10"
              alt="Mr. TUSHAR RATHORE"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-10 left-10 right-10 glass-morphism p-8 rounded-3xl translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <p className="text-white font-black text-2xl font-outfit">Mr. TUSHAR RATHORE</p>
              <p className="text-emerald-400 font-black uppercase tracking-widest text-xs mt-1">{t('about.founderTitle')}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-7xl font-black mb-10 tracking-tighter font-outfit leading-tight">{t('about.visionTitle')}<br /><span className="text-vibrant-gradient">{t('about.visionTitle2')}</span></h2>
            <p className="opacity-60 text-xl leading-relaxed mb-10 font-sans">
              {t('about.visionDesc')}
            </p>
            <div className="glass-card p-12 rounded-[3rem] border-l-4 border-l-emerald-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <Target size={80} />
              </div>
              <p className="text-2xl font-medium italic leading-relaxed relative z-10">
                {t('about.quote')}
              </p>
              <div className="mt-8 relative z-10">
                <p className="text-white font-black text-xl font-outfit">Mr. TUSHAR RATHORE</p>
                <p className="text-emerald-500 font-black uppercase tracking-widest text-xs mt-1">{t('about.founderTitle')}, {t('common.company')}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Co-Founder Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center mb-40">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <h2 className="text-4xl md:text-7xl font-black mb-10 tracking-tighter font-outfit leading-tight">{t('about.cofounderName')}<br /><span className="text-vibrant-gradient">{t('about.cofounderTitle')}</span></h2>
            <p className="opacity-60 text-xl leading-relaxed mb-10 font-sans">
              {t('about.cofounderDesc')}
            </p>
            <div className="glass-card p-12 rounded-[3rem] border-l-4 border-l-blue-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <Users size={80} />
              </div>
              <p className="text-2xl font-medium italic leading-relaxed relative z-10">
                {t('about.cofounderQuote')}
              </p>
              <div className="mt-8 relative z-10">
                <p className="text-white font-black text-xl font-outfit">{t('about.cofounderName')}</p>
                <p className="text-blue-500 font-black uppercase tracking-widest text-xs mt-1">{t('about.cofounderTitle')}, {t('common.company')}</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group order-1 md:order-2"
          >
            <div className="absolute -inset-10 bg-blue-500/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <img 
              src="https://lh3.googleusercontent.com/d/1OIyNN8daLVG6aOg1YK2nZEu5EbpmTVJn" 
              className="relative rounded-[3.5rem] w-full shadow-2xl group-hover:scale-105 transition-all duration-700 border border-white/10"
              alt={t('about.cofounderName')}
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-10 left-10 right-10 glass-morphism p-8 rounded-3xl translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <p className="text-white font-black text-2xl font-outfit">{t('about.cofounderName')}</p>
              <p className="text-blue-400 font-black uppercase tracking-widest text-xs mt-1">{t('about.cofounderTitle')}</p>
            </div>
          </motion.div>
        </div>

        {/* Mission/Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-40">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-16 rounded-[3.5rem] hover:bg-white/10 transition-all group"
          >
            <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 mb-10 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500">
              <Target size={40} />
            </div>
            <h3 className="text-5xl font-black mb-6 font-outfit">{t('about.missionTitle')}</h3>
            <p className="opacity-40 text-xl leading-relaxed group-hover:opacity-60 transition-colors">
              {t('about.missionDesc')}
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card p-16 rounded-[3.5rem] hover:bg-white/10 transition-all group"
          >
            <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 mb-10 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500">
              <Award size={40} />
            </div>
            <h3 className="text-5xl font-black mb-6 font-outfit">{t('about.visionMainTitle')}</h3>
            <p className="opacity-40 text-xl leading-relaxed group-hover:opacity-60 transition-colors">
              {t('about.visionMainDesc')}
            </p>
          </motion.div>
        </div>

        {/* Stats removed as requested */}
      </div>
    </motion.div>
  );
}
