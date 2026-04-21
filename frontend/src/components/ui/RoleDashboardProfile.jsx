import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Package, 
  Activity, 
  Briefcase, 
  UserCheck, 
  Truck, 
  Star,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Calendar
} from 'lucide-react';

const RoleDashboardProfile = ({ user, stats = {} }) => {
  const role = user?.role || 'Customer';

  const renderAdminStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard icon={Users} label="Total Users" value={stats.totalUsers || '2,481'} color="blue" trend="+12%" />
      <StatCard icon={TrendingUp} label="Platform Revenue" value={`₹${stats.revenue || '84.2k'}`} color="green" trend="+18%" />
      <StatCard icon={Calendar} label="Service Bookings" value={stats.serviceBookings || '0'} color="purple" trend="Live" />
      <StatCard icon={ShieldCheck} label="System Health" value="Stable" color="orange" trend="100%" />
    </div>
  );

  const renderVendorStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard icon={Package} label="Active Inventory" value={stats.inventoryCount || '42'} color="orange" trend="In Stock" />
      <StatCard icon={TrendingUp} label="Today's Sales" value={`₹${stats.dailySales || '4,200'}`} color="green" trend="+24%" />
      <StatCard icon={Star} label="Store Rating" value={stats.rating || '4.9'} color="yellow" trend="Excellent" />
      <StatCard icon={Activity} label="Conversion" value={stats.conversion || '3.2%'} color="blue" trend="+1.2%" />
    </div>
  );

  const renderHRStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard icon={Briefcase} label="Active Listings" value={stats.activeJobs || '15'} color="blue" trend="Live" />
      <StatCard icon={UserCheck} label="Candidate Pipeline" value={stats.hiredCount || '128'} color="green" trend="Managed" />
      <StatCard icon={Users} label="Total Applications" value={stats.totalApplied || '45'} color="purple" trend="Waitlist" />
      <StatCard icon={Zap} label="Interview Rate" value={stats.interviewRate || '68%'} color="orange" trend="High" />
    </div>
  );

  const renderDeliveryStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard icon={Truck} label="Routes Completed" value={stats.routes || '842'} color="blue" trend="98% Success" />
      <StatCard icon={Clock} label="Avg. Time" value={stats.avgTime || '42 min'} color="orange" trend="-5 min" />
      <StatCard icon={Activity} label="Fleet Status" value="Operational" color="green" trend="12 Active" />
      <StatCard icon={ShieldCheck} label="Safe Rating" value="4.8/5" color="purple" trend="Gold Tier" />
    </div>
  );

  const renderCandidateStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard icon={Briefcase} label="Applications" value={stats.applied || '8'} color="blue" trend="Active" />
      <StatCard icon={CheckCircle2} label="Matches" value={stats.matches || '14'} color="green" trend="New potential" />
      <StatCard icon={Activity} label="Profile Strength" value={`${stats.strength || '85'}%`} color="purple" trend="Complete" />
      <StatCard icon={Star} label="Skill Points" value={stats.points || '1,200'} color="yellow" trend="Rank #4" />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Dynamic Profile Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="relative group">
            <div className="w-40 h-40 rounded-full border-8 border-gray-50 dark:border-dark-bg p-2 bg-gradient-to-tr from-primary to-secondary shadow-2xl group-hover:rotate-12 transition-transform duration-700">
               <div className="w-full h-full rounded-full bg-white dark:bg-dark-card flex items-center justify-center text-4xl font-black text-primary uppercase">
                  {user?.firstName?.[0]}
               </div>
            </div>
            <div className="absolute -bottom-2 right-2 w-12 h-12 bg-white dark:bg-dark-card rounded-2xl flex items-center justify-center text-primary border border-gray-100 dark:border-gray-800 shadow-xl">
               <ShieldCheck size={24} />
            </div>
          </div>
          
          <div className="text-center md:text-left flex-grow">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
               <span className="px-5 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                  {role} Hub
               </span>
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-dark-bg px-4 py-1.5 rounded-full border border-gray-100 dark:border-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Secure Session
               </span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4 leading-none">
                {user?.firstName} <span className="text-primary">{user?.lastName}</span>
            </h2>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest max-w-xl opacity-80 leading-relaxed">
               Welcome to your personalized {role.toLowerCase()} executive suite. Track your impact, manage your assets, and scale your presence in Forge India Connect.
            </p>
          </div>

          <div className="flex gap-4 md:border-l border-gray-100 dark:border-gray-800 md:pl-10">
             <div className="text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Impact Score</p>
                <p className="text-3xl font-black text-primary">A+</p>
             </div>
             <div className="text-center px-4 border-l border-gray-100 dark:border-gray-800">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-3xl font-black text-green-500 uppercase">Live</p>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Role Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {role === 'Admin' && renderAdminStats()}
        {role === 'Vendor' && renderVendorStats()}
        {role === 'HR' && renderHRStats()}
        {role === 'Delivery Partner' && renderDeliveryStats()}
        {role === 'Candidate' && renderCandidateStats()}
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color, trend }) => {
  const colors = {
    blue: 'bg-blue-500 text-blue-500 bg-opacity-10 border-blue-100 dark:border-blue-900/30',
    green: 'bg-green-500 text-green-500 bg-opacity-10 border-green-100 dark:border-green-900/30',
    purple: 'bg-purple-500 text-purple-500 bg-opacity-10 border-purple-100 dark:border-purple-900/30',
    orange: 'bg-orange-500 text-orange-500 bg-opacity-10 border-orange-100 dark:border-orange-900/30',
    yellow: 'bg-yellow-500 text-yellow-500 bg-opacity-10 border-yellow-100 dark:border-yellow-900/30',
  };

  return (
    <div className="p-5 md:p-8 bg-white dark:bg-dark-card rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl group hover:border-primary/50 transition-all duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className={`p-4 rounded-2xl ${colors[color]} shrink-0 group-hover:scale-110 transition-transform`}>
          <Icon size={28} />
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black text-green-500 uppercase bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
            {trend}
          </span>
        </div>
      </div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
      <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase truncate">{value}</h3>
    </div>
  );
};

export default RoleDashboardProfile;
