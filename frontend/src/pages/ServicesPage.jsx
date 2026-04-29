import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEOMeta from '../components/ui/SEOMeta';
import {
  Briefcase, Globe, Smartphone, TrendingUp, ShieldCheck, Home,
  GraduationCap, ArrowRight, CheckCircle2, Users, Building2,
  BarChart2, Megaphone, Code2, FileText, Palette, Shield, Zap,
  Umbrella, Network, MapPin, Wrench, ShoppingBag, Sparkles
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  // --- PRIMARY IT SERVICES ---
  {
    id: 'software-development',
    icon: Code2,
    color: 'bg-blue-600',
    lightColor: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    eyebrow: 'Core Technology',
    title: 'Software Development',
    description: 'Custom enterprise solutions designed for scalability, security, and future-ready business operations.',
    features: [
      'Custom ERP & CRM Solutions',
      'Enterprise Software Architecture',
      'Legacy System Modernization',
      'Cloud-Native Applications',
      'API Integration & Development',
      'Business Process Automation',
    ],
    cta: 'Discuss Your Project',
    href: '/contact',
    badge: 'Flagship',
    process: ['Requirement Analysis', 'Architecture Design', 'Agile Development', 'Testing', 'Deployment'],
    image: '/images/it_solutions_service_1774516061270.png',
  },
  {
    id: 'website-development',
    icon: Globe,
    color: 'bg-teal-500',
    lightColor: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
    eyebrow: 'Web Engineering',
    title: 'Web Development',
    description: 'High-performance business websites, portals, and SaaS platforms built with modern tech stacks. Optimized for speed and security.',
    features: [
      'Corporate Business Websites',
      'Progressive Web Apps (PWA)',
      'E-Commerce Ecosystems',
      'Full-Stack Web Applications',
      'Performance Optimization',
      'Secure Admin Dashboards',
    ],
    cta: 'Get a Quote',
    href: '/services/website-development',
    badge: 'Most Popular',
    process: ['UI/UX Blueprint', 'Frontend Engineering', 'Backend Integration', 'QA', 'Live Launch'],
    image: '/images/web_app_dev_service_1774516108629.png',
  },
  {
    id: 'app-development',
    icon: Smartphone,
    color: 'bg-indigo-500',
    lightColor: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    eyebrow: 'Mobile First',
    title: 'Mobile App Development',
    description: 'Native and Hybrid mobile applications (Android & iOS) designed for seamless user experiences and high performance.',
    features: [
      'Native Android & iOS Apps',
      'Cross-Platform (React Native)',
      'Enterprise Mobility Solutions',
      'App Store Optimization (ASO)',
      'Mobile App Maintenance',
      'User-Centric UI/UX Design',
    ],
    cta: 'Get a Quote',
    href: '/services/app-development',
    badge: null,
    process: ['User Flow Design', 'Native Development', 'API Sync', 'Beta Testing', 'Store Release'],
    image: '/images/real_web_app_dev_1774517609172.png',
  },
  {
    id: 'ai-ml-solutions',
    icon: Sparkles,
    color: 'bg-violet-600',
    lightColor: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
    eyebrow: 'Future Tech',
    title: 'AI & ML Solutions',
    description: 'Leverage the power of Artificial Intelligence and Machine Learning to automate and optimize your business.',
    features: [
      'Intelligent AI Chatbots',
      'Predictive Analytics Tools',
      'Process Automation (RPA)',
      'Computer Vision Solutions',
      'Data-Driven Insights',
      'Natural Language Processing',
    ],
    cta: 'Future-Proof My Brand',
    href: '/contact',
    badge: 'Cutting Edge',
    process: ['Data Strategy', 'Model Training', 'Integration', 'Validation', 'Optimization'],
    image: '/images/carousel_hero_1_1774517488962.png',
  },
  {
    id: 'ui-ux-design',
    icon: Palette,
    color: 'bg-rose-500',
    lightColor: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    eyebrow: 'Design Thinking',
    title: 'UI/UX Design Services',
    description: 'User-centric design thinking to create intuitive, engaging, and beautiful digital products that convert.',
    features: [
      'User Interface (UI) Design',
      'User Experience (UX) Research',
      'Interactive Prototyping',
      'Wireframing & User Flows',
      'Design Systems Creation',
      'Accessibility (A11y) Audits',
    ],
    cta: 'Design My Product',
    href: '/contact',
    badge: 'New',
    process: ['Research', 'Wireframing', 'Visual Design', 'Prototyping', 'Testing'],
    image: '/images/carousel_hero_3_1774517521046.png',
  },
  {
    id: 'digital-marketing',
    icon: TrendingUp,
    color: 'bg-pink-500',
    lightColor: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
    eyebrow: 'Brand Growth',
    title: 'Digital Marketing',
    description: 'Performance-driven marketing strategies including SEO, Social Media, and AI-based analytics.',
    features: [
      'Search Engine Optimization (SEO)',
      'Social Media Marketing (SMM)',
      'Performance Marketing & PPC',
      'Content Strategy & Growth',
      'Analytics & Conversion Tracking',
      'Influencer Marketing',
    ],
    cta: 'Start Scaling',
    href: '/contact',
    badge: null,
    process: ['Market Research', 'Campaign Design', 'Ad Deployment', 'Monitoring', 'ROI Analysis'],
    image: '/images/real_digital_marketing_1774517574524.png',
  },

  // --- SECONDARY: TRAINING & PLACEMENT ---
  {
    id: 'training-programs',
    icon: GraduationCap,
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    eyebrow: 'Skill Development',
    title: 'Professional Training',
    description: 'Industry-ready skill development ecosystem for the next generation of IT talent.',
    features: [
      'Full Stack Development (MERN)',
      'UI/UX Design Masterclass',
      'Digital Marketing Certification',
      'AI & Data Science Bootcamps',
      'Resume & Portfolio Building',
      'Soft Skills & Interview Prep',
    ],
    cta: 'Enroll Now',
    href: '/contact',
    badge: 'Career Path',
    process: ['Enrollment', 'Hands-on Training', 'Project Building', 'Placement Prep', 'Graduation'],
    image: '/images/carousel_hero_2_1774517504825.png',
  },
  {
    id: 'placement-assistance',
    icon: CheckCircle2,
    color: 'bg-green-500',
    lightColor: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    eyebrow: 'Career Success',
    title: 'Placement Assistance',
    description: 'Direct hiring pipelines connecting skilled talent with top-tier technology and business firms.',
    features: [
      'Direct Hiring Pipeline',
      'MNC Placement Drives',
      'Corporate Skill Gap Analysis',
      'Interview Coaching',
      'Onboarding Support',
      'Lifetime Career Guidance',
    ],
    cta: 'Get Placed',
    href: '/contact',
    badge: 'Success Driven',
    process: ['Profile Audit', 'Mock Interviews', 'Company Matching', 'Placement Drive', 'Onboarding'],
    image: '/images/job_consulting_service_1774516042446.png',
  },
  {
    id: 'internships',
    icon: Users,
    color: 'bg-cyan-500',
    lightColor: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400',
    eyebrow: 'Early Career',
    title: 'Internship Programs',
    description: 'Hands-on experience with real-world projects under the guidance of industry experts.',
    features: [
      'Project-Based Learning',
      'Industry Mentorship',
      'Live Client Projects',
      'Internship Certification',
      'Performance-Based PPO',
      'Agile Workflow Exposure',
    ],
    cta: 'Apply for Internship',
    href: '/contact',
    badge: 'Student Choice',
    process: ['Application', 'Interview', 'Onboarding', 'Mentorship', 'Completion'],
    image: '/images/real_it_solutions_1774517558506.png',
  },

  // --- TERTIARY: CONSULTING & BUSINESS ---
  {
    id: 'job-consulting',
    icon: Briefcase,
    color: 'bg-slate-600',
    lightColor: 'bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400',
    eyebrow: 'Strategic Hiring',
    title: 'Job Consulting',
    description: 'Supporting careers beyond technology with strategic job placement and consulting in non-IT sectors.',
    features: [
      'Banking & BPO Placements',
      'Core Engineering Hiring',
      'HR Strategy Consulting',
      'Staffing & Outsourcing',
      'Executive Search',
      'Volume Recruitment',
    ],
    cta: 'Consult Experts',
    href: '/jobs',
    badge: null,
    process: ['Inquiry', 'Sourcing', 'Shortlisting', 'Interviewing', 'Selection'],
    image: '/images/real_job_consulting_1774517539244.png',
  },
  {
    id: 'insurance-services',
    icon: Umbrella,
    color: 'bg-emerald-500',
    lightColor: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    eyebrow: 'Protection',
    title: 'Insurance Services',
    description: 'Comprehensive insurance solutions for individuals and businesses to mitigate risks and ensure long-term security.',
    features: [
      'Life & Health Insurance',
      'Business Liability Coverage',
      'General Insurance Support',
      'Claim Assistance Services',
      'Risk Assessment Consulting',
      'Policy Portfolio Management',
    ],
    cta: 'Get a Quote',
    href: '/services/insurance-services',
    badge: 'Reliable',
    process: ['Needs Analysis', 'Plan Comparison', 'Policy Issuance', 'Ongoing Support', 'Claim Help'],
    image: '/images/real_insurance_1774517590965.png',
  },
  {
    id: 'atomy-business',
    icon: Network,
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    eyebrow: 'Global Network',
    title: 'Atomy Business Opportunity',
    description: 'Join a global consumer network and build a sustainable business with premium products.',
    features: [
      'Global Product Distribution',
      'Entrepreneurship Training',
      'Network Marketing Strategy',
      'Direct Consumer Access',
      'Sustainable Income Model',
      'Product Education Support',
    ],
    cta: 'Join Network',
    href: '/contact',
    badge: 'Opportunity',
    process: ['Introduction', 'Registration', 'Product Demo', 'Strategy', 'Growth'],
  },
  {
    id: 'campus-drives',
    icon: MapPin,
    color: 'bg-yellow-600',
    lightColor: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    eyebrow: 'Academic Tie-ups',
    title: 'Campus Recruitment Drives',
    description: 'Connecting academic institutions with corporate giants for large-scale talent acquisition.',
    features: [
      'University Relations',
      'Mass Hiring Events',
      'On-Campus Interviews',
      'College Skill Seminars',
      'Corporate Presentations',
      'Logistics & Management',
    ],
    cta: 'Invite FIC to Campus',
    href: '/contact',
    badge: null,
    process: ['Proposal', 'Scheduling', 'Pre-placement Talk', 'Evaluation', 'Hiring'],
  },

  // --- ADDITIONAL IT SERVICES ---
  {
    id: 'additional-it',
    icon: Wrench,
    color: 'bg-slate-700',
    lightColor: 'bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400',
    eyebrow: 'Support & Ops',
    title: 'Additional IT Services',
    description: 'Specialized technical services to optimize your business infrastructure and online presence.',
    features: [
      'E-commerce Development',
      'CRM / ERP Customization',
      'Cloud Solutions (AWS, Azure)',
      'Website Maintenance & Support',
      'IT Consulting for Startups',
      'Database Management Services',
    ],
    cta: 'View All IT Services',
    href: '/contact',
    badge: 'Essential',
    process: ['Audit', 'Implementation', 'Deployment', 'Support', 'Scaling'],
  },

  // --- PLATFORM & MARKETPLACE ---
  {
    id: 'platform-features',
    icon: ShoppingBag,
    color: 'bg-rose-600',
    lightColor: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    eyebrow: 'FIC Ecosystem',
    title: 'Marketplace & Platform Features',
    description: 'Access our proprietary platform for job management, vendor services, and professional bookings.',
    features: [
      'Job Posting for Employers',
      'One-Click Job Applications',
      'Vendor & Seller Registration',
      'Service Booking System',
      'Candidate Skill Dashboard',
      'Premium Member Features',
    ],
    cta: 'Explore Platform',
    href: '/register',
    badge: 'Proprietary',
    process: ['Sign Up', 'Verification', 'Profile Setup', 'Listing', 'Interacting'],
  },
];

const ServiceCard = ({ service, index }) => {
  const Icon = service.icon;
  return (
    <div
      className="feature-card flex flex-col opacity-0 translate-y-10"
      id={service.id}
      data-service-card
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

      {/* Service Image */}
      {service.image && (
        <div className="relative h-48 mb-6 rounded-2xl overflow-hidden group/img">
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 flex items-end p-4">
             <span className="text-white text-[10px] font-black uppercase tracking-widest">View Details</span>
          </div>
        </div>
      )}

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
        className="btn-primary w-full justify-center group mt-auto"
      >
        {service.cta}
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

const ServicesPage = () => {
  useGSAP(() => {
    gsap.from('.services-hero-content > *', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });

    gsap.to('[data-service-card]', {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 80%',
      }
    });
  });

  return (
    <>
      <SEOMeta
        title="IT Company Services | Web, App, AI & Digital Marketing | Forge India Connect"
        description="Forge India Connect: A Technology-First IT Solutions Company in Chennai. Software Development, Web & App Development, AI/ML, and Digital Marketing Services."
        keywords="IT Company in Chennai, Software Development Company, Web Development Services India, Mobile App Development Company, AI & ML Solutions Company, Digital Marketing Agency Chennai"
        canonical="/services"
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 to-primary pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 mesh-gradient-bg opacity-30" />
        <div className="container-xl relative text-center services-hero-content">
          <span className="section-eyebrow !bg-white/20 !text-white inline-block">
            Our Technology Ecosystem
          </span>
          <h1 className="text-white mt-2 mb-5">
            Transforming Businesses with<br />
            <span className="animated-text-gradient">Smart IT Solutions</span>
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto mb-10">
            Software Development | Web & App Development | AI/ML | Digital Growth Solutions. Scalable. Secure. Future-ready.
          </p>
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
      <section className="section-padding bg-slate-50 dark:bg-dark-bg services-grid">
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
              Get a Quote Now <ArrowRight size={18} />
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
};

export default ServicesPage;
