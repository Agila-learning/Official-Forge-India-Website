import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import CTA from '../sections/CTA';

const ScrambleText = ({ text }) => {
  const [displayText, setDisplayText] = React.useState(text);
  const chars = "!<>-_\\/[]{}—=+*^?#________";
  
  React.useEffect(() => {
    let frame = 0;
    const queue = [];
    for (let i = 0; i < text.length; i++) {
      const from = "";
      const to = text[i];
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queue.push({ from, to, start, end, char: "" });
    }

    let raf;
    const update = () => {
      let output = "";
      let complete = 0;
      for (let i = 0, n = queue.length; i < n; i++) {
        let { from, to, start, end, char } = queue[i];
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = chars[Math.floor(Math.random() * chars.length)];
            queue[i].char = char;
          }
          output += `<span class="text-primary opacity-50">${char}</span>`;
        } else {
          output += from;
        }
      }
      setDisplayText(output);
      if (complete === queue.length) {
        cancelAnimationFrame(raf);
      } else {
        frame++;
        raf = requestAnimationFrame(update);
      }
    };
    update();
    return () => cancelAnimationFrame(raf);
  }, [text]);

  return <span dangerouslySetInnerHTML={{ __html: displayText }} />;
};

const ServiceLayout = ({ title, description, benefits, imageSrc, seoDesc, actions, process, trustPoints }) => {
  useEffect(() => {
    document.title = `${title} | Forge India Connect`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', seoDesc);
    window.scrollTo(0, 0);
  }, [title, seoDesc]);

  return (
    <div className="pt-20 bg-white dark:bg-dark-bg min-h-screen flex flex-col">
      {/* Hero Header */}
      <section className="relative py-32 md:py-48 mesh-gradient-bg overflow-hidden border-b border-gray-100 dark:border-gray-800 text-center">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-primary mb-6 tracking-tighter uppercase italic"
          >
            <ScrambleText text={title} />
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto font-medium"
          >
            {description}
          </motion.p>
        </div>
      </section>

      {/* Main Content with Trust Points */}
      <section className="py-24 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl font-black mb-8 italic uppercase tracking-tighter">Premium <span className="text-primary">Excellence.</span></h2>
              <ul className="space-y-6 mb-12">
                {benefits.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-lg font-bold text-gray-600 dark:text-gray-300">
                    <CheckCircle className="text-primary shrink-0" size={24} /> {item}
                  </li>
                ))}
              </ul>
              <div className="flex gap-4">{actions}</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full"></div>
              <img src={imageSrc} alt={title} className="relative z-10 w-full aspect-square object-cover rounded-[4rem] shadow-2xl border-8 border-white dark:border-gray-800" />
            </motion.div>
          </div>

          {/* New Trust Points Section */}
          {trustPoints && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
              {trustPoints.map((point, idx) => (
                <div key={idx} className="p-10 bg-gray-50 dark:bg-dark-card rounded-[3rem] border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-all group">
                   <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                      <point.icon size={28} />
                   </div>
                   <h4 className="text-xl font-black mb-2 uppercase tracking-tight">{point.title}</h4>
                   <p className="text-sm text-gray-500 font-medium leading-relaxed">{point.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* New Process Section */}
          {process && (
            <div className="py-24 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-3xl font-black mb-16 text-center italic uppercase tracking-tighter">Our Fulfillment <span className="text-primary">Protocol.</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {process.map((p, idx) => (
                        <div key={idx} className="relative">
                            <div className="text-6xl font-black opacity-5 mb-4 text-primary absolute -top-10 -left-4">{idx + 1}</div>
                            <h4 className="text-lg font-black mb-2 uppercase tracking-widest text-primary">{p.title}</h4>
                            <p className="text-xs text-gray-500 font-bold uppercase leading-relaxed tracking-wider">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
          )}
        </div>
      </section>

      <CTA />
    </div>
  );
};

export default ServiceLayout;
