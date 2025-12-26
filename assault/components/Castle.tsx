
import React from 'react';
import { Team } from '../types';
import { MAX_HP } from '../constants';

interface CastleProps {
  team: Team;
  isAttacked: boolean;
  isSelected: boolean;
  isTarget: boolean;
  onClick: () => void;
}

const Guard: React.FC<{ color: string; isVisible: boolean; position: string }> = ({ color, isVisible, position }) => (
  <div 
    className={`absolute z-30 transition-all duration-500 ${position}`}
    style={{ 
      opacity: isVisible ? 1 : 0, 
      transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0)',
      pointerEvents: 'none'
    }}
  >
    <div className="relative">
      {/* Helmet */}
      <div className="w-3 h-3 bg-stone-300 border-2 border-black rounded-sm mx-auto" />
      {/* Body */}
      <div className="w-5 h-5 border-2 border-black -mt-1 mx-auto" style={{ backgroundColor: color }} />
      {/* Spear */}
      <div className="absolute -right-1 top-0 w-1 h-6 bg-stone-400 border-l border-black" />
    </div>
  </div>
);

const Castle: React.FC<CastleProps> = ({ team, isAttacked, isSelected, isTarget, onClick }) => {
  const hp = team.hp;
  const isRubble = hp === 0;

  // HP Mapping:
  // 8, 7, 6, 5: Guards (4 to 1)
  // 4: Keep falls
  // 3: Right Tower falls
  // 2: Left Tower falls
  // 1: Gate Falls / Rubble starts
  
  const guardsVisible = [hp >= 8, hp >= 7, hp >= 6, hp >= 5];
  const showKeep = hp >= 4;
  const showR = hp >= 3;
  const showL = hp >= 2;
  const showGate = hp >= 1;

  const getTowerStyle = (isVisible: boolean) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px) scale(0.8)',
    transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  });

  return (
    <div 
      onClick={onClick}
      className={`relative cursor-pointer flex flex-col items-center group
        ${isSelected ? '-translate-y-8 scale-110' : 'hover:-translate-y-2'}
        transition-all duration-300
      `}
    >
      {/* Selection Arrow */}
      {isSelected && (
        <div className="absolute -top-16 animate-bounce text-yellow-400 text-3xl z-40">
          <i className="fa-solid fa-caret-down"></i>
        </div>
      )}

      {/* Team Header */}
      <div className="mb-6 z-20">
        <div 
          className="px-3 py-1 pixel-border text-[8px] text-white whitespace-nowrap"
          style={{ backgroundColor: team.color }}
        >
          {team.name}
        </div>
        <div className="w-1 h-4 bg-stone-900 mx-auto" />
      </div>

      {/* Modular Castle Structure */}
      <div className={`relative w-48 h-32 flex items-end justify-center ${isAttacked ? 'animate-bounce' : ''}`}>
        
        {/* Shadow */}
        <div className="absolute bottom-0 w-32 h-8 bg-black/20 rounded-full blur-md -z-10" />

        {isRubble ? (
          <div className="relative flex flex-col items-center gap-1 z-10">
             {/* White Flag of Surrender */}
             <div className="absolute -top-16 flex flex-col items-center animate-bounce">
                <div className="w-1 h-16 bg-stone-800" />
                <div className="absolute top-0 left-1 w-12 h-8 bg-white border-2 border-stone-300 origin-left animate-[wave_2s_ease-in-out_infinite]">
                   <div className="w-full h-full opacity-10 flex flex-col justify-around">
                      <div className="h-0.5 bg-black w-full" />
                      <div className="h-0.5 bg-black w-full" />
                   </div>
                </div>
             </div>
             <div className="text-4xl opacity-50">🌫️</div>
             <div className="w-16 h-4 bg-stone-600 pixel-border opacity-50" />
          </div>
        ) : (
          <div className="relative w-full h-full flex items-end justify-center">
            
            {/* Guards Layer */}
            {/* Guard on Left Turret */}
            <Guard color={team.color} isVisible={guardsVisible[0]} position="bottom-[112px] left-[32px]" />
            {/* Guard on Front Left Wall */}
            <Guard color={team.color} isVisible={guardsVisible[1]} position="bottom-[56px] left-[56px]" />
            {/* Guard on Front Right Wall */}
            <Guard color={team.color} isVisible={guardsVisible[2]} position="bottom-[56px] right-[56px]" />
            {/* Guard on Right Turret */}
            <Guard color={team.color} isVisible={guardsVisible[3]} position="bottom-[112px] right-[32px]" />

            {/* Main Keep (Back Center) */}
            <div 
              className="absolute bottom-12 w-20 h-20 bg-stone-500 pixel-border z-0 flex flex-col items-center"
              style={getTowerStyle(showKeep)}
            >
              <div className="absolute -top-4 w-full flex justify-between px-1">
                <div className="w-3 h-4 bg-stone-600 border-x-2 border-t-2 border-black" />
                <div className="w-3 h-4 bg-stone-600 border-x-2 border-t-2 border-black" />
                <div className="w-3 h-4 bg-stone-600 border-x-2 border-t-2 border-black" />
              </div>
              <div className="mt-4 w-4 h-6 bg-black/30 rounded-t-full" />
            </div>

            {/* Left Tower */}
            <div 
              className="absolute bottom-4 left-4 w-12 h-24 bg-stone-400 pixel-border z-10"
              style={getTowerStyle(showL)}
            >
              <div className="absolute -top-3 w-full flex justify-around">
                <div className="w-3 h-3 bg-stone-500 border-x-2 border-t-2 border-black" />
                <div className="w-3 h-3 bg-stone-500 border-x-2 border-t-2 border-black" />
              </div>
              <div className="mt-4 w-2 h-4 bg-black/40 mx-auto" />
            </div>

            {/* Right Tower */}
            <div 
              className="absolute bottom-4 right-4 w-12 h-24 bg-stone-400 pixel-border z-10"
              style={getTowerStyle(showR)}
            >
              <div className="absolute -top-3 w-full flex justify-around">
                <div className="w-3 h-3 bg-stone-500 border-x-2 border-t-2 border-black" />
                <div className="w-3 h-3 bg-stone-500 border-x-2 border-t-2 border-black" />
              </div>
              <div className="mt-4 w-2 h-4 bg-black/40 mx-auto" />
            </div>

            {/* Front Wall & Gate */}
            <div 
              className="absolute bottom-0 w-32 h-14 bg-stone-600 pixel-border z-20 flex justify-center items-end"
              style={getTowerStyle(showGate)}
            >
               <div className="w-12 h-10 bg-stone-800 border-x-4 border-t-4 border-black/50 rounded-t-md" />
            </div>
          </div>
        )}

        {/* Target Reticle */}
        {isTarget && (
          <div className="absolute inset-x-0 -bottom-4 flex justify-center">
            <div className="w-48 h-12 border-4 border-red-500 border-dashed animate-[spin_4s_linear_infinite] rounded-full opacity-50" />
          </div>
        )}
      </div>

      {/* HP Bar */}
      <div className="mt-8 w-32 bg-black/30 h-3 pixel-border flex p-0.5">
        {[...Array(MAX_HP)].map((_, i) => (
          <div 
            key={i}
            className={`flex-1 h-full mx-0.5 transition-all duration-300 ${i < hp ? 'bg-green-400' : 'bg-transparent'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Castle;
