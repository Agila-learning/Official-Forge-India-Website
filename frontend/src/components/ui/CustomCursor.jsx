import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth springs for high-end trail
  const smoothX = useSpring(0, { stiffness: 250, damping: 20 });
  const smoothY = useSpring(0, { stiffness: 250, damping: 20 });

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      smoothX.set(e.clientX);
      smoothY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const isInteractive = e.target.tagName.toLowerCase() === 'button' || 
                            e.target.tagName.toLowerCase() === 'a' || 
                            e.target.closest('button') || 
                            e.target.closest('a');
      setIsHovered(isInteractive);
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [smoothX, smoothY]);

  return (
    <>
      {/* Outer Glow */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] bg-primary/20 blur-xl hidden md:block"
        style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: isHovered ? 2 : 1 }}
      />
      
      {/* Soft Trail */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999] bg-secondary/30 hidden md:block"
        animate={{ 
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isHovered ? 1.5 : 1
        }}
        transition={{ type: "spring", stiffness: 1000, damping: 50 }}
      />
      
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999] bg-primary hidden md:block"
        animate={{ 
          x: mousePosition.x - 3,
          y: mousePosition.y - 3,
        }}
      />
    </>
  );
};

export default CustomCursor;
