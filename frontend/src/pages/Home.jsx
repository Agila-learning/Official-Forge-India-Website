import React, { lazy, Suspense } from 'react';
import MarketplaceHero from '../components/sections/MarketplaceHero';
import SEOMeta from '../components/ui/SEOMeta';
import WelcomeModal from '../components/ui/WelcomeModal';
import GSAPReveal from '../components/ui/GSAPReveal';

// Below the fold components - Lazy Loaded
const MarketplaceCategories = lazy(() => import('../components/sections/MarketplaceCategories'));
const DeliveryBanner = lazy(() => import('../components/sections/DeliveryBanner'));
const FICRoadmap = lazy(() => import('../components/sections/FICRoadmap'));
const About = lazy(() => import('../components/sections/About'));
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
const PipelineProcess = lazy(() => import('../components/sections/PipelineProcess'));
const ServiceCoverage = lazy(() => import('../components/sections/ServiceCoverage'));
const PlacedCandidates = lazy(() => import('../components/sections/PlacedCandidates'));

const SectionPlaceholder = () => <div className="min-h-[300px] flex items-center justify-center bg-gray-50/50 animate-pulse rounded-3xl m-4" />;

const Home = () => {
  return (
    <>
      <SEOMeta
        title="Forge India Connect | Pincode-Based Multi-Service Marketplace"
        description="FIC is India's first pincode-verified marketplace for Jobs, IT Solutions, Home Services, and Products. Unlock unlimited access with FIC Membership."
        keywords="Pincode Marketplace, Home Services India, IT Solutions Marketplace, Job Portal India, FIC Membership, Forge India Connect"
        canonical="/"
      />
      <div className="pt-16">
        <MarketplaceHero />
        <WelcomeModal />
        
        <Suspense fallback={<SectionPlaceholder />}>
          <GSAPReveal direction="up" delay={0.1}>
            <MarketplaceCategories />
          </GSAPReveal>

          <DeliveryBanner />

          <FICRoadmap />

          <GSAPReveal direction="right">
            <About />
          </GSAPReveal>

          <GSAPReveal>
            <PipelineProcess />
          </GSAPReveal>

          <GSAPReveal direction="up">
            <Services />
          </GSAPReveal>

          <GSAPReveal direction="right">
            <RideServices />
          </GSAPReveal>

          <GSAPReveal direction="left">
            <RentalServices />
          </GSAPReveal>

          <LogoMarquee />

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
      </div>
    </>
  );
};

export default Home;
