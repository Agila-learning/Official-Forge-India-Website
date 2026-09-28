import React from 'react';
import { Layers, Star, Award, Zap } from 'lucide-react';
import ServicePageTemplate from '../../components/templates/ServicePageTemplate';

const Branding = () => (
  <ServicePageTemplate
    title="Brand Identity & Strategy"
    description="From logo design to full brand systems, we craft memorable identities that resonate with your audience and outlast trends."
    tagline="Brand Identity Experts"
    heroTitle="Build a Brand"
    heroHighlight="That Stands Out"
    heroSubtitle="From logo design to full brand systems, we craft memorable identities that resonate with your audience and outlast trends."
    heroImage="https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1920&auto=format&fit=crop"
    accentFrom="from-yellow-500"
    accentTo="to-orange-500"
    accentText="text-yellow-400"
    accentBg="bg-yellow-500/20"
    accentBorder="border-yellow-500/30"
    stats={[{ value: "200", label: "Brands Created", suffix: "+" }, { value: "15", label: "Industries", suffix: "" }, { value: "100", label: "Client Approval", suffix: "%" }, { value: "7", label: "Day Delivery", suffix: "" }]}
    servicesTitle="Branding Services"
    services={[{ icon: Layers, title: "Logo Design", desc: "Strategic, memorable logos that communicate your brand values instantly." }, { icon: Star, title: "Visual Identity System", desc: "Typography, color palette, iconography, and usage guidelines." }, { icon: Award, title: "Brand Strategy", desc: "Positioning, messaging framework, tone of voice, and target persona." }, { icon: Zap, title: "Marketing Collateral", desc: "Business cards, pitch decks, brochures, and social media kits." }]}
    processTitle="Our Delivery Process"
    processSteps={[{ title: "Brand Discovery", desc: "Workshops to uncover your vision, values, and target audience." }, { title: "Concept Development", desc: "Multiple creative directions presented for feedback." }, { title: "Design Refinement", desc: "Iteration on selected direction until perfect." }, { title: "Brand Delivery", desc: "Final files in all formats with comprehensive brand guide." }]}
    whyTitle="Why FIC for Branding?"
    whyPoints={[{ title: "Strategy-Led Design", desc: "Every visual decision backed by market and audience research." }, { title: "100% Original", desc: "No templates, stock logos, or AI-generated shortcuts." }, { title: "Unlimited Revisions", desc: "We refine until you love it." }]}
    serviceType="Branding"
    serviceSlug="branding"
    formTitle="Start Your Branding Project"
    formBullets={['Free initial consultation', 'Detailed proposal within 48 hours', 'No long-term lock-in contracts']}
  />
);

export default Branding;
