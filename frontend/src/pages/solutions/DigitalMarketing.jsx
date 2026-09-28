import React from 'react';
import { TrendingUp, Target, BarChart2, Zap } from 'lucide-react';
import ServicePageTemplate from '../../components/templates/ServicePageTemplate';

const DigitalMarketing = () => (
  <ServicePageTemplate
    title="Digital Marketing Services"
    description="Data-driven campaigns across Google, Meta, LinkedIn, and YouTube that deliver measurable ROI, not just impressions."
    tagline="Performance Marketing"
    heroTitle="Marketing That"
    heroHighlight="Drives Results"
    heroSubtitle="Data-driven campaigns across Google, Meta, LinkedIn, and YouTube that deliver measurable ROI, not just impressions."
    heroImage="https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1920&auto=format&fit=crop"
    accentFrom="from-pink-600"
    accentTo="to-fuchsia-500"
    accentText="text-pink-400"
    accentBg="bg-pink-600/20"
    accentBorder="border-pink-500/30"
    stats={[{ value: "3", label: "Average ROAS", suffix: "x" }, { value: "60", label: "Brands Managed", suffix: "+" }, { value: "30", label: "Cost Per Lead Reduction", suffix: "%" }, { value: "6", label: "Years Experience", suffix: "" }]}
    servicesTitle="Digital Marketing Services"
    services={[{ icon: TrendingUp, title: "Google Ads", desc: "Search, display, and shopping campaigns with conversion-focused bidding." }, { icon: Target, title: "Meta Ads", desc: "Facebook and Instagram campaigns targeting precise audience segments." }, { icon: BarChart2, title: "LinkedIn Marketing", desc: "B2B lead generation and brand positioning for decision-makers." }, { icon: Zap, title: "Performance Analytics", desc: "Real-time dashboards with ROAS, CAC, and LTV tracking." }]}
    processTitle="Our Delivery Process"
    processSteps={[{ title: "Audit & Strategy", desc: "Competitor analysis, audience profiling, and goal alignment." }, { title: "Campaign Setup", desc: "Ad creative, targeting, and funnel architecture." }, { title: "Launch & Optimize", desc: "A/B testing, bid management, and creative iteration." }, { title: "Reporting", desc: "Weekly performance reports with actionable insights." }]}
    whyTitle="Why FIC for Digital Marketing?"
    whyPoints={[{ title: "ROI-Focused", desc: "Every rupee tracked to measurable business outcomes." }, { title: "Creative + Data", desc: "In-house designers and data scientists work together." }, { title: "Transparent Reporting", desc: "Real-time dashboard access with no hidden metrics." }]}
    serviceType="Digital Marketing"
    serviceSlug="digital-marketing"
    formTitle="Start Your Digital Marketing Project"
    formBullets={['Free initial consultation', 'Detailed proposal within 48 hours', 'No long-term lock-in contracts']}
  />
);

export default DigitalMarketing;
