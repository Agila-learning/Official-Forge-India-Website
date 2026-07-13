import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image, Building2, UserCircle, Star, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import api from '../../services/api';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const CompanyFeed = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const { data } = await api.get('/company-updates');
        setUpdates(data);
      } catch (error) {
        console.error("Failed to fetch company updates", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUpdates();
  }, []);

  if (loading || updates.length === 0) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  const getIcon = (type) => {
    switch(type) {
      case 'Company Photo': return <Building2 size={16} className="text-blue-500" />;
      case 'CEO Update': return <UserCircle size={16} className="text-indigo-500" />;
      case 'Celebration': return <Star size={16} className="text-yellow-500" />;
      default: return <Image size={16} className="text-gray-500" />;
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-dark-bg">
      <div className="container-xl px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <Building2 size={14} /> Official Feed
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">
            Inside <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Forge India</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Stay updated with our latest milestones, celebrations, and messages from our leadership team.
          </p>
        </div>

        <Slider {...settings} className="company-feed-slider -mx-4">
          {updates.map((update, idx) => (
            <div key={update._id} className="px-4 pb-12">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-dark-card border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all group flex flex-col h-[500px]"
              >
                <div className="p-5 flex items-center gap-4 border-b border-white/5">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0 border border-white/10">
                    <img src="/logo.png" alt="FIC Logo" className="w-8 h-8 object-contain opacity-80" onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                    <Building2 size={24} className="text-gray-400 hidden" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Forge India Connect</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {getIcon(update.type)}
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{update.type} • {new Date(update.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 flex-1 overflow-hidden">
                  <h5 className="font-black text-white text-lg mb-2 line-clamp-1">{update.title}</h5>
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{update.description}</p>
                </div>
                
                <div className="w-full h-56 bg-dark-bg relative overflow-hidden shrink-0 mt-auto">
                  <img src={update.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={update.title} />
                </div>
                
                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-gray-500 bg-black/20">
                   <button className="flex items-center gap-2 text-xs font-bold hover:text-blue-400 transition-colors">
                      <ThumbsUp size={16} /> Like
                   </button>
                   <button className="flex items-center gap-2 text-xs font-bold hover:text-blue-400 transition-colors">
                      <MessageSquare size={16} /> Comment
                   </button>
                   <button className="flex items-center gap-2 text-xs font-bold hover:text-blue-400 transition-colors">
                      <Share2 size={16} /> Share
                   </button>
                </div>
              </motion.div>
            </div>
          ))}
        </Slider>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .company-feed-slider .slick-dots li button:before { color: rgba(255,255,255,0.5); font-size: 10px; }
        .company-feed-slider .slick-dots li.slick-active button:before { color: #3b82f6; }
      `}} />
    </section>
  );
};

export default CompanyFeed;
