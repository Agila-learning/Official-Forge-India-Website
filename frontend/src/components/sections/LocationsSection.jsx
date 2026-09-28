import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LocationsSection = () => {
  return (
    <section className="py-24 px-6 bg-white relative z-10 border-t border-slate-100">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">
            Serving <span className="text-primary">Krishnagiri, Bangalore</span> & Beyond
          </h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">Visit our physical offices to discuss your business requirements, career goals, or educational partnerships.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Krishnagiri */}
          <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-slate-200 group-hover:text-primary/10 transition-colors">
              <MapPin size={100} />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-2">Krishnagiri</h3>
              <p className="text-primary text-xs font-black uppercase tracking-widest mb-6">Head Office</p>
              
              <div className="space-y-4 mb-8">
                <p className="text-slate-600 font-medium text-sm leading-relaxed">
                  RK Towers, Rayakottai Rd, opposite to HP Petrol Bunk, Wahab Nagar, Krishnagiri, Tamil Nadu 635002
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {['Technology', 'Careers', 'Recruitment', 'Internships', 'Training', 'Business Solutions'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bangalore */}
          <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-slate-200 group-hover:text-primary/10 transition-colors">
              <MapPin size={100} />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-2">Bangalore</h3>
              <p className="text-primary text-xs font-black uppercase tracking-widest mb-6">Liaison Office</p>
              
              <div className="space-y-4 mb-8">
                <p className="text-slate-600 font-medium text-sm leading-relaxed">
                  Excel coworks, Marilingappa layout, Nagarbhavi, Papareddypalya, Bangalore
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {['Technology', 'Recruitment', 'IT Services', 'Career Opportunities', 'Digital Solutions'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        <div className="text-center mt-12">
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-colors">
            Contact FIC <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
