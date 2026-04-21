import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const BeforeAfterSlider = ({ before, after, labelBefore = "Before Service", labelAfter = "After Service" }) => {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef(null);

    const handleMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX || (e.touches && e.touches[0].clientX);
        const pos = ((x - rect.left) / rect.width) * 100;
        setSliderPos(Math.max(0, Math.min(100, pos)));
    };

    return (
        <div 
            ref={containerRef}
            className="relative w-full h-[400px] md:h-[600px] rounded-[3rem] overflow-hidden cursor-ew-resize select-none shadow-2xl border border-gray-100 dark:border-gray-800"
            onMouseMove={handleMove}
            onTouchMove={handleMove}
        >
            {/* After Image (Background) */}
            <div className="absolute inset-0">
                <img src={after} alt="After" className="w-full h-full object-cover" />
                <div className="absolute bottom-10 right-10 px-6 py-2 bg-black/40 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest">{labelAfter}</div>
            </div>

            {/* Before Image (Foreground with Clip Path) */}
            <div 
                className="absolute inset-0 z-10"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
                <img src={before} alt="Before" className="w-full h-full object-cover" />
                <div className="absolute bottom-10 left-10 px-6 py-2 bg-white/40 backdrop-blur-md rounded-full text-gray-900 text-[10px] font-black uppercase tracking-widest">{labelBefore}</div>
            </div>

            {/* Slider Handle */}
            <div 
                className="absolute top-0 bottom-0 z-20 w-[2px] bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)] flex items-center justify-center"
                style={{ left: `${sliderPos}%` }}
            >
                <div className="w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center group">
                    <div className="flex gap-1">
                        <div className="w-[2px] h-4 bg-gray-300 group-hover:scale-y-125 transition-transform" />
                        <div className="w-[2px] h-4 bg-gray-300 group-hover:scale-y-125 transition-transform" />
                    </div>
                </div>
            </div>
            
            {/* Overlays for better context */}
            <div className="absolute inset-0 pointer-events-none z-30">
                <div className="absolute top-10 left-1/2 -translate-x-1/2 px-8 py-4 bg-primary/20 backdrop-blur-xl border border-white/20 rounded-full">
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Drag to Compare Transformation</span>
                </div>
            </div>
        </div>
    );
};

export default BeforeAfterSlider;
