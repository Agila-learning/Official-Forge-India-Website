import React from 'react';
import { GraduationCap, Building2, Briefcase, Users, ArrowUpRight, ChevronRight } from 'lucide-react';
import { EXTERNAL_APPS } from '../../config/externalApps';
import { Link } from 'react-router-dom';

const AudiencePaths = () => {
  return (
    <section id="explore-fic" className="py-24 px-6 bg-slate-50 relative z-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">How Can We <span className="text-primary">Help You?</span></h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">Select your profile to discover tailored solutions, opportunities, and services designed specifically for your goals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1 - Students & Freshers */}
          <div className="bg-white rounded-[3rem] p-10 md:p-12 border border-slate-200 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300 group overflow-hidden relative">
            <div className="w-full h-48 -mt-10 -mx-10 mb-8 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop" alt="Students" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
            </div>
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform relative z-10 shadow-lg">
              <GraduationCap size={32} />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter mb-4">Students & Freshers</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">Build skills, gain real-world experience, create projects and prepare for your career.</p>
            <ul className="space-y-3 mb-10">
              {['Internships', 'Final-Year Projects', 'Technical Training', 'AI Resume Builder', 'ATS Resume Tools', 'Career Guidance', 'Interview Preparation', 'Job Opportunities', 'Banking Career Opportunities'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <a href={EXTERNAL_APPS.INTERNSHIP_FORM} target="_blank" rel="noopener noreferrer" className="flex-1 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-colors text-center flex justify-center items-center gap-2">
                Internships <ArrowUpRight size={16} />
              </a>
              <a href={EXTERNAL_APPS.RESUME_AI} target="_blank" rel="noopener noreferrer" className="flex-1 px-6 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors text-center flex justify-center items-center gap-2">
                Resume Builder <ArrowUpRight size={16} />
              </a>
              <a href={EXTERNAL_APPS.JOB_PORTAL} target="_blank" rel="noopener noreferrer" className="flex-1 px-6 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors text-center flex justify-center items-center gap-2">
                Banking Jobs <ArrowUpRight size={16} />
              </a>
            </div>
            <Link to="/training-placement" className="inline-flex mt-6 items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-800">
              Explore Student Opportunities <ChevronRight size={16} />
            </Link>
          </div>

          {/* Card 2 - Colleges & Institutions */}
          <div className="bg-white rounded-[3rem] p-10 md:p-12 border border-slate-200 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300 group overflow-hidden relative">
            <div className="w-full h-48 -mt-10 -mx-10 mb-8 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop" alt="Colleges" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
            </div>
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform relative z-10 shadow-lg">
              <Building2 size={32} />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter mb-4">For Colleges & Institutions</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">Partner with Forge India Connect to provide students with practical exposure, internships, final-year projects, career guidance, training and placement support.</p>
            <ul className="space-y-3 mb-10">
              {['Student Internships', 'Industry Visits', 'Final-Year Projects', 'Real-Time Projects', 'Technical Training', 'Career Guidance', 'Placement Support', 'Banking Career Programs', 'ERP Solutions for Institutions', 'Digital Solutions', 'Student Skill Development Programs'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <Link to="/contact" className="flex-1 px-6 py-4 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-colors text-center">
                Partner With FIC
              </Link>
              <Link to="/it-solutions" className="flex-1 px-6 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors text-center">
                Explore Solutions
              </Link>
            </div>
          </div>

          {/* Card 3 - Companies & Businesses */}
          <div className="bg-white rounded-[3rem] p-10 md:p-12 border border-slate-200 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300 group overflow-hidden relative">
            <div className="w-full h-48 -mt-10 -mx-10 mb-8 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop" alt="Companies" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
            </div>
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform relative z-10 shadow-lg">
              <Users size={32} />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter mb-4">For Companies & Businesses</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">From software development and digital transformation to recruitment and marketing, Forge India Connect helps businesses build, operate and grow.</p>
            <ul className="space-y-3 mb-10">
              {['Custom Software Development', 'Web Application Development', 'Mobile App Development', 'ERP Solutions', 'CRM Solutions', 'Business Automation', 'Digital Marketing', 'SEO', 'Recruitment', 'Staffing', 'HR Solutions', 'IT Consulting'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <Link to="/it-solutions" className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-colors text-center">
                Build With FIC
              </Link>
              <Link to="/contact" className="flex-1 px-6 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors text-center">
                Talk to Our Team
              </Link>
            </div>
          </div>

          {/* Card 4 - Job Seekers / Professionals */}
          <div className="bg-white rounded-[3rem] p-10 md:p-12 border border-slate-200 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300 group overflow-hidden relative">
            <div className="w-full h-48 -mt-10 -mx-10 mb-8 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop" alt="Job Seekers" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
            </div>
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform relative z-10 shadow-lg">
              <Briefcase size={32} />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter mb-4">For Job Seekers</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">Your Next Career Opportunity Starts Here. Enhance your profile, build standard resumes, and connect with top employers.</p>
            <ul className="space-y-3 mb-10">
              {['Job Search', 'Resume Builder', 'AI Resume Improvement', 'ATS Resume Support', 'Career Guidance', 'Interview Preparation', 'Private Bank Opportunities', 'IT Jobs', 'Fresher Jobs', 'Professional Opportunities'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <Link to="/explore-jobs" className="flex-1 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-colors text-center flex justify-center items-center gap-2">
                Find Jobs <ArrowUpRight size={16} />
              </Link>
              <a href={EXTERNAL_APPS.RESUME_AI} target="_blank" rel="noopener noreferrer" className="flex-1 px-6 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors text-center flex justify-center items-center gap-2">
                Build My Resume <ArrowUpRight size={16} />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AudiencePaths;
