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
import GSAPReveal from '../components/ui/GSAPReveal';

const Home = () => {
  return (
    <>
      <SEOMeta
        title="Forge India Connect | IT Company in Chennai | Software & Web Development"
        description="FIC is a Technology-First IT Solutions Company. Software Development, Web & App Development, AI/ML, and Digital Marketing Services. Your Technology Partner for Growth."
        keywords="IT Company in Chennai, Software Development Company, Web Development Services India, Mobile App Development Company, AI & ML Solutions Company, Digital Marketing Agency Chennai, forge india connect"
        canonical="/"
      />
      <div className="pt-16">
        <Hero />
        <WelcomeModal />
        
        <GSAPReveal delay={0.2}>
          <MetricsSection />
        </GSAPReveal>

        <GSAPReveal direction="left">
          <VisualFlow />
        </GSAPReveal>

        <GSAPReveal direction="right">
          <About />
        </GSAPReveal>

        <GSAPReveal>
          <PipelineProcess />
        </GSAPReveal>

        <GSAPReveal direction="up">
          <Services />
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
      </div>
    </>
  );
};

export default Home;
