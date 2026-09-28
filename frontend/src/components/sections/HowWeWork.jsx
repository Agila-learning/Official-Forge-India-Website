import React from 'react';

const HowWeWork = () => {
  const steps = [
    {
      num: '01',
      title: 'Understand',
      desc: 'Understand the requirement and objective.'
    },
    {
      num: '02',
      title: 'Plan',
      desc: 'Create the right technology, career or business strategy.'
    },
    {
      num: '03',
      title: 'Execute',
      desc: 'Deliver the solution, training or career support.'
    },
    {
      num: '04',
      title: 'Grow',
      desc: 'Provide ongoing support and help create measurable progress.'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1536px] mx-auto px-6 md:px-12 lg:px-24">
         <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">How We Work</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">A proven process designed to deliver results across our technology, career, and business solutions.</p>
         </div>

         <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-100 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {steps.map((step, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                     <div className="w-24 h-24 bg-white border-4 border-slate-50 rounded-full shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6">
                        <span className="text-3xl font-black text-blue-600">{step.num}</span>
                     </div>
                     <h4 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h4>
                     <p className="text-sm text-slate-500">{step.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </section>
  );
};

export default HowWeWork;
