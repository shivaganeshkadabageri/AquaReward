import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import { Droplet, User, Mail, Lock, Building, MapPin, Key, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('ROLE_GUEST'); // ROLE_GUEST or ROLE_HOTEL_ADMIN
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hotelId, setHotelId] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  
  // Admin-specific fields for onboarding a hotel
  const [hotelName, setHotelName] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');

  const [hotelsList, setHotelsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch seeded hotels on mount
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/hotels`);
        setHotelsList(response.data);
        if (response.data.length > 0) {
          setHotelId(response.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load hotels list', err);
      }
    };
    fetchHotels();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccess(false);

    const signupData = {
      name,
      email,
      password,
      role,
      hotelId: role === 'ROLE_GUEST' ? hotelId : null,
      roomNumber: role === 'ROLE_GUEST' ? roomNumber : null,
      hotelName: role === 'ROLE_HOTEL_ADMIN' ? hotelName : null,
      hotelAddress: role === 'ROLE_HOTEL_ADMIN' ? hotelAddress : null,
    };

    const res = await register(signupData);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="relative min-h-[calc(screen-16)] flex items-center justify-center px-4 py-12 dark:bg-[#070b19] overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-10 w-96 h-96 bg-aqua-400/10 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 -right-10 w-96 h-96 bg-eco-400/10 rounded-full blur-3xl opacity-20"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg glass-panel p-8 border-slate-200/50 shadow-2xl relative z-10"
      >
        <div className="text-center mb-6">
          <div className="inline-flex rounded-2xl bg-gradient-to-tr from-aqua-500 to-eco-500 p-3 text-white shadow-md shadow-aqua-500/20 mb-4">
            <Droplet className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Create Account</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Onboard property or check-in room</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 p-1.5 mb-6 border border-slate-200/40 dark:border-slate-800/40">
          <button
            type="button"
            onClick={() => setRole('ROLE_GUEST')}
            className={`rounded-lg py-2 text-xs font-bold transition-all ${
              role === 'ROLE_GUEST'
                ? 'bg-white text-aqua-600 shadow-sm dark:bg-slate-800 dark:text-aqua-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Hotel Guest
          </button>
          <button
            type="button"
            onClick={() => setRole('ROLE_HOTEL_ADMIN')}
            className={`rounded-lg py-2 text-xs font-bold transition-all ${
              role === 'ROLE_HOTEL_ADMIN'
                ? 'bg-white text-eco-600 shadow-sm dark:bg-slate-800 dark:text-eco-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Hotel Admin
          </button>
        </div>

        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-start gap-2.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-3 text-xs text-red-600 dark:text-red-400 mb-6"
            >
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-start gap-2.5 rounded-xl bg-eco-50 dark:bg-eco-950/20 border border-eco-200 dark:border-eco-900/30 p-3 text-xs text-eco-600 dark:text-eco-400 mb-6"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-eco-500" />
              <span>Account created successfully! Redirecting you to sign in...</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 pl-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-slate-200 bg-white/50 pl-10 pr-4 py-2.5 text-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-aqua-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 pl-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white/50 pl-10 pr-4 py-2.5 text-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-aqua-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 pl-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white/50 pl-10 pr-4 py-2.5 text-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-aqua-500"
              />
            </div>
          </div>

          {/* Dynamic Role Fields */}
          <AnimatePresence mode="wait">
            {role === 'ROLE_GUEST' ? (
              <motion.div
                key="guest-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 pl-1">Select Hotel Property</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <select
                        value={hotelId}
                        onChange={(e) => setHotelId(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white/50 pl-10 pr-4 py-2.5 text-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-aqua-500 appearance-none"
                      >
                        {hotelsList.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.hotelName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 pl-1">Checked-In Room Number</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        placeholder="e.g. 101"
                        className="w-full rounded-xl border border-slate-200 bg-white/50 pl-10 pr-4 py-2.5 text-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-aqua-500"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="admin-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 pl-1">New Hotel Name</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={hotelName}
                        onChange={(e) => setHotelName(e.target.value)}
                        placeholder="Eco Resort Grand"
                        className="w-full rounded-xl border border-slate-200 bg-white/50 pl-10 pr-4 py-2.5 text-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-eco-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 pl-1">Hotel Physical Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={hotelAddress}
                        onChange={(e) => setHotelAddress(e.target.value)}
                        placeholder="e.g. California Boulevard"
                        className="w-full rounded-xl border border-slate-200 bg-white/50 pl-10 pr-4 py-2.5 text-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-eco-500"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl py-3 text-sm font-bold text-white shadow-md flex justify-center items-center gap-2 transition-all mt-6 bg-gradient-to-r ${
              role === 'ROLE_GUEST'
                ? 'from-aqua-600 to-cyan-600 shadow-aqua-500/10'
                : 'from-eco-600 to-emerald-600 shadow-eco-500/10'
            } hover:brightness-105`}
          >
            {loading ? 'Processing...' : 'Register Profile'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-aqua-500 hover:underline">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
