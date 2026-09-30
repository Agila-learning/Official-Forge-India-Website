import React from 'react';
import CareerLandingTemplate from '../components/templates/CareerLandingTemplate';
import { Target, CheckCircle2, Zap, Award } from 'lucide-react';

const AIResumeBuilder = () => {
  const pageData = {
    seo: {
      title: "AI Resume Builder for Job Seekers | Forge India Connect",
      description: "Create an ATS-friendly, professional resume in minutes using our AI Resume Builder. Perfect for freshers and job seekers.",
      keywords: "AI resume builder, AI resume builder for freshers, resume builder for students, professional resume builder, ATS-friendly resume, resume builder for job seekers",
      canonical: "https://www.forgeindiaconnect.com/ai-resume-builder"
    },
    breadcrumb: "AI Resume Builder",
    hero: {
      title: "Build Your Professional AI Resume in Minutes",
      subtitle: "Craft an ATS-friendly, high-impact resume that stands out to recruiters using our advanced AI-driven resume builder.",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2000&auto=format&fit=crop",
      imageAlt: "AI resume builder for job seekers"
    },
    intro: {
      title: "What is an AI Resume Builder?",
      content: "An AI Resume Builder is a smart digital tool that assists you in writing, formatting, and optimizing your resume for job applications. It uses artificial intelligence to suggest impactful bullet points, identify missing skills, and ensure your resume format meets modern Applicant Tracking System (ATS) standards."
    },
    sections: [
      {
        icon: Target,
        title: "Why Create an ATS-Friendly Resume?",
        content: (
          <ul className="space-y-3">
            <li className="flex gap-3"><CheckCircle2 className="text-primary mt-1 shrink-0" size={18} /> Most large companies use ATS software to filter out resumes before a human ever reads them.</li>
            <li className="flex gap-3"><CheckCircle2 className="text-primary mt-1 shrink-0" size={18} /> ATS algorithms look for specific keywords and structures.</li>
            <li className="flex gap-3"><CheckCircle2 className="text-primary mt-1 shrink-0" size={18} /> Our AI builder ensures your format is readable by these systems, maximizing your chances of an interview.</li>
          </ul>
        )
      },
      {
        icon: Zap,
        title: "Key Features & Process",
        content: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="font-bold mb-2">1. Input Details</h4>
              <p className="text-sm">Enter your education, experience, and target job title.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="font-bold mb-2">2. AI Suggestions</h4>
              <p className="text-sm">AI generates professional bullet points and skill recommendations.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="font-bold mb-2">3. Auto-Formatting</h4>
              <p className="text-sm">Choose from ATS-optimized templates that look clean and professional.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="font-bold mb-2">4. Download</h4>
              <p className="text-sm">Export your polished resume in PDF format, ready to apply.</p>
            </div>
          </div>
        )
      },
      {
        icon: Award,
        title: "Who Can Use It?",
        content: (
          <p>Whether you are a college fresher looking for your first internship, or an experienced professional aiming for a leadership role, the AI Resume Builder adapts to your experience level and industry.</p>
        )
      }
    ],
    faq: [
      {
        question: "Is this resume builder suitable for freshers?",
        answer: "Absolutely. The AI is specifically trained to help freshers highlight their academic projects, internships, and soft skills effectively even without extensive work experience."
      },
      {
        question: "Will the generated resume pass ATS screening?",
        answer: "Yes, the templates and structures provided are designed specifically to be parsed accurately by standard Applicant Tracking Systems (ATS)."
      },
      {
        question: "How long does it take to build a resume?",
        answer: "With AI assistance, most users complete their professional resume in 10-15 minutes."
      }
    ],
    cta: {
      text: "Build Your Resume",
      url: "https://resume-ai-mocha-three.vercel.app/"
    }
  };

  return <CareerLandingTemplate {...pageData} />;
};

export default AIResumeBuilder;
