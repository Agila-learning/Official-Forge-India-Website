import React from 'react';
import CareerLandingTemplate from '../components/templates/CareerLandingTemplate';
import { Building2, Briefcase, GraduationCap, Users } from 'lucide-react';

const BankingJobs = () => {
  const pageData = {
    seo: {
      title: "Banking Jobs for Freshers & Graduates | Forge India Connect",
      description: "Explore banking jobs, private banking opportunities and BFSI career options for freshers and graduates with Forge India Connect.",
      keywords: "banking jobs, private bank jobs, private bank jobs for freshers, banking jobs for freshers, banking jobs in Tamil Nadu, private banking jobs in Tamil Nadu, banking career opportunities, BFSI jobs in Tamil Nadu, banking recruitment, bank jobs for graduates",
      canonical: "https://www.forgeindiaconnect.com/banking-jobs"
    },
    breadcrumb: "Banking Jobs",
    hero: {
      title: "Banking Jobs & Career Opportunities",
      subtitle: "Explore private banking career opportunities, eligibility requirements, job roles and career pathways with guidance from Forge India Connect.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2000&auto=format&fit=crop",
      imageAlt: "banking career opportunities for graduates"
    },
    intro: {
      title: "Launch Your Career in Banking & Finance",
      content: "The BFSI (Banking, Financial Services and Insurance) sector is one of the fastest-growing industries, offering diverse and rewarding career paths. Forge India Connect connects talented candidates with private banking opportunities, guiding you through the application and preparation process."
    },
    sections: [
      {
        icon: Briefcase,
        title: "Popular Banking Roles",
        content: (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="font-bold mb-1 text-primary">Relationship Manager</h4>
              <p className="text-sm">Manage high-value clients and their financial portfolios.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="font-bold mb-1 text-primary">Assistant Manager</h4>
              <p className="text-sm">Oversee branch operations and ensure seamless customer service.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="font-bold mb-1 text-primary">Sales & Business Development</h4>
              <p className="text-sm">Drive growth through strategic acquisition of new accounts.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="font-bold mb-1 text-primary">Customer Relationship</h4>
              <p className="text-sm">Assist retail customers with day-to-day banking needs.</p>
            </div>
          </div>
        )
      },
      {
        icon: GraduationCap,
        title: "Eligibility & Skills",
        content: (
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Education:</strong> Most roles require a minimum of a Bachelor's degree in any discipline. Specialized roles may require an MBA or relevant certifications.</li>
            <li><strong>Communication:</strong> Excellent verbal and written communication skills are essential for client-facing roles.</li>
            <li><strong>Analytical Skills:</strong> Ability to understand financial products and customer needs.</li>
            <li><strong>Sales Acumen:</strong> Strong persuasive skills for business development profiles.</li>
          </ul>
        )
      },
      {
        icon: Users,
        title: "How FIC Supports Candidates",
        content: (
          <p>We provide career guidance, profile assessment, and direct access to banking portals where you can apply for active roles. We help you understand what employers are looking for so you can prepare effectively.</p>
        )
      }
    ],
    faq: [
      {
        question: "Who can apply for banking jobs?",
        answer: "Graduates (any stream) and post-graduates meeting the age and criteria specified by the respective hiring bank. Some roles require prior sales or finance experience, while others are open to freshers."
      },
      {
        question: "Are banking jobs available for freshers?",
        answer: "Yes, many private banks have dedicated hiring programs for fresh graduates, primarily in customer service, retail banking, and entry-level sales roles."
      },
      {
        question: "What roles are available in private banking?",
        answer: "Common roles include Relationship Manager, Branch Operations Executive, Sales Officer, and Assistant Manager. Availability depends on the current hiring drives of our banking partners."
      },
      {
        question: "How can I apply?",
        answer: "Click the 'Explore Current Banking Jobs' button below to access our dedicated external banking portal where you can view and apply for active opportunities."
      }
    ],
    cta: {
      text: "Explore Current Banking Jobs",
      url: "https://jobs.forgeindiaconnect.in"
    }
  };

  return <CareerLandingTemplate {...pageData} />;
};

export default BankingJobs;
