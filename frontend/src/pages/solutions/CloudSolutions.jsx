import React from 'react';
import { Cloud, Server, ShieldCheck, Zap } from 'lucide-react';
import ServicePageTemplate from '../../components/templates/ServicePageTemplate';

const CloudSolutions = () => (
  <ServicePageTemplate
    title="Cloud Infrastructure & Solutions"
    description="Scalable AWS and Azure cloud architecture, database management, auto-scaling, and zero-downtime migration services."
    tagline="Cloud Architecture Experts"
    heroTitle="Infrastructure That"
    heroHighlight="Never Sleeps"
    heroSubtitle="Scalable AWS and Azure cloud architecture, database management, auto-scaling, and zero-downtime migration services."
    heroImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop"
    accentFrom="from-blue-600"
    accentTo="to-sky-500"
    accentText="text-blue-400"
    accentBg="bg-blue-600/20"
    accentBorder="border-blue-500/30"
    stats={[{ value: "40", label: "Cloud Deployments", suffix: "+" }, { value: "99", label: "Uptime", suffix: "%" }, { value: "35", label: "Cost Savings", suffix: "%" }, { value: "24", label: "Monitoring", suffix: "x7" }]}
    servicesTitle="Cloud Solutions Services"
    services={[{ icon: Cloud, title: "AWS Architecture", desc: "EC2, S3, RDS, Lambda, and CloudFront for production workloads." }, { icon: Server, title: "Azure Deployment", desc: "Managed Kubernetes, App Services, and DevOps pipeline setup." }, { icon: ShieldCheck, title: "Cloud Migration", desc: "Zero-downtime lift-and-shift or full re-architecture to cloud-native." }, { icon: Zap, title: "Database Management", desc: "PostgreSQL, MongoDB, and Redis setup with backup and monitoring." }]}
    processTitle="Our Delivery Process"
    processSteps={[{ title: "Cloud Readiness", desc: "Evaluate existing infrastructure and migration complexity." }, { title: "Architecture Design", desc: "VPC, security groups, IAM roles, and cost optimization plan." }, { title: "Migration Execution", desc: "Phased migration with rollback plans and zero business disruption." }, { title: "Monitoring & Optimization", desc: "24/7 monitoring, alerts, and monthly cost reviews." }]}
    whyTitle="Why FIC for Cloud Solutions?"
    whyPoints={[{ title: "AWS & Azure Certified", desc: "Certified architects with hands-on enterprise project experience." }, { title: "Cost Optimization", desc: "Average 35% cloud cost reduction achieved for migrated clients." }, { title: "99.9% SLA", desc: "Enterprise-grade uptime with auto-scaling and failover built in." }]}
    serviceType="Cloud Solutions"
    serviceSlug="cloud-solutions"
    formTitle="Start Your Cloud Solutions Project"
    formBullets={['Free initial consultation', 'Detailed proposal within 48 hours', 'No long-term lock-in contracts']}
  />
);

export default CloudSolutions;
