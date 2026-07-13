import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Copy, CheckCircle, IndianRupee, Link as LinkIcon, 
  UserPlus, BarChart2, TrendingUp, Award, Clock, ArrowUpRight 
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import api from '../services/api';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';

const AgentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRequestingPayout, setIsRequestingPayout] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profileRes, referralsRes] = await Promise.all([
        api.get('/users/profile'),
        api.get('/users/agent/referrals')
      ]);
      setProfile(profileRes.data);
      setReferrals(referralsRes.data);
    } catch (err) {
      console.error('Error fetching agent data', err);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (profile?.agentCode) {
      navigator.clipboard.writeText(profile.agentCode);
      setCopied(true);
      toast.success('Agent code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRequestPayout = () => {
    setIsRequestingPayout(true);
    setTimeout(() => {
      setIsRequestingPayout(false);
      toast.success('Payout request submitted successfully. Processing takes 2-3 business days.');
    }, 1500);
  };

  // Compute Gamified Stats
  const totalReferrals = referrals.length;
  const premiumReferrals = referrals.filter(r => r.subscriptionLevel === 'Premium' || r.isMember).length;
  
  let currentTier = 'Bronze';
  let commissionRate = 500;
  let nextTierGoal = 10;
  let tierColor = 'text-orange-400';
  let tierBg = 'bg-orange-500/10';

  if (premiumReferrals >= 50) {
    currentTier = 'Gold';
    commissionRate = 1000;
    nextTierGoal = 100;
    tierColor = 'text-yellow-400';
    tierBg = 'bg-yellow-500/10';
  } else if (premiumReferrals >= 10) {
    currentTier = 'Silver';
    commissionRate = 750;
    nextTierGoal = 50;
    tierColor = 'text-gray-300';
    tierBg = 'bg-gray-400/10';
  }

  const estimatedEarnings = premiumReferrals * commissionRate;
  const progressPercent = (premiumReferrals / nextTierGoal) * 100;

  // Mock data for analytics
  const performanceData = [
    { name: 'Week 1', referrals: 4, premium: 1 },
    { name: 'Week 2', referrals: 7, premium: 2 },
    { name: 'Week 3', referrals: 12, premium: 5 },
    { name: 'Week 4', referrals: 18, premium: 8 },
  ];

  const dashboardStats = {
    referrals: totalReferrals,
    earnings: `₹${estimatedEarnings}`,
    tier: currentTier
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} stats={dashboardStats} themeColor="blue-500">
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 text-gray-900 dark:text-white">
                Welcome, <span className="text-blue-500">{profile?.firstName}</span>
              </h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                Authorized Agent Console
              </p>
            </div>

            <div className="relative z-10 bg-gray-50 dark:bg-dark-bg p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-6 shadow-sm">
              <div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Your Agent Code</p>
                <p className="text-2xl font-black text-blue-500 tracking-widest">{profile?.agentCode || 'N/A'}</p>
              </div>
              <button 
                onClick={copyCode}
                className="w-12 h-12 bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl flex items-center justify-center transition-colors border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                {copied ? <CheckCircle size={20} className="text-green-500" /> : <Copy size={20} className="text-gray-400" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gamified Tier Card */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-32 h-32 ${tierBg} rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tierBg} ${tierColor}`}>
                    <Award size={24} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${tierBg} ${tierColor}`}>
                    {currentTier} Tier
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Commission Rate</p>
                <h3 className="text-3xl font-black mb-4">₹{commissionRate}<span className="text-sm text-gray-500">/referral</span></h3>
                
                {/* Progress Bar to next tier */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>{premiumReferrals} Premium</span>
                    <span>Goal: {nextTierGoal}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${Math.min(100, progressPercent)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-card p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex items-center gap-6 shadow-sm">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                <Users size={28} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Total Referrals</p>
                <h3 className="text-4xl font-black text-gray-900 dark:text-white">{totalReferrals}</h3>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/80 mb-1">Est. Earnings</p>
                  <h3 className="text-4xl font-black">₹{estimatedEarnings}</h3>
                </div>
                <button 
                  onClick={() => setActiveTab('payouts')}
                  className="w-fit mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 border border-white/20"
                >
                  View Payouts <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black uppercase tracking-tight">Referral Growth Trends</h3>
              <span className="px-4 py-2 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-xl text-xs font-bold uppercase tracking-widest">
                This Month
              </span>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="referrals" name="Total Referrals" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="premium" name="Premium Conversions" stroke="#10b981" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl">
               <h3 className="text-xl font-black uppercase tracking-tight mb-8">Conversion Rate</h3>
               <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={performanceData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} />
                     <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                     <Bar dataKey="premium" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
            
            <div className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-6">
                <TrendingUp size={40} />
              </div>
              <h3 className="text-3xl font-black tracking-tight mb-2">{(premiumReferrals / totalReferrals * 100 || 0).toFixed(1)}%</h3>
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Average Conversion Rate</p>
              <p className="text-sm text-gray-400 mt-4">You are outperforming 85% of agents in your region.</p>
            </div>
          </div>
        </div>
      )}

      {/* Payouts Tab */}
      {activeTab === 'payouts' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2 bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl">
              <h3 className="text-xl font-black uppercase tracking-tight mb-8">Payout History</h3>
              <div className="space-y-4">
                {/* Mock History */}
                {[
                  { date: 'Jun 15, 2026', amount: '₹2,500', status: 'Completed', ref: 'TXN-98234' },
                  { date: 'May 15, 2026', amount: '₹1,500', status: 'Completed', ref: 'TXN-87231' },
                ].map((txn, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center">
                        <CheckCircle size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900 dark:text-white">{txn.date}</p>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{txn.ref}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-green-500">{txn.amount}</p>
                      <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-100 dark:bg-green-500/10 px-2 py-1 rounded-md">
                        {txn.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80 mb-2">Available for Withdrawal</p>
                <h3 className="text-4xl font-black tracking-tighter mb-6">₹{estimatedEarnings}</h3>
              </div>
              <button 
                onClick={handleRequestPayout}
                disabled={isRequestingPayout || estimatedEarnings === 0}
                className="w-full py-4 bg-white text-blue-600 hover:bg-gray-50 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-900/50"
              >
                {isRequestingPayout ? (
                  <><Clock size={16} className="animate-spin" /> Processing...</>
                ) : (
                  <>Request Payout <ArrowUpRight size={16} /></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Network Tab */}
      {activeTab === 'network' && (
        <div className="bg-white dark:bg-dark-card rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black uppercase tracking-tight">Referral Network</h3>
            <span className="px-4 py-2 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-xl text-xs font-bold uppercase tracking-widest">
              {referrals.length} Total Connections
            </span>
          </div>

          {referrals.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl">
              <LinkIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-bold text-gray-600 dark:text-gray-300">No referrals yet</p>
              <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">Share your Agent Code ({profile?.agentCode}) with prospective users to start earning commissions.</p>
            </div>
          ) : (
            <div className="mobile-table-scroll">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="pb-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">User Details</th>
                    <th className="pb-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Role</th>
                    <th className="pb-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Plan Status</th>
                    <th className="pb-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Date Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {referrals.map(user => (
                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
                      <td className="py-5 pr-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <span className="font-black text-sm">{user.firstName?.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-900 dark:text-white">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 pr-4">
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-5 pr-4">
                        {(user.subscriptionLevel === 'Premium' || user.isMember) ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            <CheckCircle size={12} /> Premium
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-gray-800 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            Standard
                          </span>
                        )}
                      </td>
                      <td className="py-5 text-right text-[11px] font-bold text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </DashboardLayout>
  );
};

export default AgentDashboard;
