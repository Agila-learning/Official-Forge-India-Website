import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ServiceLayout from '../components/layout/ServiceLayout';
import JobApplicationForm from '../components/ui/JobApplicationForm';
import ServiceInquiryForm from '../components/ui/ServiceInquiryForm';
import RoleSelectionModal from '../components/ui/RoleSelectionModal';
import ServicePopup from '../components/ui/ServicePopup';
import { Search, ExternalLink, XCircle, ShieldCheck, Zap, Star, Layout, Users, BarChart } from 'lucide-react';

const serviceData = {
  'job-consulting': {
    title: 'Job Consulting',
    description: 'Forge India Connect offers elite career consulting, bridging the gap between top talent and industry giants like Kotak, Axis, HDFC, and IT leaders like Infosys and HCL.',
    benefits: [
      'Personalized Career Roadmap',
      'Mock Interviews with Industry Experts',
      'Direct Access to Fortune 500 Networks',
      'Resume Engineering for ATS Optimization'
    ],
    seoDesc: 'Elite job consulting services by Forge India Connect.',
    imageSrc: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80',
    hasCustomActions: true
  },
  'it-solutions': {
    title: 'IT Solutions',
    description: 'Scalable cloud infrastructure and managed IT services designed for maximum uptime and security. Partnering with innovations from Tata, Delta, and Antigraviity.',
    benefits: [
      '24/7 Managed Network Support',
      'Advanced Cybersecurity Shielding',
      'Cloud Migration & Optimization',
      'Custom ERP & CRM Implementations'
    ],
    seoDesc: 'Enterprise-grade IT solutions by Forge India Connect.',
    imageSrc: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80'
  },
  'digital-marketing': {
    title: 'Digital Marketing',
    description: 'Data-driven growth hacking and SEO strategies to dominate search results and social engagement.',
    benefits: [
      'Performance-Based SEO & SEM',
      'High-Conversion Ad Campaigns',
      'Viral Content Marketing Socials',
      'Real-time Analytics & ROI Tracking'
    ],
    seoDesc: 'Dominate the digital landscape with Forge India Connect.',
    imageSrc: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    showPopup: true
  },
  'insurance-services': {
    title: 'Insurance Services',
    description: 'Comprehensive risk management and insurance solutions for corporate and individual safety.',
    benefits: [
      'Bespoke Health & Life Plans',
      'Commercial Property & Asset Guard',
      'Liability & Indemnity Coverage',
      'Fast-track Claims Assistance'
    ],
    seoDesc: 'Secure your future with FIC Insurance Services.',
    imageSrc: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80'
  },
  'app-development': {
    title: 'App Development',
    description: 'High-performance mobile applications engineered for seamless user experiences on iOS and Android.',
    benefits: [
      'Native Swift & Kotlin Development',
      'React Native & Flutter Hybrid Apps',
      'Ultra-Low Latency Backend API',
      'Biometric & Secure Payment Integration'
    ],
    seoDesc: 'Premium mobile app development by Forge India Connect.',
    imageSrc: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    showPopup: true
  },
  'website-development': {
    title: 'Website Development',
    description: 'Modern, scalable web platforms built with cutting-edge tech stacks like React, Next.js, and Node.js.',
    benefits: [
      'Dynamic & Responsive PWAs',
      'E-commerce & Custom Marketplace',
      'Headless CMS Integrations',
      'SEO-First Architecture'
    ],
    seoDesc: 'Build powerful web platforms with Forge India Connect.',
    imageSrc: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    showPopup: true,
    process: [
      { title: 'Discovery', desc: 'Understanding your business goals and user needs.' },
      { title: 'Architecture', desc: 'Designing a scalable, secure technical foundation.' },
      { title: 'Development', desc: 'Agile execution using modern MERN stack standards.' },
      { title: 'QA & Launch', desc: 'Rigorous testing followed by seamless deployment.' }
    ],
    trustPoints: [
      { icon: ShieldCheck, title: '99.9% Uptime', desc: 'Enterprise-grade hosting solutions.' },
      { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for Core Web Vitals.' },
      { icon: Users, title: 'Expert Team', desc: 'Vetted senior developers only.' }
    ]
  }
};

const ServicePage = () => {
  const { serviceId } = useParams();
  const data = serviceData[serviceId];
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  if (!data) return <Navigate to="/" />;

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const actions = (() => {
    // Role-based authorization rules
    const isJobRelated = serviceId === 'job-consulting' || serviceId === 'website-development' || serviceId === 'app-development';
    
    // Check if user is authorized based on service category
    // Allow logic: Candidates and Customers are both "Clients" for different service types
    // but the system will now allow both to book any service for maximum flexibility.
    const isAuthorized = userInfo.role === 'Candidate' || userInfo.role === 'Customer' || !userInfo.role;

    // Roles that are EXPLICITLY restricted from booking (internal/management roles)
    const restrictedRoles = ['Vendor', 'Admin', 'HR'];
    const isRestricted = restrictedRoles.includes(userInfo.role);

    if (isRestricted) {
      return (
        <div className="py-6 px-10 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-500 font-black uppercase text-[10px] tracking-widest max-w-md flex items-center gap-4">
            <XCircle size={20} />
            As a {userInfo.role}, you are not authorized to book this service. Please use a Customer or Candidate account.
        </div>
      );
    }

    if (serviceId === 'website-development' || serviceId === 'app-development') {
      return (
        <button 
            onClick={() => {
                if (!userInfo || !userInfo.role) {
                    window.location.href = '/register';
                } else {
                    window.location.href = '/explore-jobs';
                }
            }}
            className="inline-flex items-center gap-2 px-10 py-5 rounded-full font-black text-white bg-primary hover:bg-blue-700 shadow-2xl shadow-primary/20 transition-all transform hover:-translate-y-2 text-lg"
        >
            <Search size={22} /> Apply Jobs
        </button>
      );
    }

    if (serviceId === 'insurance-services' || serviceId === 'job-consulting') {
      return (
        <div className="flex gap-4">
            <button 
                onClick={() => {
                    if (!userInfo || !userInfo.role) {
                        setIsRoleModalOpen(true);
                    } else if (serviceId === 'insurance-services') {
                        setIsInquiryOpen(true);
                    } else {
                        setIsFormOpen(true);
                    }
                }}
                className="inline-flex items-center gap-2 px-10 py-5 rounded-full font-black text-white bg-primary hover:bg-blue-700 shadow-2xl shadow-primary/20 transition-all transform hover:-translate-y-2 text-lg"
            >
                <Search size={22} /> {serviceId === 'insurance-services' ? 'Fill Form' : 'Find Jobs'}
            </button>
            {serviceId === 'job-consulting' && (
                <a 
                    href="https://docs.google.com/forms/d/e/1FAIpQLScbkwHKEABPsNqqrB9CKic3L6uagHUqMN6p39-tyWYEqZGs4Q/viewform" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-10 py-5 rounded-full font-black text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all transform hover:-translate-y-2 text-lg"
                >
                    <ExternalLink size={22} /> Apply Now
                </a>
            )}
        </div>
      );
    }

    return (
        <button 
            onClick={() => {
                if (!userInfo || !userInfo.role) {
                    setIsRoleModalOpen(true);
                } else {
                    setIsInquiryOpen(true);
                }
            }}
            className="inline-flex items-center gap-2 px-10 py-5 rounded-full font-black text-white bg-primary hover:bg-blue-700 shadow-2xl shadow-primary/20 transition-all transform hover:-translate-y-2 text-lg"
        >
            <Search size={22} /> Inquire Now
        </button>
    );
  })();

  return (
    <>
      {data.showPopup && <ServicePopup serviceName={data.title} />}
      <JobApplicationForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} jobTitle="Job Consulting" />
      <ServiceInquiryForm isOpen={isInquiryOpen} onClose={() => setIsInquiryOpen(false)} serviceId={serviceId} serviceName={data.title} />
      <RoleSelectionModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} />
      <ServiceLayout {...data} actions={actions} />
    </>
  );
};

export default ServicePage;
