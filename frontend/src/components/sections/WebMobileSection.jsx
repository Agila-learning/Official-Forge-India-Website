import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WebMobileSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>

      <div className="max-w-[1536px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1 relative z-10">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                   <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:bg-slate-800 transition-colors">
                      <Monitor className="text-blue-400 mb-4" size={32} />
                      <h4 className="font-bold text-slate-200">Business Websites</h4>
                   </div>
                   <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:bg-slate-800 transition-colors">
                      <h4 className="font-bold text-slate-200">SaaS Applications</h4>
                   </div>
                   <div className="bg-blue-600/20 backdrop-blur-md border border-blue-500/30 p-6 rounded-3xl flex flex-col items-center justify-center text-center">
                      <h4 className="font-bold text-blue-300">ERP & CRM</h4>
                   </div>
                   <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:bg-slate-800 transition-colors">
                      <h4 className="font-bold text-slate-200">Admin Dashboards</h4>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 p-6 rounded-3xl flex flex-col items-center justify-center text-center">
                      <Smartphone className="text-emerald-400 mb-4" size={32} />
                      <h4 className="font-bold text-emerald-300">Mobile Applications</h4>
                   </div>
                   <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:bg-slate-800 transition-colors">
                      <h4 className="font-bold text-slate-200">Customer Portals</h4>
                   </div>
                   <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:bg-slate-800 transition-colors">
                      <h4 className="font-bold text-slate-200">E-commerce</h4>
                   </div>
                </div>
             </div>
          </div>

          <div className="order-1 lg:order-2 z-10">
             <span className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-4 block">Custom Development</span>
             <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Turn Your Idea Into a Digital Product</h2>
             <p className="text-lg text-slate-300 mb-8 max-w-lg">
                We craft beautiful, responsive, and high-performance applications that deliver results. Whether you need an engaging website, a complex SaaS platform, or a native mobile app, our team delivers premium quality code.
             </p>
             <button onClick={() => navigate('/contact')} className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition-all flex items-center gap-2">
                <MessageSquare size={18} /> Discuss Your Project
             </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WebMobileSection;
