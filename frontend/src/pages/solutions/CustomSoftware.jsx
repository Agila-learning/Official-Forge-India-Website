import React from 'react';
import { Code, Layers, Settings, Zap } from 'lucide-react';
import ServicePageTemplate from '../../components/templates/ServicePageTemplate';

const CustomSoftware = () => (
  <ServicePageTemplate
    title="Custom Software Development"
    description="We engineer tailor-made software, SaaS platforms, and business automation tools from scratch."
    tagline="Bespoke Digital Products"
    heroTitle="Software Built"
    heroHighlight="For Your Business"
    heroSubtitle="We engineer tailor-made software, SaaS platforms, and business automation tools from scratch."
    heroImage="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1920&auto=format&fit=crop"
    accentFrom="from-violet-600"
    accentTo="to-purple-500"
    accentText="text-violet-400"
    accentBg="bg-violet-600/20"
    accentBorder="border-violet-500/30"
    stats={[{ value: "150", label: "Apps Built", suffix: "+" }, { value: "98", label: "Client Satisfaction", suffix: "%" }, { value: "12", label: "Tech Stacks", suffix: "" }, { value: "3", label: "Month Avg Delivery", suffix: "" }]}
    servicesTitle="Custom Software Development Services"
    services={[{ icon: Code, title: "SaaS Development", desc: "Multi-tenant cloud platforms with subscription billing and analytics." }, { icon: Layers, title: "Enterprise Apps", desc: "Internal tools, dashboards, and workflow management systems." }, { icon: Settings, title: "API-First Architecture", desc: "Scalable REST/GraphQL APIs connecting your entire tech stack." }, { icon: Zap, title: "Legacy Modernization", desc: "Migrate outdated systems to modern, maintainable codebases." }]}
    processTitle="Our Delivery Process"
    processSteps={[{ title: "Requirement Analysis", desc: "Deep-dive into your business process and tech requirements." }, { title: "System Design", desc: "Database schema, architecture, and API contracts." }, { title: "Development", desc: "Iterative builds with weekly demos." }, { title: "Deployment", desc: "Go-live assistance and long-term maintenance." }]}
    whyTitle="Why FIC for Custom Software Development?"
    whyPoints={[{ title: "Domain Experts", desc: "Developers with specialization in your industry vertical." }, { title: "IP Ownership", desc: "Full source code ownership transferred to you." }, { title: "Scalable Codebase", desc: "Built to grow from 100 to 1 million users without rewrites." }]}
    serviceType="Custom Software Development"
    serviceSlug="custom-software-development"
    formTitle="Start Your Custom Software Development Project"
    formBullets={['Free initial consultation', 'Detailed proposal within 48 hours', 'No long-term lock-in contracts']}
  />
);

export default CustomSoftware;
