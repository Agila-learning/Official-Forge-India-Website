import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, Briefcase, X, ChevronUp } from 'lucide-react';

/**
 * GlobalCTABar
 * Floating WhatsApp button (desktop) + sticky bottom CTA strip (mobile)
 */
const GlobalCTABar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const WA_NUMBER = '919080005550'; // Replace with actual WhatsApp number
  const WA_MSG = encodeURIComponent('Hi! I found FIC online and would like to know more about your services.');

  return (
    <>
      {/* ── Desktop: WhatsApp FAB ── */}
      <div className="hidden md:flex fixed bottom-8 right-8 z-50 flex-col items-end gap-3">
        {/* WhatsApp & Call Actions */}

        {/* Expanded Action Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="flex flex-col gap-2 items-end"
            >
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 bg-green-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-green-500/30 hover:bg-green-600 transition-all whitespace-nowrap"
                aria-label="Chat on WhatsApp"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp Chat
              </a>
              <a
                href="tel:+919080005550"
                className="flex items-center gap-3 px-5 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/30 hover:bg-indigo-700 transition-all whitespace-nowrap"
                aria-label="Call FIC"
              >
                <Phone size={18} />
                Call Now
              </a>
              <a
                href="/jobs"
                className="flex items-center gap-3 px-5 py-3 bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-xl hover:bg-slate-700 transition-all whitespace-nowrap"
                aria-label="Apply for job"
              >
                <Briefcase size={18} />
                Apply for Job
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(e => !e)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
            isExpanded ? 'bg-slate-800 rotate-45' : 'bg-green-500 animate-pulse-ring'
          }`}
          aria-label="Contact options"
        >
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div key="close" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }}>
                <X size={24} className="text-white" />
              </motion.div>
            ) : (
              <motion.div key="wa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ── Mobile: Sticky Bottom Action Bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-dark-card border-t border-slate-100 dark:border-slate-800 shadow-2xl safe-area-bottom">
        <div className="grid grid-cols-4 divide-x divide-slate-100 dark:divide-slate-800">
          <a
            href="tel:+919080005550"
            className="flex flex-col items-center gap-1 py-3 px-2 text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors min-h-[56px]"
            aria-label="Call"
          >
            <Phone size={20} />
            <span className="text-[10px] font-bold">Call</span>
          </a>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 py-3 px-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors min-h-[56px]"
            aria-label="WhatsApp"
          >
            <MessageCircle size={20} />
            <span className="text-[10px] font-bold">WhatsApp</span>
          </a>
          <a
            href="/jobs"
            className="flex flex-col items-center gap-1 py-3 px-2 text-primary hover:bg-primary/5 transition-colors min-h-[56px]"
            aria-label="Apply"
          >
            <Briefcase size={20} />
            <span className="text-[10px] font-bold">Apply</span>
          </a>
          <a
            href="/register"
            className="flex flex-col items-center justify-center gap-1 py-3 px-2 bg-primary text-white hover:bg-indigo-700 transition-colors min-h-[56px]"
            aria-label="Register"
          >
            <span className="text-[11px] font-black uppercase tracking-wide leading-tight text-center">Register<br/>Free</span>
          </a>
        </div>
      </div>

      {/* Mobile bottom padding to avoid content hidden behind sticky bar */}
      <div className="md:hidden h-14 pointer-events-none" aria-hidden="true" />
    </>
  );
};

export default GlobalCTABar;
