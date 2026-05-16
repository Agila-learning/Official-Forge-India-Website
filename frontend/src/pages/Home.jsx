import React, { lazy, Suspense } from 'react';
import Hero from '../components/sections/Hero';
import SEOMeta from '../components/ui/SEOMeta';
import WelcomeModal from '../components/ui/WelcomeModal';
import GSAPReveal from '../components/ui/GSAPReveal';

// Below the fold components - Lazy Loaded
const MetricsSection = lazy(() => import('../components/sections/MetricsSection'));
const ResumeAnalyzer = lazy(() => import('../components/ui/ResumeAnalyzer'));
const MarketplaceCategories = lazy(() => import('../components/sections/MarketplaceCategories'));
const DeliveryBanner = lazy(() => import('../components/sections/DeliveryBanner'));
const Services = lazy(() => import('../components/sections/Services'));
const Features = lazy(() => import('../components/sections/Features'));
const Industries = lazy(() => import('../components/sections/Industries'));
const Events = lazy(() => import('../components/sections/Events'));
const Testimonials = lazy(() => import('../components/sections/Testimonials'));
const CTA = lazy(() => import('../components/sections/CTA'));
const Contact = lazy(() => import('../components/sections/Contact'));
const LocationMap = lazy(() => import('../components/sections/LocationMap'));
const RideServices = lazy(() => import('../components/sections/RideServices'));
const RentalServices = lazy(() => import('../components/sections/RentalServices'));
const LogoMarquee = lazy(() => import('../components/ui/LogoMarquee'));
const ServiceCoverage = lazy(() => import('../components/sections/ServiceCoverage'));
const PlacedCandidates = lazy(() => import('../components/sections/PlacedCandidates'));

const SectionPlaceholder = () => <div className="min-h-[400px] flex items-center justify-center bg-dark-bg/50 backdrop-blur-xl animate-pulse rounded-[3rem] m-6 border border-white/5" />;

const Home = () => {
 return (
 <>
 <SEOMeta
 title="Forge India Connect | Premium Multi-Service Technology & Career Ecosystem"
 description="Transforming careers and businesses through innovation. Pincode-verified Jobs, IT Solutions, and Premium Services. India's futuristic technology ecosystem."
 keywords="Futuristic Technology Ecosystem, AI Job Consulting, Enterprise IT Solutions, Career Transformation India, FIC Premium Marketplace"
 canonical="/"
 />
 
 <main className="bg-dark-bg">
 <Hero />
 <WelcomeModal />
 
 <Suspense fallback={<SectionPlaceholder />}>
 <GSAPReveal direction="up" delay={0.2}>
 <MetricsSection />
 </GSAPReveal>

 <GSAPReveal direction="right">
 <LogoMarquee />
 </GSAPReveal>

 <GSAPReveal direction="up">
 <MarketplaceCategories />
 </GSAPReveal>

 <DeliveryBanner />

 <GSAPReveal direction="up">
 <Services />
 </GSAPReveal>

 <GSAPReveal direction="right">
 <RideServices />
 </GSAPReveal>

 <GSAPReveal direction="left">
 <RentalServices />
 </GSAPReveal>

 <GSAPReveal direction="left">
 <Features />
 </GSAPReveal>

 <GSAPReveal direction="right">
 <Industries />
 </GSAPReveal>

 <GSAPReveal>
 <Events />
 </GSAPReveal>

 <div id="placed">
 <GSAPReveal direction="up">
 <PlacedCandidates />
 </GSAPReveal>
 </div>

 <div id="testimonials">
 <GSAPReveal>
 <Testimonials />
 </GSAPReveal>
 </div>

 <GSAPReveal>
 <CTA />
 </GSAPReveal>

 <div id="contact">
 <Contact />
 </div>
 
 <ServiceCoverage />
 <LocationMap />
 </Suspense>
 </main>
 </>
 );
};

export default Home;
