import React, { lazy, Suspense } from 'react';
import SEOMeta from '../components/ui/SEOMeta';

// Home Page Sections
import Hero from '../components/sections/Hero';
import ClientMarquee from '../components/sections/ClientMarquee';
import AudiencePaths from '../components/sections/AudiencePaths';
import CoreServices from '../components/sections/CoreServices';
import CareersLandingSection from '../components/sections/CareersLandingSection';
import ResumeBuilderSection from '../components/sections/ResumeBuilderSection';
import BankingCareersSection from '../components/sections/BankingCareersSection';
import InternshipSection from '../components/sections/InternshipSection';
import FinalYearProjects from '../components/sections/FinalYearProjects';
import InstitutionSolutions from '../components/sections/InstitutionSolutions';
import BusinessSolutions from '../components/sections/BusinessSolutions';
import FICServiceEcosystem from '../components/sections/FICServiceEcosystem';
import AtomyPreview from '../components/sections/AtomyPreview';
import TrustSection from '../components/sections/TrustSection';
import AboutSection from '../components/sections/AboutSection';
import LocationsSection from '../components/sections/LocationsSection';
import Testimonials from '../components/sections/Testimonials';

import FinalCTA from '../components/sections/FinalCTA';
import DigitalTools from '../components/sections/DigitalTools';
import GallerySection from '../components/sections/GallerySection';
import FICExperienceCarousel from '../components/sections/FICExperienceCarousel';
import SurveyPopup from '../components/ui/SurveyPopup';
import CurrentEvents from '../components/sections/CurrentEvents';
import NetworkBanner from '../components/sections/NetworkBanner';

const Home = () => {
  return (
    <>
      <SEOMeta
        title="Forge India Connect | IT Solutions & Careers"
        description="Forge India Connect is a premier IT, software, and recruitment company providing custom solutions, web development, job consulting, and training across India."
        keywords="Forge India Connect, IT company in Krishnagiri, IT company in Bangalore, top software development company, custom software development, web app development, mobile app development, CRM solutions, ERP solutions, business automation, digital marketing services, SEO agency, IT consulting, job portal, career guidance, banking careers, placement support, student internships, final year projects, real-time training programs, corporate training, recruitment agency, staffing solutions, HR services, B2B marketplace, tech startups India, cloud solutions provider, UI/UX design, tech education, online courses, IT solutions company in Krishnagiri, best IT company in Krishnagiri"
        canonical="https://www.forgeindiaconnect.com/"
      />
      
      <main className="bg-white text-slate-800 font-sans overflow-x-hidden">
        <Hero />
        <ClientMarquee />
        <AudiencePaths />
        <CoreServices />
        <CareersLandingSection />
        <ResumeBuilderSection />
        <DigitalTools />
        <BankingCareersSection />
        <CurrentEvents />
        <InternshipSection />
        <FinalYearProjects />
        <NetworkBanner />
        <InstitutionSolutions />
        <BusinessSolutions />
        <FICServiceEcosystem />
        <AtomyPreview />

        <Testimonials previewMode={true} />
        <TrustSection />
        <AboutSection />
        <FICExperienceCarousel />
        <GallerySection previewMode={true} />
        <LocationsSection />
        <FinalCTA />
        <SurveyPopup />
      </main>
    </>
  );
};

export default Home;
