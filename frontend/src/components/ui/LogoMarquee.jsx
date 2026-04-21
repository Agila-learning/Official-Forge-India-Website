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

    // Faster and smoother marquee
    const totalWidth = marquee.scrollWidth;
    
    gsap.set(marquee, { x: 0 });
    gsap.to(marquee, {
      x: -totalWidth / 2,
      duration: 25, // Slightly faster
      ease: 'none',
      repeat: -1,
    });
  }, [logos]);

  return (
    <div className="py-12 bg-white dark:bg-dark-bg overflow-hidden border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
        <h3 className="text-xs font-black uppercase tracking-[0.8em] text-primary/60 mb-2">Strategic Partners</h3>
        <h2 className="text-3xl font-black uppercase tracking-tighter">TRUSTED BY GLOBAL <span className="text-primary italic">GIANTS</span></h2>
      </div>
      
      {/* Background Cinematic Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bg-circle absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full"></div>
        <div className="bg-circle absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>
      
      <div className="relative w-full overflow-hidden flex hover:opacity-100 transition-all duration-700">
        <div ref={marqueeRef} className="flex whitespace-nowrap items-center">
          {/* Double the array for seamless infinity loop */}
          {[...logos, ...logos].map((logo, index) => (
            <div key={index} className="flex items-center justify-center mx-24 md:mx-32 hover:scale-125 transition-transform duration-500 group shrink-0">
              <img 
                src={logo.url} 
                alt={logo.name} 
                className="h-24 md:h-32 w-auto object-contain drop-shadow-2xl" 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoMarquee;
