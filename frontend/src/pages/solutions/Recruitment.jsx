import React from 'react';
import { Users, Briefcase, CheckCircle2, Award } from 'lucide-react';
import ServicePageTemplate from '../../components/templates/ServicePageTemplate';

const Recruitment = () => (
  <ServicePageTemplate
    title="Corporate & IT Recruitment"
    description="End-to-end recruitment across IT, banking, FMCG, and manufacturing. Source, screen, and deliver ready-to-contribute candidates."
    keywords="recruitment company in Krishnagiri, recruitment consultancy in Krishnagiri, HR recruitment services, staffing solutions in Krishnagiri, recruitment services in Bangalore"
    tagline="Talent Acquisition Experts"
    heroTitle="Hire the"
    heroHighlight="Right Talent"
    heroSubtitle="End-to-end recruitment across IT, banking, FMCG, and manufacturing. Source, screen, and deliver ready-to-contribute candidates."
    heroImage="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1920&auto=format&fit=crop"
    accentFrom="from-blue-600"
    accentTo="to-indigo-500"
    accentText="text-blue-400"
    accentBg="bg-blue-600/20"
    accentBorder="border-blue-500/30"
    stats={[{ value: "1500", label: "Candidates Placed", suffix: "+" }, { value: "100", label: "Corporate Partners", suffix: "+" }, { value: "72", label: "Hour Shortlist", suffix: "hrs" }, { value: "90", label: "Day Guarantee", suffix: "" }]}
    servicesTitle="Recruitment Services"
    services={[{ icon: Users, title: "IT Recruitment", desc: "Software engineers, DevOps, data scientists, and product managers." }, { icon: Briefcase, title: "Volume Hiring", desc: "Rapid fulfillment of 50+ positions with structured screening." }, { icon: CheckCircle2, title: "Executive Search", desc: "C-Suite and senior leadership placement with confidentiality." }, { icon: Award, title: "Campus Recruitment", desc: "Freshers drives, college partnerships, and entry-level talent pipelines." }]}
    processTitle="Our Delivery Process"
    processSteps={[{ title: "JD Analysis", desc: "Deep-dive into role requirements and team culture." }, { title: "Sourcing", desc: "Multi-channel sourcing including proprietary talent database." }, { title: "Screening", desc: "Technical assessments, behavioral interviews, and background verification." }, { title: "Placement", desc: "Offer negotiation, onboarding support, and 90-day guarantee." }]}
    whyTitle="Why FIC for Recruitment?"
    whyPoints={[{ title: "1,500+ Placed", desc: "Verified track record across IT, banking, and corporate sectors." }, { title: "72-Hour TAT", desc: "Shortlist of 5 qualified candidates within 3 working days." }, { title: "90-Day Guarantee", desc: "Free replacement if a candidate exits within 90 days." }]}
    serviceType="Recruitment"
    serviceSlug="recruitment"
    formTitle="Start Your Recruitment Project"
    formBullets={['Free initial consultation', 'Detailed proposal within 48 hours', 'No long-term lock-in contracts']}
  />
);

export default Recruitment;
