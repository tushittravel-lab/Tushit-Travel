import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Car, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter,
  LayoutDashboard,
  Sun,
  Moon,
  Languages
} from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.faq'), href: '/faq' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isScrolled ? 'bg-[var(--bg)]/60 backdrop-blur-2xl py-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] border-b border-white/5' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-2 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <img 
              src="https://i.ibb.co/cWCR5s0/file-00000000eca07208a364f8764c41ea0a.png" 
              alt="TUSHIT TRAVEL" 
              className="h-16 w-auto object-contain group-hover:scale-110 transition-transform duration-500 relative z-10"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter leading-none group-hover:text-emerald-400 transition-colors font-outfit">TUSHIT</span>
            <span className="text-xs font-bold tracking-[0.3em] text-emerald-500 leading-none mt-1 group-hover:text-[var(--text)] transition-colors font-outfit">TRAVEL</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href} 
              className={`text-sm font-bold tracking-widest uppercase transition-all relative group/link font-outfit ${location.pathname === link.href ? 'text-emerald-500' : 'opacity-60 hover:opacity-100'}`}
            >
              {link.name}
              <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-emerald-500 transition-transform duration-300 origin-left ${location.pathname === link.href ? 'scale-x-100' : 'scale-x-0 group-hover/link:scale-x-100'}`} />
            </Link>
          ))}
          <div className="h-6 w-px bg-white/10 mx-2" />
          <button 
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="p-3 rounded-xl bg-white/5 opacity-60 hover:text-emerald-500 hover:opacity-100 hover:bg-white/10 transition-all flex items-center gap-2"
            title="Switch Language"
          >
            <Languages size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">{language === 'en' ? 'HI' : 'EN'}</span>
          </button>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <button 
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-white/5 opacity-60 hover:text-emerald-500 hover:opacity-100 hover:bg-white/10 transition-all"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <Link 
            to="/admin/login"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-colors group/admin font-outfit"
          >
            <LayoutDashboard className="w-4 h-4 group-hover/admin:rotate-12 transition-transform" />
            {t('nav.admin')}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-[var(--bg)]/95 backdrop-blur-2xl border-t border-white/5 overflow-hidden md:hidden"
          >
            <div className="flex flex-col p-8 gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className={`text-2xl font-black tracking-tighter ${location.pathname === link.href ? 'text-emerald-500' : 'text-white'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/admin/login"
                className="opacity-40 font-bold uppercase tracking-widest text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.admin')}
              </Link>
              <button 
                onClick={() => {
                  setLanguage(language === 'en' ? 'hi' : 'en');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 text-white/60 font-bold uppercase tracking-widest text-sm"
              >
                <Languages size={20} />
                {language === 'en' ? 'Hindi' : 'English'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-[var(--bg)] pt-32 pb-12 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <img 
                src="https://i.ibb.co/cWCR5s0/file-00000000eca07208a364f8764c41ea0a.png" 
                alt="TUSHIT TRAVEL" 
                className="h-14 w-auto object-contain group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <span className="text-2xl font-black tracking-tighter group-hover:text-emerald-400 transition-colors">TUSHIT TRAVEL</span>
            </Link>
            <p className="opacity-40 max-w-sm mb-10 leading-relaxed text-lg">
              {t('footer.desc')}
            </p>
            <div className="flex gap-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center opacity-40 hover:text-black hover:bg-emerald-500 transition-all duration-500 hover:-translate-y-2">
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-8">{t('footer.quickLinks')}</h4>
            <ul className="space-y-4 opacity-40 font-medium">
              <li><Link to="/" className="hover:text-emerald-500 transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/about" className="hover:text-emerald-500 transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/services" className="hover:text-emerald-500 transition-colors">{t('nav.services')}</Link></li>
              <li><Link to="/faq" className="hover:text-emerald-500 transition-colors">{t('nav.faq')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-8">{t('footer.contactUs')}</h4>
            <ul className="space-y-6 opacity-40 font-medium">
              <li className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-emerald-500 mt-1" />
                <div>
                  <p className="font-bold">tushittravel@gmail.com</p>
                  <p className="text-xs uppercase tracking-widest mt-1">General Inquiries</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-emerald-500 mt-1" />
                <div>
                  <p className="font-bold">Indore Sarafa Bazar M.P 452002</p>
                  <p className="text-xs uppercase tracking-widest mt-1">{t('footer.office')}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-20 text-[10px] font-bold uppercase tracking-[0.2em]">
          <p>© {new Date().getFullYear()} TUSHIT TRAVEL. {t('footer.rights')}</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:opacity-100 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:opacity-100 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const BackgroundBlobs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] animate-float rounded-full" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] animate-float rounded-full" style={{ animationDelay: '-5s' }} />
      <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-purple-500/10 blur-[120px] animate-float rounded-full" style={{ animationDelay: '-10s' }} />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-emerald-500/[0.03] blur-[150px] animate-morph" />
    </div>
  );
};

const MainLayout = () => {
  const location = useLocation();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundBlobs />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-[60] shadow-[0_0_10px_rgba(16,185,129,0.8)]"
        style={{ scaleX: scrollYProgress }}
      />
      <Navbar />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
