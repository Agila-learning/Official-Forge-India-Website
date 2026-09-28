import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const TrustSection = () => {
  const points = [
    'Multiple Business Solutions Under One Platform',
    'Technology & Career Expertise',
    'Student-Focused Industry Exposure',
    'Business-Oriented Software Solutions',
    'Career Guidance & Recruitment Support',
    'Digital Growth Services',
    'Local Presence in Krishnagiri & Bangalore',
    'Practical, Industry-Oriented Programs'
  ];

  return (
    <section className="py-24 px-6 bg-slate-50 relative z-10 border-t border-slate-200">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">
            Why <span className="text-primary">Forge India Connect?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {points.map((point, i) => (
            <div key={i} className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
              <span className="text-slate-700 font-bold text-sm lg:text-base leading-tight">{point}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
