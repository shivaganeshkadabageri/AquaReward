import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Droplet, Award, Trophy, Compass, ArrowRight, ShieldCheck, Heart, Sparkles, BarChart3, Building2 } from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="relative overflow-hidden min-h-screen dark:bg-[#070b19]">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-aqua-400/20 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
      <div className="absolute top-40 -right-4 w-96 h-96 bg-eco-400/15 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-aqua-200 bg-aqua-50/50 dark:border-aqua-950/30 dark:bg-aqua-950/20 text-aqua-600 dark:text-aqua-400 text-xs font-semibold mb-6 shadow-sm shadow-aqua-500/5"
        >
          <Sparkles className="h-3 w-3 text-aqua-500 animate-spin" />
          The Future of Eco-Friendly Tourism
        </motion.div>

        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-[1.15]"
        >
          Gamifying Sustainability <br />
          For <span className="bg-gradient-to-r from-aqua-500 via-cyan-400 to-eco-400 bg-clip-text text-transparent">Hotel Guests</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed"
        >
          AquaReward empowers hotels to reward guests for conserving water. Track real-time water savings, complete daily challenges, unlock premium eco-badges, and redeem earned points for exclusive resort discounts, dinners, and luxury upgrades.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          {user ? (
            <Link
              to={user.role === 'ROLE_HOTEL_ADMIN' ? '/admin' : '/dashboard'}
              className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-aqua-600 to-eco-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-aqua-500/25 hover:brightness-105 hover:shadow-xl transition-all"
            >
              Enter Dashboard
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-aqua-600 to-eco-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-aqua-500/20 hover:brightness-105 transition-all"
              >
                Join as Guest
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-slate-200 px-8 py-4 text-base font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/40 transition-all"
              >
                Hotel Admin Portal
              </Link>
            </>
          )}
        </motion.div>
      </section>

      {/* Highlights / Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-100 dark:border-slate-900/60">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Smart Gamification Modules</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">
            Our platform brings together water conservation and rich incentives.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Card 1 */}
          <motion.div variants={itemVariants} className="glass-panel p-8 glass-panel-hover border-slate-100/50">
            <div className="rounded-2xl bg-aqua-500/10 p-4 text-aqua-600 dark:text-aqua-400 w-fit mb-6">
              <Droplet className="h-7 w-7 text-aqua-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">IoT Water Tracking</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Real-time room analytics. Guests monitor exactly how many liters they consume during showers, laundry, and tap runs.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants} className="glass-panel p-8 glass-panel-hover border-slate-100/50">
            <div className="rounded-2xl bg-eco-500/10 p-4 text-eco-600 dark:text-eco-400 w-fit mb-6">
              <Award className="h-7 w-7 text-eco-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Redeemable Eco-Points</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Guests earn eco-points for keeping consumption below daily thresholds. Points are instantly exchangeable for resort rewards.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemVariants} className="glass-panel p-8 glass-panel-hover border-slate-100/50">
            <div className="rounded-2xl bg-amber-500/10 p-4 text-amber-600 dark:text-amber-400 w-fit mb-6">
              <Trophy className="h-7 w-7 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Interactive Streaks</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Guests unlock exclusive sustainable badges like "Eco Hero" and level-up as saving streaks grow.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Admin Analytics Promo Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/10 border-t border-b border-slate-100 dark:border-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-eco-200 bg-eco-50/50 dark:border-eco-950/30 dark:bg-eco-950/20 text-eco-600 dark:text-eco-400 text-xs font-semibold mb-4">
              <Building2 className="h-3.5 w-3.5" />
              For Hotel Management
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white leading-tight">
              Powerful Hotel Analytics & Room Diagnostics
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              Administrators view detailed property metrics. Trace total water savings, room-wise consumption, average carbon offsets, and issue rewards coupons directly.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-aqua-100 dark:bg-aqua-950/20 p-2 text-aqua-600">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Telemetry Charts</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-eco-100 dark:bg-eco-950/20 p-2 text-eco-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Goal Customizers</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-panel p-8 border-slate-200/50 shadow-xl"
          >
            {/* Visual mock-up representing hotel metrics */}
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Eco Haven Dashboard</span>
              <span className="rounded-full bg-eco-500/10 px-2 py-0.5 text-[10px] font-bold text-eco-600">ACTIVE</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-xl bg-slate-100 dark:bg-slate-800/40 p-3 text-center">
                <div className="text-[10px] text-slate-400">Total Consumption</div>
                <div className="text-sm font-extrabold text-aqua-600">3,420 L</div>
              </div>
              <div className="rounded-xl bg-slate-100 dark:bg-slate-800/40 p-3 text-center">
                <div className="text-[10px] text-slate-400">Water Saved</div>
                <div className="text-sm font-extrabold text-eco-600">625 L</div>
              </div>
              <div className="rounded-xl bg-slate-100 dark:bg-slate-800/40 p-3 text-center">
                <div className="text-[10px] text-slate-400">Eco Rank</div>
                <div className="text-sm font-extrabold text-amber-500">Gold #12</div>
              </div>
            </div>
            <div className="h-28 flex items-end gap-2.5 justify-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-8 h-20 bg-aqua-400/80 rounded-t-lg"></div>
              <div className="w-8 h-24 bg-aqua-500 rounded-t-lg"></div>
              <div className="w-8 h-12 bg-aqua-300/60 rounded-t-lg"></div>
              <div className="w-8 h-16 bg-aqua-400/80 rounded-t-lg"></div>
              <div className="w-8 h-28 bg-[#22c55e] rounded-t-lg animate-pulse"></div>
            </div>
            <div className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-3">
              Room 101 saving streak: <strong>5 Days (Sustainability Champion)</strong>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sustainable Mission / Testimonial */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <Heart className="h-10 w-10 text-red-500 mx-auto animate-bounce-slow mb-6" />
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Our Sustainable Development Mission</h2>
          <blockquote className="mt-6 text-sm sm:text-base italic text-slate-500 dark:text-slate-400 leading-relaxed">
            "By implementing AquaReward, we saw our property's water consumption decrease by 22% in the first two months. Guests absolutely love earning eco-points and competing for ranks. It feels like an organic extension of our hospitality experience."
          </blockquote>
          <div className="mt-4 font-semibold text-slate-800 dark:text-white">
            - Marcus Sterling, Director of Sustainability, Eco Haven Resorts
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-900/60 py-8 text-center text-xs text-slate-400 dark:text-slate-500">
        © 2026 AquaReward Technologies Inc. All rights reserved. Empowering hotels to protect precious planetary water.
      </footer>
    </div>
  );
};

export default LandingPage;
