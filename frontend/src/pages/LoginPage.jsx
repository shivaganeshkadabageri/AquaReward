import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplet, Mail, Lock, ArrowRight, UserCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      if (res.role === 'ROLE_HOTEL_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleQuickLogin = (emailPreset, passwordPreset) => {
    setEmail(emailPreset);
    setPassword(passwordPreset);
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
        className="w-full max-w-md glass-panel p-8 border-slate-200/50 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex rounded-2xl bg-gradient-to-tr from-aqua-500 to-eco-500 p-3 text-white shadow-md shadow-aqua-500/20 mb-4">
            <Droplet className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">Protect water resources, earn rewards</p>
        </div>

        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-3 text-xs text-red-600 dark:text-red-400 mb-6 animate-pulse">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 pl-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white/50 pl-10 pr-4 py-2.5 text-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-aqua-500 focus:ring-1 focus:ring-aqua-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 pl-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white/50 pl-10 pr-4 py-2.5 text-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-aqua-500 focus:ring-1 focus:ring-aqua-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-aqua-600 to-eco-600 hover:brightness-105 py-3 text-sm font-bold text-white shadow-md shadow-aqua-500/10 flex justify-center items-center gap-2 transition-all mt-6"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Demo Quick Logins Seeder */}
        <div className="mt-8 border-t border-slate-100 dark:border-slate-800/80 pt-6">
          <div className="text-center text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-4">
            🚀 Quick Seeder Login (Demo Accounts)
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('emma@guest.com', 'guestpassword')}
              className="flex items-center gap-1.5 justify-center rounded-xl bg-aqua-50 dark:bg-aqua-950/20 px-3 py-2 text-[11px] font-semibold text-aqua-600 dark:text-aqua-400 hover:brightness-95 hover:scale-[1.01] transition-all"
            >
              <UserCheck className="h-3.5 w-3.5" />
              Guest Account
            </button>
            <button
              onClick={() => handleQuickLogin('admin@ecohaven.com', 'adminpassword')}
              className="flex items-center gap-1.5 justify-center rounded-xl bg-eco-50 dark:bg-eco-950/20 px-3 py-2 text-[11px] font-semibold text-eco-600 dark:text-eco-400 hover:brightness-95 hover:scale-[1.01] transition-all"
            >
              <UserCheck className="h-3.5 w-3.5" />
              Admin Account
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-aqua-500 hover:underline">
            Register Room
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
