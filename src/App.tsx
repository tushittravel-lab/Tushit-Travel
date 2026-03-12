import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { LanguageProvider } from './contexts/LanguageContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Main Website Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<TermsOfService />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </LanguageProvider>
  );
}
