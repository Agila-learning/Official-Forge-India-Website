import React from 'react';
import CareerLandingTemplate from '../components/templates/CareerLandingTemplate';
import { Target, CheckCircle2, TrendingUp, Network } from 'lucide-react';

const PrivateBankOpportunities = () => {
  const pageData = {
    seo: {
      title: "Private Bank Career Opportunities | Forge India Connect",
      description: "Discover career opportunities across the private banking and BFSI sector. Understand the roles, eligibility, and skills employers look for.",
      keywords: "private bank opportunities, private bank jobs, private bank jobs for freshers, private banking careers, banking jobs in Tamil Nadu, BFSI career opportunities, banking career opportunities",
      canonical: "https://www.forgeindiaconnect.com/private-bank-opportunities"
    },
    breadcrumb: "Private Bank Opportunities",
    hero: {
      title: "Private Bank Career Opportunities",
      subtitle: "Discover career opportunities across the private banking and BFSI sector and understand the roles, eligibility, and skills employers look for.",
      image: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=2000&auto=format&fit=crop",
      imageAlt: "private banking career opportunities"
    },
    intro: {
      title: "Careers in Private Banking",
      content: "Private banking is a highly specialized sector within the BFSI industry focused on providing personalized financial services to retail, corporate, and high-net-worth clients. These institutions are constantly on the lookout for dynamic individuals who can drive growth and manage customer relationships effectively."
    },
    sections: [
      {
        icon: TrendingUp,
        title: "Opportunities for Every Stage",
        content: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h4 className="font-bold mb-2 text-primary">Fresher Opportunities</h4>
              <p className="text-sm">Kickstart your career in roles like Customer Service Officer, Junior Analyst, or Sales Trainee. Comprehensive training is usually provided by the hiring bank to help you understand their specific financial products.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h4 className="font-bold mb-2 text-primary">Experienced Professionals</h4>
              <p className="text-sm">Leverage your existing sales, operations, or finance experience into roles like Senior Relationship Manager, Branch Manager, or Wealth Advisor. The focus here is on portfolio management and driving strategic revenue.</p>
            </div>
          </div>
        )
      },
      {
        icon: Target,
        title: "Essential Skills for Success",
        content: (
          <ul className="space-y-3">
            <li className="flex gap-3"><CheckCircle2 className="text-primary mt-1 shrink-0" size={18} /> <strong>Financial Literacy:</strong> Understanding of basic banking products, loans, and investment options.</li>
            <li className="flex gap-3"><CheckCircle2 className="text-primary mt-1 shrink-0" size={18} /> <strong>Interpersonal Skills:</strong> Ability to build and maintain trust with clients.</li>
            <li className="flex gap-3"><CheckCircle2 className="text-primary mt-1 shrink-0" size={18} /> <strong>Sales Drive:</strong> Motivation to meet targets and expand the bank's customer base.</li>
          </ul>
        )
      },
      {
        icon: Network,
        title: "Career Development & Candidate Guidance",
        content: (
          <p>Succeeding in a private banking interview requires preparation. We advise candidates to thoroughly research the specific bank, understand current financial market trends, and practice behavioral interview questions. FIC helps guide candidates through this preparation process before they apply via our partner portals.</p>
        )
      }
    ],
    faq: [
      {
        question: "Is there an age limit for private banking jobs?",
        answer: "Yes, many private banks have specific age criteria, especially for entry-level fresher roles (often capping at 26 or 28 years). However, this varies widely based on the bank and the specific role."
      },
      {
        question: "Do I need a finance degree to apply?",
        answer: "No. While a B.Com, BBA, or MBA is advantageous, many private banks welcome graduates from engineering, arts, and science backgrounds, provided they possess strong communication and sales skills."
      },
      {
        question: "What is the interview process like?",
        answer: "It typically involves an initial aptitude or psychometric test, followed by group discussions (GD), and one or two rounds of personal interviews focusing on HR and technical/sales acumen."
      }
    ],
    cta: {
      text: "View Current Opportunities",
      url: "https://jobs.forgeindiaconnect.in"
    }
  };

  return <CareerLandingTemplate {...pageData} />;
};

export default PrivateBankOpportunities;
