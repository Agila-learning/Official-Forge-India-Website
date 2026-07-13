import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Star, ShieldCheck } from 'lucide-react';

const achievements = [
  { id: '100_rides', title: '100 Rides Completed', icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { id: '5_star', title: '5-Star Captain', icon: Star, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'safe_driver', title: 'Safe Driver Badge', icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-500/10' }
];

const DriverAchievements = () => {
  const [unlocked, setUnlocked] = useState(null);

  useEffect(() => {
    // Simulate unlocking an achievement after 3 seconds for demonstration
    const timer = setTimeout(() => {
      setUnlocked(achievements[0]);
      triggerConfetti();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const triggerConfetti = () => {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl">
      <h2 className="text-xl font-black uppercase tracking-widest mb-6">Achievement Hall</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {achievements.map((ach) => {
          const isUnlocked = unlocked?.id === ach.id;
          const Icon = ach.icon;
          
          return (
            <motion.div 
              key={ach.id}
              className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-all ${isUnlocked ? `border-yellow-500 ${ach.bg}` : 'border-gray-100 dark:border-gray-800 grayscale opacity-50'}`}
              animate={isUnlocked ? { 
                rotateY: [0, 180, 360],
                scale: [1, 1.1, 1]
              } : {}}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isUnlocked ? ach.bg : 'bg-gray-200 dark:bg-gray-800'}`}>
                <Icon size={32} className={isUnlocked ? ach.color : 'text-gray-400'} />
              </div>
              <h3 className={`font-black text-sm uppercase tracking-widest ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                {ach.title}
              </h3>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DriverAchievements;
