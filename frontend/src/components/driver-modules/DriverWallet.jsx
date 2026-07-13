import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, IndianRupee, ArrowDownRight, ArrowUpRight, Clock, CheckCircle2, ChevronRight, ShieldCheck, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const mockTransactions = [
  { id: 1, type: 'credit', amount: 350, desc: 'Ride Fare - Trip #892', time: 'Today, 2:30 PM', status: 'completed' },
  { id: 2, type: 'credit', amount: 150, desc: 'Peak Hour Bonus', time: 'Today, 1:15 PM', status: 'completed' },
  { id: 3, type: 'debit', amount: 50, desc: 'Platform Fee (Trip #892)', time: 'Today, 2:30 PM', status: 'completed' },
  { id: 4, type: 'credit', amount: 1200, desc: 'Weekly Incentive', time: 'Yesterday', status: 'completed' },
  { id: 5, type: 'withdrawal', amount: 2000, desc: 'Bank Transfer (HDFC)', time: 'Mon, 10:00 AM', status: 'pending' },
];

const DriverWallet = ({ stats }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [amount, setAmount] = useState('');

  const balance = stats?.todayEarnings ? 4500 + stats.todayEarnings : 4500;

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) < 100) {
      toast.error('Minimum withdrawal is ₹100');
      return;
    }
    if (Number(amount) > balance) {
      toast.error('Insufficient balance');
      return;
    }
    
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      toast.success(`₹${amount} withdrawal requested successfully!`);
      setAmount('');
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column: Wallet Card & Actions */}
      <div className="lg:col-span-1 space-y-6">
        {/* Credit Card Style Wallet */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-gray-900 to-[#111318] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">Available Balance</p>
                <h2 className="text-4xl font-black flex items-center tracking-tighter">
                  <IndianRupee size={28} className="text-blue-400 mr-1" />
                  {balance.toLocaleString()}
                </h2>
              </div>
              <Wallet className="text-gray-600" size={32} />
            </div>

            <div className="flex gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Pending Clearance</p>
                <p className="font-bold text-yellow-500 mt-1 flex items-center">₹1,200 <Clock size={12} className="ml-1" /></p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Auto Settle</p>
                <p className="font-bold text-white mt-1">Every Monday</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Withdraw Module */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-card rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-xl"
        >
          <h3 className="font-black uppercase tracking-widest text-sm mb-4">Instant Withdrawal</h3>
          <form onSubmit={handleWithdraw}>
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">₹</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl py-4 pl-10 pr-4 font-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
              />
            </div>
            <button 
              type="submit"
              disabled={isWithdrawing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isWithdrawing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Withdraw to Bank <ArrowUpRight size={16} /></>
              )}
            </button>
            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4 flex items-center justify-center gap-1">
              <ShieldCheck size={12} /> Secure IMPS Transfer
            </p>
          </form>
        </motion.div>
      </div>

      {/* Right Column: Transaction History */}
      <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col h-[600px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black uppercase tracking-widest text-lg">Transaction History</h3>
          <button className="w-10 h-10 bg-gray-50 dark:bg-dark-bg rounded-xl flex items-center justify-center text-gray-500 hover:text-blue-500 transition-colors">
            <Download size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'credits', 'debits'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-dark-bg dark:text-gray-400 dark:hover:bg-gray-800'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {mockTransactions.map((tx, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
              key={tx.id} 
              className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-500/10 text-green-500' : tx.type === 'debit' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
                  {tx.type === 'credit' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">{tx.desc}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                    {tx.time} 
                    {tx.status === 'pending' && <span className="text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded ml-2">Pending</span>}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-lg tracking-tighter ${tx.type === 'credit' ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                  {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DriverWallet;
