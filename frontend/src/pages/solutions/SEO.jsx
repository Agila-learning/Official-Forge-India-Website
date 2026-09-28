import React from 'react';
import { Search, TrendingUp, FileText, Globe } from 'lucide-react';
import ServicePageTemplate from '../../components/templates/ServicePageTemplate';

const SEO = () => (
  <ServicePageTemplate
    title="Search Engine Optimization"
    description="Technical, on-page, and local SEO strategies that drive sustainable organic traffic and qualified leads."
    tagline="Organic Growth Engine"
    heroTitle="Rank Higher,"
    heroHighlight="Grow Faster"
    heroSubtitle="Technical, on-page, and local SEO strategies that drive sustainable organic traffic and qualified leads."
    heroImage="https://images.unsplash.com/photo-1572177812156-58036aae439c?q=80&w=1920&auto=format&fit=crop"
    accentFrom="from-green-600"
    accentTo="to-emerald-500"
    accentText="text-green-400"
    accentBg="bg-green-600/20"
    accentBorder="border-green-500/30"
    stats={[{ value: "120", label: "#1 Rankings", suffix: "" }, { value: "5", label: "Avg Traffic Growth", suffix: "x" }, { value: "6", label: "Month Timeline", suffix: "mo" }, { value: "40", label: "Active Clients", suffix: "" }]}
    servicesTitle="SEO Services"
    services={[{ icon: Search, title: "Technical SEO", desc: "Site speed, Core Web Vitals, crawlability, and structured data." }, { icon: TrendingUp, title: "On-Page Optimization", desc: "Keyword research, meta optimization, and content structuring." }, { icon: FileText, title: "Local SEO", desc: "Google Business Profile, map pack ranking, and citation building." }, { icon: Globe, title: "Content Strategy", desc: "SEO-driven content calendar, blog writing, and topical authority building." }]}
    processTitle="Our Delivery Process"
    processSteps={[{ title: "SEO Audit", desc: "Full technical analysis and competitor gap mapping." }, { title: "Keyword Research", desc: "High-intent keyword discovery and content opportunity mapping." }, { title: "On-Page & Technical Fixes", desc: "Implementing all optimizations in priority order." }, { title: "Link Building & Content", desc: "Authority building through quality backlinks and fresh content." }]}
    whyTitle="Why FIC for SEO?"
    whyPoints={[{ title: "Sustainable Traffic", desc: "Rankings built on white-hat practices that last years." }, { title: "Transparent Reporting", desc: "Monthly keyword ranking, traffic, and conversion reports." }, { title: "Content Expertise", desc: "In-house writers producing search-optimized content." }]}
    serviceType="SEO"
    serviceSlug="seo"
    formTitle="Start Your SEO Project"
    formBullets={['Free initial consultation', 'Detailed proposal within 48 hours', 'No long-term lock-in contracts']}
  />
);

export default SEO;
