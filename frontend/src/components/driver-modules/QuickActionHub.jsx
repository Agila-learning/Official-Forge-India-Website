import React from 'react';
import { motion } from 'framer-motion';
import { 
  CarFront, Package, Bot, Shield, FileText, Wallet, 
  TrendingUp, Trophy, Gift, Heart, AlertOctagon, 
  Bell, History, Settings 
} from 'lucide-react';

const actions = [
  { id: 'ride-requests', title: 'Ride Requests', desc: 'Accept incoming trips', icon: CarFront, gradient: 'from-blue-500 to-indigo-600', badge: 3, status: 'Searching...' },
  { id: 'delivery-requests', title: 'Delivery', desc: 'Parcel assignments', icon: Package, gradient: 'from-orange-400 to-red-500', badge: 0, status: 'Active' },
  { id: 'ai-assistant', title: 'AI Assistant', desc: 'Voice command operations', icon: Bot, gradient: 'from-violet-500 to-purple-600', badge: 1, status: 'Online', glow: true },
  { id: 'vehicle', title: 'My Vehicle', desc: 'Manage your fleet', icon: CarFront, gradient: 'from-emerald-400 to-teal-500', badge: 0, status: 'Auto - TN01' },
  { id: 'documents', title: 'Documents', desc: 'RC, License & Insurance', icon: FileText, gradient: 'from-gray-500 to-gray-700', badge: 1, status: 'Expiring Soon' },
  { id: 'wallet', title: 'Wallet', desc: 'Withdraw & Balance', icon: Wallet, gradient: 'from-amber-400 to-orange-500', badge: 0, status: '₹4,500' },
  { id: 'earnings', title: 'Earnings', desc: 'Analytics & Revenue', icon: TrendingUp, gradient: 'from-cyan-400 to-blue-500', badge: 0, status: '+15% Today' },
  { id: 'performance', title: 'Performance', desc: 'Ratings & Metrics', icon: Trophy, gradient: 'from-yellow-400 to-amber-500', badge: 0, status: '4.9 ⭐' },
  { id: 'rewards', title: 'Rewards', desc: 'Milestones & Bonus', icon: Gift, gradient: 'from-pink-500 to-rose-600', badge: 2, status: 'Target: 5 Rides' },
  { id: 'women-safety', title: 'Women Safety', desc: 'Safety protocols', icon: Heart, gradient: 'from-rose-400 to-pink-500', badge: 0, status: 'Protected' },
  { id: 'sos', title: 'Emergency SOS', desc: 'Immediate assistance', icon: AlertOctagon, gradient: 'from-red-600 to-red-700', badge: 0, status: 'Ready', pulse: true },
  { id: 'history', title: 'Ride History', desc: 'Invoices & Past Trips', icon: History, gradient: 'from-slate-600 to-slate-800', badge: 0, status: '12 Trips Today' },
];

const QuickActionHub = ({ onNavigate }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 300 }}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate(action.id)}
            className={`relative p-5 rounded-3xl bg-white dark:bg-[#151821] border border-gray-100 dark:border-gray-800 shadow-xl cursor-pointer overflow-hidden group ${action.glow ? 'ring-2 ring-purple-500/50 shadow-purple-500/20' : ''}`}
          >
            {/* Background Hover Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            
            {action.badge > 0 && (
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-red-500/40 z-10"
              >
                {action.badge}
              </motion.div>
            )}

            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 relative z-10 shadow-lg`}>
              <Icon size={22} className="text-white" />
              {action.pulse && (
                <div className="absolute inset-0 bg-red-500 rounded-2xl animate-ping opacity-40" />
              )}
            </div>

            <div className="relative z-10">
              <h3 className="text-sm font-black text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-300 transition-all">
                {action.title}
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest line-clamp-1 mb-3">
                {action.desc}
              </p>
              
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${action.id === 'sos' ? 'bg-red-500' : 'bg-green-500'}`} />
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider">{action.status}</span>
              </div>
            </div>

            {/* Ripple Effect layer */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-active:opacity-100 bg-black/5 dark:bg-white/5 transition-opacity pointer-events-none" />
          </motion.div>
        );
      })}
    </div>
  );
};

export default QuickActionHub;
