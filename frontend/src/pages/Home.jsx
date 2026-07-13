import React, { lazy, Suspense } from 'react';
import Hero from '../components/sections/Hero';
import ChoosePath from '../components/sections/ChoosePath';
import SEOMeta from '../components/ui/SEOMeta';
import WelcomeModal from '../components/ui/WelcomeModal';
import GSAPReveal from '../components/ui/GSAPReveal';
import QuickBookingNav from '../components/sections/QuickBookingNav';

// Below the fold components - Lazy Loaded
const MetricsSection = lazy(() => import('../components/sections/MetricsSection'));
const Testimonials = lazy(() => import('../components/sections/Testimonials'));
const CTA = lazy(() => import('../components/sections/CTA'));
const LocationMap = lazy(() => import('../components/sections/LocationMap'));
const CompanyFeed = lazy(() => import('../components/sections/CompanyFeed'));
const PropertyBanner = lazy(() => import('../components/sections/PropertyBanner'));

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
        <QuickBookingNav />
        
        <GSAPReveal direction="up" delay={0.1}>
          <ChoosePath />
        </GSAPReveal>

        <Suspense fallback={<SectionPlaceholder />}>
          <GSAPReveal direction="up" delay={0.2}>
            <PropertyBanner />
          </GSAPReveal>
          <GSAPReveal direction="up" delay={0.2}>
            <MetricsSection />
          </GSAPReveal>

          <div id="testimonials">
            <GSAPReveal>
              <Testimonials />
            </GSAPReveal>
          </div>

          <GSAPReveal>
            <CompanyFeed />
          </GSAPReveal>

          <GSAPReveal>
            <CTA />
          </GSAPReveal>

          <LocationMap />
        </Suspense>
      </main>
    </>
  );
};

export default Home;
