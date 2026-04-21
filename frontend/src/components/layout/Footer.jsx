import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, ArrowRight, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#111111] border-t border-white/5 pt-24 pb-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & About */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-8 bg-white/5 p-3 rounded-2xl w-max hover:bg-white/10 transition-all border border-white/10 group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1 group-hover:rotate-12 transition-transform shadow-2xl">
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-lg" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black leading-none text-xl">FORGE INDIA</span>
                <span className="text-[10px] text-[#FFC107] font-black uppercase tracking-tight">Connect</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-8 leading-relaxed font-medium">
              India's fastest-growing platform for business networking, collaboration, and industry growth. Creating opportunities everywhere.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/people/Forge-India-Connect/61583095918027/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition-all shadow-lg hover:-translate-y-1"><Facebook size={18} /></a>
              <a href="https://www.linkedin.com/company/forge-india-connect-pvt-ltd/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all shadow-lg hover:-translate-y-1"><Linkedin size={18} /></a>
              <a href="https://www.instagram.com/forgeindia_connect?igsh=MTF4Z2M4Z3p2OHA2YQ%3D%3D" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-pink-600 transition-all shadow-lg hover:-translate-y-1"><Instagram size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-gray-400 hover:text-primary transition-colors flex items-center font-medium"><ArrowRight size={14} className="mr-2" /> About Us</Link></li>
              <li><Link to="/clientele" className="text-gray-400 hover:text-primary transition-colors flex items-center font-medium"><ArrowRight size={14} className="mr-2" /> Our Clientele</Link></li>
              <li><Link to="/testimonials" className="text-gray-400 hover:text-primary transition-colors flex items-center font-medium"><ArrowRight size={14} className="mr-2" /> Success Stories</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-primary transition-colors flex items-center"><ArrowRight size={14} className="mr-2" /> Client Portal Login</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-primary transition-colors flex items-center"><ArrowRight size={14} className="mr-2" /> Become a Member</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Premium Services</h4>
            <ul className="space-y-4">
              <li><Link to="/services/job-consulting" className="text-gray-400 hover:text-primary transition-colors flex items-center"><ArrowRight size={14} className="mr-2" /> Job Consulting</Link></li>
              <li><Link to="/services/it-solutions" className="text-gray-400 hover:text-primary transition-colors flex items-center"><ArrowRight size={14} className="mr-2" /> IT Solutions</Link></li>
              <li><Link to="/services/digital-marketing" className="text-gray-400 hover:text-primary transition-colors flex items-center"><ArrowRight size={14} className="mr-2" /> Digital Marketing</Link></li>
              <li><Link to="/services/insurance-services" className="text-gray-400 hover:text-primary transition-colors flex items-center font-medium"><ArrowRight size={14} className="mr-2" /> Insurance Services</Link></li>
              <li><Link to="/services/app-development" className="text-gray-400 hover:text-primary transition-colors flex items-center"><ArrowRight size={14} className="mr-2" /> Web & App Dev</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={18} className="text-primary mr-3 mt-1 shrink-0" />
                <span className="text-gray-400 text-sm leading-relaxed">RK Towers, Rayakottai Rd, opposite HP Petrol Bunk, Wahab Nagar, Krishnagiri, Tamil Nadu 635002</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-primary mr-3 shrink-0" />
                <span className="text-gray-400">+91 63694-06416</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-primary mr-3 shrink-0" />
                <span className="text-gray-400 relative border-b border-gray-600 hover:border-primary transition-colors pb-0.5">info@forgeindiaconnect.com</span>
              </li>
            </ul>
          </div>
          
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; 2026 All rights reserved- forge india connect
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors font-medium">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-white text-sm transition-colors font-medium">Terms of Service</Link>
            <button 
                onClick={() => {
                    localStorage.removeItem('fic_cookie_consent');
                    window.location.reload();
                }} 
                className="text-gray-500 hover:text-white text-sm transition-colors font-medium"
            >
                Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
