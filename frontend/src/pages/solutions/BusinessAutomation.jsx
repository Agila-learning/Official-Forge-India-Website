import React from 'react';
import { Settings, Zap, BarChart2, CheckCircle2 } from 'lucide-react';
import ServicePageTemplate from '../../components/templates/ServicePageTemplate';

const BusinessAutomation = () => (
  <ServicePageTemplate
    title="Business Workflow Automation"
    description="Custom automated workflows, approval systems, report generation, and process orchestration that free your team for high-value work."
    tagline="Process Automation Experts"
    heroTitle="Eliminate Repetition,"
    heroHighlight="Accelerate Growth"
    heroSubtitle="Custom automated workflows, approval systems, report generation, and process orchestration that free your team for high-value work."
    heroImage="https://images.unsplash.com/photo-1518932945647-7a3c96943e28?q=80&w=1920&auto=format&fit=crop"
    accentFrom="from-amber-600"
    accentTo="to-orange-500"
    accentText="text-amber-400"
    accentBg="bg-amber-600/20"
    accentBorder="border-amber-500/30"
    stats={[{ value: "80", label: "Workflows Automated", suffix: "+" }, { value: "60", label: "ROI Payback", suffix: "days" }, { value: "90", label: "Manual Work Eliminated", suffix: "%" }, { value: "100", label: "Automation Monitoring", suffix: "%" }]}
    servicesTitle="Business Automation Services"
    services={[{ icon: Settings, title: "Workflow Automation", desc: "Replace manual tasks with trigger-based automated sequences." }, { icon: Zap, title: "Approval Systems", desc: "Multi-level digital approval workflows with notification and audit trail." }, { icon: BarChart2, title: "Report Automation", desc: "Scheduled data pulls, calculations, and email delivery of dashboards." }, { icon: CheckCircle2, title: "RPA Solutions", desc: "Robotic Process Automation for browser-based repetitive tasks." }]}
    processTitle="Our Delivery Process"
    processSteps={[{ title: "Process Audit", desc: "Map all manual workflows and quantify time/cost spent." }, { title: "Automation Design", desc: "Design trigger-action logic and exception handling." }, { title: "Build & Test", desc: "Develop and thoroughly test automation in staging environment." }, { title: "Deploy & Monitor", desc: "Go-live with alert systems for failures and audit logs." }]}
    whyTitle="Why FIC for Business Automation?"
    whyPoints={[{ title: "Immediate ROI", desc: "Most automations pay for themselves within 60 days." }, { title: "No-Code + Custom", desc: "Leverage tools like Zapier, n8n, or custom code for complex logic." }, { title: "Maintained & Monitored", desc: "24/7 monitoring of all automations with instant failure alerts." }]}
    serviceType="Business Automation"
    serviceSlug="business-automation"
    formTitle="Start Your Business Automation Project"
    formBullets={['Free initial consultation', 'Detailed proposal within 48 hours', 'No long-term lock-in contracts']}
  />
);

export default BusinessAutomation;
