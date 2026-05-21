import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import WaterMeterSimulator from '../components/WaterMeterSimulator';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { Droplet, Trophy, Award, Flame, Star, Lightbulb, Compass, Sparkles } from 'lucide-react';

const GuestDashboard = () => {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [aiTips, setAiTips] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await api.get('/guests/dashboard');
      const histRes = await api.get('/guests/water-usage/history');
      const tipsRes = await api.get('/guests/ai-tips');
      
      setStats(statsRes.data);
      setHistory(histRes.data);
      setAiTips(tipsRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center dark:bg-[#070b19]">
        <div className="flex flex-col items-center gap-3">
          <Droplet className="h-10 w-10 animate-bounce text-aqua-500" />
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading guest telemetry...</span>
        </div>
      </div>
    );
  }

  // Format Recharts category data
  const formattedCategoryData = Object.entries(stats?.categoryBreakdown || {}).map(([key, val]) => ({
    name: key,
    liters: val,
  }));

  // Format Recharts daily consumption trends for past 7 days
  const dailyHistoryMap = {};
  history.forEach(item => {
    const dStr = item.date; // e.g. "2026-05-21"
    dailyHistoryMap[dStr] = (dailyHistoryMap[dStr] || 0.0) + item.litersUsed;
  });

  const dailyTrendData = Object.entries(dailyHistoryMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-7)
    .map(([date, liters]) => {
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      return { date: dayName, liters: Math.round(liters * 10) / 10 };
    });

  // Level XP calculations (e.g. Beginner 100, Explorer 300, Warrior 600)
  const getLevelProgress = (points) => {
    if (points < 100) return { progress: (points / 100) * 100, nextLevel: 'Eco Explorer', req: 100 };
    if (points < 300) return { progress: ((points - 100) / 200) * 100, nextLevel: 'Water Warrior', req: 300 };
    if (points < 600) return { progress: ((points - 300) / 300) * 100, nextLevel: 'Sustainability Champion', req: 600 };
    return { progress: 100, nextLevel: 'Max Level reached!', req: 600 };
  };

  const levelInfo = getLevelProgress(stats?.points || 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 dark:bg-[#070b19]">
      {/* Welcome Banner */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">
            Hello, <span className="bg-gradient-to-r from-aqua-500 to-eco-400 bg-clip-text text-transparent">{stats?.guestName}</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Room <strong className="text-slate-700 dark:text-slate-200">{stats?.roomNumber}</strong> • Active Saving Portal
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-eco-200 bg-eco-50/50 dark:border-eco-950/30 dark:bg-eco-950/20 text-eco-600 dark:text-eco-400 text-xs font-bold shadow-sm shadow-eco-500/5">
          <Sparkles className="h-4 w-4 text-eco-500 animate-pulse" />
          Rank #{stats?.rank} of {stats?.totalGuests} Guests
        </div>
      </div>

      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Points Card */}
        <div className="glass-panel p-6 border-slate-100/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Eco-Points</span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
              <Star className="h-5 w-5 fill-amber-500/20" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-800 dark:text-white">{stats?.points}</div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">XP till next reward upgrade</p>
        </div>

        {/* Streak Card */}
        <div className="glass-panel p-6 border-slate-100/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Saving Streak</span>
            <div className="rounded-xl bg-orange-500/10 p-2 text-orange-500">
              <Flame className="h-5 w-5 fill-orange-500/20 animate-pulse" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-800 dark:text-white">{stats?.streakDays} Days</div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">Conscious consumption streak</p>
        </div>

        {/* Liters Consumed Today */}
        <div className="glass-panel p-6 border-slate-100/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Liters Today</span>
            <div className="rounded-xl bg-aqua-500/10 p-2 text-aqua-500">
              <Droplet className="h-5 w-5 fill-aqua-500/20" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-800 dark:text-white">{Math.round(stats?.dailyUsage * 10) / 10} L</div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">Daily Budget Limit: 120.0 L</p>
        </div>

        {/* Total Water Saved */}
        <div className="glass-panel p-6 border-slate-100/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Water Saved</span>
            <div className="rounded-xl bg-eco-500/10 p-2 text-eco-500">
              <Trophy className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#22c55e]">{Math.round(stats?.litersSaved * 10) / 10} L</div>
          <p className="text-xs text-eco-600 dark:text-eco-400 mt-1.5 font-semibold">
            Saved {Math.round(stats?.percentageSaved)}% vs average guest
          </p>
        </div>
      </div>

      {/* Gamification Progress Bar */}
      <div className="glass-panel p-6 border-slate-100/80 dark:border-slate-800/80 mb-8">
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Eco Saving Level</span>
            <h4 className="text-base font-extrabold text-aqua-600 dark:text-aqua-400 mt-0.5">{stats?.ecoLevel}</h4>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Next: <strong className="text-slate-700 dark:text-slate-200">{levelInfo.nextLevel}</strong> ({stats?.points}/{levelInfo.req} pts)
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelInfo.progress}%` }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-aqua-500 to-eco-500 h-full rounded-full"
          ></motion.div>
        </div>
      </div>

      {/* Main Grid: Telemetry Charts, IoT Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Charts Panel */}
        <div className="lg:col-span-2 space-y-8">
          {/* Weekly Consumption Graph */}
          <div className="glass-panel p-6 border-slate-100/80 dark:border-slate-800/80">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Weekly Consumption Trend</h3>
            <div className="h-64 w-full">
              {dailyTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyTrendData}>
                    <defs>
                      <linearGradient id="colorLiters" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0891b2" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="L" />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white' }} />
                    <Area type="monotone" dataKey="liters" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLiters)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate-400">
                  Enter simulated usage on the right to start plotting graphs!
                </div>
              )}
            </div>
          </div>

          {/* Category Breakdown Progress indicators */}
          <div className="glass-panel p-6 border-slate-100/80 dark:border-slate-800/80">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Water Consumption by Fixture</h3>
            <div className="space-y-4">
              {['SHOWER', 'TAP', 'LAUNDRY', 'BATHROOM'].map((cat) => {
                const amount = stats?.categoryBreakdown[cat] || 0.0;
                const maxExpected = cat === 'SHOWER' ? 70.0 : cat === 'LAUNDRY' ? 60.0 : 30.0;
                const percentage = Math.min(100, (amount / maxExpected) * 100);
                return (
                  <div key={cat}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wide">{cat}</span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {amount} L / {maxExpected} L Limit
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percentage > 85 ? 'bg-red-500' : 'bg-aqua-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right side Simulator and AI recommendations */}
        <div className="space-y-8">
          {/* Smart meter simulator component */}
          <WaterMeterSimulator onSimulationComplete={fetchDashboardData} />

          {/* AI Tips widget */}
          <div className="glass-panel p-6 border-slate-100/80 dark:border-slate-800/80 bg-gradient-to-b from-aqua-500/[0.03] to-transparent">
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-xl bg-eco-500/10 p-2 text-eco-500">
                <Lightbulb className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">AI Conservation Advisory</h3>
            </div>
            {aiTips?.recommendations?.length > 0 ? (
              <div className="space-y-3">
                {aiTips.recommendations.map((tip, idx) => (
                  <div key={idx} className="flex gap-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-l-2 border-eco-500 pl-3 py-0.5">
                    {tip}
                  </div>
                ))}
                <div className="text-[10px] text-slate-400 mt-2">
                  Anomaly detected: <strong className="text-aqua-600 dark:text-aqua-400">{aiTips.primaryAnomaly}</strong>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Simulate a fixture usage above to allow the AI to generate telemetry advice.</p>
            )}
          </div>

          {/* Earned Badges capsule */}
          <div className="glass-panel p-6 border-slate-100/80 dark:border-slate-800/80">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">Unlocked Badges ({stats?.badges?.length})</h3>
            {stats?.badges?.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {stats.badges.map((badge) => (
                  <div
                    key={badge}
                    className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-aqua-500/10 to-eco-500/10 px-3 py-1 border border-aqua-500/10 dark:border-aqua-500/5 text-[11px] font-bold text-aqua-600 dark:text-aqua-400"
                  >
                    <Award className="h-3.5 w-3.5 text-eco-500" />
                    {badge}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Maintain streaks and save water to unlock your first sustainable badge!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;
