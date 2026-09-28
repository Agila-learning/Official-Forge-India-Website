import React from 'react';
import { Users, Clock, ShieldCheck, BarChart2 } from 'lucide-react';
import ServicePageTemplate from '../../components/templates/ServicePageTemplate';

const Staffing = () => (
  <ServicePageTemplate
    title="Professional Staffing Solutions"
    description="Contract, temporary, and payroll-managed staffing solutions across IT, manufacturing, retail, and services."
    tagline="Workforce Solutions"
    heroTitle="Flexible Workforce,"
    heroHighlight="On Demand"
    heroSubtitle="Contract, temporary, and payroll-managed staffing solutions across IT, manufacturing, retail, and services."
    heroImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1920&auto=format&fit=crop"
    accentFrom="from-teal-600"
    accentTo="to-cyan-500"
    accentText="text-teal-400"
    accentBg="bg-teal-600/20"
    accentBorder="border-teal-500/30"
    stats={[{ value: "500", label: "Staff Deployed", suffix: "+" }, { value: "48", label: "Hour Deployment", suffix: "hrs" }, { value: "20", label: "Client Companies", suffix: "+" }, { value: "100", label: "Compliance", suffix: "%" }]}
    servicesTitle="Staffing Services"
    services={[{ icon: Users, title: "Contract Staffing", desc: "Short-term and project-based staff deployed within 48 hours." }, { icon: Clock, title: "Temp-to-Perm", desc: "Trial hires that convert to permanent on successful performance." }, { icon: ShieldCheck, title: "Payroll Management", desc: "Complete payroll, PF, ESI, and compliance handled by FIC." }, { icon: BarChart2, title: "Managed Services", desc: "Full outsourcing of a functional team with performance SLAs." }]}
    processTitle="Our Delivery Process"
    processSteps={[{ title: "Workforce Planning", desc: "Assess headcount gaps and skill requirements." }, { title: "Talent Deployment", desc: "Match from active talent pool or fresh sourcing." }, { title: "Onboarding", desc: "Documentation, induction, and compliance setup." }, { title: "Ongoing Management", desc: "Performance tracking, attendance, and monthly reporting." }]}
    whyTitle="Why FIC for Staffing?"
    whyPoints={[{ title: "48-Hour Deployment", desc: "Fastest turnaround in the industry for contract staffing." }, { title: "Compliance First", desc: "PF, ESI, TDS, and labor law compliance fully managed." }, { title: "Scalable Teams", desc: "Add or reduce headcount based on project needs with zero friction." }]}
    serviceType="Staffing"
    serviceSlug="staffing"
    formTitle="Start Your Staffing Project"
    formBullets={['Free initial consultation', 'Detailed proposal within 48 hours', 'No long-term lock-in contracts']}
  />
);

export default Staffing;
