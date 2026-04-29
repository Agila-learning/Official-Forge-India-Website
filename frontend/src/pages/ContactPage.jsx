import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ContactFunnel from '../components/ui/ContactFunnel';
import SEOMeta from '../components/ui/SEOMeta';
import {
  MapPin, Phone, Mail, Clock, Building2,
  Facebook, Instagram, Linkedin, Youtube
} from 'lucide-react';

const contactInfo = [
  {
    icon: MapPin,
    label: 'Head Office',
    value: 'RK Towers, Rayakottai Rd, opposite to HP Petrol Bunk, Wahab Nagar, Krishnagiri, Tamil Nadu 635002',
    href: 'https://www.google.com/maps/search/?api=1&query=RK+Towers+Krishnagiri+Tamil+Nadu+635002',
  },
  {
    icon: Phone,
    label: 'Call / WhatsApp',
    value: '+91 63694 06416',
    href: 'tel:+916369406416',
  },
  {
    icon: Mail,
    label: 'Email Us',
    value: 'info@forgeindiaconnect.com',
    href: 'mailto:info@forgeindiaconnect.com',
  },
  {
    icon: Clock,
    label: 'Working Hours',
    value: 'Mon – Sat: 9:00 AM – 7:00 PM',
    href: null,
  },
];

const socials = [
  { icon: Facebook,  href: 'https://www.facebook.com/people/Forge-India-Connect/61583095918027', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/forgeindia_connect?igsh=MTF4Z2M4Z3p2OHA2YQ%3D%3D', label: 'Instagram' },
  { icon: Linkedin,  href: 'https://www.linkedin.com/company/forge-india-connect-pvt-ltd/?viewAsMember=true', label: 'LinkedIn' },
];

const ContactPage = () => (
  <>
    <SEOMeta
      title="Contact Forge India Connect | Job Consulting & Business Services Inquiry"
      description="Get in touch with Forge India Connect for job placement, HR consulting, digital marketing, or web development services in Chennai, Krishnagiri & Bangalore."
      keywords="contact FIC, job consultancy contact, hire through FIC, business services inquiry"
      canonical="/contact"
    />

    {/* Hero Banner */}
    <section className="relative bg-gradient-to-br from-primary via-indigo-800 to-secondary overflow-hidden pt-32 pb-20 px-4">
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}
      />
      <div className="container-xl text-center relative z-10">
        <motion.span
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-5"
        >
          <Building2 size={12} /> Get In Touch
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-white mb-4"
        >
          Let's Build Something Together
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-white/80 text-lg max-w-xl mx-auto"
        >
          Whether you're looking for a job, hiring talent, or growing your business — we're here to help.
        </motion.p>
      </div>
    </section>

    {/* Main Content */}
    <section className="section-padding bg-slate-50 dark:bg-dark-bg">
      <div className="container-xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left — Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Contact Details</h2>
              <div className="section-divider !mx-0 !mb-6" />
            </div>

            <div className="space-y-5">
              {contactInfo.map((item, i) => {
                const Icon = item.icon;
                const content = (
                  <div key={i} className={`flex items-start gap-4 p-5 bg-white dark:bg-dark-card rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm ${item.href ? 'hover:border-primary hover:shadow-md transition-all' : ''}`}>
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{item.value}</p>
                    </div>
                  </div>
                );
                return item.href ? <a href={item.href} target="_blank" rel="noopener noreferrer" key={i}>{content}</a> : <div key={i}>{content}</div>;
              })}
            </div>

            {/* Social Links */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Follow Us</p>
              <div className="flex gap-3">
                {socials.map(s => {
                  const Icon = s.icon;
                  return (
                    <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary hover:shadow-md transition-all">
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Google Maps Embed Moved to Branches Section */}
          </div>

          {/* Right — Contact Funnel */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-dark-card rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl p-8 sm:p-10">
              <ContactFunnel />
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Branches */}
    <section className="section-padding bg-white dark:bg-dark-card" aria-label="Branch Offices">
      <div className="container-xl">
        <div className="section-header">
          <span className="section-eyebrow">Our Presence</span>
          <h2 className="section-title">Serving South India</h2>
          <p className="section-subtitle">
            Job consultancy and business services in Chennai, Krishnagiri & Bangalore — with plans to expand across Tamil Nadu.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { city: 'Krishnagiri', type: 'Head Office', address: 'RK Towers, Rayakottai Rd, opposite to HP Petrol Bunk, Wahab Nagar, Krishnagiri, Tamil Nadu 635002.', phone: '+91 63694 06416', map: 'https://maps.google.com/maps?q=RK+Towers,Rayakottai+Rd,opposite+to+HP+Petrol+Bunk,Wahab+Nagar,Krishnagiri,Tamil+Nadu+635002&output=embed' },
            { city: 'Chennai',     type: 'Branch Office', address: '22, VVM Towers, 3rd Floor, Pattullos Rd, Anna Salai, Royapettah, Chennai, Tamil Nadu 600002', phone: '+91 63694 06416', map: 'https://maps.google.com/maps?q=22,+VVM+Towers,+3rd+Floor,+Pattullos+Rd,+Anna+Salai,+Royapettah,+Chennai,+Tamil+Nadu+600002&output=embed' },
            { city: 'Bangalore',   type: 'Liaison Office', address: 'Excel coworks, Marilingappa layout, Nagarbhavi, Papareddypalya , Bangalore.', phone: '+91 63694 06416', map: 'https://maps.google.com/maps?q=Excel+coworks,+Marilingappa+layout,+Nagarbhavi,+Papareddypalya+,+Bangalore&output=embed' },
          ].map((branch, i) => (
            <motion.div
              key={branch.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="feature-card text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <MapPin size={22} />
              </div>
              <span className="badge-primary mb-3 inline-block">{branch.type}</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{branch.city}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{branch.address}</p>
              <a href={`tel:${branch.phone.replace(/\s/g,'')}`} className="text-primary font-bold text-sm hover:underline block mb-4">{branch.phone}</a>
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm h-48 w-full">
                <iframe
                  title={`${branch.city} Location`}
                  src={branch.map}
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  aria-label={`Google Maps showing ${branch.city} branch location`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default ContactPage;
