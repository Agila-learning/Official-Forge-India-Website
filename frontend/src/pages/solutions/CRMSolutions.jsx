import React from 'react';
import { Users, TrendingUp, MessageSquare, Target } from 'lucide-react';
import ServicePageTemplate from '../../components/templates/ServicePageTemplate';

const CRMSolutions = () => (
  <ServicePageTemplate
    title="CRM Solutions"
    description="Automated lead pipelines, smart follow-ups, and actionable sales analytics that accelerate revenue growth."
    tagline="Customer Relationship Management"
    heroTitle="Turn Leads Into"
    heroHighlight="Loyal Customers"
    heroSubtitle="Automated lead pipelines, smart follow-ups, and actionable sales analytics that accelerate revenue growth."
    heroImage="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1920&auto=format&fit=crop"
    accentFrom="from-rose-600"
    accentTo="to-pink-500"
    accentText="text-rose-400"
    accentBg="bg-rose-600/20"
    accentBorder="border-rose-500/30"
    stats={[{ value: "3", label: "x Faster Follow-up", suffix: "" }, { value: "45", label: "Lead Conversion Boost", suffix: "%" }, { value: "80", label: "Clients", suffix: "+ active" }, { value: "24", label: "Setup Time", suffix: "hrs" }]}
    servicesTitle="CRM Solutions Services"
    services={[{ icon: Users, title: "Lead Pipeline Automation", desc: "Capture, score, and nurture leads automatically from all channels." }, { icon: TrendingUp, title: "Sales Dashboards", desc: "Real-time performance metrics, forecasts, and team leaderboards." }, { icon: MessageSquare, title: "Customer 360 View", desc: "Unified customer history, interactions, and purchase timeline." }, { icon: Target, title: "Email & WhatsApp Integration", desc: "Trigger personalized communication at every sales stage." }]}
    processTitle="Our Delivery Process"
    processSteps={[{ title: "Sales Process Mapping", desc: "Document your current funnel and identify conversion bottlenecks." }, { title: "CRM Configuration", desc: "Custom fields, pipelines, and automation rules built for your team." }, { title: "Data Import", desc: "Clean and migrate existing contacts, deals, and history." }, { title: "Training & Adoption", desc: "Hands-on team training and workflow documentation." }]}
    whyTitle="Why FIC for CRM Solutions?"
    whyPoints={[{ title: "3x Faster Follow-ups", desc: "Automated reminders eliminate lead leakage." }, { title: "Custom Pipelines", desc: "Every business has a unique sales process." }, { title: "Integration Ready", desc: "Connects with WhatsApp, email, payment gateways, and ERP." }]}
    serviceType="CRM Solutions"
    serviceSlug="crm-solutions"
    formTitle="Start Your CRM Solutions Project"
    formBullets={['Free initial consultation', 'Detailed proposal within 48 hours', 'No long-term lock-in contracts']}
  />
);

export default CRMSolutions;
