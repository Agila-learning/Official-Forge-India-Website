import React from 'react';
import { Globe, Layers, Zap, ShieldCheck } from 'lucide-react';
import ServicePageTemplate from '../../components/templates/ServicePageTemplate';

const WebApplication = () => (
  <ServicePageTemplate
    title="Web Application Development"
    description="From business dashboards to SaaS portals, we build fast, secure, and responsive web applications that deliver results."
    tagline="High-Performance Web Apps"
    heroTitle="Web Apps That"
    heroHighlight="Scale & Convert"
    heroSubtitle="From business dashboards to SaaS portals, we build fast, secure, and responsive web applications that deliver results."
    heroImage="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1920&auto=format&fit=crop"
    accentFrom="from-sky-600"
    accentTo="to-blue-500"
    accentText="text-sky-400"
    accentBg="bg-sky-600/20"
    accentBorder="border-sky-500/30"
    stats={[{ value: "120", label: "Web Apps", suffix: "+" }, { value: "90", label: "Lighthouse Score", suffix: "avg" }, { value: "99", label: "Uptime", suffix: "%" }, { value: "48", label: "Hr Turnaround", suffix: "" }]}
    servicesTitle="Web Application Development Services"
    services={[{ icon: Globe, title: "Progressive Web Apps", desc: "Offline-capable, app-like experiences delivered through the browser." }, { icon: Layers, title: "Admin Dashboards", desc: "Real-time analytics, CRUD interfaces, and role-based access control." }, { icon: Zap, title: "E-commerce Portals", desc: "Multi-vendor storefronts with payment gateway integration." }, { icon: ShieldCheck, title: "Business Portals", desc: "Customer-facing self-service platforms and workflow tools." }]}
    processTitle="Our Delivery Process"
    processSteps={[{ title: "UX Research", desc: "User journey mapping and competitor analysis." }, { title: "Design System", desc: "Component library, brand alignment, and accessibility." }, { title: "Engineering", desc: "React/Next.js frontend with Node.js backend." }, { title: "Performance QA", desc: "Lighthouse audits, load testing, and SEO optimization." }]}
    whyTitle="Why FIC for Web Application Development?"
    whyPoints={[{ title: "SEO-Optimized", desc: "Every page scored 90+ on Google Lighthouse." }, { title: "Mobile-First", desc: "Pixel-perfect on every device and screen size." }, { title: "Security Built-In", desc: "HTTPS, CSRF protection, and regular vulnerability scans." }]}
    serviceType="Web Application Development"
    serviceSlug="web-application-development"
    formTitle="Start Your Web Application Development Project"
    formBullets={['Free initial consultation', 'Detailed proposal within 48 hours', 'No long-term lock-in contracts']}
  />
);

export default WebApplication;
