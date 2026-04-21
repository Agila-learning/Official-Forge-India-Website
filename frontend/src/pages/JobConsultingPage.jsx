import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEOMeta from '../components/ui/SEOMeta';
import {
  Briefcase, CheckCircle2, ArrowRight, Star, Users,
  Building2, GraduationCap, FileText, PhoneCall
} from 'lucide-react';

const sectors = [
  { name: 'Banking & Finance', roles: ['Relationship Manager', 'Bank PO', 'Loan Officer', 'Credit Analyst'], companies: ['HDFC Bank', 'ICICI Bank', 'Kotak Mahindra', 'Axis Bank', 'Yes Bank'] },
  { name: 'IT & Software',     roles: ['Software Developer', 'QA Engineer', 'Tech Support', 'Data Analyst'],    companies: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Cognizant'] },
  { name: 'BPO / ITES',       roles: ['Customer Service', 'Process Associate', 'Team Leader', 'Voice Support'],  companies: ['Accenture', 'Concentrix', 'Teleperformance', 'WNS', 'EXL'] },
  { name: 'Insurance',         roles: ['LIC Agent', 'Insurance Advisor', 'Claims Executive', 'Underwriter'],      companies: ['LIC', 'Max Life', 'HDFC Life', 'Bajaj Allianz', 'Reliance'] },
];

const process = [
  { step: '01', title: 'Register Online', desc: 'Fill our quick registration form with your details and preferred role.' },
  { step: '02', title: 'Document Verification', desc: 'Upload and verify your qualifications and ID — takes under 24 hours.' },
  { step: '03', title: 'Profile Processing', desc: 'Our counsellors craft your profile and match it with active openings.' },
  { step: '04', title: 'Interview Scheduling', desc: 'We arrange direct interviews with our 180+ hiring partner companies.' },
  { step: '05', title: 'Placement Confirmed', desc: 'Receive your offer letter with post-placement support and follow-up.' },
];

const testimonials = [
  { name: 'Priya S.',    role: 'HDFC Bank, RM',          quote: 'FIC placed me within 3 weeks! The interview coaching was a game-changer. Highly recommend.', rating: 5 },
  { name: 'Rajan K.',   role: 'TCS, Software Dev',       quote: 'I was struggling for months. FIC streamlined my profile and got me 4 interview calls in one week.', rating: 5 },
  { name: 'Meena L.',   role: 'Concentrix, Team Leader', quote: 'The counsellors are genuinely supportive. They went beyond just scheduling — they prepared me fully.', rating: 5 },
];

const JobConsultingPage = () => (
  <>
    <SEOMeta
      title="Job Consultancy in Chennai | Banking, IT & BPO Placement | Forge India Connect"
      description="Top job consultancy in Chennai, Krishnagiri & Bangalore. Expert placement in Banking (HDFC, ICICI), IT (TCS, Infosys), BPO & more. Register today for career placement support."
      keywords="job consultancy chennai, banking job placement chennai, IT job placement south india, BPO jobs krishnagiri, HR consultancy freshers tamil nadu, best job agency chennai, career placement service, forge india connect jobs"
      canonical="/job-consulting"
    />

    {/* Hero */}
    <section className="relative bg-gradient-to-br from-indigo-950 via-primary to-indigo-800 pt-32 pb-20 px-4 overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="container-xl relative">
        <div className="max-w-3xl">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section-eyebrow !bg-white/20 !text-white">
            #1 Job Consultancy in South India
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white mt-3 mb-5">
            Land Your Dream Job in <span className="animated-text-gradient">Banking, IT & BPO</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-white/80 text-lg leading-relaxed mb-8 max-w-2xl">
            Forge India Connect has placed <strong className="text-white">2,400+ candidates</strong> across South India with a 95% success rate. We offer end-to-end placement support — from resume building to interview coaching and offer letter follow-up.
          </motion.p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register" className="btn-primary btn-lg !bg-white !text-primary hover:!bg-slate-100 shadow-2xl">
              Apply for Placement <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-bold rounded-xl hover:bg-white/10 transition-all min-h-[44px]">
              <PhoneCall size={16} /> Book Free Counselling
            </Link>
          </div>
          {/* Social proof bar */}
          <div className="flex flex-wrap gap-6 mt-10">
            {[['2,400+', 'Placed'], ['95%', 'Success Rate'], ['180+', 'Hiring Partners'], ['48 hrs', 'Avg Turnaround']].map(([v, l]) => (
              <div key={l}>
                <p className="text-2xl font-black text-white">{v}</p>
                <p className="text-white/60 text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Sectors We Cover */}
    <section className="section-padding bg-slate-50 dark:bg-dark-bg">
      <div className="container-xl">
        <div className="section-header">
          <span className="section-eyebrow">Sectors We Cover</span>
          <h2 className="section-title">Jobs across every industry vertical</h2>
          <div className="section-divider" />
          <p className="section-subtitle">From entry-level to management, we have active openings in the sectors that matter most.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sectors.map((sector, i) => (
            <motion.div
              key={sector.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="feature-card"
            >
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">{sector.name}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {sector.roles.map(r => <span key={r} className="badge-primary">{r}</span>)}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Hiring Partners</p>
              <div className="flex flex-wrap gap-2">
                {sector.companies.map(c => (
                  <span key={c} className="px-3 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">{c}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Process */}
    <section className="section-padding bg-white dark:bg-dark-card">
      <div className="container-xl">
        <div className="section-header">
          <span className="section-eyebrow">How It Works</span>
          <h2 className="section-title">From registration to placement — in 5 steps</h2>
          <div className="section-divider" />
        </div>
        <div className="relative">
          {/* connector line */}
          <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-20" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {process.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="process-step"
              >
                <div className="process-step-icon text-lg font-black relative z-10 bg-white dark:bg-dark-card border-2 border-primary/20 shadow-lg">
                  {p.step}
                </div>
                <h4 className="font-black text-slate-900 dark:text-white text-sm mb-2">{p.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="section-padding bg-slate-50 dark:bg-dark-bg">
      <div className="container-xl">
        <div className="section-header">
          <span className="section-eyebrow">Success Stories</span>
          <h2 className="section-title">Real people. Real placements.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="feature-card"
            >
              <div className="flex mb-3">
                {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed mb-5">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Final CTA */}
    <section className="section-padding bg-primary">
      <div className="container-xl text-center">
        <h2 className="text-white mb-4">Ready to start your career journey?</h2>
        <p className="text-white/75 text-lg max-w-xl mx-auto mb-8">
          Register today — our team will contact you within 24 hours for a free career counselling session.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/register" className="btn-primary btn-lg !bg-white !text-primary hover:!bg-slate-100">
            Register Free <ArrowRight size={18} />
          </Link>
          <a href="https://wa.me/916369406416" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#25D366] text-white font-black rounded-full shadow-2xl shadow-green-500/30 hover:scale-105 active:scale-95 transition-all">
            WhatsApp for Quick Query
          </a>
        </div>
      </div>
    </section>
  </>
);

export default JobConsultingPage;
