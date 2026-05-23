import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, ShoppingBag, Briefcase, Users, ArrowRight, Zap, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

const ChoosePath = () => {
  const navigate = useNavigate();

  const paths = [
    {
      id: 'business',
      title: 'Business Solutions',
      subtitle: 'For Enterprises & Clients',
      desc: 'Deploy world-class software development, recruitment solutions, staffing operations, digital marketing, and registration compliance.',
      color: 'from-blue-600 to-indigo-700',
      icon: <Building2 className="text-blue-400 group-hover:scale-110 transition-transform" size={28} />,
      points: ['Elite IT & Software Dev', 'Recruitment & Payroll HRMS', 'Marketing & Brand Strategy'],
      btnText: 'Explore Solutions',
      btnColor: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20',
      path: '/services'
    },
    {
      id: 'customer',
      title: 'Customer Services',
      subtitle: 'For Everyday Needs & Booking',
      desc: 'Purchase premium products, book certified home repair services, order grocery delivery, and reserve hotel/PG rooms or quick rides.',
      color: 'from-emerald-600 to-teal-700',
      icon: <ShoppingBag className="text-emerald-400 group-hover:scale-110 transition-transform" size={28} />,
      points: ['Atomy Wellness & Shop', 'Home Repairs & Cleaning', 'PG & Taxi Ride Bookings'],
      btnText: 'Book & Shop Now',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20',
      path: '/explore-shop'
    },
    {
      id: 'careers',
      title: 'Careers / Jobs',
      subtitle: 'For Candidates & Job Seekers',
      desc: 'Apply for certified job postings, upload your resume for immediate AI ATS scanning, and sign up for intensive Skill Academy courses.',
      color: 'from-violet-600 to-fuchsia-700',
      icon: <Briefcase className="text-violet-400 group-hover:scale-110 transition-transform" size={28} />,
      points: ['AI ATS Resume Scan', 'Verified Pincode Jobs', 'Training & Placements'],
      btnText: 'Find Job Openings',
      btnColor: 'bg-violet-600 hover:bg-violet-700 shadow-violet-500/20',
      path: '/jobs'
    },
    {
      id: 'partners',
      title: 'Join as Partner',
      subtitle: 'For Fleet, Agents & Vendors',
      desc: 'Register as a delivery fleet partner, catalog merchant vendor, or network agent to unlock premium payouts, commission tiers, and SaaS portals.',
      color: 'from-orange-600 to-amber-700',
      icon: <Users className="text-orange-400 group-hover:scale-110 transition-transform" size={28} />,
      points: ['Delivery Fleet Signup', 'Merchant Catalog CMS', 'High-Commission Referral'],
      btnText: 'Partner Registration',
      btnColor: 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/20',
      path: '/register'
    }
  ];

  return (
    <section id="choose-path" className="relative py-32 bg-dark-bg overflow-hidden select-none">
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 relative z-10">
        
        {/* Ecosystem Overview / Introduction Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 border border-primary/20 rounded-full"
          >
            <Sparkles size={14} className="text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Unified System</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight"
          >
            Ecosystem <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Overview</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-white/50 font-medium leading-relaxed"
          >
            Forge India Connect connects enterprises, daily service seekers, job candidates, and logistics fleets into a single, high-performance ecosystem powered by automated workflows.
          </motion.p>
        </div>

        {/* Section divider and Path Picker */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500 mb-2">CHOOSE YOUR PATH</p>
          <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">What are you looking for today?</h3>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Select the portal that suits your needs and get started with ease.</p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {paths.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, type: 'spring', damping: 20 }}
              whileHover={{ y: -8 }}
              className="group relative flex flex-col justify-between bg-white/5 dark:bg-dark-card/40 border border-white/10 rounded-[2.5rem] p-8 hover:border-white/20 transition-all shadow-2xl overflow-hidden min-h-[500px]"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-[0.03] group-hover:opacity-[0.1] rounded-full blur-2xl transition-opacity`} />

              <div className="space-y-6 relative z-10">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                  {item.icon}
                </div>
                
                <div>
                  <h4 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">{item.title}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/70 mt-1">{item.subtitle}</p>
                </div>

                <p className="text-xs text-white/60 font-medium leading-relaxed">
                  {item.desc}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-white/5">
                  {item.points.map((pt, pidx) => (
                    <div key={pidx} className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-white/40 shrink-0" />
                      <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (item.path.startsWith('#')) {
                    const el = document.getElementById(item.path.substring(1));
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate(item.path);
                  }
                }}
                className={`w-full py-4 mt-8 ${item.btnColor} text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg group-hover:scale-105 active:scale-95`}
              >
                {item.btnText} <ArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ChoosePath;
