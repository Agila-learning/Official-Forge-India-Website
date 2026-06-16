import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEOMeta from '../components/ui/SEOMeta';

const AgentPortalWrapper = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col bg-slate-900 overflow-hidden">
      <SEOMeta title="Agent Network | Forge India Connect" />
      
      {/* Top Navigation Bar with Back Button */}
      <div className="h-16 bg-slate-900 border-b border-white/10 flex items-center px-6 shrink-0 z-50 shadow-md">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm uppercase tracking-wider">Back to Website</span>
        </button>
        <div className="ml-auto">
          <p className="text-white/40 text-xs font-black uppercase tracking-widest hidden md:block">Forge India Connect - Agent Network</p>
        </div>
      </div>

      {/* Embedded Iframe */}
      <div className="flex-1 w-full relative bg-white">
        <iframe 
          src="https://agent-3-mu.vercel.app/" 
          className="absolute inset-0 w-full h-full border-none"
          title="FIC Agent Network"
          allow="camera; microphone; geolocation"
        />
      </div>
    </div>
  );
};

export default AgentPortalWrapper;
