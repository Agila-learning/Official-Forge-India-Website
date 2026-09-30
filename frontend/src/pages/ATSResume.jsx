import React from 'react';
import CareerLandingTemplate from '../components/templates/CareerLandingTemplate';
import { Target, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

const ATSResume = () => {
  const pageData = {
    seo: {
      title: "ATS-Friendly Resume Preparation | Forge India Connect",
      description: "Learn how to build an ATS-friendly resume to beat Applicant Tracking Systems. Essential resume tips and tools for freshers and professionals.",
      keywords: "ATS resume, ATS-friendly resume, ATS resume for freshers, ATS resume builder, resume for job applications, ATS resume tips",
      canonical: "https://www.forgeindiaconnect.com/ats-resume"
    },
    breadcrumb: "ATS Resume",
    hero: {
      title: "Beat the Bots with an ATS-Friendly Resume",
      subtitle: "Over 75% of resumes are rejected by Applicant Tracking Systems before a human ever sees them. Learn how to format and optimize your resume for success.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
      imageAlt: "ATS-friendly resume preparation for job seekers"
    },
    intro: {
      title: "What is an ATS Resume?",
      content: "An ATS (Applicant Tracking System) resume is formatted specifically to be easily read and parsed by the automated recruitment software used by top employers. These systems scan your resume for keywords, work history, and formatting to determine if you are a match for the job."
    },
    sections: [
      {
        icon: Target,
        title: "Why ATS Compatibility Matters",
        content: (
          <p>Without ATS compatibility, your resume's formatting could break when parsed, causing critical information like your contact details or skills to be missed. A compatible resume guarantees that the software reads every detail correctly, ranking you higher in the recruiter's dashboard.</p>
        )
      },
      {
        icon: AlertTriangle,
        title: "Common ATS Mistakes to Avoid",
        content: (
          <ul className="space-y-3">
            <li className="flex gap-3"><CheckCircle2 className="text-primary mt-1 shrink-0" size={18} /> Avoid using complex tables or multi-column layouts.</li>
            <li className="flex gap-3"><CheckCircle2 className="text-primary mt-1 shrink-0" size={18} /> Do not use graphics, charts, or images in your resume body.</li>
            <li className="flex gap-3"><CheckCircle2 className="text-primary mt-1 shrink-0" size={18} /> Stick to standard fonts (Arial, Calibri, Times New Roman).</li>
            <li className="flex gap-3"><CheckCircle2 className="text-primary mt-1 shrink-0" size={18} /> Save and upload your resume as a standard PDF or DOCX format.</li>
          </ul>
        )
      },
      {
        icon: FileText,
        title: "Resume Tips for Candidates",
        content: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h4 className="font-bold mb-3 text-lg">For Freshers</h4>
              <p className="text-sm">Focus on your education, academic projects, technical skills, and any internship experience. Use clear headings like "Education" and "Projects". Highlight relevant coursework.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h4 className="font-bold mb-3 text-lg">For Experienced Professionals</h4>
              <p className="text-sm">Use standard reverse-chronological format for your work history. Include measurable achievements and match the exact keywords from the job description in your experience bullet points.</p>
            </div>
          </div>
        )
      }
    ],
    faq: [
      {
        question: "What format should an ATS resume be?",
        answer: "Standard reverse-chronological format is best. Use standard, simple headings like 'Work Experience', 'Education', and 'Skills' rather than creative alternatives."
      },
      {
        question: "Can I use colors in my ATS resume?",
        answer: "Yes, subtle colors are fine, but the ATS primarily strips formatting to read raw text. Ensure your contrast is good and you aren't relying on color to convey important information."
      },
      {
        question: "Should I include my photo?",
        answer: "No. In most countries, including a photo can confuse the ATS and may cause your application to be rejected due to anti-discrimination hiring policies."
      }
    ],
    cta: {
      text: "Create ATS-Friendly Resume",
      url: "https://resume-ai-mocha-three.vercel.app/"
    }
  };

  return <CareerLandingTemplate {...pageData} />;
};

export default ATSResume;
