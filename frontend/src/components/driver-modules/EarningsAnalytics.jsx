import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Calendar, DollarSign } from 'lucide-react';

const data = [
  { name: 'Mon', earnings: 1200, rides: 12 },
  { name: 'Tue', earnings: 1800, rides: 15 },
  { name: 'Wed', earnings: 1500, rides: 13 },
  { name: 'Thu', earnings: 2100, rides: 18 },
  { name: 'Fri', earnings: 3200, rides: 25 },
  { name: 'Sat', earnings: 3800, rides: 30 },
  { name: 'Sun', earnings: 2900, rides: 22 },
];

const EarningsAnalytics = ({ todayEarnings = 2350 }) => {
  return (
    <div className="space-y-6">
      {/* Top summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-bold uppercase tracking-widest text-xs">Today's Revenue</h3>
            <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-4xl font-black text-gray-900 dark:text-white">₹{todayEarnings.toLocaleString()}</p>
          <p className="text-xs font-bold text-green-500 mt-2 flex items-center gap-1"><TrendingUp size={14}/> +14% vs yesterday</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-bold uppercase tracking-widest text-xs">Weekly Target</h3>
            <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
              <Award size={20} />
            </div>
          </div>
          <p className="text-4xl font-black text-gray-900 dark:text-white">₹16,500</p>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mt-4 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="bg-blue-500 h-full rounded-full" transition={{ duration: 1 }} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">85% Achieved</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 shadow-xl shadow-purple-500/20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="text-white/80 font-bold uppercase tracking-widest text-xs">Peak Hour Bonus</h3>
            <div className="w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md">
              <Calendar size={20} />
            </div>
          </div>
          <p className="text-4xl font-black relative z-10">₹450</p>
          <p className="text-[10px] font-bold text-white/90 mt-2 uppercase tracking-widest relative z-10">Earned during 6PM - 9PM</p>
        </motion.div>
      </div>

      {/* Main Chart */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800">
        <h2 className="text-xl font-black uppercase tracking-widest mb-6 text-gray-900 dark:text-white">Weekly Revenue Trends</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderRadius: '16px', border: 'none', color: '#fff' }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="earnings" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorEarnings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default EarningsAnalytics;
