import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import api from '../../services/api';

const CareersLandingSection = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs');
        // Get up to 6 published jobs
        const activeJobs = data.filter(job => job.status === 'Published' || job.status === 'Active').slice(0, 6);
        setJobs(activeJobs);
      } catch (error) {
        console.error('Failed to fetch jobs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <section className="py-24 px-6 bg-slate-50 relative z-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">
              Explore Career <span className="text-primary">Opportunities</span>
            </h2>
            <p className="text-slate-500 font-medium max-w-2xl text-lg">
              Forge India Connect bridges the gap between top talent and leading companies. Apply for active IT and corporate roles.
            </p>
          </div>
          <div className="flex gap-4 shrink-0 flex-wrap">
            <Link to="/explore-jobs" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-colors flex items-center gap-2">
              View All Jobs <ArrowRight size={16} />
            </Link>
            <a href="https://jobs.forgeindiaconnect.in" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center gap-2 shadow-sm">
              Explore Banking Jobs <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-slate-100 h-64 animate-pulse"></div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <Briefcase size={24} />
                  </div>
                  {job.type && (
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                      {job.type}
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-1">{job.title}</h3>
                
                <div className="flex flex-wrap gap-4 mb-6 mt-2 text-sm font-medium text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} />
                    <span>{job.experience || 'Experience not specified'}</span>
                  </div>
                </div>

                <p className="text-slate-500 text-sm mb-8 line-clamp-2 flex-grow">
                  {job.description || 'View job description for more details.'}
                </p>

                <Link to="/explore-jobs" className="inline-flex items-center justify-between w-full px-6 py-3 bg-slate-50 group-hover:bg-primary group-hover:text-white text-slate-900 rounded-xl font-bold text-sm transition-colors mt-auto">
                  View Job Details <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <Briefcase size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No Active IT Roles</h3>
            <p className="text-slate-500 font-medium mb-6">There are currently no IT roles open. Please check back later or explore banking opportunities.</p>
            <Link to="/explore-jobs" className="text-primary font-bold hover:underline">Check general career opportunities →</Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CareersLandingSection;
