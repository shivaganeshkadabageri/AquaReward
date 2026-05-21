import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Star, CheckCircle2, Ticket, QrCode, Tag } from 'lucide-react';

const RewardsPage = () => {
  const [rewards, setRewards] = useState([]);
  const [myCoupons, setMyCoupons] = useState([]);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeCoupon, setActiveCoupon] = useState(null); // Modal for newly redeemed coupon

  const fetchRewardsData = async () => {
    try {
      const statsRes = await api.get('/guests/dashboard');
      const rewardsRes = await api.get('/rewards');
      const myRedemptionsRes = await api.get('/rewards/my-redemptions');

      setPoints(statsRes.data.points);
      setRewards(rewardsRes.data);
      setMyCoupons(myRedemptionsRes.data);
    } catch (err) {
      console.error('Failed to load rewards data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewardsData();
  }, []);

  const handleRedeem = async (reward) => {
    if (points < reward.pointsRequired) {
      alert('Insufficient points for this reward.');
      return;
    }

    try {
      const res = await api.post('/rewards/redeem', { rewardId: reward.id });
      // Show newly redeemed coupon modal
      setActiveCoupon({
        ...res.data,
        rewardName: reward.rewardName,
        pointsRequired: reward.pointsRequired,
        description: reward.description,
      });
      // Refresh telemetry
      await fetchRewardsData();
    } catch (error) {
      console.error('Redemption failed:', error);
      alert(error.response?.data || 'Redemption failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center dark:bg-[#070b19]">
        <div className="flex flex-col items-center gap-3">
          <Award className="h-10 w-10 animate-pulse text-aqua-500" />
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading eco-rewards...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 dark:bg-[#070b19]">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
            <Award className="h-8 w-8 text-eco-500" />
            Eco-Rewards Catalog
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Exchange your earned eco-points for exclusive luxury rewards and discounts
          </p>
        </div>

        {/* User Balance Capsule */}
        <div className="flex items-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-5 py-3 dark:border-amber-500/10">
          <Star className="h-5 w-5 text-amber-500 fill-amber-500/20 animate-pulse" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Your Balance</div>
            <div className="text-lg font-black text-slate-800 dark:text-slate-100">{points} Eco-Points</div>
          </div>
        </div>
      </div>

      {/* Rewards Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {rewards.map((reward) => {
          const isEligible = points >= reward.pointsRequired;
          return (
            <div
              key={reward.id}
              className="glass-panel overflow-hidden border-slate-100 dark:border-slate-800 flex flex-col justify-between glass-panel-hover"
            >
              <div>
                <img
                  src={reward.imageUrl || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400'}
                  alt={reward.rewardName}
                  className="h-44 w-full object-cover"
                />
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-white">{reward.rewardName}</h3>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-full px-2.5 py-0.5">
                      {reward.pointsRequired} pts
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {reward.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={!isEligible}
                  className={`w-full rounded-xl py-2.5 text-xs font-bold text-white transition-all shadow-md ${
                    isEligible
                      ? 'bg-gradient-to-r from-eco-600 to-emerald-600 shadow-eco-500/10 hover:brightness-105'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                  }`}
                >
                  {isEligible ? 'Redeem Reward' : 'Insufficient Points'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Redemptions / My Coupons */}
      <div className="border-t border-slate-100 dark:border-slate-900/60 pt-10">
        <h2 className="text-lg font-bold text-slate-700 dark:text-white mb-4 flex items-center gap-2">
          <Ticket className="h-5 w-5 text-aqua-500" />
          My Redeemed Coupons ({myCoupons.length})
        </h2>
        {myCoupons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myCoupons.map((coupon) => {
              // Find matching reward name
              const reward = rewards.find((r) => r.id === coupon.rewardId);
              return (
                <div
                  key={coupon.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white/50 p-4 dark:border-slate-800/80 dark:bg-slate-900/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-eco-50 dark:bg-eco-950/20 p-2.5 text-eco-600">
                      <Tag className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {reward?.rewardName || 'Special Reward Coupon'}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                        Code: <strong className="text-aqua-600 font-mono select-all">{coupon.couponCode}</strong>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveCoupon({ ...coupon, rewardName: reward?.rewardName || 'Special Eco Reward' })}
                    className="flex items-center gap-1 text-[10px] font-bold text-aqua-600 hover:underline dark:text-aqua-400"
                  >
                    <QrCode className="h-4 w-4" />
                    View QR
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400">You haven't redeemed any coupons yet. Complete eco-challenges to earn points!</p>
        )}
      </div>

      {/* QR Coupon Modal overlay */}
      <AnimatePresence>
        {activeCoupon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6 dark:bg-[#0f172a] shadow-2xl relative"
            >
              <h3 className="text-lg font-black text-center text-slate-800 dark:text-white mb-1">Your Reward Coupon</h3>
              <p className="text-[11px] text-center text-slate-500 mb-6">Present this coupon at the front desk to redeem</p>

              {/* Simulated Premium QR Card */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200/50 p-6 flex flex-col items-center dark:bg-slate-900/60 dark:border-slate-800/80 mb-6">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">{activeCoupon.rewardName}</div>
                <div className="text-[10px] text-eco-500 font-bold mb-4">Eco Reward Redeemed</div>

                {/* Mock QR Code Pattern */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-700 dark:bg-white mb-4 shadow-sm">
                  {/* Generated CSS mock grid of QR code blocks */}
                  <div className="grid grid-cols-4 gap-1.5 h-28 w-28 text-slate-800">
                    <div className="bg-slate-900 rounded-[3px]"></div>
                    <div className="bg-slate-900 rounded-[3px]"></div>
                    <div></div>
                    <div className="bg-slate-900 rounded-[3px]"></div>
                    <div></div>
                    <div className="bg-slate-900 rounded-[3px]"></div>
                    <div className="bg-slate-900 rounded-[3px]"></div>
                    <div></div>
                    <div className="bg-slate-900 rounded-[3px]"></div>
                    <div></div>
                    <div className="bg-slate-900 rounded-[3px]"></div>
                    <div className="bg-slate-900 rounded-[3px]"></div>
                    <div className="bg-slate-900 rounded-[3px]"></div>
                    <div className="bg-slate-900 rounded-[3px]"></div>
                    <div></div>
                    <div className="bg-slate-900 rounded-[3px]"></div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Coupon Code</div>
                  <div className="text-sm font-black font-mono tracking-wider text-aqua-600 mt-0.5 select-all">{activeCoupon.couponCode}</div>
                </div>
              </div>

              <button
                onClick={() => setActiveCoupon(null)}
                className="w-full rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-800/60 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all"
              >
                Close Coupon
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RewardsPage;
