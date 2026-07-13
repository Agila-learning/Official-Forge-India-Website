import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck, Star, Zap, CheckCircle2, XCircle, ChevronRight,
  CreditCard, IndianRupee, Clock, Award, Gift, Gem, Car, Bike,
  Hotel, Brush, RefreshCw, Crown, Lock, AlertCircle, BarChart2,
  ChevronDown, ChevronUp, Sparkles, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';

// ─── Helper: load Razorpay SDK ───────────────────────────────────────────────
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// ─── Helper: check membership expiry ─────────────────────────────────────────
const isMembershipActive = (vault) => {
  if (!vault || vault.status !== 'Active') return false;
  if (!vault.cycleEndDate) return false;
  return new Date(vault.cycleEndDate) > new Date();
};

// ─── Theme colours per plan ───────────────────────────────────────────────────
const planTheme = {
  starter: {
    bg: 'from-blue-500 via-cyan-500 to-teal-500',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    btn: 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
    shadow: 'shadow-blue-500/25',
    border: 'border-blue-200 dark:border-blue-800',
    accent: 'text-blue-500',
    icon: <Sparkles size={18} />,
  },
  premium: {
    bg: 'from-violet-500 via-purple-600 to-pink-500',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    btn: 'from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700',
    shadow: 'shadow-purple-500/25',
    border: 'border-purple-200 dark:border-purple-800',
    accent: 'text-purple-500',
    icon: <Crown size={18} />,
  },
  elite: {
    bg: 'from-amber-400 via-orange-500 to-rose-500',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    btn: 'from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600',
    shadow: 'shadow-amber-500/25',
    border: 'border-amber-200 dark:border-amber-800',
    accent: 'text-amber-500',
    icon: <Gem size={18} />,
  },
};

const getTheme = (plan) =>
  planTheme[(plan?.planCode || plan?.name || '').toLowerCase()] || planTheme.starter;

// ─── UsageMeter ──────────────────────────────────────────────────────────────
const UsageMeter = ({ label, icon, used = 0, limit = 0, color = 'blue' }) => {
  if (limit === 0) return null; // not included in plan
  const isUnlimited = limit === -1;
  const pct = isUnlimited ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const barColors = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500',
    green: 'bg-emerald-500',
    rose: 'bg-rose-500',
  };

  return (
    <div className="p-4 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-gray-500">{icon}</span>
        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{label}</span>
      </div>
      {isUnlimited ? (
        <p className="text-sm font-black text-emerald-500">∞ Unlimited</p>
      ) : (
        <>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-gray-500">{used} / {limit} used</span>
            <span className="text-xs font-black text-gray-700 dark:text-gray-300">{pct}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${barColors[color] || barColors.blue} ${pct >= 100 ? 'opacity-50' : ''}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {pct >= 100 && (
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1.5">Limit Reached</p>
          )}
        </>
      )}
    </div>
  );
};

// ─── Plan Feature Row ─────────────────────────────────────────────────────────
const FeatureRow = ({ label, starter, premium, elite }) => (
  <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
    <td className="py-3 px-4 text-sm font-bold text-gray-700 dark:text-gray-300">{label}</td>
    <td className="py-3 px-4 text-center text-sm font-bold text-blue-600 dark:text-blue-400">{starter}</td>
    <td className="py-3 px-4 text-center text-sm font-bold text-purple-600 dark:text-purple-400">{premium}</td>
    <td className="py-3 px-4 text-center text-sm font-bold text-amber-600 dark:text-amber-400">{elite}</td>
  </tr>
);

// ─── Plan Card ────────────────────────────────────────────────────────────────
const PlanCard = ({ plan, currentPlanId, onPurchase, paying }) => {
  const theme = getTheme(plan);
  const isActive = currentPlanId?.toString() === plan._id?.toString();
  const [expanded, setExpanded] = useState(false);

  const fmtLimit = (limit) => {
    if (limit === -1) return '∞ Unlimited';
    if (limit === 0) return '—';
    return `${limit}x`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative flex flex-col rounded-[2.5rem] border-2 ${theme.border} bg-white dark:bg-dark-card overflow-hidden shadow-xl ${theme.shadow} ${plan.popular ? 'ring-2 ring-purple-500/50 scale-[1.02]' : ''}`}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute -top-px left-1/2 -translate-x-1/2 px-5 py-1.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-b-xl shadow-lg">
          ✦ Most Popular
        </div>
      )}

      {/* Header gradient */}
      <div className={`bg-gradient-to-br ${theme.bg} p-6 pt-8 text-white`}>
        <div className="flex items-center gap-2 mb-1">
          {theme.icon}
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">FIC Membership</span>
        </div>
        <h3 className="text-3xl font-black tracking-tighter">{plan.name}</h3>
        <p className="text-sm opacity-80 mt-1 font-semibold">{plan.description}</p>
        <div className="mt-4 flex items-end gap-1">
          <span className="text-5xl font-black">₹{plan.price}</span>
          <span className="text-lg opacity-70 mb-1">{plan.period}</span>
        </div>
        <p className="text-[10px] font-bold opacity-60 mt-1 uppercase tracking-widest">
          Valid {plan.validityDays || 30} Days
        </p>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Category discounts */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { key: 'cabDiscount', icon: <Car size={14} />, label: 'Cab' },
            { key: 'bikeDiscount', icon: <Bike size={14} />, label: 'Bike' },
            { key: 'hotelDiscount', icon: <Hotel size={14} />, label: 'Hotel' },
            { key: 'cleaningDiscount', icon: <Brush size={14} />, label: 'Cleaning' },
          ].map(({ key, icon, label }) => {
            const rule = plan[key] || {};
            if (!rule.percentage) return (
              <div key={key} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl opacity-40">
                <span className="text-gray-400">{icon}</span>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{label}</p>
                  <p className="text-xs font-bold text-gray-400">—</p>
                </div>
              </div>
            );
            return (
              <div key={key} className={`flex items-center gap-2 p-3 rounded-xl ${theme.badge}`}>
                {icon}
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-70">{label}</p>
                  <p className="text-sm font-black">{rule.percentage}% · {fmtLimit(rule.limit)}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Key features */}
        <ul className="space-y-2.5 mb-5 flex-1">
          <li className="flex items-center gap-2.5">
            {plan.prioritySupport
              ? <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
              : <XCircle size={15} className="text-gray-300 dark:text-gray-600 shrink-0" />}
            <span className={`text-sm font-bold ${plan.prioritySupport ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300 dark:text-gray-600'}`}>
              Priority Support
            </span>
          </li>
          <li className="flex items-center gap-2.5">
            {plan.premiumPartnerAccess
              ? <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
              : <XCircle size={15} className="text-gray-300 dark:text-gray-600 shrink-0" />}
            <span className={`text-sm font-bold ${plan.premiumPartnerAccess ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300 dark:text-gray-600'}`}>
              Premium Partner Access
            </span>
          </li>
          <li className="flex items-center gap-2.5">
            <Gift size={15} className="text-emerald-500 shrink-0" />
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
              {plan.freeCancellationCount === -1 ? 'Unlimited' : plan.freeCancellationCount} Free Cancellation{plan.freeCancellationCount !== 1 ? 's' : ''}
            </span>
          </li>
          {plan.referralBonus > 0 && (
            <li className="flex items-center gap-2.5">
              <Award size={15} className="text-emerald-500 shrink-0" />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                ₹{plan.referralBonus} Referral Bonus
              </span>
            </li>
          )}
          {plan.welcomeBonusPoints > 0 && (
            <li className="flex items-center gap-2.5">
              <Star size={15} className="text-amber-400 shrink-0" />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {plan.welcomeBonusPoints} Welcome Points
              </span>
            </li>
          )}
        </ul>

        {/* Extra features toggle */}
        {plan.features?.length > 0 && (
          <div className="mb-5">
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
            >
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {expanded ? 'Hide' : 'Show'} all features
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 mt-3 overflow-hidden"
                >
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-gray-400 shrink-0" />
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{f}</span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* CTA Button */}
        {isActive ? (
          <div className="w-full py-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-[11px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-2">
            <ShieldCheck size={16} />
            Active Plan
          </div>
        ) : (
          <button
            onClick={() => onPurchase(plan)}
            disabled={paying}
            className={`w-full py-4 rounded-2xl bg-gradient-to-r ${theme.btn} text-white text-[11px] font-black uppercase tracking-widest shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {paying ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <>
                <CreditCard size={16} />
                {currentPlanId ? 'Switch Plan' : 'Purchase Plan'}
                <ChevronRight size={14} />
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ─── Expiry Banner ────────────────────────────────────────────────────────────
const ExpiryBanner = ({ vault, onRenew }) => {
  const endDate = new Date(vault.cycleEndDate);
  const daysLeft = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-8 p-5 rounded-2xl flex items-center gap-4 border-2 ${
        isExpired
          ? 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800'
          : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'
      }`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isExpired ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
        {isExpired ? <Lock size={22} /> : <AlertCircle size={22} />}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-black ${isExpired ? 'text-rose-700 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400'}`}>
          {isExpired ? '⚠ Membership Expired — Discounts Disabled' : `Membership expiring in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {isExpired ? 'Renew now to restore your discounts and limits.' : `Renew before ${endDate.toLocaleDateString()} to maintain uninterrupted access.`}
        </p>
      </div>
      <button
        onClick={onRenew}
        className={`shrink-0 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r ${isExpired ? 'from-rose-500 to-red-600' : 'from-amber-400 to-orange-500'} shadow-md hover:scale-105 transition-transform`}
      >
        Renew Now
      </button>
    </motion.div>
  );
};

// ─── Active Vault Card ────────────────────────────────────────────────────────
const ActiveVaultCard = ({ user, vault, plan }) => {
  const theme = getTheme(plan);
  const endDate = new Date(vault.cycleEndDate);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="text-emerald-500" size={22} />
        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Your Active Membership</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Digital Card */}
        <div className="lg:col-span-2">
          <div className={`relative p-7 rounded-[2rem] bg-gradient-to-br ${theme.bg} shadow-2xl ${theme.shadow} text-white overflow-hidden group`}>
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute -left-10 -bottom-10 w-28 h-28 bg-black/10 rounded-full blur-2xl" />

            <div className="relative z-10 flex justify-between items-start mb-8">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">FIC Membership</p>
                <h3 className="text-2xl font-black tracking-tighter">{plan.name}</h3>
              </div>
              <div className="w-11 h-11 bg-white/20 rounded-xl backdrop-blur-md flex items-center justify-center border border-white/30">
                {theme.icon}
              </div>
            </div>

            <p className="relative z-10 text-sm font-black tracking-[0.15em] opacity-90 mb-1">{vault.membershipNumber}</p>
            <p className="relative z-10 text-[10px] uppercase font-bold opacity-60">{user?.firstName} {user?.lastName}</p>

            <div className="relative z-10 flex items-end justify-between mt-5">
              <div>
                <p className="text-[9px] opacity-60 uppercase tracking-widest font-bold">Valid Till</p>
                <p className="text-sm font-black">{endDate.toLocaleDateString()}</p>
              </div>
              <div className="p-2 bg-white rounded-xl shadow-lg">
                <QRCode value={`FIC-VERIFY-${vault.membershipNumber}`} size={44} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-4">
          {[
            { icon: <IndianRupee size={18} />, label: 'Total Savings', value: `₹${(vault.totalSavings || 0).toLocaleString()}`, color: 'green' },
            { icon: <Star size={18} />, label: 'Reward Points', value: vault.rewardPoints || 0, color: 'amber' },
            { icon: <Zap size={18} />, label: 'Cashback Earned', value: `₹${(vault.cashbackEarned || 0).toLocaleString()}`, color: 'blue' },
            { icon: <TrendingUp size={18} />, label: 'Savings / Month', value: `₹${(vault.savingsThisMonth || 0).toLocaleString()}`, color: 'purple' },
          ].map(({ icon, label, value, color }) => {
            const colorMap = {
              green: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600',
              amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
              blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
              purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
            };
            return (
              <div key={label} className="p-5 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className={`w-9 h-9 rounded-xl ${colorMap[color]} flex items-center justify-center mb-3`}>{icon}</div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-xl font-black text-gray-900 dark:text-white">{value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Usage Meters */}
      <div className="mt-6">
        <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <BarChart2 size={15} /> Usage This Cycle
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <UsageMeter label="Cab Rides" icon={<Car size={14} />} used={vault.cabRidesUsed || 0} limit={plan?.cabDiscount?.limit || 0} color="blue" />
          <UsageMeter label="Bike Bookings" icon={<Bike size={14} />} used={vault.bikeBookingsUsed || 0} limit={plan?.bikeDiscount?.limit || 0} color="purple" />
          <UsageMeter label="Hotel Stays" icon={<Hotel size={14} />} used={vault.hotelBookingsUsed || 0} limit={plan?.hotelDiscount?.limit || 0} color="amber" />
          <UsageMeter label="Cleaning" icon={<Brush size={14} />} used={vault.cleaningServicesUsed || 0} limit={plan?.cleaningDiscount?.limit || 0} color="rose" />
        </div>
      </div>
    </motion.div>
  );
};

// ─── Comparison Table ─────────────────────────────────────────────────────────
const ComparisonTable = ({ plans }) => {
  const [show, setShow] = useState(false);
  const getPlan = (code) => plans.find(p => (p.planCode || p.name)?.toLowerCase() === code);
  const s = getPlan('starter'), p = getPlan('premium'), e = getPlan('elite');
  if (!s || !p || !e) return null;

  const fmtLimit = (d) => d?.limit === -1 ? '∞' : d?.limit > 0 ? `${d.limit}x` : '—';
  const fmtPct = (d) => d?.percentage > 0 ? `${d.percentage}%` : '—';
  const yesno = (v) => v ? '✅' : '❌';

  return (
    <div className="mt-12">
      <button
        onClick={() => setShow(v => !v)}
        className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 uppercase tracking-widest transition-colors mx-auto"
      >
        {show ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {show ? 'Hide' : 'Show'} Full Comparison Table
      </button>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
          >
            <table className="w-full text-sm bg-white dark:bg-dark-card">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/60">
                  <th className="py-3 px-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Feature</th>
                  <th className="py-3 px-4 text-center text-xs font-black text-blue-600 uppercase tracking-widest">Starter ₹199</th>
                  <th className="py-3 px-4 text-center text-xs font-black text-purple-600 uppercase tracking-widest">Premium ₹499</th>
                  <th className="py-3 px-4 text-center text-xs font-black text-amber-600 uppercase tracking-widest">Elite ₹999</th>
                </tr>
              </thead>
              <tbody>
                <FeatureRow label="Validity" starter="30 Days" premium="30 Days" elite="30 Days" />
                <FeatureRow label="Cab Discount" starter={fmtPct(s.cabDiscount)} premium={fmtPct(p.cabDiscount)} elite={fmtPct(e.cabDiscount)} />
                <FeatureRow label="Cab Ride Limit" starter={fmtLimit(s.cabDiscount)} premium={fmtLimit(p.cabDiscount)} elite={fmtLimit(e.cabDiscount)} />
                <FeatureRow label="Bike Discount" starter={fmtPct(s.bikeDiscount)} premium={fmtPct(p.bikeDiscount)} elite={fmtPct(e.bikeDiscount)} />
                <FeatureRow label="Bike Limit" starter={fmtLimit(s.bikeDiscount)} premium={fmtLimit(p.bikeDiscount)} elite={fmtLimit(e.bikeDiscount)} />
                <FeatureRow label="Hotel Discount" starter={fmtPct(s.hotelDiscount)} premium={fmtPct(p.hotelDiscount)} elite={fmtPct(e.hotelDiscount)} />
                <FeatureRow label="Hotel Limit" starter={fmtLimit(s.hotelDiscount)} premium={fmtLimit(p.hotelDiscount)} elite={fmtLimit(e.hotelDiscount)} />
                <FeatureRow label="Cleaning Discount" starter={fmtPct(s.cleaningDiscount)} premium={fmtPct(p.cleaningDiscount)} elite={fmtPct(e.cleaningDiscount)} />
                <FeatureRow label="Cleaning Limit" starter={fmtLimit(s.cleaningDiscount)} premium={fmtLimit(p.cleaningDiscount)} elite={fmtLimit(e.cleaningDiscount)} />
                <FeatureRow label="Priority Support" starter={yesno(s.prioritySupport)} premium={yesno(p.prioritySupport)} elite={yesno(e.prioritySupport)} />
                <FeatureRow label="Premium Partners" starter={yesno(s.premiumPartnerAccess)} premium={yesno(p.premiumPartnerAccess)} elite={yesno(e.premiumPartnerAccess)} />
                <FeatureRow label="Free Cancellations" starter={s.freeCancellationCount} premium={p.freeCancellationCount} elite="∞" />
                <FeatureRow label="Referral Bonus" starter={s.referralBonus > 0 ? `₹${s.referralBonus}` : '—'} premium={`₹${p.referralBonus}`} elite={`₹${e.referralBonus}`} />
                <FeatureRow label="Welcome Points" starter={s.welcomeBonusPoints} premium={p.welcomeBonusPoints} elite={e.welcomeBonusPoints} />
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const MembershipHub = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('userInfo') || 'null'));
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [renewTarget, setRenewTarget] = useState(null); // scroll to plans

  const vault = user?.membershipVault;
  const isActive = isMembershipActive(vault);
  const isExpired = vault?.status === 'Active' && !isActive;

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/membership-plans');
      setPlans(data || []);

      if (vault?.planId) {
        const found = data.find(p => p._id === vault.planId?.toString() || p._id?.toString() === vault.planId?.toString());
        setActivePlan(found || null);
      }
    } catch {
      toast.error('Failed to load membership plans');
    } finally {
      setLoading(false);
    }
  }, [vault?.planId]);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  // Refresh user from localStorage when storage changes
  useEffect(() => {
    const handler = () => setUser(JSON.parse(localStorage.getItem('userInfo') || 'null'));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handlePurchase = async (plan) => {
    if (!user) { toast.error('Please log in to purchase a membership.'); return; }

    const sdkLoaded = await loadRazorpay();
    if (!sdkLoaded) {
      toast.error('Payment gateway failed to load. Please refresh and try again.');
      return;
    }

    setPaying(true);
    try {
      // 1. Create Razorpay order
      const { data: order } = await api.post('/users/membership-vault', { planId: plan._id });

      // 2. Open Razorpay checkout modal
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Forge India Connect',
        description: `${plan.name} Membership`,
        order_id: order.orderId,
        prefill: {
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.email,
          contact: user.mobile || '',
        },
        theme: {
          color: plan.planCode === 'elite' ? '#f59e0b' : plan.planCode === 'premium' ? '#8b5cf6' : '#3b82f6',
        },
        handler: async (response) => {
          // 3. Verify payment and activate membership
          try {
            const { data: result } = await api.post('/users/membership-vault/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: plan._id,
            });

            // 4. Update local storage + state
            if (result.user) {
              localStorage.setItem('userInfo', JSON.stringify(result.user));
              setUser(result.user);
            } else {
              // Patch vault manually
              const updated = { ...user, membershipVault: result.vault, isMember: true };
              localStorage.setItem('userInfo', JSON.stringify(updated));
              setUser(updated);
            }

            toast.success(`🎉 ${plan.name} membership activated!`);
            fetchPlans();
          } catch (err) {
            toast.error(err.response?.data?.message || 'Payment verification failed');
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        toast.error(`Payment failed: ${resp.error.description}`);
        setPaying(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pb-28">
      {/* ── Hero ── */}
      <div className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[60%] h-64 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-black uppercase tracking-widest text-[10px] mb-6"
          >
            <Gem size={13} /> Forge India Connect — Elite Membership
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter mb-5"
          >
            Unlock{' '}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Premium
            </span>{' '}
            Privileges
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-semibold max-w-2xl mx-auto"
          >
            Real discounts on every booking — cabs, bikes, hotels, and home services. Pay once, save every ride.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* ── Expiry Banner ── */}
        {(isExpired || (isActive && vault?.cycleEndDate && Math.ceil((new Date(vault.cycleEndDate) - new Date()) / (1000 * 60 * 60 * 24)) <= 5)) && (
          <ExpiryBanner vault={vault} onRenew={() => setRenewTarget(true)} />
        )}

        {/* ── Active Vault ── */}
        {isActive && activePlan && (
          <ActiveVaultCard user={user} vault={vault} plan={activePlan} />
        )}

        {/* ── Plan Cards ── */}
        <div id="plans-section" ref={node => renewTarget && node?.scrollIntoView({ behavior: 'smooth' })}>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
              {isActive ? 'Switch or Renew Plan' : 'Choose Your Plan'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <PlanCard
                  plan={plan}
                  currentPlanId={isActive ? vault?.planId : null}
                  onPurchase={handlePurchase}
                  paying={paying}
                />
              </motion.div>
            ))}
          </div>

          {plans.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <Gem size={40} className="mx-auto mb-4 opacity-30" />
              <p className="font-bold">No membership plans available at the moment.</p>
            </div>
          )}
        </div>

        {/* ── Comparison Table ── */}
        {plans.length >= 3 && <ComparisonTable plans={plans} />}

        {/* ── Value Props ── */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <ShieldCheck size={24} />, title: 'Secure Payment', desc: 'Powered by Razorpay — India\'s trusted payment gateway.' },
            { icon: <RefreshCw size={24} />, title: 'Easy Renewal', desc: 'Renew from your dashboard anytime before expiry.' },
            { icon: <Award size={24} />, title: 'Instant Activation', desc: 'Your membership activates immediately after payment.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 p-6 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">{icon}</div>
              <div>
                <h4 className="font-black text-gray-900 dark:text-white mb-1">{title}</h4>
                <p className="text-sm text-gray-500 font-medium">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembershipHub;
