import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const PrivacyPolicy = () => {
  const { t } = useLanguage();

  const sections = [
    {
      title: "Data Collection",
      icon: <Eye className="text-emerald-500" />,
      content: "We collect information that you provide directly to us, such as when you create an account, make a booking, or contact our support team. This may include your name, email address, phone number, and payment information."
    },
    {
      title: "Use of Information",
      icon: <Lock className="text-emerald-500" />,
      content: "The information we collect is used to provide, maintain, and improve our services, process your bookings, and communicate with you about your account and our latest offers."
    },
    {
      title: "Data Security",
      icon: <Shield className="text-emerald-500" />,
      content: "We implement a variety of security measures to maintain the safety of your personal information. Your data is stored on secure servers and is only accessible by authorized personnel."
    },
    {
      title: "Cookies Policy",
      icon: <FileText className="text-emerald-500" />,
      content: "Our website uses cookies to enhance your browsing experience and analyze site traffic. You can choose to disable cookies through your browser settings, though this may affect site functionality."
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
            Privacy <span className="text-emerald-500">Policy</span>
          </h1>
          <p className="text-xl opacity-60 font-medium max-w-2xl mx-auto leading-relaxed italic">
            Your privacy is our top priority. Learn how we protect and manage your data at Tushit Travel.
          </p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-10 rounded-[2.5rem] border-white/5 hover:border-emerald-500/30 transition-all group"
            >
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-4 font-outfit group-hover:text-emerald-400 transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-lg opacity-60 leading-relaxed font-medium">
                    {section.content}
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
          <h4 className="text-xl font-black uppercase tracking-widest mb-4">Have Questions?</h4>
          <p className="opacity-60 mb-8 max-w-lg mx-auto">
            If you have any questions about our privacy policy, please feel free to contact our support team.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-3 bg-emerald-500 text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform">
            Contact Support <ChevronRight size={16} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
