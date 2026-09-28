import React from 'react';
import { Megaphone, Search, BarChart3, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DigitalMarketingSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-slate-900 text-white relative">
      <div className="max-w-[1536px] mx-auto px-6 md:px-12 lg:px-24">
         <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <div className="w-full lg:w-1/2">
               <span className="text-purple-400 font-bold uppercase tracking-widest text-xs mb-4 block">Business Growth</span>
               <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">Make Your Brand More Visible</h2>
               <p className="text-lg text-slate-300 mb-8">
                  Data-driven digital marketing, SEO, and social media strategies designed to generate leads, optimize conversions, and grow your business.
               </p>
               
               <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8">
                  {['Digital Marketing', 'Social Media Marketing', 'SEO', 'Google/Meta Campaigns', 'Content Strategy', 'Branding', 'Lead Generation', 'Performance Marketing'].map((service, idx) => (
                     <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shrink-0"></div>
                        <span className="text-sm font-medium text-slate-300">{service}</span>
                     </div>
                  ))}
               </div>

               <button onClick={() => navigate('/digital-marketing')} className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20">
                  Grow My Business
               </button>
            </div>

            <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
               <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 transform translate-y-8">
                  <Megaphone className="text-purple-400 mb-4" size={32} />
                  <h4 className="font-bold text-white mb-2">Social Media</h4>
                  <p className="text-xs text-slate-400">Build brand awareness and engage your audience.</p>
               </div>
               <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
                  <Search className="text-purple-400 mb-4" size={32} />
                  <h4 className="font-bold text-white mb-2">SEO Optimization</h4>
                  <p className="text-xs text-slate-400">Rank higher on Google and drive organic traffic.</p>
               </div>
               <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 transform translate-y-8">
                  <BarChart3 className="text-purple-400 mb-4" size={32} />
                  <h4 className="font-bold text-white mb-2">Lead Generation</h4>
                  <p className="text-xs text-slate-400">Targeted campaigns to acquire quality prospects.</p>
               </div>
               <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
                  <TrendingUp className="text-purple-400 mb-4" size={32} />
                  <h4 className="font-bold text-white mb-2">Performance Marketing</h4>
                  <p className="text-xs text-slate-400">Data-driven ad strategies for maximum ROI.</p>
               </div>
            </div>

         </div>
      </div>
    </section>
  );
};

export default DigitalMarketingSection;
