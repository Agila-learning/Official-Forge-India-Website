import React from 'react';
import { Layers, Database, Users, TrendingUp } from 'lucide-react';
import ServicePageTemplate from '../../components/templates/ServicePageTemplate';

const ERPSolutions = () => (
  <ServicePageTemplate
    title="ERP Solutions for Business"
    description="Comprehensive ERP systems for schools, manufacturers, retailers, and enterprises. One platform, every module."
    tagline="Enterprise Resource Planning"
    heroTitle="Unify Your"
    heroHighlight="Entire Business"
    heroSubtitle="Comprehensive ERP systems for schools, manufacturers, retailers, and enterprises. One platform, every module."
    heroImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1920&auto=format&fit=crop"
    accentFrom="from-orange-600"
    accentTo="to-amber-500"
    accentText="text-orange-400"
    accentBg="bg-orange-600/20"
    accentBorder="border-orange-500/30"
    stats={[{ value: "60", label: "ERP Deployments", suffix: "+" }, { value: "40", label: "Cost Reduction", suffix: "%" }, { value: "12", label: "Industries", suffix: "" }, { value: "99", label: "Data Accuracy", suffix: "%" }]}
    servicesTitle="ERP Solutions Services"
    services={[{ icon: Layers, title: "Inventory Management", desc: "Real-time stock tracking, auto-reorder, and supplier management." }, { icon: Database, title: "HRMS & Payroll", desc: "Employee lifecycle, attendance, payroll processing, and compliance." }, { icon: Users, title: "Finance & Accounting", desc: "GL, AP/AR, budgeting, and automated financial reporting." }, { icon: TrendingUp, title: "School ERP", desc: "Admissions, fee collection, timetable, and student progress tracking." }]}
    processTitle="Our Delivery Process"
    processSteps={[{ title: "Business Audit", desc: "Map existing workflows and identify automation opportunities." }, { title: "Module Planning", desc: "Select and configure only the modules you need." }, { title: "Data Migration", desc: "Safely transfer legacy data with validation." }, { title: "Training & Go-Live", desc: "Staff training and post-deployment support." }]}
    whyTitle="Why FIC for ERP Solutions?"
    whyPoints={[{ title: "Industry-Specific", desc: "ERP modules pre-configured for manufacturing, retail, education." }, { title: "No Vendor Lock-In", desc: "Source code and full data ownership with your team." }, { title: "ROI in 6 Months", desc: "Average 40% reduction in operational costs." }]}
    serviceType="ERP Solutions"
    serviceSlug="erp-solutions"
    formTitle="Start Your ERP Solutions Project"
    formBullets={['Free initial consultation', 'Detailed proposal within 48 hours', 'No long-term lock-in contracts']}
  />
);

export default ERPSolutions;
