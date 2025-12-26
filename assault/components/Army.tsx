
import React, { useEffect, useState } from 'react';

interface ArmyProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  onFinish: () => void;
}

const Soldier: React.FC<{ delay: number; color: string; phase: string }> = ({ delay, color, phase }) => (
  <div 
    className={`absolute walking`} 
    style={{ 
      animationDelay: `${delay}s`,
      left: `${Math.random() * 60 - 30}px`,
      top: `${Math.random() * 40 - 20}px`
    }}
  >
    <div className="relative">
      {/* Head/Helmet */}
      <div className="w-4 h-4 bg-stone-300 border-2 border-black rounded-sm" />
      {/* Body */}
      <div className="w-6 h-6 border-2 border-black -mt-1" style={{ backgroundColor: color }} />
      {/* Sword/Weapon */}
      <div className={`absolute -right-2 top-2 w-1 h-6 bg-stone-400 border-l border-black transition-transform ${phase === 'ATTACKING' ? 'rotate-90 origin-top' : ''}`} />
    </div>
  </div>
);

const Army: React.FC<ArmyProps> = ({ startX, startY, endX, endY, color, onFinish }) => {
  const [pos, setPos] = useState({ x: startX, y: startY });
  const [phase, setPhase] = useState<'MOVING' | 'ATTACKING'>('MOVING');

  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth path
      const eased = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      const curX = startX + (endX - startX) * eased;
      const curY = startY + (endY - startY) * eased;

      setPos({ x: curX, y: curY });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setPhase('ATTACKING');
        setTimeout(onFinish, 1200);
      }
    };

    requestAnimationFrame(animate);
  }, [startX, startY, endX, endY, onFinish]);

  return (
    <div 
      className="fixed z-[100] pointer-events-none"
      style={{ 
        left: pos.x, 
        top: pos.y, 
        transform: `translate(-50%, -50%) ${endX < startX ? 'scaleX(-1)' : ''}` 
      }}
    >
      <div className="relative">
        {[...Array(8)].map((_, i) => (
          <Soldier key={i} delay={i * 0.1} color={color} phase={phase} />
        ))}

        {phase === 'ATTACKING' && (
          <div className="absolute inset-0 flex items-center justify-center">
             {[...Array(5)].map((_, i) => (
               <div 
                 key={i} 
                 className="particle absolute text-2xl"
                 style={{ 
                   left: Math.random() * 100 - 50, 
                   top: Math.random() * 100 - 50,
                   animationDelay: `${i * 0.1}s` 
                 }}
               >
                 💥
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Army;
