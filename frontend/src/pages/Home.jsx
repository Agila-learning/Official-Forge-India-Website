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

import LogoMarquee from '../components/ui/LogoMarquee';
import PipelineProcess from '../components/sections/PipelineProcess';
import ServiceCoverage from '../components/sections/ServiceCoverage';
import PlacedCandidates from '../components/sections/PlacedCandidates';
import VisualFlow from '../components/sections/VisualFlow';
import WelcomeModal from '../components/ui/WelcomeModal';

const Home = () => {
  return (
    <div className="pt-16">
      <Hero />
      <WelcomeModal />
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
  );
};

export default Home;
