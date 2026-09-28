import React from 'react';
import { Server, Code, Cpu, ShieldCheck } from 'lucide-react';
import ServicePageTemplate from '../../components/templates/ServicePageTemplate';

const ITSolutions = () => (
  <ServicePageTemplate
    title="End-to-End IT Solutions"
    description="From bespoke software to robust infrastructure, we architect scalable IT systems that power modern enterprises."
    tagline="Enterprise IT Architecture"
    heroTitle="Engineering"
    heroHighlight="Digital Excellence"
    heroSubtitle="From bespoke software to robust infrastructure, we architect scalable IT systems that power modern enterprises."
    heroImage="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1920&auto=format&fit=crop"
    accentFrom="from-blue-600"
    accentTo="to-cyan-500"
    accentText="text-blue-400"
    accentBg="bg-blue-600/20"
    accentBorder="border-blue-500/30"
    stats={[{ value: "200", label: "Projects Delivered", suffix: "+" }, { value: "100", label: "Corporate Partners", suffix: "+" }, { value: "5", label: "Years Experience", suffix: "+" }, { value: "24", label: "Support Hours", suffix: "x7" }]}
    servicesTitle="IT Solutions Services"
    services={[{ icon: Server, title: "Infrastructure Support", desc: "24/7 network monitoring, server management, and zero-downtime architecture." }, { icon: Code, title: "Custom Software Dev", desc: "Full-stack enterprise applications tailored to your business logic." }, { icon: Cpu, title: "Cloud Migration", desc: "Seamless AWS/Azure migration with data security and performance tuning." }, { icon: ShieldCheck, title: "IT Consulting", desc: "Strategic technology roadmap planning for startups and enterprises." }]}
    processTitle="Our Delivery Process"
    processSteps={[{ title: "Discovery", desc: "Requirements mapping and architecture blueprinting." }, { title: "Prototype", desc: "UI/UX wireframes and feasibility validation." }, { title: "Build", desc: "Agile sprints with CI/CD pipelines." }, { title: "Launch", desc: "QA testing and zero-risk production deployment." }]}
    whyTitle="Why FIC for IT Solutions?"
    whyPoints={[{ title: "Proven Expertise", desc: "5+ years delivering IT transformation across 100+ clients." }, { title: "Dedicated Team", desc: "Assigned developers and PMs for every project." }, { title: "Agile Delivery", desc: "Weekly sprints and transparent progress reporting." }]}
    serviceType="IT Solutions"
    serviceSlug="it-solutions"
    formTitle="Start Your IT Solutions Project"
    formBullets={['Free initial consultation', 'Detailed proposal within 48 hours', 'No long-term lock-in contracts']}
  />
);

export default ITSolutions;
