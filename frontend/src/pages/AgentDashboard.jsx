import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ExternalLink, Layout, Users, TrendingUp, AlertCircle } from 'lucide-react';
import SEOMeta from '../components/ui/SEOMeta';

const AgentDashboard = () => {
    // This will eventually embed the deployed URL
    const deployedAgentUrl = "https://example.com/agent-admin"; // Placeholder

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg pt-28 pb-20 px-6">
            <SEOMeta 
                title="Agent Command Hub | Forge India Connect"
                description="Secure administration portal for FIC authorized agents and representatives."
            />
            
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                            Agent <span className="text-primary italic">Command Hub</span>
                        </h1>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
                            Authorized Representative Access Only
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Security Status</p>
                            <p className="text-xs font-black text-green-600 leading-none uppercase">Encrypted Session</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Info Panel */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">External Tools</h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'Lead Pipeline', icon: Users, desc: 'Manage vendor referrals' },
                                    { name: 'Commission Tracker', icon: TrendingUp, desc: 'View earnings' },
                                    { name: 'Resource Kit', icon: Layout, desc: 'Marketing assets' }
                                ].map((tool, i) => (
                                    <button key={i} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-dark-bg hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all flex items-center gap-4 group">
                                        <div className="w-10 h-10 bg-white dark:bg-dark-card rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary shadow-sm">
                                            <tool.icon size={18} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{tool.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold">{tool.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-primary p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-primary/30">
                            <div className="relative z-10">
                                <h4 className="text-lg font-black uppercase tracking-tight mb-2">Need Support?</h4>
                                <p className="text-xs text-white/70 font-medium leading-relaxed mb-6">Contact the FIC Administrative team for any operational clearance or tool access issues.</p>
                                <button className="px-6 py-3 bg-white text-primary rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Contact Admin</button>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        </div>
                    </div>

                    {/* Right Embedded Panel (Placeholder) */}
                    <div className="lg:col-span-2 h-[600px] bg-white dark:bg-dark-card rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden relative group">
                        {/* Placeholder Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-dark-bg rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                                <ExternalLink size={40} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">System Integration <span className="text-primary italic">Pending</span></h2>
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] max-w-sm mb-8 leading-relaxed">
                                The Agent Administrative Console is being provisioned. Your deployed management URL will be embedded here shortly.
                            </p>
                            
                            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl text-amber-600 dark:text-amber-400">
                                <AlertCircle size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Remote Deployment</span>
                            </div>
                        </div>
                        
                        {/* Once URL is available, we use an iframe */}
                        {/* <iframe src={deployedAgentUrl} className="w-full h-full border-none" title="Agent Admin" /> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;
