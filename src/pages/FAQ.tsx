import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`glass-card rounded-[2.5rem] overflow-hidden mb-6 transition-all duration-500 ${isOpen ? 'bg-white/10 border-emerald-500/30' : 'hover:bg-white/5'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-10 flex items-center justify-between text-left transition-colors"
      >
        <h3 className={`text-2xl font-black tracking-tight font-outfit transition-colors ${isOpen ? 'text-emerald-400' : ''}`}>{question}</h3>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-emerald-500 text-black rotate-180 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-white/5 text-white/40'}`}>
          {isOpen ? <Minus size={24} /> : <Plus size={24} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="p-10 pt-0 opacity-60 leading-relaxed text-xl font-sans border-t border-white/5 mt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQ() {
  const { t } = useLanguage();
  const faqs = [
    {
      question: t('faq.q1'),
      answer: t('faq.a1')
    },
    {
      question: t('faq.q2'),
      answer: t('faq.a2')
    },
    {
      question: t('faq.q3'),
      answer: t('faq.a3')
    },
    {
      question: t('faq.q4'),
      answer: t('faq.a4')
    },
    {
      question: t('faq.q5'),
      answer: t('faq.a5')
    },
    {
      question: t('faq.q6'),
      answer: t('faq.a6')
    }
  ];

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
          src="https://images.unsplash.com/photo-1454165833767-027ff33027ef?auto=format&fit=crop&q=80&w=2000" 
          alt="FAQ Background"
          className="w-full h-full object-cover opacity-40 scale-105 animate-float"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
        <div className="absolute inset-0 mesh-gradient opacity-40" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-32">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-emerald-500 font-black tracking-[0.5em] uppercase text-xs font-outfit"
          >
            {t('faq.badge')}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-9xl font-black mt-8 tracking-tighter leading-none font-outfit"
          >
            {t('faq.title1')}<br />
            <span className="text-vibrant-gradient text-glow animate-rotate-hue inline-block hover:scale-105 transition-transform duration-500 cursor-default">{t('faq.title2')}</span>
          </motion.h1>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <FAQItem {...faq} />
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 glass-card p-16 rounded-[3.5rem] text-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <h2 className="text-5xl font-black mb-6 font-outfit relative z-10">{t('faq.stillQuestions')}</h2>
          <p className="opacity-40 text-xl mb-12 relative z-10">{t('faq.stillQuestionsDesc')}</p>
          <Link to="/contact" className="btn-vibrant inline-block relative z-10 py-5 px-12 text-lg">{t('faq.contactSupport')}</Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
