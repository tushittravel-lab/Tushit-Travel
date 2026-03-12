import React from 'react';
import { motion } from 'motion/react';
import { Gavel, Scale, FileCheck, AlertCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const TermsOfService = () => {
  const { t } = useLanguage();

  const terms = [
    {
      title: "Service Agreement",
      icon: <FileCheck className="text-emerald-500" />,
      content: "By using Tushit Travel services, you agree to comply with all local laws and regulations. Our services are provided to facilitate travel and transportation for our customers."
    },
    {
      title: "Booking & Cancellation",
      icon: <Scale className="text-emerald-500" />,
      content: "Bookings are subject to availability. Cancellations made within 24 hours of the scheduled service may be subject to a cancellation fee. Please review your specific booking details for more information."
    },
    {
      title: "Liability",
      icon: <AlertCircle className="text-emerald-500" />,
      content: "Tushit Travel is not liable for any indirect, incidental, or consequential damages arising from the use of our services. We strive to provide the highest quality service but cannot guarantee uninterrupted availability."
    },
    {
      title: "Governing Law",
      icon: <Gavel className="text-emerald-500" />,
      content: "These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes relating to these terms will be subject to the exclusive jurisdiction of the courts in Indore, M.P."
    }
  ];

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-6 font-outfit">
            Terms of <span className="text-emerald-500">Service</span>
          </h1>
          <p className="text-xl opacity-60 font-medium max-w-2xl mx-auto leading-relaxed italic">
            Please read these terms carefully before using our services. They outline your rights and responsibilities as a Tushit Travel customer.
          </p>
        </motion.div>

        <div className="space-y-8">
          {terms.map((term, idx) => (
            <motion.div
              key={term.title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-10 rounded-[2.5rem] border-white/5 hover:border-emerald-500/30 transition-all group"
            >
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {term.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-4 font-outfit group-hover:text-emerald-400 transition-colors">
                    {term.title}
                  </h3>
                  <p className="text-lg opacity-60 leading-relaxed font-medium">
                    {term.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-12 rounded-[3rem] bg-emerald-500/5 border border-emerald-500/10 text-center"
        >
          <h4 className="text-xl font-black uppercase tracking-widest mb-4">Acceptance of Terms</h4>
          <p className="opacity-60 mb-8 max-w-lg mx-auto">
            By accessing or using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link to="/contact" className="inline-flex items-center gap-3 bg-emerald-500 text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform">
              Contact Support <ChevronRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
