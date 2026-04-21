import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, Search } from 'lucide-react';
import api from '../services/api';
import CTA from '../components/sections/CTA';

const FAQItem = ({ faq, index, isOpen, toggleOpen }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-dark-card transition-all ${isOpen ? 'shadow-lg shadow-primary/5 border-primary/20' : 'hover:border-primary/30'}`}
    >
      <button 
        onClick={toggleOpen}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        {/* Index chip */}
        <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black mr-4 transition-colors ${isOpen ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className={`text-lg font-bold flex-1 pr-6 transition-colors ${isOpen ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
            {faq.question}
        </h3>
        <motion.div 
            animate={{ rotate: isOpen ? 180 : 0 }} 
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
        >
            <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data } = await api.get('/faqs');
        setFaqs(data);
      } catch (err) {
        console.error('Failed to fetch FAQs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-dark-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-8"
          >
             <MessageCircle size={40} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-gray-900 dark:text-white"
          >
            Frequently Asked <span className="animated-text-gradient">Questions</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Find comprehensive answers to the most common questions about Forge India Connect's placement services, technology solutions, and global partnerships.
          </motion.p>
        </div>

        {/* Live Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mb-10"
        >
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setOpenIndex(-1); }}
            className="w-full pl-14 pr-6 py-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 font-medium outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors text-sm font-bold"
            >
              Clear
            </button>
          )}
        </motion.div>

        {loading ? (
           <div className="flex justify-center items-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
           </div>
        ) : (
           <div className="space-y-4 mb-24">
             {filteredFaqs.length > 0 ? (
                 filteredFaqs.map((faq, index) => (
                   <FAQItem 
                     key={faq._id} 
                     faq={faq}
                     index={index}
                     isOpen={openIndex === index} 
                     toggleOpen={() => setOpenIndex(openIndex === index ? -1 : index)} 
                   />
                 ))
             ) : (
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="text-center py-12 bg-gray-50 dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800"
                 >
                    <Search size={36} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-bold text-lg">
                      {faqs.length === 0 ? 'No FAQs available at the moment.' : `No results for "${searchQuery}"`}
                    </p>
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="mt-4 text-primary font-bold text-sm hover:underline">
                        Clear search
                      </button>
                    )}
                 </motion.div>
             )}
           </div>
        )}
      </div>
      <CTA />
    </div>
  );
};

export default FAQ;
