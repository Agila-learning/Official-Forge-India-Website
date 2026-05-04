import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, ArrowLeft, Timer, Sparkles, Globe, ShieldCheck } from 'lucide-react';
import SEOMeta from '../components/ui/SEOMeta';

const YetToLaunch = () => {
  return (
    <>
      <SEOMeta 
        title="Agent Platform | Coming Soon"
        description="The Forge India Connect Agent platform is launching soon. Join our network of professional agents and grow your business."
      />
      
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden px-4">
        {/* Cinematic Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-2xl w-full text-center"
        >
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/20"
          >
            <Rocket size={48} className="text-white" />
          </motion.div>

          <h4 className="text-blue-400 font-black uppercase tracking-[0.4em] text-xs mb-4">Strategic Initiative</h4>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase leading-none">
            Agent Portal <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 italic">Deploying Soon</span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-xl mx-auto leading-relaxed">
            Our next-generation Agent Ecosystem is currently undergoing final system synchronization. Get ready to scale your operations with FIC.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Timer, title: "Precision", sub: "Final Testing" },
              { icon: ShieldCheck, title: "Security", sub: "Vault Protocol" },
              { icon: Globe, title: "Global", sub: "Network Ready" }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
                <item.icon size={24} className="text-blue-400 mx-auto mb-3" />
                <h5 className="text-white font-black uppercase tracking-widest text-[10px] mb-1">{item.title}</h5>
                <p className="text-slate-500 text-[10px] font-bold uppercase">{item.sub}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/" 
              className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-50 transition-all flex items-center gap-2 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Base
            </Link>
            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" /> Notify Me
            </button>
          </div>
        </motion.div>

        {/* Floating elements */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 right-1/4 w-2 h-2 bg-blue-500 rounded-full blur-[2px]"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-emerald-500 rounded-full blur-[2px]"
        />
      </div>
    </>
  );
};

export default YetToLaunch;
