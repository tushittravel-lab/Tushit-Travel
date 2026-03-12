import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  ChevronRight, 
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  MapPin,
  Plus,
  AlertCircle,
  X,
  CheckCircle
} from 'lucide-react';

import { getDirectImageUrl } from '../utils/image';

// --- Components ---

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 20, x: '-50%' }}
      className={`fixed bottom-10 left-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border backdrop-blur-xl ${
        type === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-red-500/20 border-red-500/50 text-red-400'
      }`}
    >
      {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span className="font-bold text-sm tracking-wide font-outfit uppercase">{message}</span>
    </motion.div>
  );
};

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }: { isOpen: boolean, title: string, message: string, onConfirm: () => void, onCancel: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-10 rounded-[2.5rem] text-center"
      >
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-8">
          <AlertCircle size={40} />
        </div>
        <h3 className="text-2xl font-black mb-4 tracking-tighter uppercase font-outfit">{title}</h3>
        <p className="opacity-40 text-sm mb-10 leading-relaxed">{message}</p>
        <div className="flex gap-4">
          <button onClick={onCancel} className="flex-1 py-4 rounded-2xl bg-white/5 font-bold hover:bg-white/10 transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">Delete</button>
        </div>
      </motion.div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab, onClose }: { activeTab: string, setActiveTab: (tab: string) => void, onClose?: () => void }) => {
  const navigate = useNavigate();
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar size={20} /> },
    { id: 'fleet', label: 'Fleet Management', icon: <Car size={20} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleBackToWeb = () => {
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <div className="w-full md:w-80 bg-[var(--bg)] border-r border-white/5 flex flex-col h-full sticky top-0 z-50">
      <div className="p-6 md:p-10">
        <div className="flex items-center justify-between mb-12 md:mb-16 group">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-2 bg-emerald-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <img 
                src="https://i.ibb.co/cWCR5s0/file-00000000eca07208a364f8764c41ea0a.png" 
                alt="TUSHIT TRAVEL" 
                className="h-10 md:h-14 w-auto object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black tracking-tighter leading-none font-outfit">ADMIN</span>
              <span className="text-[8px] md:text-[10px] font-bold tracking-[0.3em] text-emerald-500 leading-none mt-1 font-outfit">PANEL</span>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="md:hidden p-2 text-white/40 hover:text-white">
              <XCircle size={24} />
            </button>
          )}
        </div>

        <nav className="space-y-2 md:space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-4 px-4 md:px-6 py-3 md:py-4 rounded-2xl text-sm font-bold transition-all duration-500 relative group ${activeTab === item.id ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'opacity-40 hover:opacity-100 hover:bg-white/5'}`}
            >
              <span className={`transition-transform duration-500 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
              <span className="font-outfit tracking-wide">{item.label}</span>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute right-4 w-1.5 h-1.5 rounded-full bg-black"
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 md:p-10 border-t border-white/5 space-y-2">
        <button 
          onClick={handleBackToWeb}
          className="w-full flex items-center gap-4 px-4 md:px-6 py-3 md:py-4 rounded-2xl text-sm font-bold text-emerald-500 hover:bg-emerald-500/10 transition-all group"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform" />
          <span className="font-outfit tracking-wide">Back to Site</span>
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 md:px-6 py-3 md:py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-outfit tracking-wide">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

const DashboardOverview = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        
        setStats([
          { label: 'Total Revenue', value: '₹12.4L', change: '+12.5%', icon: <TrendingUp className="text-emerald-500" />, glow: 'shadow-emerald-500/20' },
          { label: 'Active Bookings', value: data.activeBookings.toString(), change: 'Real-time', icon: <Calendar className="text-blue-500" />, glow: 'shadow-blue-500/20' },
          { label: 'Fleet Status', value: `${data.fleet.available}/${data.fleet.total}`, change: 'Available', icon: <Car className="text-amber-500" />, glow: 'shadow-amber-500/20' },
          { label: 'Total Customers', value: data.customers.toString(), change: 'Registered', icon: <Users className="text-purple-500" />, glow: 'shadow-purple-500/20' },
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="opacity-20 font-outfit">Loading system statistics...</div>;

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {stats.map((stat: any, idx: number) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-card p-10 rounded-[2.5rem] group hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${stat.glow}`}
          >
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                {stat.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 ${stat.change.startsWith('+') ? 'text-emerald-500' : 'opacity-40'}`}>
                {stat.change}
              </span>
            </div>
            <p className="opacity-40 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <p className="text-4xl font-black font-outfit tracking-tighter group-hover:text-emerald-400 transition-colors">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-card rounded-[3rem] p-12 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="flex justify-between items-center mb-12 relative z-10">
            <h3 className="text-2xl font-black tracking-tight font-outfit">Recent Activity</h3>
            <button className="text-xs font-black uppercase tracking-widest text-emerald-500 hover:text-white transition-colors">View Full Log</button>
          </div>
          <div className="space-y-10 relative z-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between group/item">
                <div className="flex items-center gap-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover/item:bg-emerald-500 group-hover/item:text-black transition-all duration-500">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-white font-black text-lg font-outfit">New Booking Request</p>
                    <p className="text-white/20 text-xs mt-1 font-bold uppercase tracking-widest">Delhi to Jaipur • SUV • 2 mins ago</p>
                  </div>
                </div>
                <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-emerald-500 hover:text-black transition-all duration-500">
                  <ChevronRight size={20} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-[3rem] p-12 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <h3 className="text-2xl font-black tracking-tight mb-12 font-outfit relative z-10">Fleet Distribution</h3>
          <div className="space-y-10 relative z-10">
            {[
              { label: 'Premium Sedan', count: 12, color: 'bg-emerald-500', glow: 'shadow-emerald-500/40' },
              { label: 'Luxury SUV', count: 8, color: 'bg-blue-500', glow: 'shadow-blue-500/40' },
              { label: 'MUV / Van', count: 4, color: 'bg-amber-500', glow: 'shadow-amber-500/40' },
            ].map((item) => (
              <div key={item.label} className="group/bar">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  <span className="opacity-40 group-hover:opacity-100 transition-colors">{item.label}</span>
                  <span>{item.count} Units</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / 24) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${item.color} ${item.glow} shadow-lg`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const BookingsTable = ({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<{ id: number } | null>(null);
  const [editingBooking, setEditingBooking] = useState<any>(null);

  const fetchBookings = () => {
    fetch('/api/admin/bookings').then(res => res.json()).then(setBookings);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      fetchBookings();
      showToast(`Booking ${status} successfully`, 'success');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/admin/bookings/${editingBooking.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingBooking)
    });
    if (res.ok) {
      fetchBookings();
      setEditingBooking(null);
      showToast('Booking updated successfully', 'success');
    }
  };

  const deleteBooking = async (id: number) => {
    const res = await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchBookings();
      showToast('Booking deleted', 'success');
    }
    setConfirmDelete(null);
  };

  const filteredBookings = bookings.filter(b => 
    (b.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.customer_phone?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.pickup_location?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.drop_location?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="glass-card rounded-3xl overflow-hidden">
      <ConfirmModal 
        isOpen={!!confirmDelete}
        title="Delete Booking"
        message="Are you sure you want to delete this booking request? This action cannot be undone."
        onConfirm={() => confirmDelete && deleteBooking(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
      />

      {editingBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-2xl p-10 rounded-[3rem] relative"
          >
            <button onClick={() => setEditingBooking(null)} className="absolute top-8 right-8 opacity-40 hover:opacity-100"><XCircle size={24} /></button>
            <h3 className="text-3xl font-black mb-8 tracking-tighter uppercase font-outfit">Edit Booking</h3>
            <form onSubmit={handleEditSubmit} className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Customer Name</label>
                <input type="text" className="input-field" value={editingBooking.customer_name || ''} onChange={e => setEditingBooking({...editingBooking, customer_name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Phone</label>
                <input type="text" className="input-field" value={editingBooking.customer_phone || ''} onChange={e => setEditingBooking({...editingBooking, customer_phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Pickup</label>
                <input type="text" className="input-field" value={editingBooking.pickup_location || ''} onChange={e => setEditingBooking({...editingBooking, pickup_location: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Drop</label>
                <input type="text" className="input-field" value={editingBooking.drop_location || ''} onChange={e => setEditingBooking({...editingBooking, drop_location: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Date</label>
                <input type="date" className="input-field [color-scheme:dark]" value={editingBooking.pickup_date || ''} onChange={e => setEditingBooking({...editingBooking, pickup_date: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Time</label>
                <input type="time" className="input-field [color-scheme:dark]" value={editingBooking.pickup_time || ''} onChange={e => setEditingBooking({...editingBooking, pickup_time: e.target.value})} />
              </div>
              <div className="col-span-2 mt-4">
                <button type="submit" className="btn-primary w-full py-4">Save Changes</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <div className="p-10 border-b border-white/5 flex justify-between items-center">
        <h3 className="text-xl font-black tracking-tight">Booking Requests</h3>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-sm focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5">
              <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40">Customer / Trip</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40">Vehicle</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40">Date & Time</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40">Status</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-8">
                  <p className="font-bold">{booking.customer_name || 'Guest'}</p>
                  <p className="opacity-20 text-xs mt-1">{booking.customer_phone || 'No phone'}</p>
                  <p className="opacity-20 text-[10px] mt-1 uppercase tracking-widest">{booking.pickup_location} → {booking.drop_location || 'Local'}</p>
                </td>
                <td className="p-8">
                  <p className="font-bold">{booking.car_name || 'Unassigned'}</p>
                  <p className="opacity-20 text-xs mt-1">{booking.trip_type}</p>
                </td>
                <td className="p-8">
                  <p className="font-bold">{booking.pickup_date}</p>
                  <p className="opacity-20 text-xs mt-1">{booking.pickup_time}</p>
                </td>
                <td className="p-8">
                  <select 
                    value={booking.status}
                    onChange={(e) => updateStatus(booking.id, e.target.value)}
                    className={`bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest focus:outline-none ${booking.status === 'pending' ? 'text-amber-500' : 'text-emerald-500'}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-8">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingBooking(booking)}
                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center opacity-40 hover:text-emerald-500 transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                    <button 
                      onClick={() => setConfirmDelete({ id: booking.id })}
                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center opacity-40 hover:text-red-500 transition-colors"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CustomersTable = ({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<{ id: number } | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);

  const fetchCustomers = () => {
    fetch('/api/admin/customers').then(res => res.json()).then(setCustomers);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/admin/customers/${editingCustomer.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingCustomer)
    });
    if (res.ok) {
      fetchCustomers();
      setEditingCustomer(null);
      showToast('Customer updated successfully', 'success');
    }
  };

  const deleteCustomer = async (id: number) => {
    const res = await fetch(`/api/admin/customers/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchCustomers();
      showToast('Customer deleted', 'success');
    }
    setConfirmDelete(null);
  };

  const filteredCustomers = customers.filter(c => 
    (c.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.phone?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="glass-card rounded-3xl overflow-hidden">
      <ConfirmModal 
        isOpen={!!confirmDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? All their history will be removed."
        onConfirm={() => confirmDelete && deleteCustomer(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
      />

      {editingCustomer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-xl p-10 rounded-[3rem] relative"
          >
            <button onClick={() => setEditingCustomer(null)} className="absolute top-8 right-8 opacity-40 hover:opacity-100"><XCircle size={24} /></button>
            <h3 className="text-3xl font-black mb-8 tracking-tighter uppercase font-outfit">Edit Customer</h3>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Name</label>
                <input type="text" className="input-field" value={editingCustomer.name || ''} onChange={e => setEditingCustomer({...editingCustomer, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Email</label>
                <input type="email" className="input-field" value={editingCustomer.email || ''} onChange={e => setEditingCustomer({...editingCustomer, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Phone</label>
                <input type="text" className="input-field" value={editingCustomer.phone || ''} onChange={e => setEditingCustomer({...editingCustomer, phone: e.target.value})} />
              </div>
              <div className="mt-4">
                <button type="submit" className="btn-primary w-full py-4">Save Changes</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <div className="p-10 border-b border-white/5 flex justify-between items-center">
        <h3 className="text-xl font-black tracking-tight">Customer Directory</h3>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-sm focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5">
              <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40">Customer Name</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40">Contact Info</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40">Total Bookings</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40">Joined Date</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-8">
                  <p className="font-bold">{customer.name}</p>
                </td>
                <td className="p-8">
                  <p className="text-sm">{customer.email}</p>
                  <p className="opacity-20 text-xs mt-1">{customer.phone}</p>
                </td>
                <td className="p-8">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold">
                    {customer.total_bookings} Bookings
                  </span>
                </td>
                <td className="p-8">
                  <p className="opacity-40 text-xs">{new Date(customer.created_at).toLocaleDateString()}</p>
                </td>
                <td className="p-8">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingCustomer(customer)}
                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center opacity-40 hover:text-emerald-500 transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                    <button 
                      onClick={() => setConfirmDelete({ id: customer.id })}
                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center opacity-40 hover:text-red-500 transition-colors"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SettingsPanel = ({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) => {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (res.ok) {
      showToast('Settings updated successfully!', 'success');
    }
  };

  if (loading) return <div className="opacity-20">Loading system settings...</div>;

  return (
    <div className="glass-card rounded-[3rem] p-12 max-w-4xl mx-auto">
      <h3 className="text-3xl font-black mb-10 tracking-tighter">SYSTEM SETTINGS</h3>
      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Site Name</label>
            <input 
              type="text" 
              className="input-field" 
              value={settings.site_name || ''}
              onChange={e => setSettings({...settings, site_name: e.target.value})}
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Contact Email</label>
            <input 
              type="email" 
              className="input-field" 
              value={settings.contact_email || ''}
              onChange={e => setSettings({...settings, contact_email: e.target.value})}
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Contact Phone</label>
            <input 
              type="text" 
              className="input-field" 
              value={settings.contact_phone || ''}
              onChange={e => setSettings({...settings, contact_phone: e.target.value})}
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">WhatsApp Number</label>
            <input 
              type="text" 
              className="input-field" 
              value={settings.whatsapp_number || ''}
              onChange={e => setSettings({...settings, whatsapp_number: e.target.value})}
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Maintenance Mode</label>
            <select 
              className="input-field"
              value={settings.maintenance_mode || 'false'}
              onChange={e => setSettings({...settings, maintenance_mode: e.target.value})}
            >
              <option value="false">Disabled</option>
              <option value="true">Enabled</option>
            </select>
          </div>
        </div>
        <div className="pt-6 border-t border-white/5">
          <button type="submit" className="btn-primary px-10 py-4">
            Save All Changes
          </button>
        </div>
      </form>
    </div>
  );
};

const FleetManagement = ({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) => {
  const [fleet, setFleet] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    car_number: '',
    category: 'Sedan',
    capacity: 4,
    luggage: 2,
    price_per_km: 12.5,
    image_url: '',
    status: 'available',
    image_front: '',
    image_side: '',
    image_interior: '',
    image_seats: '',
    image_boot: '',
    has_ac: true,
    fuel_type: 'Diesel',
    transmission: 'Manual',
    driver_included: true,
    price_per_day: 2500,
    price_per_hour: 800,
    best_use: 'Family trip, Airport pickup',
    features: 'Air Conditioner, Comfortable seats, Music system, Mobile charging',
    driver_details: ''
  });

  const fetchFleet = () => {
    fetch('/api/fleet').then(res => res.json()).then(setFleet);
  };

  useEffect(() => {
    fetchFleet();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingCar ? `/api/admin/fleet/${editingCar.id}` : '/api/admin/fleet';
    const method = editingCar ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        car_number: formData.car_number || ''
      })
    });

    if (res.ok) {
      setIsModalOpen(false);
      setEditingCar(null);
      setFormData({
        name: '', category: 'Sedan', capacity: 4, luggage: 2, price_per_km: 12.5, image_url: '', status: 'available',
        image_front: '', image_side: '', image_interior: '', image_seats: '', image_boot: '',
        has_ac: true, fuel_type: 'Diesel', transmission: 'Manual', driver_included: true,
        price_per_day: 2500, price_per_hour: 800, best_use: 'Family trip, Airport pickup',
        features: 'Air Conditioner, Comfortable seats, Music system, Mobile charging', driver_details: ''
      });
      fetchFleet();
      showToast(editingCar ? 'Vehicle updated' : 'Vehicle added', 'success');
    }
  };

  const handleEdit = (car: any) => {
    setEditingCar(car);
    setFormData({
      name: car.name,
      car_number: car.car_number || '',
      category: car.category,
      capacity: car.capacity,
      luggage: car.luggage,
      price_per_km: car.price_per_km,
      image_url: car.image_url,
      status: car.status,
      image_front: car.image_front || '',
      image_side: car.image_side || '',
      image_interior: car.image_interior || '',
      image_seats: car.image_seats || '',
      image_boot: car.image_boot || '',
      has_ac: !!car.has_ac,
      fuel_type: car.fuel_type || 'Diesel',
      transmission: car.transmission || 'Manual',
      driver_included: !!car.driver_included,
      price_per_day: car.price_per_day || 0,
      price_per_hour: car.price_per_hour || 0,
      best_use: car.best_use || '',
      features: car.features || '',
      driver_details: car.driver_details || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/admin/fleet/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchFleet();
      showToast('Vehicle removed from fleet', 'success');
    }
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-10">
      <ConfirmModal 
        isOpen={!!confirmDelete}
        title="Remove Vehicle"
        message="Are you sure you want to remove this vehicle from the fleet? This cannot be undone."
        onConfirm={() => confirmDelete && handleDelete(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
      />
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-black tracking-tighter">FLEET MANAGEMENT</h3>
        <button 
          onClick={() => { setEditingCar(null); setIsModalOpen(true); }}
          className="btn-primary flex items-center gap-2 py-3 px-6 text-xs"
        >
          <Plus size={16} /> Add New Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {fleet.map((car) => (
          <div key={car.id} className="glass-card rounded-3xl overflow-hidden group">
            <div className="aspect-video relative">
              <img src={getDirectImageUrl(car.image_url)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={car.name} referrerPolicy="no-referrer" />
              <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-black text-white uppercase tracking-widest">
                {car.status}
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-xl font-black">{car.name}</h4>
                  <p className="text-emerald-500 font-black text-[10px] uppercase tracking-widest mt-1">{car.category}</p>
                </div>
                <p className="text-xl font-black">₹{car.price_per_km}</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleEdit(car)}
                  className="flex-1 py-3 rounded-xl bg-white/5 text-xs font-bold hover:bg-white/10 transition-all"
                >
                  Edit Details
                </button>
                <button 
                  onClick={() => setConfirmDelete({ id: car.id })}
                  className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center opacity-40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-2xl p-10 rounded-[3rem] relative"
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 opacity-40 hover:opacity-100"
            >
              <XCircle size={24} />
            </button>
            <h3 className="text-3xl font-black mb-8 tracking-tighter">
              {editingCar ? 'EDIT VEHICLE' : 'ADD NEW VEHICLE'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-4 no-scrollbar">
              <div className="col-span-2 border-b border-white/5 pb-4 mb-2">
                <h4 className="text-sm font-black text-emerald-500 uppercase tracking-widest">Basic Information</h4>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Vehicle Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Vehicle Number</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.car_number}
                  onChange={e => setFormData({...formData, car_number: e.target.value})}
                  placeholder="e.g. MP 09 AB 1234"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Category</label>
                <select 
                  className="input-field"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="MUV">MUV</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Status</label>
                <select 
                  className="input-field"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="available">Available</option>
                  <option value="on-trip">On Trip</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="col-span-2 border-b border-white/5 pb-4 mb-2 mt-4">
                <h4 className="text-sm font-black text-emerald-500 uppercase tracking-widest">Pricing Details</h4>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Price per KM (₹)</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="input-field" 
                  value={formData.price_per_km}
                  onChange={e => setFormData({...formData, price_per_km: parseFloat(e.target.value)})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Price per Day (₹)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={formData.price_per_day}
                  onChange={e => setFormData({...formData, price_per_day: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Price per Hour (₹)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={formData.price_per_hour}
                  onChange={e => setFormData({...formData, price_per_hour: parseFloat(e.target.value)})}
                />
              </div>

              <div className="col-span-2 border-b border-white/5 pb-4 mb-2 mt-4">
                <h4 className="text-sm font-black text-emerald-500 uppercase tracking-widest">Quick Details</h4>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Capacity (Seats)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={formData.capacity}
                  onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Luggage (Bags)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={formData.luggage}
                  onChange={e => setFormData({...formData, luggage: parseInt(e.target.value)})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">AC Available</label>
                <select 
                  className="input-field"
                  value={formData.has_ac ? 'true' : 'false'}
                  onChange={e => setFormData({...formData, has_ac: e.target.value === 'true'})}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Fuel Type</label>
                <select 
                  className="input-field"
                  value={formData.fuel_type}
                  onChange={e => setFormData({...formData, fuel_type: e.target.value})}
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Transmission</label>
                <select 
                  className="input-field"
                  value={formData.transmission}
                  onChange={e => setFormData({...formData, transmission: e.target.value})}
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Driver Included</label>
                <select 
                  className="input-field"
                  value={formData.driver_included ? 'true' : 'false'}
                  onChange={e => setFormData({...formData, driver_included: e.target.value === 'true'})}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="col-span-2 border-b border-white/5 pb-4 mb-2 mt-4">
                <h4 className="text-sm font-black text-emerald-500 uppercase tracking-widest">Images (URLs)</h4>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Main Image URL</label>
                <input type="url" className="input-field" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Front View URL</label>
                <input type="url" className="input-field" value={formData.image_front} onChange={e => setFormData({...formData, image_front: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Side View URL</label>
                <input type="url" className="input-field" value={formData.image_side} onChange={e => setFormData({...formData, image_side: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Interior View URL</label>
                <input type="url" className="input-field" value={formData.image_interior} onChange={e => setFormData({...formData, image_interior: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Seats View URL</label>
                <input type="url" className="input-field" value={formData.image_seats} onChange={e => setFormData({...formData, image_seats: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Boot Space URL</label>
                <input type="url" className="input-field" value={formData.image_boot} onChange={e => setFormData({...formData, image_boot: e.target.value})} />
              </div>

              <div className="col-span-2 border-b border-white/5 pb-4 mb-2 mt-4">
                <h4 className="text-sm font-black text-emerald-500 uppercase tracking-widest">Additional Info</h4>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Best Use / Purpose (Comma separated)</label>
                <input type="text" className="input-field" value={formData.best_use} onChange={e => setFormData({...formData, best_use: e.target.value})} placeholder="Wedding, Family trip, Airport pickup..." />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Features (Comma separated)</label>
                <input type="text" className="input-field" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} placeholder="Air Conditioner, Comfortable seats, Music system..." />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Driver Details</label>
                <textarea className="input-field min-h-[100px]" value={formData.driver_details} onChange={e => setFormData({...formData, driver_details: e.target.value})} placeholder="Name, Phone, Experience..." />
              </div>

              <div className="col-span-2 mt-8 pb-10">
                <button type="submit" className="btn-primary w-full py-5 text-lg">
                  {editingCar ? 'Update Vehicle Details' : 'Add Vehicle to Fleet'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/admin/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[var(--bg)] flex relative overflow-hidden">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" 
          alt="Dashboard Background"
          className="w-full h-full object-cover opacity-30 scale-105 animate-float"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
        <div className="absolute inset-0 mesh-gradient opacity-30" />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-80 max-w-[85vw]"
            >
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onClose={() => setIsMobileSidebarOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <main className="flex-1 p-6 md:p-12 overflow-y-auto h-screen no-scrollbar relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 md:mb-16">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-3 rounded-xl bg-white/5 border border-white/10 text-emerald-500"
            >
              <LayoutDashboard size={24} />
            </button>
            <div>
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl md:text-5xl font-black tracking-tighter uppercase font-outfit"
              >
                {activeTab === 'dashboard' ? 'System ' : ''}
                <span className="gradient-text text-glow animate-rotate-hue inline-block hover:scale-105 transition-transform duration-500 cursor-default">{activeTab === 'dashboard' ? 'Overview' : activeTab.replace('-', ' ')}</span>
              </motion.h2>
              <p className="opacity-20 text-[10px] font-black uppercase tracking-[0.4em] mt-2 md:mt-3 font-outfit">Welcome back, Administrator</p>
            </div>
          </div>
          <div className="flex items-center gap-6 md:gap-10 w-full md:w-auto justify-between md:justify-end">
            <button className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 flex items-center justify-center opacity-40 hover:text-emerald-500 hover:bg-white/10 transition-all group">
              <Bell size={20} className="md:size-6 group-hover:rotate-12 transition-transform" />
              <div className="absolute top-3 right-3 md:top-4 md:right-4 w-2 h-2 md:w-2.5 md:h-2.5 bg-emerald-500 rounded-full border-2 border-[var(--bg)] animate-pulse" />
            </button>
            <div className="flex items-center gap-4 md:gap-6 pl-6 md:pl-10 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="font-black text-base md:text-lg font-outfit leading-none">Admin User</p>
                <p className="text-emerald-500 font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em] mt-1">Super Admin</p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-black text-lg md:text-xl font-outfit shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                A
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'dashboard' && <DashboardOverview />}
            {activeTab === 'bookings' && <BookingsTable showToast={showToast} />}
            {activeTab === 'fleet' && <FleetManagement showToast={showToast} />}
            {activeTab === 'customers' && <CustomersTable showToast={showToast} />}
            {activeTab === 'settings' && <SettingsPanel showToast={showToast} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
