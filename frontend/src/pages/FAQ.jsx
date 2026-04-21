import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How does the job consulting process work at FIC?',
    a: 'Our process has 5 steps: Registration → Document Verification → Profile Processing → Interview Support → Placement Confirmation. From the moment you register, our dedicated counsellors guide you through each stage. Standard processing takes 5–10 business days.',
  },
  {
    q: 'What sectors do you place candidates in?',
    a: 'We specialize in Banking & Finance (HDFC, ICICI, Axis, Kotak), Information Technology, BPO & Customer Service, Manufacturing, Automobile, and General Management roles. We have active hiring partnerships across Chennai, Krishnagiri, Bangalore, and beyond.',
  },
  {
    q: 'What is the registration fee for job consulting?',
    a: 'For our Premium Placement program, a one-time registration fee of ₹1,500 applies. This covers document verification, profile creation, resume building assistance, and guaranteed interview scheduling with our partner companies.',
  },
  {
    q: 'How can employers post jobs and hire through FIC?',
    a: 'Employers can contact us via the "Hire Through FIC" form or call directly. We offer end-to-end recruitment: job description crafting, candidate screening, background verification, and final shortlisting — typically delivering 3–5 interview-ready candidates within 48 hours.',
  },
  {
    q: 'Do you offer college placement programs?',
    a: 'Yes! FIC partners with degree colleges, polytechnics, and training institutes for bulk campus placement drives. We handle the entire process: pre-placement talks, aptitude sessions, mock interviews, and final placement coordination.',
  },
  {
    q: 'What digital services do you offer for businesses?',
    a: 'Our business services include Website & App Development, SEO & Digital Marketing, Social Media Management, Google Ads campaigns, Insurance Services, and Home Services booking platform. Contact us for a customized quote.',
  },
  {
    q: 'Is there a refund policy for the registration fee?',
    a: 'Yes. If we are unable to schedule a minimum of 3 interviews within 30 days of profile activation, you are eligible for a full refund. Our goal is your placement, and we stand behind that commitment.',
  },
  {
    q: 'How do I track my application status?',
    a: 'After registration, you will receive access to your Candidate Dashboard where you can track document verification status, interview schedules, and placement progress in real time.',
  },
];

const FAQItem = ({ faq, isOpen, onToggle }) => (
  <div className={`border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-lg shadow-primary/5' : ''}`}>
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors min-h-[44px]"
      aria-expanded={isOpen}
    >
      <span className={`font-bold text-sm sm:text-base leading-snug transition-colors ${isOpen ? 'text-primary' : 'text-slate-800 dark:text-slate-100'}`}>
        {faq.q}
      </span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.25 }}
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
      >
        <ChevronDown size={16} />
      </motion.div>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className="px-6 pb-6">
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
              {faq.a}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="section-padding bg-white dark:bg-dark-bg" id="faq" aria-label="Frequently Asked Questions">
      <div className="container-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div className="lg:sticky lg:top-32">
            <span className="section-eyebrow">FAQs</span>
            <h2 className="section-title">Everything you need to know</h2>
            <div className="section-divider !mx-0" />
            <p className="section-subtitle mt-4 mb-8">
              Can't find your answer? Contact our team directly — we typically respond within 2 business hours.
            </p>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
              <a
                href="https://wa.me/916369406416"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary gap-3"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp Us
              </a>
              <a href="/contact" className="btn-outline">
                Send a Message
              </a>
            </div>
          </div>

          {/* Right — FAQs */}
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
