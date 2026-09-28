import React from 'react';
import { Building2, ArrowUpRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { EXTERNAL_APPS } from '../../config/externalApps';
import { Link } from 'react-router-dom';

const BankingCareersSection = () => {
  return (
    <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2" />
      
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="lg:w-1/2 w-full order-2 lg:order-1">
            <div className="bg-slate-800/50 p-8 md:p-12 rounded-[3rem] border border-slate-700 relative overflow-hidden">
               <Building2 size={120} className="absolute -bottom-10 -right-10 text-slate-700 opacity-30" />
               <div className="relative z-10 space-y-6">
                 <div className="flex flex-col gap-2 mb-8">
                   <div className="w-48 h-20 bg-white rounded-xl flex items-center justify-center overflow-hidden p-2">
                     <img src="/unext-logo.png" alt="UNext Manipal" className="w-full h-full object-contain" />
                   </div>
                   <div>
                     <p className="text-blue-400 text-xs font-black uppercase tracking-widest mt-2">Authorized Training Partner</p>
                   </div>
                 </div>
                 <div className="space-y-4">
                   <div className="flex items-start gap-4">
                     <CheckCircle size={24} className="text-emerald-400 mt-1 shrink-0" />
                     <p className="font-medium text-slate-300">Professional banking training programs via our authorized partnership.</p>
                   </div>
                   <div className="flex items-start gap-4">
                     <CheckCircle size={24} className="text-emerald-400 mt-1 shrink-0" />
                     <p className="font-medium text-slate-300">Access to recruitment opportunities in leading private banks upon successful completion.</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>

          <div className="lg:w-1/2 order-1 lg:order-2">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
              Build Your Career in <span className="text-blue-400">Banking</span>
            </h2>
            <p className="text-xl text-slate-400 font-medium mb-8">
              Explore available banking career opportunities, recruitment programs and career pathways through Forge India Connect.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={EXTERNAL_APPS.JOB_PORTAL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20"
              >
                Explore Banking Jobs <ArrowUpRight size={18} />
              </a>
              <Link 
                to="/contact" 
                className="px-8 py-5 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 border border-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                Talk to a Career Advisor
              </Link>
            </div>
            
            <p className="mt-8 text-xs text-slate-500 font-bold max-w-md">
              * FIC serves as an authorized partner for UNext Manipal programs. Admission and placement are subject to program terms and criteria.
            </p>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default BankingCareersSection;
