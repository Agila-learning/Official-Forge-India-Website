import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, HelpCircle } from 'lucide-react';
import SEOMeta from '../ui/SEOMeta';

const CareerLandingTemplate = ({
  seo,
  breadcrumb,
  hero,
  intro,
  sections,
  faq,
  cta
}) => {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 overflow-x-hidden">
      <SEOMeta 
        title={seo.title} 
        description={seo.description} 
        keywords={seo.keywords} 
        canonical={seo.canonical} 
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white">
        <div className="absolute inset-0 z-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.5) 1px,transparent 1px)', backgroundSize: '60px 60px' }}
        />
        <div className="container-xl px-6 relative z-10 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight size={12} />
            <span className="text-slate-600">{breadcrumb}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-tight mb-6">
                {hero.title}
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                {hero.subtitle}
              </p>
              <a href={cta.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-primary/20 gap-3">
                {cta.text} <ArrowRight size={16} />
              </a>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-amber-500/10 rounded-[3rem] blur-2xl -z-10" />
              <img src={hero.image} alt={hero.imageAlt} className="rounded-[2.5rem] shadow-2xl w-full h-[400px] object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20 bg-slate-50">
        <div className="container-xl px-6 max-w-4xl mx-auto space-y-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-black text-slate-900 mb-6">{intro.title}</h2>
            <div className="text-slate-600 leading-relaxed text-lg">{intro.content}</div>
          </motion.div>

          {sections.map((section, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                {section.icon && <section.icon className="text-primary" size={24} />}
                {section.title}
              </h3>
              <div className="text-slate-600 leading-relaxed space-y-4">
                {section.content}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      {faq && faq.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container-xl px-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900 mb-10 text-center uppercase tracking-tighter">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faq.map((q, i) => (
                <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-start gap-3">
                    <HelpCircle size={20} className="text-primary shrink-0 mt-0.5" />
                    {q.question}
                  </h4>
                  <p className="text-slate-600 pl-8">{q.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
        <div className="container-xl px-6 max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">Ready to Take the Next Step?</h2>
          <p className="text-blue-100 mb-10 text-lg">Join thousands of students and professionals advancing their careers with Forge India Connect.</p>
          <a href={cta.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-10 py-5 bg-white text-primary font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all shadow-2xl gap-3">
            {cta.text} <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
};

export default CareerLandingTemplate;
