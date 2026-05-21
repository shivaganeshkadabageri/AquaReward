import React, { useState } from 'react';
import { api } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, ShowerHead, Settings, CheckCircle2, Waves, RefreshCw } from 'lucide-react';

const WaterMeterSimulator = ({ onSimulationComplete }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [simulatedCategory, setSimulatedCategory] = useState('');
  const [litersSavedSimulated, setLitersSavedSimulated] = useState(0);
  const [customLiters, setCustomLiters] = useState('');
  const [customCategory, setCustomCategory] = useState('SHOWER');

  const simulationPresets = [
    { name: 'Take 5-min Shower', category: 'SHOWER', liters: 35.0, icon: ShowerHead, desc: 'Eco shower-head' },
    { name: 'Wash Hands / Faucet', category: 'TAP', liters: 6.0, icon: Droplet, desc: 'Sensor tap run' },
    { name: 'Flush Toilet (Half)', category: 'BATHROOM', liters: 4.5, icon: Waves, desc: 'Eco dual-flush' },
    { name: 'Eco Laundry Cycle', category: 'LAUNDRY', liters: 45.0, icon: RefreshCw, desc: 'Front-load high efficiency' },
  ];

  const triggerSimulation = async (category, liters) => {
    setLoading(true);
    setSuccess(false);
    setSimulatedCategory(category);
    setLitersSavedSimulated(liters);

    try {
      await api.post('/guests/water-usage/simulate', {
        category: category,
        litersUsed: liters,
      });
      
      setSuccess(true);
      if (onSimulationComplete) {
        onSimulationComplete();
      }
      setTimeout(() => {
        setSuccess(false);
      }, 4000);
    } catch (error) {
      console.error('Simulation failed:', error);
      alert('Simulation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const l = parseFloat(customLiters);
    if (!isNaN(l) && l > 0) {
      triggerSimulation(customCategory, l);
      setCustomLiters('');
    }
  };

  return (
    <div className="glass-panel p-6 shadow-md border-slate-100/80 dark:border-slate-800/80">
      <div className="flex items-center gap-2 mb-4">
        <div className="rounded-xl bg-gradient-to-tr from-aqua-400 to-eco-400 p-2 text-white shadow-sm">
          <Droplet className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">IoT Smart Meter Simulator</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Simulate room fixture events in real-time</p>
        </div>
      </div>

      {/* Preset buttons grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {simulationPresets.map((preset) => {
          const Icon = preset.icon;
          return (
            <button
              key={preset.name}
              disabled={loading}
              onClick={() => triggerSimulation(preset.category, preset.liters)}
              className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50 hover:border-aqua-300 dark:border-slate-800 dark:hover:bg-slate-800/40 dark:hover:border-aqua-500/30 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-aqua-50 dark:bg-aqua-950/20 p-2 text-aqua-600 dark:text-aqua-400 group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">{preset.name}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">{preset.desc}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-aqua-600 dark:text-aqua-400">{preset.liters} L</div>
                <div className="text-[9px] font-medium text-eco-500">+10-25 XP</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Success Alert / Loading State */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-3 rounded-xl bg-aqua-50/50 dark:bg-aqua-950/10 p-4 border border-aqua-100 dark:border-aqua-900/20 text-aqua-600 dark:text-aqua-400 mb-6"
          >
            <Droplet className="h-5 w-5 animate-bounce text-aqua-500" />
            <span className="text-sm font-semibold">Smart meter transmitting telemetry packet...</span>
          </motion.div>
        )}

        {success && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-xl bg-gradient-to-r from-eco-500/10 to-aqua-500/10 p-4 border border-eco-500/20 dark:border-eco-500/10 mb-6"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-eco-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Usage Received Successfully!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Fixture: <strong className="text-aqua-600 dark:text-aqua-400">{simulatedCategory}</strong> with <strong className="text-aqua-600 dark:text-aqua-400">{litersSavedSimulated} liters</strong>.
                </p>
                <p className="text-[10px] text-eco-600 dark:text-eco-400 font-semibold mt-1">
                  🌱 Streak checks and Level thresholds re-evaluated. +Points awarded!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Simulation Entry */}
      <form onSubmit={handleCustomSubmit} className="border-t border-slate-100 dark:border-slate-800/80 pt-4">
        <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">Custom Usage Entry</div>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:border-aqua-500"
          >
            <option value="SHOWER">Shower</option>
            <option value="TAP">Tap</option>
            <option value="LAUNDRY">Laundry</option>
            <option value="BATHROOM">Bathroom</option>
          </select>
          <div className="relative flex-grow">
            <input
              type="number"
              step="0.1"
              required
              value={customLiters}
              onChange={(e) => setCustomLiters(e.target.value)}
              placeholder="Enter liters (e.g. 15.5)"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 pr-10 text-sm bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:border-aqua-500"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400">liters</span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-aqua-600 to-eco-600 hover:brightness-105 px-4 py-2 text-sm font-semibold text-white transition-all shadow-md shadow-aqua-500/10"
          >
            Simulate
          </button>
        </div>
      </form>
    </div>
  );
};

export default WaterMeterSimulator;
