import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplet, Trophy, Award, Flame, Users, Calendar, Plus, Trash2, CheckCircle2, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [rewardName, setRewardName] = useState('');
  const [pointsRequired, setPointsRequired] = useState('');
  const [rewardDesc, setRewardDesc] = useState('');
  const [rewardImg, setRewardImg] = useState('');

  const [challengeName, setChallengeName] = useState('');
  const [targetLiters, setTargetLiters] = useState('');
  const [challengePoints, setChallengePoints] = useState('');
  const [challengeDesc, setChallengeDesc] = useState('');

  const [successMsg, setSuccessMsg] = useState('');

  const fetchAdminData = async () => {
    try {
      const analyticsRes = await api.get('/admin/analytics');
      const guestsRes = await api.get('/admin/guests');
      
      setAnalytics(analyticsRes.data);
      setGuests(guestsRes.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCheckoutGuest = async (guestId) => {
    if (!window.confirm('Are you sure you want to check-out / remove this guest?')) return;
    try {
      await api.delete(`/admin/guests/${guestId}`);
      showToast('Guest successfully checked out');
      fetchAdminData();
    } catch (err) {
      console.error('Checkout failed', err);
    }
  };

  const handleAddReward = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/rewards', {
        rewardName: rewardName,
        pointsRequired: parseInt(pointsRequired),
        description: rewardDesc,
        imageUrl: rewardImg || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400',
      });
      
      showToast('New eco-reward published!');
      setRewardName('');
      setPointsRequired('');
      setRewardDesc('');
      setRewardImg('');
      fetchAdminData();
    } catch (err) {
      console.error('Failed to add reward', err);
    }
  };

  const handleAddChallenge = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/challenges', {
        challengeName: challengeName,
        targetLiters: parseFloat(targetLiters),
        rewardPoints: parseInt(challengePoints),
        description: challengeDesc,
        type: 'DAILY',
      });

      showToast('New eco-challenge launched!');
      setChallengeName('');
      setTargetLiters('');
      setChallengePoints('');
      setChallengeDesc('');
      fetchAdminData();
    } catch (err) {
      console.error('Failed to add challenge', err);
    }
  };

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center dark:bg-[#070b19]">
        <div className="flex flex-col items-center gap-3">
          <Droplet className="h-10 w-10 animate-bounce text-eco-500" />
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading hotel management suite...</span>
        </div>
      </div>
    );
  }

  // Format category breakdown for charts
  const categoryChartData = Object.entries(analytics?.categoryBreakdown || {}).map(([key, val]) => ({
    name: key,
    liters: Math.round(val),
  }));

  // Format daily trends for trends graph
  const trendChartData = (analytics?.dailyTrends || []).map((t) => {
    const day = new Date(t.date).toLocaleDateString('en-US', { weekday: 'short' });
    return { name: day, liters: Math.round(t.litersUsed) };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 dark:bg-[#070b19]">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 rounded-2xl bg-gradient-to-r from-eco-600 to-emerald-600 border border-eco-500/10 px-5 py-3.5 text-xs text-white shadow-xl flex items-center gap-2"
          >
            <CheckCircle2 className="h-4.5 w-4.5 text-white" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome & Overview Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Hotel Admin Management</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor property-wide diagnostics, check rooms, configure incentives and evaluate footprints
        </p>
      </div>

      {/* Analytics stat boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Hotel Consumption */}
        <div className="glass-panel p-6 border-slate-100/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Water Used</span>
            <div className="rounded-xl bg-aqua-500/10 p-2 text-aqua-600">
              <Droplet className="h-5 w-5 fill-aqua-500/20" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-800 dark:text-white">
            {Math.round(analytics?.totalConsumption * 10) / 10} L
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">Across all rooms & fixtures</p>
        </div>

        {/* Active Guests Count */}
        <div className="glass-panel p-6 border-slate-100/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Guests</span>
            <div className="rounded-xl bg-purple-500/10 p-2 text-purple-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-800 dark:text-white">{analytics?.activeGuests} Rooms</div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">Actively tracked guests</p>
        </div>

        {/* Saved Liters */}
        <div className="glass-panel p-6 border-slate-100/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Liters Conserved</span>
            <div className="rounded-xl bg-eco-500/10 p-2 text-eco-500">
              <Trophy className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#22c55e]">
            {Math.round(analytics?.waterSaved * 10) / 10} L
          </div>
          <p className="text-xs text-eco-600 dark:text-eco-400 font-semibold mt-1.5 flex items-center gap-1">
            <TrendingDown className="h-3.5 w-3.5" />
            Below standard base of 150L/day
          </p>
        </div>

        {/* Total Redeemed Coupons */}
        <div className="glass-panel p-6 border-slate-100/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Rewards Redeemed</span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-800 dark:text-white">{analytics?.totalRedemptions} Coupons</div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">Issued eco-voucher codes</p>
        </div>
      </div>

      {/* Main Grid: Charts & Managers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Weekly Trend Chart */}
        <div className="lg:col-span-2 glass-panel p-6 border-slate-100/80 dark:border-slate-800/80">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-aqua-500" />
            Weekly Water Telemetry Trend (Liters)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendChartData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="L" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white' }} />
                <Line type="monotone" dataKey="liters" stroke="#16a34a" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fixture breakdown chart */}
        <div className="glass-panel p-6 border-slate-100/80 dark:border-slate-800/80">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Consumptions by Category</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px' }} />
                <Bar dataKey="liters" fill="#0891b2" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Guest Management Table */}
      <div className="glass-panel overflow-hidden border-slate-100 dark:border-slate-800 mb-8 shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/10">
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white">Rooms and Checked-In Guests ({guests.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/30 text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800/60">
                <th className="p-4">Room</th>
                <th className="p-4">Guest Name</th>
                <th className="p-4">Level</th>
                <th className="p-4 text-center">Streak</th>
                <th className="p-4 text-center">Score (XP)</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {guests.length > 0 ? (
                guests.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 text-slate-600 dark:text-slate-300">
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">Room {g.roomNumber}</td>
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-100">{g.name}</td>
                    <td className="p-4">{g.ecoLevel}</td>
                    <td className="p-4 text-center font-bold text-orange-500">{g.streakDays} Days</td>
                    <td className="p-4 text-center font-black text-amber-600 dark:text-amber-400">{g.points} pts</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleCheckoutGuest(g.id)}
                        className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50 dark:border-red-950/20 dark:hover:bg-red-950/30 transition-colors"
                        title="Checkout Guest"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">No rooms are currently checked in.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Forms Grid: Onboard Rewards, Onboard Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Onboard Eco-Reward */}
        <div className="glass-panel p-6 border-slate-100/80 dark:border-slate-800/80">
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-eco-500" />
            Publish Eco-Reward Package
          </h3>
          <form onSubmit={handleAddReward} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Reward Name</label>
                <input
                  type="text"
                  required
                  value={rewardName}
                  onChange={(e) => setRewardName(e.target.value)}
                  placeholder="e.g. Free Massage"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-eco-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Points Required</label>
                <input
                  type="number"
                  required
                  value={pointsRequired}
                  onChange={(e) => setPointsRequired(e.target.value)}
                  placeholder="e.g. 200"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-eco-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Package Image URL (Optional)</label>
              <input
                type="text"
                value={rewardImg}
                onChange={(e) => setRewardImg(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-eco-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Reward Description</label>
              <textarea
                required
                rows="3"
                value={rewardDesc}
                onChange={(e) => setRewardDesc(e.target.value)}
                placeholder="Details of reward package..."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-eco-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-eco-600 to-emerald-600 hover:brightness-105 py-2.5 text-xs font-bold text-white shadow-md shadow-eco-500/10"
            >
              Publish Reward
            </button>
          </form>
        </div>

        {/* Launch Eco-Challenge */}
        <div className="glass-panel p-6 border-slate-100/80 dark:border-slate-800/80">
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-aqua-500" />
            Launch Water Eco-Challenge
          </h3>
          <form onSubmit={handleAddChallenge} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Challenge Name</label>
                <input
                  type="text"
                  required
                  value={challengeName}
                  onChange={(e) => setChallengeName(e.target.value)}
                  placeholder="e.g. Ultra Eco Saver"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-aqua-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Target Liters</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={targetLiters}
                  onChange={(e) => setTargetLiters(e.target.value)}
                  placeholder="e.g. 90.0"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-aqua-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Reward Points (XP)</label>
              <input
                type="number"
                required
                value={challengePoints}
                onChange={(e) => setChallengePoints(e.target.value)}
                placeholder="e.g. 50"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-aqua-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Challenge Description</label>
              <textarea
                required
                rows="3"
                value={challengeDesc}
                onChange={(e) => setChallengeDesc(e.target.value)}
                placeholder="Describe challenge goals..."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 outline-none focus:border-aqua-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-aqua-600 to-cyan-600 hover:brightness-105 py-2.5 text-xs font-bold text-white shadow-md shadow-aqua-500/10"
            >
              Launch Challenge
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminAnalytics;
