import React from 'react';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Services from '../components/sections/Services';
import Features from '../components/sections/Features';
import Industries from '../components/sections/Industries';
import Events from '../components/sections/Events';
import Testimonials from '../components/sections/Testimonials';
import CTA from '../components/sections/CTA';
import Contact from '../components/sections/Contact';
import LocationMap from '../components/sections/LocationMap';
import MetricsSection from '../components/sections/MetricsSection';
import SEOMeta from '../components/ui/SEOMeta';

import LogoMarquee from '../components/ui/LogoMarquee';
import PipelineProcess from '../components/sections/PipelineProcess';
import ServiceCoverage from '../components/sections/ServiceCoverage';
import PlacedCandidates from '../components/sections/PlacedCandidates';
import VisualFlow from '../components/sections/VisualFlow';
import WelcomeModal from '../components/ui/WelcomeModal';

const Home = () => {
  return (
    <>
      <SEOMeta
        title="Forge India Connect | Job Consultancy, Business Services & Placement in Chennai"
        description="FIC is South India's leading job consultancy and business services platform. Expert job placement in Banking, IT & BPO, digital marketing, web development, insurance, and home services across Chennai, Krishnagiri & Bangalore."
        keywords="job consultancy chennai, banking job placement, IT placement south india, HR consultancy freshers, digital marketing services chennai, web development company, forge india connect, job consulting krishnagiri"
        canonical="/"
      />
      <div className="pt-16">
        <Hero />
        <WelcomeModal />
        <MetricsSection />
        <VisualFlow />
        <About />
        <PipelineProcess />
        <Services />
        <LogoMarquee />
        <Features />
        <Industries />
        <Events />
        <div id="placed">
          <PlacedCandidates />
        </div>
        <div id="testimonials">
          <Testimonials />
        </div>
        <CTA />
        <div id="contact">
          <Contact />
        </div>
        <ServiceCoverage />
        <LocationMap />
      </div>
    </>
  );
};

export default Home;
