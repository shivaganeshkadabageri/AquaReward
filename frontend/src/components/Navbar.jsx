import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Award, Trophy, Compass, User, LogOut, Moon, Sun, Menu, X, BarChart3, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isGuest = user?.role === 'ROLE_GUEST';
  const isAdmin = user?.role === 'ROLE_HOTEL_ADMIN';

  const guestLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Droplet },
    { name: 'Challenges', path: '/challenges', icon: Compass },
    { name: 'Rewards', path: '/rewards', icon: Award },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  ];

  const adminLinks = [
    { name: 'Overview', path: '/admin', icon: BarChart3 },
  ];

  const activeLinks = isGuest ? guestLinks : isAdmin ? adminLinks : [];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#070b19]/80 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="rounded-xl bg-gradient-to-tr from-aqua-500 to-eco-500 p-2 text-white shadow-md shadow-aqua-500/20">
                <Droplet className="h-5 w-5 animate-pulse" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
                Aqua<span className="bg-gradient-to-r from-aqua-500 to-eco-400 bg-clip-text text-transparent">Reward</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {activeLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-aqua-50 text-aqua-600 dark:bg-aqua-950/40 dark:text-aqua-400'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right Side Options (Dark Mode, User Details, Menu Toggle) */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/60 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {user ? (
              <>
                {/* User Info Capsule (Desktop) */}
                <div className="hidden lg:flex items-center gap-3 border-l border-slate-200/50 pl-3 dark:border-slate-800/50">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {isGuest ? `Room ${user.roomNumber}` : 'Hotel Admin'}
                    </div>
                  </div>
                  <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-1.5 border border-slate-200 dark:border-slate-700">
                    <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                  </div>
                </div>

                {/* Logout (Desktop) */}
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2 rounded-xl border border-red-200/50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950/20 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-gradient-to-r from-aqua-600 to-eco-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-aqua-500/10 hover:brightness-105 transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 md:hidden dark:text-slate-300 dark:hover:bg-slate-800/60"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 bg-white md:hidden dark:border-slate-800 dark:bg-[#070b19] overflow-hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {user ? (
                <>
                  <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-2">
                      <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </div>
                    <div>
                      <div className="text-base font-semibold text-slate-800 dark:text-white">{user.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {isGuest ? `Room ${user.roomNumber}` : 'Hotel Admin'}
                      </div>
                    </div>
                  </div>

                  {activeLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
                      >
                        <Icon className="h-5 w-5 text-aqua-500" />
                        {link.name}
                      </Link>
                    );
                  })}

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl border border-slate-200 py-2.5 text-center text-sm font-medium text-slate-700 dark:border-slate-800 dark:text-slate-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl bg-gradient-to-r from-aqua-600 to-eco-600 py-2.5 text-center text-sm font-medium text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
