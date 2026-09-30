import React from 'react';
import { Globe, Layers, Zap, ShieldCheck } from 'lucide-react';
import ServicePageTemplate from '../../components/templates/ServicePageTemplate';

const WebDevelopment = () => (
  <ServicePageTemplate
    title="Corporate Web Development"
    description="Premium corporate websites, CMS-powered platforms, and conversion-optimized landing pages that make lasting first impressions."
    keywords="web development company in Krishnagiri, web development company in Bangalore, custom web application development, web application development company, website development company in Krishnagiri"
    tagline="Website Design & Development"
    heroTitle="Websites That"
    heroHighlight="Win Business"
    heroSubtitle="Premium corporate websites, CMS-powered platforms, and conversion-optimized landing pages that make lasting first impressions."
    heroImage="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1920&auto=format&fit=crop"
    accentFrom="from-cyan-600"
    accentTo="to-blue-500"
    accentText="text-cyan-400"
    accentBg="bg-cyan-600/20"
    accentBorder="border-cyan-500/30"
    stats={[{ value: "150", label: "Websites Launched", suffix: "+" }, { value: "21", label: "Day Delivery", suffix: "" }, { value: "90", label: "Lighthouse Score", suffix: "avg" }, { value: "3", label: "Month Support", suffix: "" }]}
    servicesTitle="Web Development Services"
    services={[{ icon: Globe, title: "Corporate Websites", desc: "Professionally designed brand websites with CMS and blog integration." }, { icon: Layers, title: "Landing Pages", desc: "High-converting campaign pages with A/B testing support." }, { icon: Zap, title: "E-commerce Websites", desc: "Custom storefronts with payment integration and inventory management." }, { icon: ShieldCheck, title: "Website Redesign", desc: "Modernize outdated websites with improved UX and performance." }]}
    processTitle="Our Delivery Process"
    processSteps={[{ title: "Discovery & Scope", desc: "Sitemap planning, competitor research, and design brief." }, { title: "Design Mockups", desc: "Full-page visual designs presented for approval before coding." }, { title: "Development", desc: "Clean, semantic code with CMS integration." }, { title: "Launch & SEO", desc: "Deployment, domain setup, and initial on-page SEO." }]}
    whyTitle="Why FIC for Web Development?"
    whyPoints={[{ title: "Fast Delivery", desc: "Fully functional websites delivered in 7-21 days." }, { title: "SEO-Ready", desc: "Every website built with search engine visibility in mind." }, { title: "Post-Launch Support", desc: "3-month support period included with every project." }]}
    serviceType="Web Development"
    serviceSlug="web-development"
    formTitle="Start Your Web Development Project"
    formBullets={['Free initial consultation', 'Detailed proposal within 48 hours', 'No long-term lock-in contracts']}
  />
);

export default WebDevelopment;
