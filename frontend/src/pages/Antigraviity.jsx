import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Globe, Shield, Code, Database, Server, ArrowRight, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import JobApplicationForm from '../components/ui/JobApplicationForm';
import CTA from '../components/sections/CTA';

const services = [
  { icon: Code, title: "Web Development", desc: "Crafting ultra-responsive, high-conversion web platforms." },
  { icon: Globe, title: "App Development", desc: "Native and hybrid mobile experiences built for scale." },
  { icon: Shield, title: "Cybersecurity", desc: "Fortifying enterprise assets with elite threat detection." },
  { icon: Cpu, title: "IT Infrastructure", desc: "Next-gen cloud architecture and managed services." },
  { icon: Database, title: "Data Analytics", desc: "Turning complex datasets into actionable business intelligence." },
  { icon: Server, title: "Cloud Engineering", desc: "Seamless migration and optimization for global reach." },
];

import api from '../services/api';

const Antigraviity = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs');
        setJobs(data);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = (job) => {
    setSelectedJob(job);
    setIsFormOpen(true);
  };

  return (
    <div className="pt-20 bg-white dark:bg-dark-bg min-h-screen">
      <JobApplicationForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        jobTitle={selectedJob ? selectedJob.title : "Antigraviity Career"} 
      />

      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden bg-[#0A0F1A] text-white">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="text-sm font-black uppercase tracking-widest text-secondary">A Subsidiary of FIC Group</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black mb-8 tracking-tighter"
          >
            Antigraviity <span className="animated-text-gradient">Technologies</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto font-medium leading-relaxed"
          >
            Engineering the future of enterprise software, cybersecurity, and cloud-native solutions with precision and impact.
          </motion.p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-10 rounded-[3rem] bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-gray-800 hover:border-primary/40 transition-all group"
            >
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-8 shadow-xl group-hover:bg-primary transition-colors">
                <service.icon size={32} className="text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-black mb-4">{service.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Careers Section */}
      <section className="py-24 bg-gray-50 dark:bg-dark-bg/50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-4">Current <span className="text-primary">Openings</span></h2>
              <p className="text-xl text-gray-500 font-medium">Join our elite engineering team in Chennai and Bangalore.</p>
            </div>
            <div className="flex gap-4">
              <div className="px-6 py-3 rounded-2xl bg-white dark:bg-dark-card shadow-sm flex items-center gap-3">
                <MapPin size={20} className="text-primary" />
                <span className="font-bold">Chennai / Bangalore</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {jobs.map((job, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-dark-card p-8 md:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-8 hover:shadow-2xl hover:shadow-primary/5 transition-all group"
              >
                <div className="flex items-center gap-8 w-full md:w-auto">
                   <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Briefcase size={28} className="text-primary" />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black mb-1 group-hover:text-primary transition-colors">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400 font-bold uppercase tracking-wider">
                         <span className="flex items-center gap-1"><GraduationCap size={16} /> 2.5 - 3.0 LPA</span>
                         <span className="flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
                      </div>
                   </div>
                </div>
                <div className="hidden lg:block flex-grow px-12">
                   <p className="text-gray-500 font-medium">{job.requirements}</p>
                </div>
                <button 
                  onClick={() => handleApply(job)}
                  className="w-full md:w-auto px-10 py-4 bg-primary text-white font-black rounded-full shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Apply Now <ArrowRight size={20} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </div>
  );
};

export default Antigraviity;
