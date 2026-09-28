import React from 'react';
import { Users, FileText, ShieldCheck, BarChart2 } from 'lucide-react';
import ServicePageTemplate from '../../components/templates/ServicePageTemplate';

const HRSolutions = () => (
  <ServicePageTemplate
    title="HR Solutions & Consulting"
    description="Comprehensive HR consulting, HRMS implementation, payroll management, and HR policy design for growing businesses."
    tagline="Human Resources Experts"
    heroTitle="People-First"
    heroHighlight="HR Strategy"
    heroSubtitle="Comprehensive HR consulting, HRMS implementation, payroll management, and HR policy design for growing businesses."
    heroImage="https://images.unsplash.com/photo-1554774853-719586f82d77?q=80&w=1920&auto=format&fit=crop"
    accentFrom="from-indigo-600"
    accentTo="to-blue-500"
    accentText="text-indigo-400"
    accentBg="bg-indigo-600/20"
    accentBorder="border-indigo-500/30"
    stats={[{ value: "50", label: "Companies Served", suffix: "+" }, { value: "100", label: "Compliance Rate", suffix: "%" }, { value: "6", label: "HR Modules", suffix: "" }, { value: "48", label: "Hour Policy Setup", suffix: "hrs" }]}
    servicesTitle="HR Solutions Services"
    services={[{ icon: Users, title: "HRMS Implementation", desc: "Deploy and configure HR software for your team size and workflows." }, { icon: FileText, title: "Payroll Processing", desc: "Accurate, compliant monthly payroll with salary slips and statutory filings." }, { icon: ShieldCheck, title: "HR Policy Design", desc: "Handbooks, leave policies, performance frameworks, and grievance procedures." }, { icon: BarChart2, title: "HR Audit", desc: "Comprehensive review of existing HR processes and compliance gaps." }]}
    processTitle="Our Delivery Process"
    processSteps={[{ title: "HR Assessment", desc: "Evaluate current HR maturity and compliance posture." }, { title: "Solution Design", desc: "Recommend and configure the right HR tools and policies." }, { title: "Implementation", desc: "HRMS deployment, policy rollout, and staff communication." }, { title: "Ongoing Support", desc: "Monthly HR advisory and compliance monitoring." }]}
    whyTitle="Why FIC for HR Solutions?"
    whyPoints={[{ title: "End-to-End HR", desc: "From recruitment policy to exit management, all under one roof." }, { title: "Statutory Compliance", desc: "PF, ESI, Professional Tax, and Labour Law compliance guaranteed." }, { title: "Scalable Frameworks", desc: "HR policies designed to grow with your team from 10 to 1000+." }]}
    serviceType="HR Solutions"
    serviceSlug="hr-solutions"
    formTitle="Start Your HR Solutions Project"
    formBullets={['Free initial consultation', 'Detailed proposal within 48 hours', 'No long-term lock-in contracts']}
  />
);

export default HRSolutions;
