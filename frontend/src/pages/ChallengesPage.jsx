import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { Compass, Star, Trophy, Flame, CheckCircle2, ShieldAlert } from 'lucide-react';

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchChallengesAndStats = async () => {
    try {
      const challengesRes = await api.get('/guests/challenges');
      const statsRes = await api.get('/guests/dashboard');
      
      setChallenges(challengesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load challenges', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallengesAndStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center dark:bg-[#070b19]">
        <div className="flex flex-col items-center gap-3">
          <Compass className="h-10 w-10 animate-spin text-aqua-500" />
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading eco-challenges...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 dark:bg-[#070b19]">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
            <Compass className="h-8 w-8 text-aqua-500" />
            Eco-Challenges
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete sustainable challenges and level up your conservation score
          </p>
        </div>

        {/* User Telemetry Overview */}
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200/50 p-3.5 dark:bg-slate-900/60 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 border-r border-slate-200 dark:border-slate-800 pr-3.5">
            <Flame className="h-4.5 w-4.5 text-orange-500 animate-pulse" />
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{stats?.streakDays} Day Streak</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="h-4.5 w-4.5 text-amber-500 fill-amber-500/20" />
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{stats?.points} XP</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Challenges list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-700 dark:text-white mb-1">Active Hotel Challenges</h2>
          {challenges.length > 0 ? (
            challenges.map((challenge) => {
              // Calculate status
              const isCompleted = stats?.dailyUsage <= challenge.targetLiters;
              return (
                <div
                  key={challenge.id}
                  className={`glass-panel p-6 border-slate-100/80 dark:border-slate-800/80 transition-all ${
                    isCompleted 
                      ? 'bg-eco-500/[0.02] border-eco-500/20 dark:border-eco-500/10' 
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{challenge.challengeName}</h3>
                        {isCompleted && (
                          <span className="rounded-full bg-eco-500/15 px-2 py-0.5 text-[9px] font-bold text-eco-600 dark:text-eco-400">
                            COMPLETED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                        {challenge.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-extrabold text-eco-600 dark:text-eco-400">+{challenge.rewardPoints} XP</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Target: &le; {challenge.targetLiters}L</div>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                      <span>Today's Telemetry: {Math.round(stats?.dailyUsage * 10) / 10} L</span>
                      <span>Goal: &le; {challenge.targetLiters} L</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isCompleted ? 'bg-eco-500' : 'bg-aqua-500'}`}
                        style={{ width: `${Math.min(100, (stats?.dailyUsage / challenge.targetLiters) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400">No active challenges initialized by this hotel property.</p>
          )}
        </div>

        {/* Gamification Tips and Challenge Details */}
        <div className="space-y-6">
          <div className="glass-panel p-6 border-slate-100/80 dark:border-slate-800/80 bg-gradient-to-tr from-aqua-500/[0.03] to-transparent">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white mb-3">Streak Milestone Rewards</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/60 pb-2">
                <span>3-Day Saving Streak</span>
                <span className="font-bold text-aqua-600">Ultra Saver Badge</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/60 pb-2">
                <span>5-Day Saving Streak</span>
                <span className="font-bold text-aqua-600">Eco Hero Badge</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400 pb-1">
                <span>600+ Cumulative XP</span>
                <span className="font-bold text-eco-600">Sustainability Champ</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 border-slate-100/80 dark:border-slate-800/80">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Daily Limits Advisory</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Daily budget limits are set at <strong>120 liters</strong>. Stay under the limit to keep your conservation streak active and double your daily completion multipliers!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;
