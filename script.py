import os

base_path = r'frontend\src\pages\solutions'
if not os.path.exists(base_path):
    os.makedirs(base_path)

pages_data = [
    {
        'name': 'ITSolutions',
        'slug': 'it-solutions',
        'title': 'End-to-End IT Solutions & Business Technology Consulting',
        'subtitle': 'Transform your business with our comprehensive IT solutions. We engineer digital excellence through custom software, infrastructure support, and enterprise architecture.',
        'hero_image': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1920&auto=format&fit=crop',
        'service_type': 'IT Solutions',
        'cta_text': 'Discuss Your IT Requirement'
    },
    {
        'name': 'CustomSoftware',
        'slug': 'custom-software-development',
        'title': 'Custom Software Development Services',
        'subtitle': 'Bespoke business software, SaaS platforms, and enterprise applications engineered for scale and tailored to your unique workflow.',
        'hero_image': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1920&auto=format&fit=crop',
        'service_type': 'Custom Software Development',
        'cta_text': 'Request Custom Software'
    },
    {
        'name': 'WebApplication',
        'slug': 'web-application-development',
        'title': 'Web Application Development',
        'subtitle': 'High-performance, secure, and scalable web applications, business dashboards, and SaaS portals.',
        'hero_image': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1920&auto=format&fit=crop',
        'service_type': 'Web Application Development',
        'cta_text': 'Discuss Your Web Application'
    },
    {
        'name': 'MobileApp',
        'slug': 'mobile-app-development',
        'title': 'Mobile App Development',
        'subtitle': 'Native and cross-platform mobile applications for iOS and Android. Engage your customers on every device.',
        'hero_image': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1920&auto=format&fit=crop',
        'service_type': 'Mobile App Development',
        'cta_text': 'Start Your App Project'
    },
    {
        'name': 'ERPSolutions',
        'slug': 'erp-solutions',
        'title': 'Enterprise Resource Planning (ERP) Solutions',
        'subtitle': 'Streamline operations with comprehensive ERP systems for schools, colleges, and businesses. Manage inventory, HRMS, finance, and sales in one unified dashboard.',
        'hero_image': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1920&auto=format&fit=crop',
        'service_type': 'ERP Solutions',
        'cta_text': 'Discuss ERP Requirements'
    },
    {
        'name': 'CRMSolutions',
        'slug': 'crm-solutions',
        'title': 'Customer Relationship Management (CRM) Solutions',
        'subtitle': 'Accelerate sales and improve customer retention with automated lead pipelines, task management, and sales dashboards.',
        'hero_image': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1920&auto=format&fit=crop',
        'service_type': 'CRM Solutions',
        'cta_text': 'Request CRM Solution'
    },
    {
        'name': 'DigitalMarketing',
        'slug': 'digital-marketing',
        'title': 'Digital Marketing & Growth Strategies',
        'subtitle': 'Data-driven performance marketing, lead generation, and comprehensive digital campaigns to scale your brand online.',
        'hero_image': 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1920&auto=format&fit=crop',
        'service_type': 'Digital Marketing',
        'cta_text': 'Grow Your Business'
    },
    {
        'name': 'SEO',
        'slug': 'seo',
        'title': 'Search Engine Optimization (SEO)',
        'subtitle': 'Dominate search rankings with technical, on-page, and local SEO strategies. Drive organic traffic and targeted leads.',
        'hero_image': 'https://images.unsplash.com/photo-1572177812156-58036aae439c?q=80&w=1920&auto=format&fit=crop',
        'service_type': 'SEO',
        'cta_text': 'Request SEO Consultation'
    },
    {
        'name': 'Branding',
        'slug': 'branding',
        'title': 'Brand Identity & Strategy',
        'subtitle': 'Crafting memorable brand identities, logo design, visual guidelines, and corporate branding to make your business stand out.',
        'hero_image': 'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1920&auto=format&fit=crop',
        'service_type': 'Branding',
        'cta_text': 'Build Your Brand'
    },
    {
        'name': 'SocialMedia',
        'slug': 'social-media-marketing',
        'title': 'Social Media Marketing',
        'subtitle': 'Creative content strategy and campaign management for Instagram, Facebook, and LinkedIn. Engage your audience and build community.',
        'hero_image': 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1920&auto=format&fit=crop',
        'service_type': 'Social Media Marketing',
        'cta_text': 'Plan My Social Media'
    },
    {
        'name': 'Recruitment',
        'slug': 'recruitment',
        'title': 'Corporate & IT Recruitment',
        'subtitle': 'End-to-end talent acquisition. We source, screen, and place top talent across IT and non-IT sectors.',
        'hero_image': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1920&auto=format&fit=crop',
        'service_type': 'Recruitment',
        'cta_text': 'Hire Through FIC'
    },
    {
        'name': 'Staffing',
        'slug': 'staffing',
        'title': 'Professional Staffing Solutions',
        'subtitle': 'Flexible workforce solutions including contract, temporary, and permanent staffing for diverse industries.',
        'hero_image': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1920&auto=format&fit=crop',
        'service_type': 'Staffing',
        'cta_text': 'Request Staffing Support'
    },
    {
        'name': 'HRSolutions',
        'slug': 'hr-solutions',
        'title': 'HR Solutions & Management',
        'subtitle': 'Comprehensive HR consulting, employee management, payroll processing, and HRMS implementation.',
        'hero_image': 'https://images.unsplash.com/photo-1554774853-719586f82d77?q=80&w=1920&auto=format&fit=crop',
        'service_type': 'HR Solutions',
        'cta_text': 'Discuss HR Requirements'
    },
    {
        'name': 'WebDevelopment',
        'slug': 'web-development',
        'title': 'Corporate & Business Web Development',
        'subtitle': 'Professional corporate websites, CMS, landing pages, and responsive e-commerce websites designed for maximum conversions.',
        'hero_image': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1920&auto=format&fit=crop',
        'service_type': 'Web Development',
        'cta_text': 'Start Your Website Project'
    },
    {
        'name': 'MobileApplications',
        'slug': 'mobile-applications',
        'title': 'Mobile Applications & Solutions',
        'subtitle': 'Mobile-first business solutions, utility applications, and service booking apps to digitize your customer experience.',
        'hero_image': 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=1920&auto=format&fit=crop',
        'service_type': 'Mobile Applications',
        'cta_text': 'Discuss Mobile Solutions'
    },
    {
        'name': 'CloudSolutions',
        'slug': 'cloud-solutions',
        'title': 'Cloud Infrastructure & Architecture',
        'subtitle': 'Secure cloud hosting, scalable AWS/Azure deployment, database management, and seamless cloud migration.',
        'hero_image': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop',
        'service_type': 'Cloud Solutions',
        'cta_text': 'Discuss Cloud Solutions'
    },
    {
        'name': 'APIDevelopment',
        'slug': 'api-development',
        'title': 'API Development & Integration',
        'subtitle': 'Secure REST APIs, third-party system integrations, payment gateways, and custom webhooks for connected ecosystems.',
        'hero_image': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1920&auto=format&fit=crop',
        'service_type': 'API Development',
        'cta_text': 'Discuss API Integration'
    },
    {
        'name': 'BusinessAutomation',
        'slug': 'business-automation',
        'title': 'Business Workflow Automation',
        'subtitle': 'Eliminate manual processes with custom automated workflows, approval systems, and automated reporting.',
        'hero_image': 'https://images.unsplash.com/photo-1518932945647-7a3c96943e28?q=80&w=1920&auto=format&fit=crop',
        'service_type': 'Business Automation',
        'cta_text': 'Automate My Business'
    }
]

template = '''import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import SEOMeta from '../../components/ui/SEOMeta';
import ServiceInquiryForm from '../../components/forms/ServiceInquiryForm';

const __NAME__ = () => {
  return (
    <div className="bg-[#0c0f1a] min-h-screen pb-32 pt-20">
      <SEOMeta 
        title="__TITLE__ | Forge India Connect" 
        description="__SUBTITLE__" 
      />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="__HERO_IMAGE__" 
            className="w-full h-full object-cover opacity-30" 
            alt="__SERVICE_TYPE__" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f1a] via-[#0c0f1a]/80 to-transparent" />
        </div>
        
        <div className="container-xl px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-blue-400 font-black uppercase tracking-[0.3em] text-xs px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-full">
                __SERVICE_TYPE__
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight mb-6">
              __TITLE__
            </h1>
            
            <p className="text-xl text-gray-300 font-medium leading-relaxed mb-10 max-w-2xl">
              __SUBTITLE__
            </p>
            
            <div className="flex flex-wrap gap-4 mt-10">
              <a 
                href="#inquiry"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-blue-900/50 transition-all flex items-center gap-3 hover:gap-5"
              >
                __CTA_TEXT__ <ArrowRight size={18} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container-xl px-6 mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors"
            >
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6">
                    <CheckCircle2 size={24} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-black text-white mb-3">Expertise</h3>
                <p className="text-gray-400">Industry-leading methodologies applied to __SERVICE_TYPE__ to guarantee optimal results.</p>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors"
            >
                <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-6">
                    <ShieldCheck size={24} className="text-indigo-400" />
                </div>
                <h3 className="text-xl font-black text-white mb-3">Reliability</h3>
                <p className="text-gray-400">Robust, secure, and scalable solutions built for modern business demands.</p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors"
            >
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6">
                    <Zap size={24} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-black text-white mb-3">Performance</h3>
                <p className="text-gray-400">Fast, optimized, and high-performance delivery ensuring your competitive edge.</p>
            </motion.div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquiry" className="container-xl px-6 mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">
              Discuss Your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Requirements</span>
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-xl">
              Partner with Forge India Connect to drive your business forward with our specialized __SERVICE_TYPE__ services.
            </p>
            
            <div className="space-y-6">
              {[
                { title: 'Tailored Solutions', desc: 'Custom strategies designed for your specific needs.' },
                { title: 'Dedicated Support', desc: 'Expert team available to guide you through every step.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0 border border-blue-800/50">
                    <CheckCircle2 size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-[2rem] shadow-2xl"
          >
            <ServiceInquiryForm 
              serviceType="__SERVICE_TYPE__" 
              serviceSlug="__SLUG__"
              themeColor="blue" 
              title="__CTA_TEXT__"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default __NAME__;
'''

for page in pages_data:
    file_content = template
    file_content = file_content.replace('__NAME__', page['name'])
    file_content = file_content.replace('__TITLE__', page['title'])
    file_content = file_content.replace('__SUBTITLE__', page['subtitle'])
    file_content = file_content.replace('__HERO_IMAGE__', page['hero_image'])
    file_content = file_content.replace('__SERVICE_TYPE__', page['service_type'])
    file_content = file_content.replace('__CTA_TEXT__', page['cta_text'])
    file_content = file_content.replace('__SLUG__', page['slug'])
    
    file_path = os.path.join(base_path, f"{page['name']}.jsx")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(file_content)

print(f"Created {len(pages_data)} solution pages.")
