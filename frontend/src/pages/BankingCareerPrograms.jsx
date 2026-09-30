import React from 'react';
import CareerLandingTemplate from '../components/templates/CareerLandingTemplate';
import { BookOpen, CheckCircle2, Route, Star } from 'lucide-react';

const BankingCareerPrograms = () => {
  const pageData = {
    seo: {
      title: "Banking Career Programs & Training | Forge India Connect",
      description: "Explore structured banking career programs designed to help graduates develop relevant skills and prepare for banking career opportunities.",
      keywords: "banking career programs, banking career program for freshers, banking training programs, banking career opportunities, BFSI career programs, banking jobs for graduates",
      canonical: "https://www.forgeindiaconnect.com/banking-career-programs"
    },
    breadcrumb: "Banking Career Programs",
    hero: {
      title: "Banking Career Programs",
      subtitle: "Explore structured banking career programs designed to help graduates understand banking roles, develop relevant skills, and prepare for career opportunities.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2000&auto=format&fit=crop",
      imageAlt: "banking career training and development program"
    },
    intro: {
      title: "About Banking Career Programs",
      content: "Transitioning from a university environment into the fast-paced BFSI sector requires specific skills. Our affiliated Banking Career Programs are intensive, structured pathways designed to bridge the gap between academic knowledge and industry requirements."
    },
    sections: [
      {
        icon: Route,
        title: "The Program Journey",
        content: (
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">1</div>
              <div>
                <h4 className="font-bold text-slate-900">Application & Assessment</h4>
                <p className="text-sm text-slate-600">Candidates undergo an initial screening process to assess basic aptitude and communication skills.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">2</div>
              <div>
                <h4 className="font-bold text-slate-900">Training and Preparation</h4>
                <p className="text-sm text-slate-600">Participants engage in targeted modules covering retail banking, financial products, compliance, and sales techniques.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">3</div>
              <div>
                <h4 className="font-bold text-slate-900">Skill Development</h4>
                <p className="text-sm text-slate-600">Focus on soft skills, corporate etiquette, and handling customer objections.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">4</div>
              <div>
                <h4 className="font-bold text-slate-900">Career Opportunities</h4>
                <p className="text-sm text-slate-600">Upon successful completion, candidates are guided toward interviews for roles matching their newly acquired skills.</p>
              </div>
            </div>
          </div>
        )
      },
      {
        icon: BookOpen,
        title: "Who Can Apply?",
        content: (
          <ul className="space-y-3">
            <li className="flex gap-3"><CheckCircle2 className="text-primary mt-1 shrink-0" size={18} /> Fresh graduates looking for a structured entry into the banking sector.</li>
            <li className="flex gap-3"><CheckCircle2 className="text-primary mt-1 shrink-0" size={18} /> Professionals from non-finance backgrounds wanting to switch to banking.</li>
            <li className="flex gap-3"><CheckCircle2 className="text-primary mt-1 shrink-0" size={18} /> Candidates who meet the age and educational criteria of the specific program they select.</li>
          </ul>
        )
      },
      {
        icon: Star,
        title: "Candidate Support",
        content: (
          <p>We believe in end-to-end support. FIC provides guidance during the application phase, helps you select the right program based on your career goals, and offers ongoing support as you navigate the training and placement process via our partners.</p>
        )
      }
    ],
    faq: [
      {
        question: "Do these programs guarantee a job?",
        answer: "No program can guarantee a job, as final selection depends on your interview performance and meeting the hiring bank's criteria. However, these programs significantly improve your readiness and provide structured interview opportunities."
      },
      {
        question: "Are these programs free?",
        answer: "Some programs may involve a training fee or a learn-and-earn model depending on the specific banking partner or training institution. Details will be provided on the external program application page."
      },
      {
        question: "What banking roles are covered?",
        answer: "Programs typically prepare candidates for frontline roles such as Relationship Manager, Sales Officer, and Customer Service Executive."
      }
    ],
    cta: {
      text: "Explore Banking Programs",
      url: "https://jobs.forgeindiaconnect.in"
    }
  };

  return <CareerLandingTemplate {...pageData} />;
};

export default BankingCareerPrograms;
