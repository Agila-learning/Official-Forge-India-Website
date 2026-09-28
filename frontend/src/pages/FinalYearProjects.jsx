import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Code2, Cpu, Globe, GraduationCap, Layout, Sparkles, Terminal, Rocket, CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOMeta from '../components/ui/SEOMeta';

const ProjectCategory = ({ title, desc, icon, image, tools, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay }}
    className="group relative bg-white dark:bg-dark-card rounded-[3rem] p-8 border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
  >
    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10 group-hover:bg-primary/10 transition-colors" />
    
    <div className="relative h-48 rounded-[2rem] overflow-hidden mb-8 border border-gray-100 dark:border-gray-800">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30">
        {icon}
      </div>
    </div>

    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-3 group-hover:text-primary transition-colors">{title}</h3>
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed mb-6 h-16">{desc}</p>
    
    <div className="space-y-4 mb-8">
      <p className="text-[10px] font-black uppercase tracking-widest text-primary">Tech Stack Included:</p>
      <div className="flex flex-wrap gap-2">
        {tools.map(tool => (
          <span key={tool} className="px-3 py-1 bg-gray-50 dark:bg-dark-bg text-gray-600 dark:text-gray-300 rounded-full text-[10px] font-black uppercase tracking-wider border border-gray-200 dark:border-gray-700">
            {tool}
          </span>
        ))}
      </div>
    </div>

    <Link 
      to={`/contact?subject=Inquiry about ${encodeURIComponent(title)} Project`}
      className="w-full block text-center py-4 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm group-hover:shadow-lg border border-gray-200 dark:border-gray-700"
    >
      Request Syllabus <ArrowRight size={14} className="inline ml-2" />
    </Link>
  </motion.div>
);

const FinalYearProjects = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const categories = [
    {
      title: "MERN Stack Projects",
      desc: "Full-stack web applications with React, Node.js, Express, and MongoDB. Learn state management, REST APIs, and auth.",
      icon: <Layout size={24} />,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
      tools: ["React", "Node.js", "Express", "MongoDB", "Redux"]
    },
    {
      title: "AI & Machine Learning",
      desc: "Cutting-edge AI projects involving NLP, computer vision, and predictive analytics using Python and TensorFlow.",
      icon: <Cpu size={24} />,
      image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1000&auto=format&fit=crop",
      tools: ["Python", "TensorFlow", "Scikit-Learn", "OpenCV", "Pandas"]
    },
    {
      title: "SaaS Applications",
      desc: "Multi-tenant Software-as-a-Service platforms with subscription billing, admin dashboards, and scalable architecture.",
      icon: <Globe size={24} />,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
      tools: ["Next.js", "Stripe", "PostgreSQL", "Prisma", "Tailwind"]
    },
    {
      title: "Python & Data Science",
      desc: "Data-driven applications, scraping scripts, and automation tools built with robust Python frameworks.",
      icon: <Terminal size={24} />,
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop",
      tools: ["Django", "FastAPI", "BeautifulSoup", "MySQL", "Docker"]
    },
    {
      title: "LMS & EdTech Platforms",
      desc: "Complete Learning Management Systems with course creation, video streaming, student tracking, and assessments.",
      icon: <GraduationCap size={24} />,
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1000&auto=format&fit=crop",
      tools: ["React", "AWS S3", "WebRTC", "Socket.io", "GraphQL"]
    },
    {
      title: "Blockchain & Web3",
      desc: "Decentralized applications (dApps), smart contracts, and NFT marketplaces built on Ethereum.",
      icon: <Code2 size={24} />,
      image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1000&auto=format&fit=crop",
      tools: ["Solidity", "Web3.js", "Hardhat", "IPFS", "React"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] overflow-hidden" ref={containerRef}>
      <SEOMeta 
        title="Final Year Projects | Forge India Connect"
        description="Premium final year project guidance and development for IT/CS students. Explore MERN, AI, Python, SaaS, and Web3 domains."
      />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-40 pb-20 px-6 min-h-[80vh] flex items-center">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop')] opacity-[0.03] dark:opacity-[0.1] bg-cover bg-center mix-blend-overlay" />
        </motion.div>

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary mb-8 backdrop-blur-md"
            >
              <Sparkles size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Student Excellence Program</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-[0.9] mb-8"
            >
              Final Year <span className="text-primary">Projects.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto mb-12"
            >
              Stand out in your placements with industry-standard projects. Complete guidance from ideation to deployment with source code and documentation.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <button 
                onClick={() => document.getElementById('domains').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all flex items-center gap-2 hover:gap-4"
              >
                Explore Domains <ChevronRight size={16} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-12 border-y border-gray-200 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-lg relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              "Complete Source Code",
              "IEEE Base Papers",
              "100% Documentation",
              "Installation Support"
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 text-gray-800 dark:text-gray-200"
              >
                <CheckCircle2 className="text-primary" size={20} />
                <span className="font-black uppercase tracking-widest text-xs">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOMAINS GRID ── */}
      <section id="domains" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">
              Project <span className="text-primary">Domains</span>
            </h2>
            <p className="text-gray-500 font-medium">Choose from our curated list of trending technology domains.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <ProjectCategory key={idx} {...cat} delay={idx * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-gray-900 to-black dark:from-dark-card dark:to-dark-bg border border-gray-800 rounded-[3rem] p-12 text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay" />
            
            <Rocket size={48} className="text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 relative z-10">
              Have a Custom Project Idea?
            </h2>
            <p className="text-gray-400 font-medium max-w-2xl mx-auto mb-8 relative z-10">
              Our expert mentors can help you build your dream project from scratch. Share your requirements and let's bring it to life.
            </p>
            <Link 
              to="/contact?subject=Custom Final Year Project Inquiry"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-primary hover:text-white transition-all relative z-10"
            >
              Discuss Your Idea <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FinalYearProjects;
