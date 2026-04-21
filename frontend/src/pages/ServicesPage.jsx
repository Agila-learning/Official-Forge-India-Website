import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEOMeta from '../components/ui/SEOMeta';
import {
  Briefcase, Globe, Smartphone, TrendingUp, ShieldCheck, Home,
  GraduationCap, ArrowRight, CheckCircle2, Users, Building2,
  BarChart2, Megaphone, Code2, FileText
} from 'lucide-react';

const services = [
  {
    id: 'job-consulting',
    icon: Briefcase,
    color: 'bg-indigo-500',
    lightColor: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    eyebrow: 'Career Growth',
    title: 'Job Consulting',
    description: 'End-to-end placement support for Banking, IT, BPO, and General Management sectors across South India.',
    features: [
      'Banking & Finance (HDFC, ICICI, Kotak, Axis)',
      'IT & Software Engineering Placements',
      'BPO / Customer Service Hiring',
      'Resume Building & ATS Optimization',
      'Mock Interviews & Soft Skills Training',
      'Government & PSU Exam Coaching',
    ],
    cta: 'Apply for Placement',
    href: '/jobs',
    badge: 'Most Popular',
    process: ['Register', 'Document Verification', 'Profile Processing', 'Interview Scheduling', 'Placement Confirmed'],
  },
  {
    id: 'digital-marketing',
    icon: TrendingUp,
    color: 'bg-teal-500',
    lightColor: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
    eyebrow: 'Grow Online',
    title: 'Digital Marketing',
    description: 'Data-driven digital marketing strategies to grow your brand visibility and convert leads into customers.',
    features: [
      'Search Engine Optimization (SEO)',
      'Google Ads & PPC Campaign Management',
      'Social Media Marketing (Meta, Instagram)',
      'Email & WhatsApp Marketing Automation',
      'Content Creation & Copywriting',
      'Analytics Reporting & ROI Tracking',
    ],
    cta: 'Get a Marketing Quote',
    href: '/contact',
    badge: null,
    process: ['Audit & Strategy', 'Campaign Setup', 'Content Creation', 'Launch & Monitor', 'Optimize & Scale'],
  },
  {
    id: 'web-app-development',
    icon: Code2,
    color: 'bg-violet-500',
    lightColor: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
    eyebrow: 'Build Digital',
    title: 'Web & App Development',
    description: 'Custom, mobile-first websites and web applications built for performance, conversions, and brand impact.',
    features: [
      'Business & Portfolio Websites',
      'E-Commerce & Online Stores',
      'React / Next.js Web Applications',
      'REST API & Backend Development',
      'Mobile-Responsive UI/UX Design',
      'Website Maintenance & Hosting',
    ],
    cta: 'Request a Project Quote',
    href: '/contact',
    badge: null,
    process: ['Discovery', 'UI/UX Design', 'Development', 'Testing & QA', 'Launch & Support'],
  },
  {
    id: 'insurance-services',
    icon: ShieldCheck,
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    eyebrow: 'Financial Security',
    title: 'Insurance Services',
    description: 'Protect your family and business with the right insurance plans guided by certified FIC advisors.',
    features: [
      'Life Insurance Planning',
      'Health & Medical Insurance',
      'Vehicle & Motor Insurance',
      'Business & Property Insurance',
      'Term Plans & Investment-Linked Policies',
      'Claims Assistance & Renewal Support',
    ],
    cta: 'Talk to an Advisor',
    href: '/contact',
    badge: null,
    process: ['Need Analysis', 'Plan Comparison', 'Policy Selection', 'Documentation', 'Policy Issued'],
  },
  {
    id: 'college-collaboration',
    icon: GraduationCap,
    color: 'bg-rose-500',
    lightColor: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    eyebrow: 'Campus Connect',
    title: 'College Collaboration',
    description: 'Structured placement programs connecting educational institutions with top hiring companies.',
    features: [
      'Bulk Campus Placement Drives',
      'Pre-Placement Training Programs',
      'Aptitude & Communication Workshops',
      'Industry Expert Guest Sessions',
      'MoU Partnership Agreements',
      'Dedicated Campus Placement Cell',
    ],
    cta: 'Partner With Us',
    href: '/contact',
    badge: null,
    process: ['MoU Signing', 'Student Profiling', 'Training Programs', 'Company Tie-ups', 'Placement Drive'],
  },
  {
    id: 'home-services',
    icon: Home,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    eyebrow: 'At Your Doorstep',
    title: 'Home Services',
    description: 'Verified professionals for all your home and office service needs — booked online, delivered on time.',
    features: [
      'AC Service & Repair',
      'Plumbing & Electrical Work',
      'Cleaning & Deep Sanitization',
      'Pest Control Services',
      'Painting & Interior Work',
      'Appliance Repair & Installation',
    ],
    cta: 'Book a Service',
    href: '/home-services',
    badge: null,
    process: ['Book Online', 'Confirmation', 'Professional Assigned', 'Service Executed', 'Review & Pay'],
  },
];

const ServiceCard = ({ service, index }) => {
  const Icon = service.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="feature-card flex flex-col"
      id={service.id}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${service.color} shadow-lg`}>
          <Icon size={26} />
        </div>
        {service.badge && (
          <span className="badge-primary">{service.badge}</span>
        )}
      </div>

      <span className={`text-xs font-bold uppercase tracking-widest mb-2 ${service.lightColor.split(' ').slice(2).join(' ')}`}>
        {service.eyebrow}
      </span>
      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{service.title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">{service.description}</p>

      {/* Features */}
      <ul className="space-y-2 mb-6 flex-1">
        {service.features.map(f => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
            <CheckCircle2 size={15} className="text-teal-500 shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>

      {/* Process Timeline */}
      <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">How it works</p>
        <div className="flex flex-wrap gap-1.5">
          {service.process.map((step, i) => (
            <React.Fragment key={step}>
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">{step}</span>
              {i < service.process.length - 1 && <ArrowRight size={12} className="text-slate-300 shrink-0 mt-0.5" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <Link
        to={service.href}
        className="btn-primary w-full justify-center group"
      >
        {service.cta}
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
};

const ServicesPage = () => (
  <>
    <SEOMeta
      title="Services | Job Consulting, Digital Marketing, Web Dev & More | Forge India Connect"
      description="Explore FIC's complete range of services: Job placement in Banking/IT/BPO, digital marketing, website development, insurance, college placement programs, and home services across South India."
      keywords="job consulting services, digital marketing chennai, website development south india, insurance services, college placement program, home services booking"
      canonical="/services"
    />

    {/* Hero */}
    <section className="relative bg-gradient-to-br from-slate-900 to-primary pt-32 pb-24 px-4 overflow-hidden">
      <div className="absolute inset-0 mesh-gradient-bg opacity-30" />
      <div className="container-xl relative text-center">
        <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="section-eyebrow !bg-white/20 !text-white">
          What We Do
        </motion.span>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-white mt-2 mb-5">
          Comprehensive Services for<br />
          <span className="animated-text-gradient">Jobs, Growth & Success</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-white/75 text-lg max-w-2xl mx-auto mb-10">
          From career placement to business scaling — FIC is South India's most trusted partner for professionals, companies, and institutions.
        </motion.p>
        {/* Quick Navigation */}
        <div className="flex flex-wrap justify-center gap-2">
          {services.map(s => (
            <a key={s.id} href={`#${s.id}`}
              className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl text-xs font-bold hover:bg-white/20 transition-all backdrop-blur-sm">
              {s.title}
            </a>
          ))}
        </div>
      </div>
    </section>

    {/* Services Grid */}
    <section className="section-padding bg-slate-50 dark:bg-dark-bg">
      <div className="container-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>

    {/* CTA Banner */}
    <section className="section-padding bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="container-xl text-center relative">
        <span className="section-eyebrow !bg-white/20 !text-white">Ready to Begin?</span>
        <h2 className="text-white mt-2 mb-5">Not sure which service is right for you?</h2>
        <p className="text-white/75 text-lg max-w-xl mx-auto mb-8">
          Our team will understand your needs and guide you to the best solution — completely free of charge.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/contact" className="btn-primary btn-lg !bg-white !text-primary hover:!bg-slate-100 shadow-2xl">
            Book Free Consultation <ArrowRight size={18} />
          </Link>
          <a href="https://wa.me/916369406416" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#25D366] text-white font-black rounded-full shadow-2xl shadow-green-500/30 hover:scale-105 active:scale-95 transition-all"
          >  WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  </>
);

export default ServicesPage;
