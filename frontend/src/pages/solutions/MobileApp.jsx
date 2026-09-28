import React from 'react';
import { Smartphone, Zap, ShieldCheck, Star } from 'lucide-react';
import ServicePageTemplate from '../../components/templates/ServicePageTemplate';

const MobileApp = () => (
  <ServicePageTemplate
    title="Mobile App Development"
    description="Native and cross-platform mobile applications that engage users, drive retention, and scale with your business."
    tagline="iOS & Android Solutions"
    heroTitle="Apps That Live"
    heroHighlight="In Every Pocket"
    heroSubtitle="Native and cross-platform mobile applications that engage users, drive retention, and scale with your business."
    heroImage="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1920&auto=format&fit=crop"
    accentFrom="from-emerald-600"
    accentTo="to-teal-500"
    accentText="text-emerald-400"
    accentBg="bg-emerald-600/20"
    accentBorder="border-emerald-500/30"
    stats={[{ value: "80", label: "Apps Published", suffix: "+" }, { value: "50", label: "Play Store", suffix: "+" }, { value: "4.8", label: "Avg Rating", suffix: "★" }, { value: "30", label: "Day Delivery", suffix: "" }]}
    servicesTitle="Mobile App Development Services"
    services={[{ icon: Smartphone, title: "React Native", desc: "Single codebase for iOS and Android with near-native performance." }, { icon: Zap, title: "Flutter Development", desc: "Beautiful, expressive UIs with smooth 60fps animations." }, { icon: ShieldCheck, title: "iOS Native", desc: "High-performance apps leveraging the full Apple ecosystem." }, { icon: Star, title: "Android Native", desc: "Kotlin-based apps optimized for the Google Play ecosystem." }]}
    processTitle="Our Delivery Process"
    processSteps={[{ title: "App Strategy", desc: "Platform choice, tech stack, and monetization planning." }, { title: "UI/UX Design", desc: "Wireframes, interactive prototypes, and design handoff." }, { title: "Development", desc: "Sprint-based development with TestFlight/Play beta access." }, { title: "App Store Launch", desc: "Submission, ASO optimization, and post-launch monitoring." }]}
    whyTitle="Why FIC for Mobile App Development?"
    whyPoints={[{ title: "Cross-Platform Experts", desc: "Reduce cost without sacrificing quality with shared codebases." }, { title: "App Store Track Record", desc: "50+ apps live on App Store and Google Play." }, { title: "Ongoing Support", desc: "Monthly maintenance, OS update compatibility, and analytics." }]}
    serviceType="Mobile App Development"
    serviceSlug="mobile-app-development"
    formTitle="Start Your Mobile App Development Project"
    formBullets={['Free initial consultation', 'Detailed proposal within 48 hours', 'No long-term lock-in contracts']}
  />
);

export default MobileApp;
