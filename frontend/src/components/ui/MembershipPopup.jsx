import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Zap, Crown, Star, CheckCircle2, ArrowRight, Wallet } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PLANS = [
    {
        name: 'Starter Vault',
        value: 5000,
        price: '₹5,000',
        color: 'from-blue-500 to-indigo-600',
        border: 'border-blue-200 dark:border-blue-800/30',
        badge: 'bg-blue-100 text-blue-600',
        icon: Zap,
        highlight: false,
        benefits: [
            'Travel services up to ₹2,000',
            'PG / Accommodation services',
            'Food services up to ₹1,300',
            'Valid for 1 month',
            'Multi-use within cycle',
        ],
    },
    {
        name: 'Premium Vault',
        value: 10000,
        price: '₹10,000',
        color: 'from-purple-500 to-pink-600',
        border: 'border-purple-200 dark:border-purple-800/30',
        badge: 'bg-purple-100 text-purple-600',
        icon: Star,
        highlight: true,
        benefits: [
            'All Starter Vault benefits',
            'Extended travel coverage',
            'Premium PG stays',
            'Food & dining perks',
            'Priority customer support',
            'Valid for 1 month',
        ],
    },
    {
        name: 'Elite Vault',
        value: 25000,
        price: '₹25,000',
        color: 'from-yellow-500 to-orange-600',
        border: 'border-yellow-200 dark:border-yellow-800/30',
        badge: 'bg-yellow-100 text-yellow-700',
        icon: Crown,
        highlight: false,
        benefits: [
            'All Premium Vault benefits',
            'Unlimited service categories',
            'Exclusive elite services',
            'Dedicated account manager',
            'Rollover unused balance (10%)',
            'Valid for 1 month',
        ],
    },
];

const MembershipPopup = ({ onClose }) => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePurchase = async (plan) => {
        setLoading(true);
        try {
            await api.post('/users/membership-vault', { planValue: plan.value, planTier: plan.name });
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const updated = {
                ...userInfo,
                membershipVault: {
                    balance: plan.value,
                    planValue: plan.value,
                    planTier: plan.name,
                    cycleStartDate: new Date().toISOString(),
                    savingsThisMonth: 0,
                },
            };
            localStorage.setItem('userInfo', JSON.stringify(updated));
            toast.success(`${plan.name} activated! ₹${plan.value.toLocaleString()} credited to your vault.`);
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Purchase failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.85, y: 40, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="w-full max-w-5xl max-h-[95vh] overflow-y-auto bg-white dark:bg-dark-card rounded-[3rem] shadow-3xl relative"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all z-10"
                    >
                        <X size={20} />
                    </button>

                    {/* Hero Banner */}
                    <div className="relative overflow-hidden rounded-t-[3rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-10 md:p-14">
                        <div className="absolute inset-0 opacity-10">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="absolute w-64 h-64 rounded-full bg-white/30 blur-3xl" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, transform: 'translate(-50%,-50%)' }} />
                            ))}
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <Wallet size={20} className="text-white" />
                                </div>
                                <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.3em]">FIC Membership Vault</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3">
                                You're missing out on <br />
                                <span className="text-yellow-300">Premium Savings!</span>
                            </h2>
                            <p className="text-white/80 font-bold text-sm md:text-base max-w-lg">
                                FIC members have already saved up to <span className="text-yellow-300 font-black">₹1,00,000</span> on travel, PG stays, food, and more. Prepay once, enjoy services all month.
                            </p>
                            <div className="flex flex-wrap gap-4 mt-8">
                                {['Travel', 'PG / Stays', 'Food & Dining', 'More Services'].map(cat => (
                                    <div key={cat} className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur rounded-full border border-white/20">
                                        <CheckCircle2 size={14} className="text-yellow-300" />
                                        <span className="text-white text-[10px] font-black uppercase tracking-widest">{cat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="absolute top-4 right-14">
                            <Sparkles className="text-yellow-300 opacity-60" size={48} />
                        </div>
                    </div>

                    {/* Plans Grid */}
                    <div className="p-6 md:p-10">
                        <div className="text-center mb-8">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Choose Your Plan</p>
                            <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">Prepaid Service Vault</h3>
                            <p className="text-sm font-bold text-gray-400 mt-2">Valid for services only · Monthly cycle · Multi-use</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {PLANS.map(plan => {
                                const Icon = plan.icon;
                                const isSelected = selectedPlan?.name === plan.name;
                                return (
                                    <div
                                        key={plan.name}
                                        onClick={() => setSelectedPlan(plan)}
                                        className={`relative cursor-pointer rounded-[2.5rem] border-2 transition-all duration-200 overflow-hidden ${
                                            isSelected
                                                ? 'border-primary scale-[1.02] shadow-2xl shadow-primary/20'
                                                : `${plan.border} hover:border-primary/40 hover:shadow-lg`
                                        }`}
                                    >
                                        {plan.highlight && (
                                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                                        )}
                                        {plan.highlight && (
                                            <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                                                Most Popular
                                            </div>
                                        )}
                                        <div className={`h-2 w-full bg-gradient-to-r ${plan.color}`} />
                                        <div className="p-7">
                                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-5`}>
                                                <Icon size={22} className="text-white" />
                                            </div>
                                            <h4 className="text-lg font-black text-gray-900 dark:text-white mb-1">{plan.name}</h4>
                                            <div className="flex items-end gap-1 mb-5">
                                                <span className="text-4xl font-black text-gray-900 dark:text-white">{plan.price}</span>
                                                <span className="text-xs font-bold text-gray-400 mb-1">/ month</span>
                                            </div>
                                            <ul className="space-y-2 mb-6">
                                                {plan.benefits.map(b => (
                                                    <li key={b} className="flex items-start gap-2 text-xs font-bold text-gray-600 dark:text-gray-300">
                                                        <CheckCircle2 size={13} className="text-primary mt-0.5 shrink-0" />
                                                        {b}
                                                    </li>
                                                ))}
                                            </ul>
                                            {isSelected && (
                                                <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest">
                                                    <CheckCircle2 size={14} /> Selected
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <p className="text-xs font-bold text-gray-400 text-center sm:text-left">
                                ✅ Service-only redemption · ✅ No product purchases · ✅ Monthly usage tracking
                            </p>
                            <button
                                disabled={!selectedPlan || loading}
                                onClick={() => selectedPlan && handlePurchase(selectedPlan)}
                                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                                    selectedPlan
                                        ? 'bg-gradient-to-r from-primary to-indigo-600 text-white shadow-xl shadow-primary/30 hover:scale-[1.02]'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {loading ? 'Activating...' : selectedPlan ? `Activate ${selectedPlan.name}` : 'Select a Plan'}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MembershipPopup;
