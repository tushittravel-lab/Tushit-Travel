import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Navigation, 
  Plane, 
  ChevronRight, 
  ArrowRight, 
  Map, 
  TrendingUp,
  ShieldCheck,
  Clock4,
  Headphones,
  CheckCircle2
} from 'lucide-react';

export default function Services() {
  const { t } = useLanguage();
  const services = [
    { 
      id: 'local', 
      title: t('services.local'), 
      desc: t('services.localDesc'),
      icon: <Navigation size={48} />,
      features: ['Point-to-point', 'Hourly rentals', 'City tours']
    },
    { 
      id: 'airport', 
      title: t('services.airport'), 
      desc: t('services.airportDesc'),
      icon: <Plane size={48} />,
      features: ['Meet & Greet', 'Flight tracking', 'Luggage assistance']
    },
    { 
      id: 'one-way', 
      title: t('services.outstation'), 
      desc: t('services.outstationDesc'),
      icon: <ChevronRight size={48} />,
      features: ['Fixed pricing', 'Door-to-door', '24/7 availability']
    },
    { 
      id: 'round-trip', 
      title: t('services.corporate'), 
      desc: t('services.corporateDesc'),
      icon: <ArrowRight size={48} />,
      features: ['Flexible itinerary', 'Driver stay included', 'Multiple stops']
    },
    { 
      id: 'tour', 
      title: t('services.tours'), 
      desc: t('services.toursDesc'),
      icon: <Map size={48} />,
      features: ['Expert guides', 'Customizable', 'Hotel assistance']
    },
    { 
      id: 'long-distance', 
      title: t('services.wedding'), 
      desc: t('services.weddingDesc'),
      icon: <TrendingUp size={48} />,
      features: ['Premium fleet', 'Experienced drivers', 'Safety first']
    },
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
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=2000" 
          alt="Services Background"
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
            {t('services.badge')}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-9xl font-black mt-8 tracking-tighter leading-none font-outfit"
          >
            {t('services.title1')}<br />
            <span className="text-vibrant-gradient text-glow animate-rotate-hue inline-block hover:scale-105 transition-transform duration-500 cursor-default">{t('services.title2')}</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-12 rounded-[3.5rem] group hover:border-emerald-500/50 hover:bg-white/10 hover:-translate-y-4 transition-all duration-700 relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
              <div className="text-emerald-500 mb-10 group-hover:scale-110 group-hover:text-white transition-all duration-500">
                {React.cloneElement(service.icon as React.ReactElement, { size: 64 })}
              </div>
              <h3 className="text-4xl font-black mb-6 tracking-tight font-outfit group-hover:text-emerald-400 transition-colors">{service.title}</h3>
              <p className="opacity-40 text-lg leading-relaxed mb-10 group-hover:opacity-60 transition-colors">
                {service.desc}
              </p>
              <ul className="space-y-4 mb-12">
                {service.features.map(feature => (
                  <li key={feature} className="flex items-center gap-4 opacity-60 font-bold text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/#booking-form" className="w-full btn-vibrant py-5 block text-center text-lg">
                Book {service.title}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Trust Section */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: <ShieldCheck size={48} />, title: 'Safe & Secure', desc: 'Every ride is monitored 24/7 for your safety.' },
            { icon: <Clock4 size={48} />, title: 'Always On Time', desc: 'Punctuality is the core of our service philosophy.' },
            { icon: <Headphones size={48} />, title: 'Expert Support', desc: 'Dedicated team to assist you at every step.' },
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center p-12 glass-card rounded-[3rem] hover:bg-white/5 transition-all group"
            >
              <div className="text-emerald-500 mb-8 flex justify-center group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
              <h4 className="text-3xl font-black mb-4 font-outfit">{item.title}</h4>
              <p className="opacity-40 text-lg leading-relaxed group-hover:opacity-60 transition-colors">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
