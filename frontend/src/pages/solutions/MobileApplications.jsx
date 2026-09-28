import React from 'react';
import { Smartphone, MapPin, Globe, Star } from 'lucide-react';
import ServicePageTemplate from '../../components/templates/ServicePageTemplate';

const MobileApplications = () => (
  <ServicePageTemplate
    title="Mobile Application Solutions"
    description="Service booking apps, delivery platforms, utility applications, and customer engagement apps built for real-world usage."
    tagline="Mobile-First Business Solutions"
    heroTitle="Business Apps"
    heroHighlight="That Drive Growth"
    heroSubtitle="Service booking apps, delivery platforms, utility applications, and customer engagement apps built for real-world usage."
    heroImage="https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=1920&auto=format&fit=crop"
    accentFrom="from-purple-600"
    accentTo="to-violet-500"
    accentText="text-purple-400"
    accentBg="bg-purple-600/20"
    accentBorder="border-purple-500/30"
    stats={[{ value: "60", label: "Apps Delivered", suffix: "+" }, { value: "4.7", label: "Avg App Rating", suffix: "★" }, { value: "2", label: "Platforms Supported", suffix: "" }, { value: "30", label: "Day Turnaround", suffix: "" }]}
    servicesTitle="Mobile Applications Services"
    services={[{ icon: Smartphone, title: "Service Booking Apps", desc: "On-demand service platforms with real-time booking and tracking." }, { icon: MapPin, title: "Delivery Apps", desc: "Multi-vendor delivery platforms with driver management and live tracking." }, { icon: Globe, title: "Customer Loyalty Apps", desc: "Reward points, push notifications, and personalized offers." }, { icon: Star, title: "Field Service Apps", desc: "Offline-capable mobile tools for field teams and technicians." }]}
    processTitle="Our Delivery Process"
    processSteps={[{ title: "App Concept", desc: "Product vision, feature list, and market validation." }, { title: "UX Design", desc: "Interactive prototypes tested with real users." }, { title: "Development", desc: "Agile development with bi-weekly feature releases." }, { title: "Store Submission", desc: "App Store and Play Store listing optimization and launch." }]}
    whyTitle="Why FIC for Mobile Applications?"
    whyPoints={[{ title: "Real-World Tested", desc: "Apps tested with 100+ real users before launch." }, { title: "Offline-First", desc: "Core features work without internet connectivity." }, { title: "Push Notifications", desc: "Targeted re-engagement campaigns built into every app." }]}
    serviceType="Mobile Applications"
    serviceSlug="mobile-applications"
    formTitle="Start Your Mobile Applications Project"
    formBullets={['Free initial consultation', 'Detailed proposal within 48 hours', 'No long-term lock-in contracts']}
  />
);

export default MobileApplications;
