import React from 'react';
import { Globe, Share2, TrendingUp, Zap } from 'lucide-react';
import ServicePageTemplate from '../../components/templates/ServicePageTemplate';

const SocialMedia = () => (
  <ServicePageTemplate
    title="Social Media Marketing"
    description="Creative content strategies, stunning visuals, and data-driven campaigns that grow your audience and drive engagement."
    tagline="Social Media Experts"
    heroTitle="Content That"
    heroHighlight="Builds Community"
    heroSubtitle="Creative content strategies, stunning visuals, and data-driven campaigns that grow your audience and drive engagement."
    heroImage="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1920&auto=format&fit=crop"
    accentFrom="from-fuchsia-600"
    accentTo="to-violet-500"
    accentText="text-fuchsia-400"
    accentBg="bg-fuchsia-600/20"
    accentBorder="border-fuchsia-500/30"
    stats={[{ value: "50", label: "Brands Managed", suffix: "+" }, { value: "3", label: "Avg Engagement Boost", suffix: "x" }, { value: "2M", label: "Monthly Impressions", suffix: "+" }, { value: "7", label: "Day Content Refresh", suffix: "" }]}
    servicesTitle="Social Media Marketing Services"
    services={[{ icon: Globe, title: "Content Calendar", desc: "30-day planned content strategy with captions, hashtags, and design." }, { icon: Share2, title: "Reel & Video Production", desc: "Short-form video content optimized for Instagram and YouTube Shorts." }, { icon: TrendingUp, title: "Community Management", desc: "Daily engagement, comment responses, and DM handling." }, { icon: Zap, title: "Influencer Coordination", desc: "Micro and macro influencer identification and campaign management." }]}
    processTitle="Our Delivery Process"
    processSteps={[{ title: "Social Audit", desc: "Review existing presence and competitor benchmarking." }, { title: "Strategy Development", desc: "Platform-specific content pillars and posting frequency." }, { title: "Content Production", desc: "Design, copywriting, and scheduling of all posts." }, { title: "Monitor & Grow", desc: "Monthly reporting on reach, engagement, and follower growth." }]}
    whyTitle="Why FIC for Social Media Marketing?"
    whyPoints={[{ title: "Platform Specialists", desc: "Dedicated experts for each platform." }, { title: "Original Creative", desc: "In-house designers producing scroll-stopping content." }, { title: "Proven Engagement", desc: "Average 3-5x engagement boost within 3 months." }]}
    serviceType="Social Media Marketing"
    serviceSlug="social-media-marketing"
    formTitle="Start Your Social Media Marketing Project"
    formBullets={['Free initial consultation', 'Detailed proposal within 48 hours', 'No long-term lock-in contracts']}
  />
);

export default SocialMedia;
