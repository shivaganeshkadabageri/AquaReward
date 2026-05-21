import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { Trophy, Star, Flame, Award, ShieldAlert, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get('/guests/leaderboard');
      setLeaderboard(res.data);
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center dark:bg-[#070b19]">
        <div className="flex flex-col items-center gap-3">
          <Trophy className="h-10 w-10 animate-bounce text-amber-500" />
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading hotel leaderboard...</span>
        </div>
      </div>
    );
  }

  // Separate top 3 if available
  const topThree = leaderboard.slice(0, 3);
  const remainingList = leaderboard.slice(3);

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return 'bg-amber-400/10 text-amber-600 border border-amber-400/20';
    if (rank === 2) return 'bg-slate-300/20 text-slate-500 border border-slate-300/30';
    if (rank === 3) return 'bg-amber-700/10 text-amber-700 border border-amber-700/20';
    return 'bg-slate-100 text-slate-500 border border-slate-200/50';
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 dark:bg-[#070b19]">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex rounded-2xl bg-amber-500/10 p-3 text-amber-500 mb-3 shadow-md shadow-amber-500/5">
          <Trophy className="h-6 w-6 animate-pulse" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Water Savers Leaderboard</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          See where you stand among conservationists at your hotel
        </p>
      </div>

      {/* Top 3 Podium (visual highlights) */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {topThree.map((guest, idx) => {
            const rank = idx + 1;
            return (
              <motion.div
                key={guest.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                className={`glass-panel p-6 border-slate-100 dark:border-slate-800 text-center relative overflow-hidden ${
                  rank === 1 
                    ? 'border-amber-400/40 dark:border-amber-400/20 bg-gradient-to-b from-amber-500/[0.03] to-transparent ring-2 ring-amber-400/20 shadow-amber-500/5 shadow-xl sm:-translate-y-2' 
                    : ''
                }`}
              >
                {/* Rank Medal */}
                <div className={`absolute top-3 left-3 rounded-full px-2 py-0.5 text-[9px] font-black tracking-wide ${getRankBadgeColor(rank)}`}>
                  RANK #{rank}
                </div>

                <div className="mx-auto rounded-full bg-slate-100 dark:bg-slate-800 p-3 w-fit border border-slate-200/50 dark:border-slate-700/80 mb-3.5">
                  <Trophy className={`h-8 w-8 ${
                    rank === 1 ? 'text-amber-400 animate-bounce-slow' : rank === 2 ? 'text-slate-400' : 'text-amber-700'
                  }`} />
                </div>

                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{guest.name}</h3>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{guest.ecoLevel}</div>

                <div className="mt-4 flex items-center justify-center gap-4 text-xs font-bold pt-3.5 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-500/10" />
                    <span>{guest.points} XP</span>
                  </div>
                  <div className="flex items-center gap-1 text-orange-500">
                    <Flame className="h-3.5 w-3.5 animate-pulse" />
                    <span>{guest.streakDays}d Streak</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Main Leaderboard scrolling list */}
      <div className="glass-panel overflow-hidden border-slate-100 dark:border-slate-800 shadow-md">
        <div className="bg-slate-50 dark:bg-slate-900/60 px-6 py-3 border-b border-slate-100 dark:border-slate-800/80 grid grid-cols-12 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-2">Rank</div>
          <div className="col-span-4">Name / Level</div>
          <div className="col-span-2 text-center">Badges</div>
          <div className="col-span-2 text-center">Streak</div>
          <div className="col-span-2 text-right">Points</div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {remainingList.length > 0 ? (
            remainingList.map((guest) => (
              <div
                key={guest.name}
                className="px-6 py-4 grid grid-cols-12 items-center text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
              >
                <div className="col-span-2">
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 font-bold text-slate-500 dark:text-slate-400">
                    #{guest.rank}
                  </span>
                </div>

                <div className="col-span-4 pr-2">
                  <div className="font-extrabold text-slate-800 dark:text-slate-200">{guest.name}</div>
                  <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">{guest.ecoLevel}</div>
                </div>

                <div className="col-span-2 text-center">
                  <div className="inline-flex items-center gap-0.5 rounded-full bg-aqua-500/10 px-2 py-0.5 text-[10px] font-bold text-aqua-600 dark:text-aqua-400">
                    <Award className="h-3 w-3" />
                    <span>{guest.badgesCount}</span>
                  </div>
                </div>

                <div className="col-span-2 text-center font-bold text-orange-500">
                  {guest.streakDays}d
                </div>

                <div className="col-span-2 text-right font-black text-amber-600 dark:text-amber-400">
                  {guest.points} XP
                </div>
              </div>
            ))
          ) : topThree.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No active hotel guest leaderboards available.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
