import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOMeta from '../../components/SEOMeta';
import { motion } from 'framer-motion';
import { CheckCircle, MapPin, Code, Star, ArrowRight } from 'lucide-react';

// Reusable SEO template for services, skills, and locations
const DynamicSEOPage = ({ type }) => {
  const { slug, location } = useParams();

  // Helper to format slug to readable title
  const formatTitle = (str) => {
    if (!str) return '';
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formattedSlug = formatTitle(slug);
  const formattedLocation = formatTitle(location);

  let pageTitle = '';
  let heroTitle = '';
  let metaDescription = '';
  let keywords = '';

  if (type === 'service-location') {
    pageTitle = `Best ${formattedSlug} IT Company in ${formattedLocation} | Top Startup`;
    heroTitle = `Leading ${formattedSlug} Startup IT Company in ${formattedLocation}`;
    metaDescription = `Looking for the best ${formattedSlug} services? Forge India Connect is a top-rated startup IT company operating in ${formattedLocation}, delivering premium, scalable IT solutions.`;
    keywords = `${formattedSlug} in ${formattedLocation}, best ${formattedSlug} IT company ${formattedLocation}, top startup IT company ${formattedLocation}, ${formattedSlug} services Krishnagiri Bangalore`;
  } else if (type === 'location') {
    pageTitle = `Best Startup IT Company in ${formattedSlug} | Forge India Connect`;
    heroTitle = `Top IT & Software Company in ${formattedSlug}`;
    metaDescription = `Forge India Connect is widely recognized as the best startup IT company in ${formattedSlug}. We specialize in web, mobile, and enterprise IT solutions to scale your business.`;
    keywords = `IT company in ${formattedSlug}, best startup IT company ${formattedSlug}, top software agencies ${formattedSlug}, tech startup ${formattedSlug}`;
  } else if (type === 'skill') {
    pageTitle = `Hire Best ${formattedSlug} Experts | Top IT Startup in Krishnagiri & Bangalore`;
    heroTitle = `Dedicated ${formattedSlug} Experts for Your Next Big Project`;
    metaDescription = `Looking for top-tier ${formattedSlug} professionals? Forge India Connect is the best startup IT company in Krishnagiri and Bangalore, delivering high-performance tech solutions.`;
    keywords = `hire ${formattedSlug} developers, best IT company for ${formattedSlug}, startup IT company Krishnagiri Bangalore, ${formattedSlug} experts India`;
  }

  return (
    <>
      <SEOMeta 
        title={pageTitle} 
        description={metaDescription} 
        keywords={keywords}
      />
      
      <main className="pt-24 pb-16 min-h-screen bg-slate-50">
        {/* Hero Section */}
        <section className="py-20 px-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
          <div className="max-w-[1200px] mx-auto text-center relative z-10">
            <motion.span 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-6"
            >
              {type === 'service-location' ? 'Local Expertise' : type === 'skill' ? 'Premium Talent' : 'Regional Hub'}
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase mb-6"
            >
              {heroTitle}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-lg text-slate-500 max-w-3xl mx-auto font-medium mb-10 leading-relaxed"
            >
              {metaDescription}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/30">
                Discuss Your Project <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-16 px-6 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Star, title: "Proven Track Record", desc: "Years of experience delivering high-quality solutions on time and within budget." },
              { icon: type === 'skill' ? Code : MapPin, title: type === 'skill' ? "Deep Technical Expertise" : "Local Understanding", desc: type === 'skill' ? `Our team is highly proficient in ${formattedSlug} architecture and best practices.` : `We understand the unique market dynamics of ${formattedLocation || formattedSlug}.` },
              { icon: CheckCircle, title: "100% Client Satisfaction", desc: "We prioritize your business goals and ensure seamless communication throughout the process." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 group hover:-translate-y-2 transition-transform"
              >
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6 max-w-[1200px] mx-auto">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/40 via-transparent to-transparent opacity-50" />
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10 tracking-tighter">Ready to scale your business?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-10 relative z-10 text-lg">
              Get a free consultation and project estimate within 24 hours. Let's build something amazing together.
            </p>
            <Link to="/contact" className="relative z-10 inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors">
              Contact Us Today
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default DynamicSEOPage;
