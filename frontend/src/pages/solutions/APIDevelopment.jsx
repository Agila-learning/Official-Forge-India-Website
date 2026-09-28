import React from 'react';
import { Code, Globe, Zap, ShieldCheck } from 'lucide-react';
import ServicePageTemplate from '../../components/templates/ServicePageTemplate';

const APIDevelopment = () => (
  <ServicePageTemplate
    title="API Development & Integration"
    description="Robust REST and GraphQL APIs, third-party integrations, payment gateways, and webhook systems for connected ecosystems."
    tagline="System Integration Experts"
    heroTitle="Connect Every"
    heroHighlight="System Seamlessly"
    heroSubtitle="Robust REST and GraphQL APIs, third-party integrations, payment gateways, and webhook systems for connected ecosystems."
    heroImage="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1920&auto=format&fit=crop"
    accentFrom="from-violet-600"
    accentTo="to-indigo-500"
    accentText="text-violet-400"
    accentBg="bg-violet-600/20"
    accentBorder="border-violet-500/30"
    stats={[{ value: "200", label: "APIs Built", suffix: "+" }, { value: "99", label: "Uptime", suffix: "%" }, { value: "100", label: "Ms Avg Response", suffix: "ms" }, { value: "50", label: "Integrations", suffix: "+" }]}
    servicesTitle="API Development Services"
    services={[{ icon: Code, title: "REST API Development", desc: "Versioned, documented APIs with authentication and rate limiting." }, { icon: Globe, title: "GraphQL APIs", desc: "Flexible data fetching with subscriptions for real-time applications." }, { icon: Zap, title: "Payment Integrations", desc: "Razorpay, Stripe, PayPal, and UPI gateway integration." }, { icon: ShieldCheck, title: "Third-Party Integrations", desc: "CRM, ERP, WhatsApp Business API, and marketing tool connections." }]}
    processTitle="Our Delivery Process"
    processSteps={[{ title: "Requirements Mapping", desc: "Document all systems, data flows, and integration touchpoints." }, { title: "API Design", desc: "OpenAPI spec, authentication strategy, and error handling." }, { title: "Development & Testing", desc: "TDD-driven API development with Postman collection documentation." }, { title: "Deployment & Monitoring", desc: "Swagger docs, API gateway, and uptime monitoring." }]}
    whyTitle="Why FIC for API Development?"
    whyPoints={[{ title: "Fully Documented", desc: "Every API delivered with interactive Swagger documentation." }, { title: "Security First", desc: "JWT, OAuth2, API key management, and rate limiting included." }, { title: "Webhook Expertise", desc: "Event-driven architectures with reliable retry and logging systems." }]}
    serviceType="API Development"
    serviceSlug="api-development"
    formTitle="Start Your API Development Project"
    formBullets={['Free initial consultation', 'Detailed proposal within 48 hours', 'No long-term lock-in contracts']}
  />
);

export default APIDevelopment;
