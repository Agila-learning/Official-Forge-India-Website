import React from 'react';
import SEOMeta from '../components/ui/SEOMeta';
import { Building2, Code2, Smartphone, Database, TrendingUp, MonitorSmartphone, Users, Headset, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const KrishnagiriITCompany = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Forge India Connect Pvt. Ltd.",
    "image": "https://forgeindiaconnect.com/hero-logo.png",
    "description": "Premium IT company in Krishnagiri providing web development, mobile app development, ERP solutions, and digital marketing services.",
    "url": "https://forgeindiaconnect.com/it-company-in-krishnagiri",
    "telephone": "+91-1234567890", 
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2nd Floor, RK Towers, Rayakottai Road, Opp. HP Petrol Bunk",
      "addressLocality": "Krishnagiri",
      "addressRegion": "Tamil Nadu",
      "postalCode": "635002",
      "addressCountry": "IN"
    }
  };

  return (
    <>
      <SEOMeta
        title="IT Company in Krishnagiri | Web, Mobile & ERP Solutions – Forge India Connect"
        description="Forge India Connect is an IT company in Krishnagiri offering web development, mobile app development, ERP solutions, digital marketing and business technology services."
        canonical="/it-company-in-krishnagiri"
      />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>

      <main className="bg-slate-50 text-slate-800 font-sans pb-20 pt-24">
        {/* Hero Section */}
        <section className="relative bg-dark-bg text-white py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
          <div className="max-w-5xl mx-auto relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
              IT Company in <span className="text-primary">Krishnagiri</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
              Transforming businesses with cutting-edge web, mobile, and ERP solutions tailored for modern growth.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/contact" className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1">
                Get Started Today
              </Link>
              <Link to="/services" className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1">
                Explore Services
              </Link>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-20 px-6 md:px-12 lg:px-24 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-slate-900">Empowering Krishnagiri's Digital Growth</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                As a leading software development company in Krishnagiri, <strong>Forge India Connect (FIC)</strong> specializes in delivering scalable technology solutions. We bridge the gap between complex business challenges and innovative software implementations. 
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Whether you need a robust web presence, a custom mobile application, or enterprise-grade ERP solutions, our team in Krishnagiri is equipped to drive your digital transformation journey forward.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <MapPin className="text-primary" /> Our Krishnagiri Office
              </h3>
              <address className="not-italic text-slate-600 space-y-2 text-lg">
                <p className="font-bold text-slate-900">Forge India Connect Pvt. Ltd.</p>
                <p>2nd Floor, RK Towers,</p>
                <p>Rayakottai Road, Opp. HP Petrol Bunk,</p>
                <p>Krishnagiri – 635002,</p>
                <p>Tamil Nadu, India.</p>
              </address>
              <div className="mt-8">
                <Link to="/contact" className="text-primary font-bold inline-flex items-center gap-2 hover:gap-3 transition-all">
                  Visit Us <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="bg-white py-20 px-6 md:px-12 lg:px-24 border-y border-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Comprehensive IT Services in Krishnagiri</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">From startups to large institutions, our IT solutions in Krishnagiri are tailored to meet your unique operational demands.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <MonitorSmartphone size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Web Development</h3>
                <p className="text-slate-600">Premium web development services in Krishnagiri. We build fast, responsive, and SEO-friendly web applications that engage your audience.</p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <Smartphone size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Mobile App Development</h3>
                <p className="text-slate-600">Expert mobile app development in Krishnagiri for iOS and Android. Engage your users on the go with intuitive and high-performance native and cross-platform apps.</p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <Database size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">ERP & CRM Solutions</h3>
                <p className="text-slate-600">Streamline your operations with our robust ERP solutions in Krishnagiri. Custom enterprise software to manage your resources, sales, and customer relations efficiently.</p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <Code2 size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Custom Software Development</h3>
                <p className="text-slate-600">Bespoke software solutions tailored to solve specific business challenges. We handle the entire lifecycle from planning to deployment.</p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Digital Marketing</h3>
                <p className="text-slate-600">Grow your digital footprint with data-driven SEO, social media strategies, and content marketing designed to boost your brand visibility.</p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
                  <Headset size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">IT Consulting & Support</h3>
                <p className="text-slate-600">Reliable IT consulting to help you make informed technological investments. We provide ongoing support and maintenance for all our deployments.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 px-6 md:px-12 lg:px-24 max-w-6xl mx-auto">
          <div className="bg-dark-bg text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-3xl md:text-5xl font-black mb-6">Why Partner with Forge India Connect?</h2>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                As an established IT company operating locally, we understand the regional business landscape while maintaining global technological standards. Our commitment goes beyond just writing code—we focus on building partnerships that drive tangible business value for organizations in Krishnagiri and surrounding areas.
              </p>
              <ul className="space-y-4 mb-10 text-slate-200">
                <li className="flex items-center gap-3"><CheckCircleIcon /> Expert in-house development team</li>
                <li className="flex items-center gap-3"><CheckCircleIcon /> Scalable and secure software architectures</li>
                <li className="flex items-center gap-3"><CheckCircleIcon /> Dedicated local support and maintenance</li>
                <li className="flex items-center gap-3"><CheckCircleIcon /> End-to-end IT consulting</li>
              </ul>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-dark-bg font-bold py-4 px-8 rounded-full hover:bg-slate-100 transition-colors">
                Discuss Your Project
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

const CheckCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default KrishnagiriITCompany;
