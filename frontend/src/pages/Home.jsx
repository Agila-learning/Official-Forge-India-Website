import MarketplaceHero from '../components/sections/MarketplaceHero';
import MarketplaceCategories from '../components/sections/MarketplaceCategories';
import FICRoadmap from '../components/sections/FICRoadmap';
import About from '../components/sections/About';
import Services from '../components/sections/Services';
import Features from '../components/sections/Features';
import Industries from '../components/sections/Industries';
import Events from '../components/sections/Events';
import Testimonials from '../components/sections/Testimonials';
import CTA from '../components/sections/CTA';
import Contact from '../components/sections/Contact';
import LocationMap from '../components/sections/LocationMap';
import SEOMeta from '../components/ui/SEOMeta';
import LogoMarquee from '../components/ui/LogoMarquee';
import PipelineProcess from '../components/sections/PipelineProcess';
import ServiceCoverage from '../components/sections/ServiceCoverage';
import PlacedCandidates from '../components/sections/PlacedCandidates';
import WelcomeModal from '../components/ui/WelcomeModal';
import GSAPReveal from '../components/ui/GSAPReveal';

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
        
        <GSAPReveal direction="up" delay={0.1}>
          <MarketplaceCategories />
        </GSAPReveal>

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
