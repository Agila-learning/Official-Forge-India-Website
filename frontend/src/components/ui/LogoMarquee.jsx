import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const logos = [
 { name: 'Ather', url: '/Clientele/ather.webp' },
 { name: 'AU', url: '/Clientele/au.webp' },
 { name: 'Axis', url: '/Clientele/axis.webp' },
 { name: 'Capgemini', url: '/Clientele/capgemeni.webp' },
 { name: 'CUB', url: '/Clientele/cub.webp' },
 { name: 'Delta', url: '/Clientele/delta.webp' },
 { name: 'Equitas', url: '/Clientele/equitas.webp' },
 { name: 'Foxconn', url: '/Clientele/foxconn.webp' },
 { name: 'HDFC', url: '/Clientele/hdfc.webp' },
 { name: 'Hyundai', url: '/Clientele/hyundai.webp' },
 { name: 'Kotak Mahindra', url: '/Clientele/kotak-mahindra.webp' },
 { name: 'Ma Foi', url: '/Clientele/mafoi.webp' },
 { name: 'Movate', url: '/Clientele/movate.webp' },
 { name: 'Muthoot', url: '/Clientele/muthoot.webp' },
 { name: 'Tata', url: '/Clientele/tata.webp' },
 { name: 'Tech Mahindra', url: '/Clientele/techmahindra.webp' },
 { name: 'TP', url: '/Clientele/tp.webp' },
 { name: 'UHG', url: '/Clientele/uhg.webp' },
 { name: 'Kochar', url: '/Clientele/kochar.webp' },
 { name: 'Polaris', url: '/Clientele/polaris.webp' },
];

const LogoMarquee = () => {
 const marqueeRef = useRef(null);

 useEffect(() => {
 const marquee = marqueeRef.current;
 if (!marquee) return;

 const totalWidth = marquee.scrollWidth;
 
 gsap.set(marquee, { x: 0 });
 gsap.to(marquee, {
 x: -totalWidth / 2,
 duration: 35,
 ease: 'none',
 repeat: -1,
 });
 }, [logos]);

 return (
 <div className="py-20 bg-dark-bg overflow-hidden relative border-y border-white/5">
 {/* Background Cinematic Elements */}
 <div className="absolute inset-0 overflow-hidden pointer-events-none">
 <div className="bg-circle absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full animate-mesh"></div>
 <div className="bg-circle absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-secondary/5 blur-[120px] rounded-full animate-mesh"></div>
 </div>

 <div className="max-w-7xl mx-auto px-6 mb-16 text-center relative z-10">
 <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 mb-4">Strategic Global Network</h3>
 <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
 TRUSTED BY <span className="text-primary">ENTERPRISE LEADERS</span>
 </h2>
 </div>
 
 <div className="relative w-full overflow-hidden flex mask-horizontal">
 <div ref={marqueeRef} className="flex whitespace-nowrap items-center py-4">
 {[...logos, ...logos].map((logo, index) => (
 <div key={index} className="flex items-center justify-center mx-16 md:mx-20 group shrink-0">
 <div className="glass-card p-8 md:p-12 hover:border-primary/40 transition-all duration-500 hover:scale-110">
 <img 
 src={logo.url} 
 alt={`${logo.name} Partner`} 
 loading="lazy"
 className="h-12 md:h-16 w-auto object-contain grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
 onError={(e) => { e.target.style.display = 'none'; }}
 />
 </div>
 </div>
 ))}
 </div>
 </div>

 <style dangerouslySetInnerHTML={{ __html: `
 .mask-horizontal {
 mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
 -webkit-mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
 }
 `}} />
 </div>
 );
};

export default LogoMarquee;
