import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GSAPReveal = ({ children, direction = 'up', delay = 0, duration = 0.8, distance = 50 }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    
    let vars = {
      opacity: 0,
      duration: duration,
      delay: delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    };

    switch (direction) {
      case 'up': vars.y = distance; break;
      case 'down': vars.y = -distance; break;
      case 'left': vars.x = distance; break;
      case 'right': vars.x = -distance; break;
      default: vars.y = distance;
    }

    gsap.from(el, vars);
  }, [direction, delay, duration, distance]);

  return <div ref={elementRef}>{children}</div>;
};

export default GSAPReveal;
