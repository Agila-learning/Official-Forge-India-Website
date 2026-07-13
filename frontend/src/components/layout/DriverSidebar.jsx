import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Car, Package, ShoppingBag, Navigation, Wrench, 
  ClipboardList, Wallet, BarChart2, Calendar, Star, Target, Bell, 
  ShieldCheck, MessageSquare, LifeBuoy, AlertCircle, Settings, User, 
  LogOut, ChevronDown, ChevronRight, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const navGroups = [
  {
    title: 'Command Center',
    items: [
      { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
      { id: 'ride-requests', icon: Car, label: 'Ride Requests', badge: '3' },
      { id: 'delivery-requests', icon: Package, label: 'Delivery Requests' },
      { id: 'orders', icon: ShoppingBag, label: 'Orders' },
      { id: 'route', icon: Navigation, label: 'Delivery Route' },
      { id: 'ai-booking', icon: MessageSquare, label: 'AI Chat Booking', isNew: true },
    ]
  },
  {
    title: 'Fleet & Identity',
    items: [
      { id: 'vehicle', icon: Wrench, label: 'Vehicle Management' },
      { id: 'kyc', icon: ClipboardList, label: 'Verification & Docs' },
      { id: 'profile', icon: User, label: 'My Profile' },
    ]
  },
  {
    title: 'Finance & Growth',
    items: [
      { id: 'payouts', icon: Wallet, label: 'Wallet & Payouts' },
      { id: 'analytics', icon: BarChart2, label: 'Earnings Analytics' },
      { id: 'history', icon: Calendar, label: 'History & Invoices' },
      { id: 'performance', icon: Star, label: 'Performance' },
      { id: 'rewards', icon: Target, label: 'Rewards & Incentives' },
    ]
  },
  {
    title: 'Safety & Support',
    items: [
      { id: 'women-safety', icon: ShieldCheck, label: 'Women Safety Mode', highlight: 'text-pink-500' },
      { id: 'sos', icon: AlertCircle, label: 'Emergency (SOS)', highlight: 'text-red-500' },
      { id: 'notifications', icon: Bell, label: 'Notifications' },
      { id: 'support', icon: LifeBuoy, label: 'Support Center' },
      { id: 'settings', icon: Settings, label: 'Settings' },
    ]
  }
];

const DriverSidebar = ({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsSidebarOpen,
  handleLogout,
  userInfo
}) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 pb-24">
      {navGroups.map((group, groupIdx) => (
        <div key={groupIdx} className="mb-8">
          {!isCollapsed && (
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-4 px-4">
              {group.title}
            </h4>
          )}
          <nav className="space-y-1.5 relative">
            {group.items.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`relative w-full flex items-center p-3 rounded-2xl transition-all duration-300 group ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  {/* Animated Background Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-blue-600 shadow-lg shadow-blue-600/30 rounded-2xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  
                  <div className={`relative z-10 flex items-center ${isCollapsed ? 'justify-center w-full' : 'gap-4 w-full'}`}>
                    <div className={`flex items-center justify-center ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
                      <Icon size={20} className={!isActive && item.highlight ? item.highlight : ''} />
                    </div>
                    
                    {!isCollapsed && (
                      <div className="flex flex-1 items-center justify-between">
                        <span className="font-bold text-sm tracking-wide">{item.label}</span>
                        {item.badge && (
                          <span className="bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                            {item.badge}
                          </span>
                        )}
                        {item.isNew && (
                          <span className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-md">
                            <Zap size={10} /> AI
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      ))}

      {/* Logout Button */}
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/5">
        <button
          onClick={handleLogout}
          className={`relative w-full flex items-center p-3 rounded-2xl transition-all duration-300 group text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <div className={`flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${isCollapsed ? 'w-full' : ''}`}>
            <LogOut size={20} />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-sm tracking-wide ml-4">Secure Exit</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default DriverSidebar;
