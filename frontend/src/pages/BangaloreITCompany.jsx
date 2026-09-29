import React from 'react';
import SEOMeta from '../components/ui/SEOMeta';
import { Building2, Code2, Smartphone, Database, TrendingUp, MonitorSmartphone, Users, Headset, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BangaloreITCompany = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Forge India Connect Pvt. Ltd.",
    "image": "https://forgeindiaconnect.com/hero-logo.png",
    "description": "Leading IT company in Bangalore specializing in software development, cloud computing, ERP solutions, and digital marketing.",
    "url": "https://forgeindiaconnect.com/it-company-in-bangalore",
    "telephone": "+91-1234567890", 
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bangalore",
      "addressRegion": "Karnataka",
      "addressCountry": "IN"
    }
  };

  return (
    <>
      <SEOMeta
        title="IT Company in Bangalore | Software & Business Solutions – Forge India Connect"
        description="Forge India Connect is a premier IT company in Bangalore offering bespoke software development, ERP solutions, digital marketing, and tech consulting services."
        canonical="/it-company-in-bangalore"
      />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>

      <main className="bg-slate-50 text-slate-800 font-sans pb-20 pt-24">
        {/* Hero Section */}
        <section className="relative bg-dark-bg text-white py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
          <div className="max-w-5xl mx-auto relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
              Software Company in <span className="text-primary">Bangalore</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
              Empowering global enterprises and startups with cutting-edge tech innovations and agile software solutions in India's Silicon Valley.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/contact" className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1">
                Consult Our Experts
              </Link>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-20 px-6 md:px-12 lg:px-24 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-slate-900">Driving Innovation in Bangalore</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                <strong>Forge India Connect (FIC)</strong> is a trusted technology partner for businesses operating in and around Bangalore. We bring deep technical expertise to solve complex enterprise challenges through intelligent software and robust IT infrastructure.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                From scalable cloud architecture to dynamic web applications and digital transformation strategies, our IT services in Bangalore are designed to elevate your business in a highly competitive market.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <MapPin className="text-primary" /> Serving Bangalore
              </h3>
              <p className="text-slate-600 mb-6 text-lg">
                While our primary operations are based in Krishnagiri, we actively serve a wide portfolio of clients, enterprises, and startups across Bangalore, offering seamless IT support, strategic consulting, and remote software deployments.
              </p>
              <div className="mt-8">
                <Link to="/contact" className="text-primary font-bold inline-flex items-center gap-2 hover:gap-3 transition-all">
                  Get in Touch <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="bg-white py-20 px-6 md:px-12 lg:px-24 border-y border-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Our Core Tech Capabilities</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">Advanced technological solutions designed for scale, security, and performance.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <MonitorSmartphone size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Enterprise Web Applications</h3>
                <p className="text-slate-600">High-performance web development company services in Bangalore, utilizing modern frameworks to build secure, scalable applications.</p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <Database size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Cloud & ERP Integrations</h3>
                <p className="text-slate-600">Secure cloud hosting, migrations, and customized ERP solutions to modernize your internal operations and data management.</p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                  <Code2 size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Tech Staffing & Consulting</h3>
                <p className="text-slate-600">Expert IT consulting and specialized talent acquisition to augment your engineering teams and accelerate project delivery.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default BangaloreITCompany;
