import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Contact() {
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
          src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=2000" 
          alt="Contact Background"
          className="w-full h-full object-cover opacity-40 scale-105 animate-float"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
        <div className="absolute inset-0 mesh-gradient opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-32">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-emerald-500 font-black tracking-[0.5em] uppercase text-xs font-outfit"
          >
            {t('contact.badge')}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-9xl font-black mt-8 tracking-tighter leading-none font-outfit"
          >
            {t('contact.title1')}<br />
            <span className="text-vibrant-gradient text-glow animate-rotate-hue inline-block hover:scale-105 transition-transform duration-500 cursor-default">{t('contact.title2')}</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-7xl font-black mb-12 tracking-tighter font-outfit leading-tight">{t('contact.startConversation')}<br /><span className="text-emerald-500">{t('contact.startConversation2')}</span></h2>
            <p className="opacity-60 text-xl leading-relaxed mb-16 max-w-lg font-sans">
              {t('contact.desc')}
            </p>

            <div className="space-y-12">
              {[
                { icon: <Phone size={32} />, value: '+91 90744 44467', label: t('contact.supportLine') },
                { icon: <Mail size={32} />, value: 'tushittravel@gmail.com', label: t('contact.generalInquiries') },
                { icon: <MapPin size={32} />, value: t('contact.address'), label: t('contact.corporateOffice') },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-8 group"
                >
                  <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(16,185,129,0)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-black text-3xl mb-2 font-outfit group-hover:text-emerald-400 transition-colors">{item.value}</p>
                    <p className="text-emerald-500/60 text-xs font-black uppercase tracking-[0.2em]">{item.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-20 flex gap-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <motion.a 
                  key={i} 
                  href="#" 
                  whileHover={{ y: -8, scale: 1.1 }}
                  className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center opacity-40 hover:text-black hover:bg-emerald-500 transition-all duration-500 shadow-xl"
                >
                  <Icon size={32} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-16 rounded-[4rem] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = String(formData.get('name') || '');
                const phone = String(formData.get('phone') || '');
                const email = String(formData.get('email') || '');
                const subject = String(formData.get('subject') || '');
                const message = String(formData.get('message') || '');

                try {
                  const res = await fetch('/api/inquiries', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, phone, email, subject, message })
                  });

                  if (!res.ok) {
                    throw new Error('Failed to save inquiry');
                  }

                  const whatsappMsg = 
                    `*New Contact Inquiry - Tushit Travel*\n\n` +
                    `*Name:* ${name}\n` +
                    `*Phone:* ${phone}\n` +
                    `*Email:* ${email}\n` +
                    `*Subject:* ${subject}\n` +
                    `*Message:* ${message}`;

                  const whatsappUrl = `https://wa.me/919074444467?text=${encodeURIComponent(whatsappMsg)}`;
                  window.open(whatsappUrl, '_blank');
                } catch (err) {
                  console.error('Inquiry submit error:', err);
                  alert('Failed to send inquiry. Please try again.');
                }
              }}
              className="space-y-10 relative z-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-emerald-500 font-outfit">{t('contact.formName')}</label>
                  <input name="name" type="text" placeholder={t('contact.formNamePlaceholder')} className="input-field py-5 px-8 text-lg" required />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-emerald-500 font-outfit">{t('contact.formPhone')}</label>
                  <input name="phone" type="tel" placeholder={t('contact.formPhonePlaceholder')} className="input-field py-5 px-8 text-lg" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-emerald-500 font-outfit">{t('contact.formEmail')}</label>
                  <input name="email" type="email" placeholder={t('contact.formEmailPlaceholder')} className="input-field py-5 px-8 text-lg" required />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-emerald-500 font-outfit">{t('contact.formSubject')}</label>
                  <input name="subject" type="text" placeholder={t('contact.formSubjectPlaceholder')} className="input-field py-5 px-8 text-lg" required />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-emerald-500 font-outfit">{t('contact.formMessage')}</label>
                <textarea name="message" placeholder={t('contact.formMessagePlaceholder')} className="input-field h-48 resize-none py-5 px-8 text-lg" required />
              </div>
              <button className="btn-vibrant w-full flex items-center justify-center gap-4 group py-6 text-xl">
                {t('contact.formSubmit')}
                <Send size={24} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
