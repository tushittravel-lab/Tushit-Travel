import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Navigation, 
  Plane, 
  ChevronRight, 
  ArrowRight, 
  Map, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Car,
  Phone,
  ShieldCheck,
  Clock4,
  Headphones,
  CheckCircle2,
  Star,
  Briefcase,
  TrendingUp,
  Award,
  Zap,
  Briefcase as Luggage,
  X,
  Maximize2
} from 'lucide-react';
import { getDirectImageUrl } from '../utils/image';

// --- Components ---

const BookingForm = ({ variant = 'hero', initialData = null, onClose = () => {} }: { variant?: 'hero' | 'modal', initialData?: any, onClose?: () => void }) => {
  const { t } = useLanguage();
  const [tripType, setTripType] = useState('one-way');
  const [fleet, setFleet] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [formData, setFormData] = useState({
    pickup: '',
    drop: '',
    date: '',
    time: '',
    mobile: '',
    passengers: 1,
    carId: initialData?.id || '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    returnDate: '',
    duration: 1,
    tourType: 'fixed',
    flightNumber: '',
    instructions: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, carId: initialData.id }));
    }
  }, [initialData]);

  useEffect(() => {
    const loadFleet = async (retries = 3) => {
      try {
        const res = await fetch('/api/fleet');
        if (!res.ok) throw new Error('Failed to fetch fleet');
        const data = await res.json();
        setFleet(data);
      } catch (err) {
        console.error('Error loading fleet:', err);
        if (retries > 0) {
          setTimeout(() => loadFleet(retries - 1), 1000);
        }
      }
    };

    const loadSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      }
    };

    loadFleet();
    loadSettings();
  }, []);

  const tripTypes = [
    { id: 'local', label: 'City Mobility', icon: <Navigation className="w-4 h-4" /> },
    { id: 'airport', label: 'Airport Concierge', icon: <Plane className="w-4 h-4" /> },
    { id: 'one-way', label: 'Direct Transfer', icon: <ChevronRight className="w-4 h-4" /> },
    { id: 'round-trip', label: 'Return Journey', icon: <ArrowRight className="w-4 h-4" /> },
    { id: 'tour', label: 'Curated Expedition', icon: <Map className="w-4 h-4" /> },
    { id: 'long-distance', label: 'Interstate Travel', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct WhatsApp Message
    const car = fleet.find(c => c.id.toString() === formData.carId.toString());
    const selectedCar = car?.name || 'Any';
    const carNumber = car?.car_number || 'N/A';
    const carRate = car?.price_per_km ? `₹${car.price_per_km}/km` : 'N/A';
    
    const message = `*New Booking Request - Tushit Travel*%0A%0A` +
      `*Customer:* ${formData.customerName}%0A` +
      `*Email:* ${formData.customerEmail}%0A` +
      `*Phone:* ${formData.customerPhone}%0A` +
      `*Trip Type:* ${tripType}%0A` +
      `*Pickup:* ${formData.pickup}%0A` +
      `*Drop:* ${formData.drop || 'N/A'}%0A` +
      `*Date:* ${formData.date}%0A` +
      `*Time:* ${formData.time}%0A` +
      `*Passengers:* ${formData.passengers}%0A` +
      `*Vehicle:* ${selectedCar}%0A` +
      `*Car Number:* ${carNumber}%0A` +
      `*Rate:* ${carRate}%0A` +
      (formData.flightNumber ? `*Flight:* ${formData.flightNumber}%0A` : '') +
      (formData.instructions ? `*Instructions:* ${formData.instructions}%0A` : '');

    const whatsappNumber = settings.whatsapp_number || '919074444467';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    try {
      // Save to DB first
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripType,
          ...formData
        })
      });

      if (response.ok) {
        window.open(whatsappUrl, '_blank');
        alert('Booking request sent! Redirecting to WhatsApp for confirmation...');
        if (variant === 'modal') onClose();
      } else {
        const errorData = await response.json();
        alert(`Failed to save booking: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to send booking request. Please check your connection and try again.');
    }
  };

  const containerClass = variant === 'hero' 
    ? "w-full max-w-5xl mx-auto glass-card rounded-[2.5rem] overflow-hidden"
    : "w-full glass-card rounded-3xl overflow-hidden border-white/10";

  return (
    <div className={containerClass} id="booking-form">
      {variant === 'modal' && (
        <div className="bg-emerald-500/10 p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            {initialData?.image_url && (
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-2xl bg-black/20">
                <img src={getDirectImageUrl(initialData.image_url)} className="w-full h-full object-contain" alt={initialData.name} referrerPolicy="no-referrer" />
              </div>
            )}
            <div>
              <h4 className="text-2xl font-black tracking-tight uppercase font-outfit">Complete Your Booking</h4>
              {initialData && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                  <p className="text-emerald-500 text-xs font-black uppercase tracking-widest">
                    {initialData.name}
                  </p>
                  {initialData.car_number && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                        {initialData.car_number}
                      </p>
                    </>
                  )}
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                    {initialData.category}
                  </p>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                    ₹{initialData.price_per_km}/km
                  </p>
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-white/40 hover:text-white group"
          >
            <X size={24} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-white/5 bg-black/40 p-2 gap-2">
        {tripTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setTripType(type.id)}
            className={`flex items-center gap-3 px-6 py-3 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all rounded-2xl relative ${tripType === type.id ? 'bg-vibrant-gradient text-white shadow-xl shadow-emerald-500/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            {type.icon}
            {type.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5 pointer-events-none" />
        
        {variant === 'modal' && initialData && (
          <div className="col-span-full bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-wrap items-center gap-8 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Car size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Selected Vehicle</p>
                <p className="text-lg font-black uppercase tracking-tight">{initialData.name}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10 hidden md:block" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Vehicle Number</p>
              <p className="text-lg font-black uppercase tracking-tight text-emerald-500">{initialData.car_number || 'N/A'}</p>
            </div>
            <div className="h-8 w-px bg-white/10 hidden md:block" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Category</p>
              <p className="text-lg font-black uppercase tracking-tight">{initialData.category}</p>
            </div>
            <div className="h-8 w-px bg-white/10 hidden md:block" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Rate</p>
              <p className="text-lg font-black uppercase tracking-tight text-emerald-400">₹{initialData.price_per_km}/km</p>
            </div>
          </div>
        )}

        <div className="space-y-3 relative z-10 hidden">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-2">
            <Phone size={12} /> Mobile Number
          </label>
          <input 
            type="tel" 
            placeholder="Enter your phone number"
            className="input-field"
            value={formData.mobile}
            onChange={e => setFormData({...formData, mobile: e.target.value})}
          />
        </div>

        <div className="space-y-3 relative z-10">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-2">
            <MapPin size={12} /> Pickup Location
          </label>
          <input 
            type="text" 
            placeholder="Enter city or address"
            className="input-field"
            value={formData.pickup}
            onChange={e => setFormData({...formData, pickup: e.target.value})}
            required
          />
        </div>

        {tripType !== 'local' && (
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-2">
              <MapPin size={12} /> Drop Location
            </label>
            <input 
              type="text" 
              placeholder="Enter destination"
              className="input-field"
              value={formData.drop}
              onChange={e => setFormData({...formData, drop: e.target.value})}
              required={tripType !== 'local'}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-2">
              <Calendar size={12} /> Date
            </label>
            <input 
              type="date" 
              className="input-field [color-scheme:dark]"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-2">
              <Clock size={12} /> Time
            </label>
            <input 
              type="time" 
              className="input-field [color-scheme:dark]"
              value={formData.time}
              onChange={e => setFormData({...formData, time: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-2">
            <Users size={12} /> Passengers
          </label>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <button 
              type="button"
              onClick={() => setFormData({...formData, passengers: Math.max(1, formData.passengers - 1)})}
              className="px-5 py-3 text-white hover:bg-white/10 transition-colors border-r border-white/10"
            >-</button>
            <input 
              type="number" 
              className="w-full bg-transparent text-center text-white font-bold focus:outline-none"
              value={formData.passengers}
              readOnly
            />
            <button 
              type="button"
              onClick={() => setFormData({...formData, passengers: Math.min(10, formData.passengers + 1)})}
              className="px-5 py-3 text-white hover:bg-white/10 transition-colors border-l border-white/10"
            >+</button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-2">
            <Car size={12} /> Vehicle Type
          </label>
          <select 
            className="input-field appearance-none"
            value={formData.carId}
            onChange={e => setFormData({...formData, carId: e.target.value})}
            required
          >
            <option value="" className="bg-zinc-900">Select Car</option>
            {fleet.map(car => (
              <option key={car.id} value={car.id} className="bg-zinc-900">{car.name} ({car.category})</option>
            ))}
          </select>
        </div>

        {tripType === 'round-trip' && (
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-2">
              <Calendar size={12} /> Return Date
            </label>
            <input 
              type="date" 
              className="input-field [color-scheme:dark]"
              value={formData.returnDate}
              onChange={e => setFormData({...formData, returnDate: e.target.value})}
              required
            />
          </div>
        )}

        {tripType === 'tour' && (
          <>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-2">
                <Calendar size={12} /> Duration (Days)
              </label>
              <input 
                type="number" 
                min="1"
                className="input-field"
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})}
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-2">
                <Map size={12} /> Tour Type
              </label>
              <select 
                className="input-field appearance-none"
                value={formData.tourType}
                onChange={e => setFormData({...formData, tourType: e.target.value})}
              >
                <option value="fixed" className="bg-zinc-900">Fixed Package</option>
                <option value="custom" className="bg-zinc-900">Custom Tour</option>
              </select>
            </div>
          </>
        )}

        {tripType === 'airport' && (
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-2">
              <Plane size={12} /> Flight Number
            </label>
            <input 
              type="text" 
              placeholder="e.g. AI-101"
              className="input-field"
              value={formData.flightNumber}
              onChange={e => setFormData({...formData, flightNumber: e.target.value})}
            />
          </div>
        )}

        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Full Name</label>
            <input 
              type="text" 
              placeholder="Your Name"
              className="input-field"
              value={formData.customerName}
              onChange={e => setFormData({...formData, customerName: e.target.value})}
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Email Address</label>
            <input 
              type="email" 
              placeholder="email@example.com"
              className="input-field"
              value={formData.customerEmail}
              onChange={e => setFormData({...formData, customerEmail: e.target.value})}
              required
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Phone Number</label>
            <input 
              type="tel" 
              placeholder="+91 00000 00000"
              className="input-field"
              value={formData.customerPhone}
              onChange={e => setFormData({...formData, customerPhone: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="md:col-span-3 space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-2">
            Special Instructions
          </label>
          <textarea 
            placeholder="Any specific requirements?"
            className="input-field h-24 resize-none"
            value={formData.instructions}
            onChange={e => setFormData({...formData, instructions: e.target.value})}
          />
        </div>

        <div className="md:col-span-3 flex flex-col md:flex-row items-center justify-end gap-8 pt-6 border-t border-white/5">
          <div className="flex items-center gap-6 mr-auto">
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Estimated Fare</p>
              <p className="text-3xl font-black text-white">₹ ---</p>
            </div>
            <button 
              type="button" 
              onClick={() => alert('Fare breakdown will be available after selecting pickup and drop locations.')}
              className="text-xs font-bold text-emerald-500 hover:underline"
            >
              Fare Breakdown
            </button>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              type="submit"
              className="flex-1 md:flex-none btn-primary flex items-center justify-center gap-3 group"
            >
              Book Now
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const FullscreenImage = ({ src, isOpen, onClose }: { src: string, isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-md p-4" 
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 z-[1010] w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-emerald-500 transition-all"
      >
        <X size={24} />
      </button>
      <motion.img 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        src={getDirectImageUrl(src)} 
        alt="Fullscreen" 
        className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        referrerPolicy="no-referrer"
      />
    </motion.div>
  );
};

const CarDetailsModal = ({ car, isOpen, onClose, onBook, onFullscreen }: { car: any, isOpen: boolean, onClose: () => void, onBook: (car: any) => void, onFullscreen: (src: string) => void }) => {
  const [activeImage, setActiveImage] = useState(car?.image_url);
  const [ratings, setRatings] = useState<any[]>([]);
  const [userRating, setUserRating] = useState({ rating: 0, comment: '', name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { t } = useLanguage();

  const fetchRatings = async () => {
    if (!car) return;
    try {
      const res = await fetch(`/api/ratings/${car.id}`);
      if (res.ok) {
        const data = await res.json();
        setRatings(data);
      }
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };

  useEffect(() => {
    if (car) {
      setActiveImage(car.image_url);
      fetchRatings();
      
      // Check if user has already rated this car
      const savedRating = localStorage.getItem(`rating_${car.id}`);
      if (savedRating) {
        const parsed = JSON.parse(savedRating);
        setUserRating({ rating: parsed.rating, comment: parsed.comment, name: parsed.customer_name });
        setEditingId(parsed.id);
      } else {
        setUserRating({ rating: 0, comment: '', name: '' });
        setEditingId(null);
      }
    }
  }, [car]);

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRating.rating === 0) {
      alert("Please select a rating");
      return;
    }
    setIsSubmitting(true);
    try {
      const url = editingId ? `/api/ratings/${editingId}` : '/api/ratings';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: car.id,
          customerName: userRating.name,
          rating: userRating.rating,
          comment: userRating.comment
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (!editingId) {
          localStorage.setItem(`rating_${car.id}`, JSON.stringify({
            id: result.id,
            car_id: car.id,
            customer_name: userRating.name,
            rating: userRating.rating,
            comment: userRating.comment
          }));
          setEditingId(result.id);
        } else {
          localStorage.setItem(`rating_${car.id}`, JSON.stringify({
            id: editingId,
            car_id: car.id,
            customer_name: userRating.name,
            rating: userRating.rating,
            comment: userRating.comment
          }));
        }
        fetchRatings();
        alert(editingId ? "Rating updated!" : "Rating submitted!");
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !car) return null;

  const images = [
    { label: 'Main', url: car.image_url },
    { label: 'Front', url: car.image_front },
    { label: 'Side', url: car.image_side },
    { label: 'Interior', url: car.image_interior },
    { label: 'Seats', url: car.image_seats },
    { label: 'Boot', url: car.image_boot },
  ].filter(img => img.url);

  const features = car.features ? car.features.split(',').map((f: string) => f.trim()) : [];
  const bestUse = car.best_use ? car.best_use.split(',').map((f: string) => f.trim()) : [];

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 backdrop-blur-xl">
      <div className="min-h-screen flex items-center justify-center p-4 md:p-10 relative">
        <div className="absolute inset-0" onClick={onClose} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-card w-full max-w-6xl rounded-[3rem] overflow-hidden relative flex flex-col lg:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 z-50 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-emerald-500 transition-all"
          >
            <X size={24} />
          </button>

        {/* Left: Images */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col gap-6 bg-white/5">
          <div 
            className="aspect-[16/10] rounded-[2rem] overflow-hidden relative group bg-black/20 cursor-zoom-in"
            onClick={() => onFullscreen(activeImage)}
          >
            <img 
              src={getDirectImageUrl(activeImage)} 
              alt={car.name} 
              className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
                <Maximize2 size={18} />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-8">
              <h2 className="text-4xl font-black tracking-tighter uppercase font-outfit">{car.name}</h2>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-emerald-500 font-black text-xs uppercase tracking-[0.3em]">{car.category} • {car.car_number || 'Premium'}</p>
                {car.review_count > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                    <Star size={12} className="fill-emerald-500 text-emerald-500" />
                    <span className="text-[10px] font-black text-white">{Number(car.avg_rating).toFixed(1)}</span>
                    <span className="text-[8px] font-bold text-white/40">({car.review_count} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-3">
            {images.map((img, idx) => (
              <button 
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage(img.url);
                }}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all relative group/thumb ${activeImage === img.url ? 'border-emerald-500 scale-105 shadow-lg shadow-emerald-500/20' : 'border-transparent opacity-40 hover:opacity-100'}`}
              >
                <img src={getDirectImageUrl(img.url)} className="w-full h-full object-contain bg-black/20" referrerPolicy="no-referrer" />
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFullscreen(img.url);
                  }}
                >
                  <Maximize2 size={14} className="text-white" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 p-8 rounded-3xl bg-white/5 border border-white/10">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4">Driver Details</h4>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Users size={20} />
              </div>
              <p className="text-sm opacity-60 leading-relaxed italic">
                {car.driver_details || 'Professional verified driver included with every trip. Experienced in long-distance and local routes.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <div className="space-y-10">
            {/* Pricing */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Per KM</p>
                <p className="text-2xl font-black font-outfit text-emerald-400">₹{car.price_per_km}</p>
              </div>
              <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Per Day</p>
                <p className="text-2xl font-black font-outfit text-blue-400">₹{car.price_per_day || '2500'}</p>
              </div>
              <div className="p-6 rounded-3xl bg-purple-500/10 border border-purple-500/20 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Per Hour</p>
                <p className="text-2xl font-black font-outfit text-purple-400">₹{car.price_per_hour || '800'}</p>
              </div>
            </div>

            {/* Quick Specs */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-6">Quick Specifications</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500"><Users size={18} /></div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest opacity-20">Capacity</p>
                    <p className="font-bold">{car.capacity} Seats</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500"><Luggage size={18} /></div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest opacity-20">Luggage</p>
                    <p className="font-bold">{car.luggage} Bags</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500"><Zap size={18} /></div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest opacity-20">Fuel / Trans</p>
                    <p className="font-bold">{car.fuel_type || 'Diesel'} • {car.transmission || 'Manual'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500"><CheckCircle2 size={18} /></div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest opacity-20">AC / Driver</p>
                    <p className="font-bold">{car.has_ac ? 'AC' : 'Non-AC'} • {car.driver_included ? 'Driver Incl.' : 'Self Drive'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-6">Premium Features</h4>
              <div className="flex flex-wrap gap-3">
                {features.length > 0 ? features.map((f, i) => (
                  <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" /> {f}
                  </span>
                )) : (
                  <>
                    <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Air Conditioner</span>
                    <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Music System</span>
                    <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Mobile Charging</span>
                  </>
                )}
              </div>
            </div>

            {/* Best For */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-6">Best Use Case</h4>
              <div className="flex flex-wrap gap-3">
                {bestUse.length > 0 ? bestUse.map((f, i) => (
                  <span key={i} className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                    {f}
                  </span>
                )) : (
                  <>
                    <span className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">Family Trip</span>
                    <span className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">Airport Pickup</span>
                    <span className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">Wedding</span>
                  </>
                )}
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <button 
                onClick={() => onBook(car)}
                className="btn-vibrant w-full py-6 text-lg flex items-center justify-center gap-3"
              >
                <Calendar size={24} />
                Book This {car.name} Now
              </button>
              <p className="text-center text-[10px] font-bold uppercase tracking-widest opacity-20 mt-4">No advance payment required for booking</p>
            </div>

            {/* Ratings Section */}
            <div className="pt-10 border-t border-white/5">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-8">Customer Reviews</h4>
              
              {/* Rating Summary */}
              {ratings.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 p-8 rounded-3xl bg-white/5 border border-white/10">
                  <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 pb-8 md:pb-0 md:pr-8">
                    <p className="text-6xl font-black text-emerald-500 font-outfit">
                      {(ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)}
                    </p>
                    <div className="flex gap-1 my-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={i < Math.round(ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length) ? "fill-emerald-500 text-emerald-500" : "text-white/10"}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40">Based on {ratings.length} Reviews</p>
                  </div>
                  
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = ratings.filter(r => r.rating === star).length;
                      const percentage = (count / ratings.length) * 100;
                      return (
                        <div key={star} className="flex items-center gap-4">
                          <div className="flex items-center gap-1 w-12">
                            <span className="text-xs font-bold text-white/60">{star}</span>
                            <Star size={10} className="fill-white/20 text-white/20" />
                          </div>
                          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${percentage}%` }}
                              className={`h-full rounded-full ${star >= 4 ? 'bg-emerald-500' : star === 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-white/40 w-8">{count}</span>
                        </div>
                      );
                    })}
                    <div className="pt-4 flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-emerald-500">Positive: {ratings.filter(r => r.rating >= 4).length}</span>
                      <span className="text-red-500">Negative: {ratings.filter(r => r.rating <= 2).length}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Rating Form */}
              <form onSubmit={handleRatingSubmit} className="bg-white/5 rounded-3xl p-8 border border-white/10 mb-10">
                <p className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-6">
                  {editingId ? "Edit Your Review" : "Share Your Experience"}
                </p>
                
                <div className="flex gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating({ ...userRating, rating: star })}
                      className="transition-transform hover:scale-125"
                    >
                      <Star
                        size={28}
                        className={star <= userRating.rating ? "fill-emerald-500 text-emerald-500" : "text-white/20"}
                      />
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="input-field"
                    value={userRating.name}
                    onChange={(e) => setUserRating({ ...userRating, name: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Write your comment..."
                    className="input-field h-24 resize-none"
                    value={userRating.comment}
                    onChange={(e) => setUserRating({ ...userRating, comment: e.target.value })}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-emerald-500 text-black font-black uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : (editingId ? "Update Review" : "Submit Review")}
                  </button>
                </div>
              </form>

              {/* Ratings List */}
              <div className="space-y-6">
                {ratings.length > 0 ? ratings.map((r) => (
                  <div key={r.id} className={`p-6 rounded-2xl bg-white/5 border ${r.rating >= 4 ? 'border-emerald-500/10' : r.rating <= 2 ? 'border-red-500/10' : 'border-white/5'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black uppercase ${r.rating >= 4 ? 'bg-emerald-500/20 text-emerald-500' : r.rating <= 2 ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-white/60'}`}>
                          {r.customer_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black uppercase tracking-tight text-white">{r.customer_name}</p>
                          <div className="flex gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={i < r.rating ? (r.rating >= 4 ? "fill-emerald-500 text-emerald-500" : r.rating <= 2 ? "fill-red-500 text-red-500" : "fill-yellow-500 text-yellow-500") : "text-white/10"}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] font-bold text-white/20 uppercase">
                        {new Date(r.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {r.comment && (
                      <p className="text-sm opacity-60 leading-relaxed italic pl-11">"{r.comment}"</p>
                    )}
                  </div>
                )) : (
                  <p className="text-center py-10 text-white/20 text-xs font-bold uppercase tracking-widest">No reviews yet. Be the first to rate!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
  );
};

const FleetSection = ({ onViewDetails, onBook, onFullscreen }: { onViewDetails: (car: any) => void, onBook: (car: any) => void, onFullscreen: (src: string) => void }) => {
  const { t } = useLanguage();
  const [fleet, setFleet] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const loadFleet = async (retries = 3) => {
      try {
        const res = await fetch('/api/fleet');
        if (!res.ok) throw new Error('Failed to fetch fleet');
        const data = await res.json();
        setFleet(data);
      } catch (err) {
        console.error('Error loading fleet:', err);
        if (retries > 0) {
          setTimeout(() => loadFleet(retries - 1), 1000);
        }
      }
    };
    loadFleet();
  }, []);

  const categories = ['All', 'Sedan', 'SUV', 'MUV', 'Luxury'];
  const filteredFleet = filter === 'All' ? fleet : fleet.filter(car => car.category === filter);

  return (
    <section className="py-20 md:py-40 bg-[var(--bg)] relative" id="fleet-section">
      {/* Background Visuals */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-20"
        >
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000" 
            alt="Fleet Background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <div className="absolute inset-0 mesh-gradient opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-32">
          <div className="max-w-2xl relative">
            <div className="absolute -top-20 -left-10 text-[15rem] font-black text-white/[0.02] select-none pointer-events-none font-outfit uppercase whitespace-nowrap">
              Premium
            </div>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-emerald-500 font-black tracking-[0.6em] uppercase text-xs font-outfit block mb-6 relative z-10"
            >
              {t('fleet.badge')}
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-9xl font-black tracking-tighter font-outfit leading-[0.85] relative z-10"
            >
              {t('fleet.title1')}<br />
              <span className="text-vibrant-gradient text-glow animate-rotate-hue">{t('fleet.title2')}</span>
            </motion.h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap border ${filter === cat ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredFleet.map((car, idx) => (
              <motion.div 
                key={car.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="glass-card rounded-[3.5rem] overflow-hidden group hover:border-emerald-500/50 hover:bg-white/10 hover:-translate-y-6 transition-all duration-700 relative"
              >
                <div 
                  className="aspect-[16/11] overflow-hidden relative cursor-zoom-in bg-black/20"
                  onClick={() => onFullscreen(car.image_url)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                  <img 
                    src={getDirectImageUrl(car.image_url)} 
                    alt={car.name} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />

                  {/* Zoom Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onFullscreen(car.image_url);
                    }}
                    className="absolute top-8 left-8 z-40 w-10 h-10 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-emerald-500 transition-all opacity-0 group-hover:opacity-100"
                    title="View Fullscreen"
                  >
                    <Maximize2 size={18} />
                  </button>
                  
                  {/* Status Badge */}
                  <div className="absolute top-8 right-8 z-20 flex flex-col items-end gap-2">
                    <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-md border ${
                      car.status === 'available' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-red-500/20 border-red-500/50 text-red-400'
                    }`}>
                      {car.status}
                    </div>
                    {car.review_count > 0 && (
                      <div className="bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
                        <Star size={12} className="fill-emerald-500 text-emerald-500" />
                        <span className="text-[10px] font-black text-white">{Number(car.avg_rating).toFixed(1)}</span>
                        <span className="text-[8px] font-bold text-white/40">({car.review_count})</span>
                      </div>
                    )}
                  </div>

                  {/* Floating Price */}
                  <div className="absolute bottom-8 left-10 z-20">
                    <p className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.3em] mb-1">Starting from</p>
                    <p className="text-4xl font-black text-white font-outfit tracking-tighter">₹{car.price_per_km}<span className="text-sm opacity-40 font-bold tracking-normal ml-1">/km</span></p>
                  </div>

                </div>

                <div className="p-12">
                  <div className="mb-10">
                    <h3 className="text-4xl font-black tracking-tighter mb-3 font-outfit group-hover:text-emerald-400 transition-colors uppercase">{car.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-white/40 font-bold text-xs uppercase tracking-widest">
                        {car.category} • {car.car_number || 'Premium'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 mb-12 border-y border-white/5 py-10 group-hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500">
                        <Users size={24} />
                      </div>
                      <div>
                        <p className="text-2xl font-black font-outfit">{car.capacity}</p>
                        <p className="opacity-20 text-[10px] font-black uppercase tracking-widest">Seats</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500">
                        <Zap size={24} />
                      </div>
                      <div>
                        <p className="text-2xl font-black font-outfit">{car.transmission || 'Manual'}</p>
                        <p className="opacity-20 text-[10px] font-black uppercase tracking-widest">Trans</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => onViewDetails(car)}
                    className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 font-black uppercase tracking-widest text-xs hover:bg-emerald-500 hover:text-black transition-all duration-500 flex items-center justify-center gap-3 group/btn"
                  >
                    View Full Details
                    <ChevronRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                  </button>

                  <button 
                    onClick={() => onBook(car)}
                    className="w-full btn-vibrant flex items-center justify-center gap-4 group/btn py-6 text-sm"
                  >
                    Select Vehicle
                    <ChevronRight className="group-hover/btn:translate-x-2 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const Hero = () => {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
      {/* Background Cinematic Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[var(--bg)] z-10" />
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=80" 
          className="w-full h-full object-cover opacity-60"
          alt="Hero Background"
          referrerPolicy="no-referrer"
        />
        
        {/* Animated Particles/Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              x: [0, 100, 0], 
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ 
              x: [0, -100, 0], 
              y: [0, 50, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px]"
          />
        </div>

        {/* Animated Route Lines Overlay (SVG) */}
        <svg className="absolute inset-0 w-full h-full opacity-30 z-10 pointer-events-none" viewBox="0 0 1000 1000">
          <motion.path
            d="M0,500 Q250,250 500,500 T1000,500"
            fill="none"
            stroke="url(#grad1)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-6 py-2 mb-10"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] font-outfit">{t('hero.badge')}</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-5xl md:text-[10rem] font-black text-white tracking-tighter leading-[0.8] mb-10 font-outfit"
        >
          <motion.span
            animate={{ color: ['#ffffff', '#10b981', '#3b82f6', '#ffffff'] }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            {t('hero.title1')}
          </motion.span>
          <br />
          <span className="text-vibrant-gradient text-glow animate-rotate-hue inline-block hover:scale-105 transition-transform duration-500 cursor-default">{t('hero.title2')}</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/80 text-xl md:text-2xl max-w-3xl mx-auto font-medium mb-16 leading-relaxed font-sans"
        >
          {t('hero.subtitle')}
        </motion.p>
        
        {/* Floating Trust Badges */}
        <div className="mt-20 flex flex-wrap justify-center gap-12">
          {[
            { icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />, label: t('hero.verifiedDrivers') },
            { icon: <Clock4 className="w-6 h-6 text-emerald-500" />, label: t('hero.onTime') },
            { icon: <Headphones className="w-6 h-6 text-emerald-500" />, label: t('hero.support') },
          ].map((badge, idx) => (
            <motion.div 
              key={badge.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.1)' }}
              className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/5 px-6 py-3 rounded-2xl text-white/60 font-black text-xs uppercase tracking-widest transition-all"
            >
              {badge.icon}
              {badge.label}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LiveAvailability = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ total: 0, available: 0, onTrip: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('/api/availability')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch availability');
          return res.json();
        })
        .then(setStats)
        .catch(err => console.error('Error loading availability:', err));
    }, 5000);
    fetch('/api/availability')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch availability');
        return res.json();
      })
      .then(setStats)
      .catch(err => console.error('Error loading availability:', err));
    return () => clearInterval(interval);
  }, []);

  const statItems = [
    { label: t('home.availability.total'), value: stats.total, color: 'text-white', icon: <Car className="w-8 h-8" />, bg: 'bg-blue-500/10' },
    { label: t('home.availability.available'), value: stats.available, color: 'text-emerald-400', icon: <CheckCircle2 className="w-8 h-8" />, bg: 'bg-emerald-500/10' },
    { label: t('home.availability.onTrip'), value: stats.onTrip, color: 'text-amber-400', icon: <TrendingUp className="w-8 h-8" />, bg: 'bg-amber-500/10' },
  ];

  return (
    <section className="py-20 bg-[var(--bg)] relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=2000" 
          alt="Availability Background"
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statItems.map((item, idx) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card rounded-[2.5rem] p-12 relative overflow-hidden group border-white/5"
            >
              <div className={`absolute -top-10 -right-10 w-40 h-40 ${item.bg} rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`} />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center opacity-40 mb-8 group-hover:text-emerald-500 transition-colors">
                  {item.icon}
                </div>
                <p className="opacity-40 text-xs font-black uppercase tracking-[0.4em] mb-4 font-outfit">{item.label}</p>
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)] ${item.label.includes('Available') || item.label.includes('उपलब्ध') ? 'bg-emerald-500' : 'bg-white/10'}`} />
                  <span className="text-xs font-bold opacity-60 uppercase tracking-widest">{t('home.availability.liveStatus')}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  const { t } = useLanguage();
  const points = [
    { title: t('home.why.verified'), desc: t('home.why.verifiedDesc'), icon: <ShieldCheck />, color: 'from-emerald-500 to-teal-500', size: 'large' },
    { title: t('home.why.pricing'), desc: t('home.why.pricingDesc'), icon: <Award />, color: 'from-blue-500 to-indigo-500', size: 'small' },
    { title: t('home.why.clean'), desc: t('home.why.cleanDesc'), icon: <CheckCircle2 />, color: 'from-purple-500 to-pink-500', size: 'small' },
    { title: t('home.why.coverage'), desc: t('home.why.coverageDesc'), icon: <Map />, color: 'from-amber-500 to-orange-500', size: 'small' },
    { title: t('home.why.support'), desc: t('home.why.supportDesc'), icon: <Headphones />, color: 'from-cyan-500 to-blue-500', size: 'large' },
    { title: t('home.why.booking'), desc: t('home.why.bookingDesc'), icon: <Zap />, color: 'from-red-500 to-rose-500', size: 'small' },
  ];

  return (
    <section className="py-20 md:py-32 bg-[var(--bg)] relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000" 
          alt="Edge Background"
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
      </div>
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-5s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-emerald-500 font-black tracking-[0.5em] uppercase text-xs font-outfit"
          >
            {t('home.edge.badge')}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-8xl font-black mt-6 tracking-tighter font-outfit leading-none"
          >
            {t('home.edge.title1')}<br />
            <span className="text-vibrant-gradient">{t('home.edge.title2')}</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {points.map((item, idx) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`glass-card p-10 rounded-[2.5rem] hover:border-emerald-500/50 hover:bg-white/10 hover:-translate-y-2 transition-all group cursor-default relative overflow-hidden ${item.size === 'large' ? 'md:col-span-2' : 'md:col-span-1'}`}
            >
              <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`} />
              <div className="flex flex-col h-full justify-between relative z-10">
                <div>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-8 group-hover:scale-110 shadow-lg transition-all duration-500`}>
                    {React.cloneElement(item.icon as React.ReactElement, { size: 32 })}
                  </div>
                  <h4 className="text-3xl font-black mb-4 group-hover:text-emerald-400 transition-colors font-outfit">{item.title}</h4>
                  <p className="opacity-40 text-lg leading-relaxed group-hover:opacity-60 transition-colors">{item.desc}</p>
                </div>
                {item.size === 'large' && (
                  <div className="mt-12 flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800 overflow-hidden">
                          <img src={`https://picsum.photos/seed/${i+idx}/100/100`} alt="User" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs font-bold opacity-40 uppercase tracking-widest">{t('home.why.trusted')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const { t } = useLanguage();
  const reviews = [
    { name: 'Rahul Sharma', city: 'Delhi', text: t('home.testimonials.r1'), rating: 5 },
    { name: 'Priya Patel', city: 'Mumbai', text: t('home.testimonials.r2'), rating: 5 },
    { name: 'Ankit Verma', city: 'Bangalore', text: t('home.testimonials.r3'), rating: 5 },
  ];

  return (
    <section className="py-20 md:py-32 bg-[var(--bg)] relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=2000" 
          alt="Testimonials Background"
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
      </div>
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#10b981_0%,transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-emerald-500 font-black tracking-[0.5em] uppercase text-xs font-outfit"
          >
            {t('home.testimonials.badge')}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black mt-6 tracking-tighter font-outfit"
          >
            {t('home.testimonials.title1')} <span className="gradient-text">{t('home.testimonials.title2')}</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-12 rounded-[3rem] relative hover:bg-white/10 hover:border-emerald-500/30 transition-all group"
            >
              <div className="flex gap-1 mb-8">
                {[...Array(item.rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-5 h-5 fill-emerald-500 text-emerald-500 group-hover:scale-125 transition-transform" 
                    style={{ transitionDelay: `${i * 50}ms` }}
                  />
                ))}
              </div>
              <p className="text-xl opacity-70 mb-10 italic leading-relaxed group-hover:opacity-100 transition-colors">"{item.text}"</p>
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-2xl font-black group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500 overflow-hidden">
                    <img src={`https://picsum.photos/seed/${item.name}/100/100`} alt={item.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                    <span className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity">{item.name[0]}</span>
                  </div>
                </div>
                <div>
                  <p className="font-black text-xl group-hover:text-emerald-400 transition-colors font-outfit">{item.name}</p>
                  <p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-widest">{item.city} • {t('home.testimonials.verified')}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ExperienceSection = () => {
  const { t } = useLanguage();
  return (
    <section className="relative py-20 md:py-40 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80" 
          className="w-full h-full object-cover opacity-40"
          alt="Luxury Car"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/80 to-transparent z-10" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-emerald-500 font-black tracking-[0.5em] uppercase text-xs font-outfit"
          >
            {t('home.experience.badge')}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-8xl font-black mt-6 tracking-tighter font-outfit leading-none mb-10"
          >
            {t('home.experience.title1')} <br />
            <span className="gradient-text">{t('home.experience.title2')}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="opacity-60 text-xl leading-relaxed mb-12 font-sans"
          >
            {t('home.experience.desc')}
          </motion.p>
          
          <div className="grid grid-cols-2 gap-8 mb-12">
            {/* Stats removed as requested */}
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-vibrant group flex items-center gap-4"
            onClick={() => document.getElementById('fleet-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t('common.exploreFleet')}
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [selectedCarForDetails, setSelectedCarForDetails] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const handleSelectCar = (car: any) => {
    setSelectedCarForDetails(car);
  };

  const handleBookCar = (car: any) => {
    setSelectedCarForDetails(null);
    setSelectedCar(car);
    setIsBookingModalOpen(true);
  };

  const handleFullscreen = (src: string) => {
    setFullscreenImage(src);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[var(--bg)]"
    >
      <Hero />
      <FleetSection 
        onViewDetails={handleSelectCar} 
        onBook={handleBookCar} 
        onFullscreen={handleFullscreen}
      />
      <LiveAvailability />
      <ExperienceSection />
      <WhyChooseUs />
      <Testimonials />

      <AnimatePresence>
        {selectedCarForDetails && (
          <CarDetailsModal 
            car={selectedCarForDetails} 
            isOpen={!!selectedCarForDetails} 
            onClose={() => setSelectedCarForDetails(null)} 
            onBook={handleBookCar}
            onFullscreen={handleFullscreen}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {fullscreenImage && (
          <FullscreenImage 
            src={fullscreenImage} 
            isOpen={!!fullscreenImage} 
            onClose={() => setFullscreenImage(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 backdrop-blur-xl">
            <div className="min-h-screen flex items-center justify-center p-6 relative">
              <div className="absolute inset-0" onClick={() => setIsBookingModalOpen(false)} />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-5xl"
                onClick={(e) => e.stopPropagation()}
              >
                <BookingForm 
                  variant="modal" 
                  initialData={selectedCar} 
                  onClose={() => setIsBookingModalOpen(false)} 
                />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
