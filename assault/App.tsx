
import React, { useState, useRef } from 'react';
import { Team, BattleState, GameAction } from './types';
import { INITIAL_TEAMS, MAX_HP, TEAM_COLORS } from './constants';
import Castle from './components/Castle';
import Army from './components/Army';

const App: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [battleState, setBattleState] = useState<BattleState>({
    attackerId: null,
    targetId: null,
    action: 'IDLE',
    isAnimating: false,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const castleRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleUpdateTeam = (id: string, name: string) => {
    setTeams(prev => prev.map(t => t.id === id ? { ...t, name } : t));
  };

  const handleAddTeam = () => {
    if (teams.length >= 4) return;
    const newId = Date.now().toString();
    setTeams(prev => [
      ...prev,
      { id: newId, name: `Team ${prev.length + 1}`, hp: MAX_HP, color: TEAM_COLORS[prev.length] }
    ]);
  };

  const handleRemoveTeam = (id: string) => {
    if (teams.length <= 1) return;
    setTeams(prev => prev.filter(t => t.id !== id));
  };

  const selectAttacker = (id: string) => {
    if (battleState.isAnimating) return;
    setBattleState({ attackerId: id, targetId: null, action: 'IDLE', isAnimating: false });
  };

  const selectTarget = (id: string) => {
    if (battleState.isAnimating || !battleState.attackerId || id === battleState.attackerId) return;
    setBattleState(prev => ({ ...prev, targetId: id }));
  };

  const startAction = (action: GameAction) => {
    if (!battleState.attackerId || battleState.isAnimating) return;
    
    if (action === 'REPAIR') {
      setBattleState(prev => ({ ...prev, action: 'REPAIR', isAnimating: true }));
      setTimeout(() => {
        setTeams(prev => prev.map(t => t.id === battleState.attackerId ? { ...t, hp: Math.min(t.hp + 1, MAX_HP) } : t));
        setBattleState({ attackerId: null, targetId: null, action: 'IDLE', isAnimating: false });
      }, 1000);
    } else if (action === 'ATTACK' && battleState.targetId) {
      setBattleState(prev => ({ ...prev, action: 'ATTACK', isAnimating: true }));
    }
  };

  const onAttackFinished = () => {
    setTeams(prev => prev.map(t => t.id === battleState.targetId ? { ...t, hp: Math.max(t.hp - 1, 0) } : t));
    setBattleState({ attackerId: null, targetId: null, action: 'IDLE', isAnimating: false });
  };

  const getPos = (id: string | null) => {
    const el = id ? castleRefs.current[id] : null;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  const attackingTeamColor = teams.find(t => t.id === battleState.attackerId)?.color || '#fff';

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#87ceeb]">
      {/* Atmosphere Decor */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="cloud" style={{ top: '15%', left: '10%' }} />
        <div className="cloud" style={{ top: '30%', left: '45%', animationDelay: '-20s', opacity: 0.6 }} />
        <div className="cloud" style={{ top: '10%', left: '80%', animationDelay: '-40s' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-12 text-center pointer-events-none">
        <h1 className="text-4xl text-white drop-shadow-[6px_6px_0px_rgba(0,0,0,0.4)] tracking-wider">
          ASSAULT THE CASTLE!
        </h1>
      </div>

      {/* Main Battlefield */}
      <div className="flex-1 relative z-10 flex items-center justify-center">
        {/* The Terrain */}
        <div className="battlefield-floor" />
        
        {/* Castles Grid Layout */}
        <div className="grid grid-cols-2 gap-x-32 gap-y-16 p-8">
          {teams.map((team, idx) => (
            <div 
              key={team.id} 
              ref={el => { castleRefs.current[team.id] = el; }}
              className={`z-20 ${idx % 2 === 0 ? '-translate-y-4' : 'translate-y-4'}`}
            >
              <Castle 
                team={team}
                isSelected={battleState.attackerId === team.id}
                isTarget={battleState.targetId === team.id}
                isAttacked={battleState.isAnimating && battleState.targetId === team.id}
                onClick={() => {
                  if (!battleState.attackerId) selectAttacker(team.id);
                  else if (team.id !== battleState.attackerId) selectTarget(team.id);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Army Animation Layer */}
      {battleState.isAnimating && battleState.action === 'ATTACK' && (
        <Army 
          startX={getPos(battleState.attackerId).x}
          startY={getPos(battleState.attackerId).y}
          endX={getPos(battleState.targetId).x}
          endY={getPos(battleState.targetId).y}
          color={attackingTeamColor}
          onFinish={onAttackFinished}
        />
      )}

      {/* Controls Overlay */}
      <div className="bg-stone-900/95 border-t-8 border-stone-800 p-8 flex flex-col items-center gap-6 z-[100] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        {!battleState.attackerId ? (
          <div className="text-yellow-400 text-sm animate-pulse tracking-widest">
            {">> SELECT A VICTORIOUS TEAM <<"}
          </div>
        ) : (
          <div className="flex items-center gap-10 text-white">
            <div className="flex flex-col items-center">
              <span className="text-[10px] mb-3 uppercase opacity-50 tracking-tighter">Commanding</span>
              <div 
                className="px-6 py-3 pixel-border text-xs" 
                style={{ backgroundColor: teams.find(t=>t.id===battleState.attackerId)?.color }}
              >
                {teams.find(t=>t.id===battleState.attackerId)?.name}
              </div>
            </div>

            <div className="h-16 w-1 bg-stone-700 rounded-full" />

            <div className="flex gap-6">
              <button 
                onClick={() => startAction('REPAIR')}
                disabled={battleState.isAnimating}
                className="bg-green-600 hover:bg-green-500 pixel-border px-8 py-4 text-xs active:translate-y-1 transition-all disabled:opacity-50"
              >
                RESTORE WALLS
              </button>

              {battleState.targetId ? (
                <button 
                  onClick={() => startAction('ATTACK')}
                  disabled={battleState.isAnimating}
                  className="bg-red-600 hover:bg-red-500 pixel-border px-8 py-4 text-xs animate-pulse active:translate-y-1 transition-all disabled:opacity-50"
                >
                  STORM THE GATES!
                </button>
              ) : (
                <div className="bg-stone-800 pixel-border px-8 py-4 text-xs text-white/30 border-stone-700 italic">
                  Select Target...
                </div>
              )}

              <button 
                onClick={() => setBattleState({ attackerId: null, targetId: null, action: 'IDLE', isAnimating: false })}
                className="bg-stone-700 hover:bg-stone-600 pixel-border px-6 py-4 text-xs"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="absolute right-12 bottom-12 text-stone-500 hover:text-white transition-all transform hover:rotate-90"
        >
          <i className="fa-solid fa-gear text-3xl"></i>
        </button>
      </div>

      {/* Settings Modal (remains similar) */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[200] p-4 backdrop-blur-sm">
          <div className="bg-[#4a90e2] pixel-border p-10 max-w-lg w-full shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            <h2 className="text-white text-xl mb-10 text-center tracking-widest border-b-4 border-white/20 pb-4">WAR ROOM CONFIG</h2>
            
            <div className="space-y-6 mb-10">
              {teams.map(team => (
                <div key={team.id} className="flex gap-4 items-center">
                  <div className="w-6 h-6 pixel-border" style={{ backgroundColor: team.color }} />
                  <input 
                    type="text"
                    value={team.name}
                    onChange={(e) => handleUpdateTeam(team.id, e.target.value)}
                    className="flex-1 pixel-border bg-white p-3 text-sm focus:outline-none"
                  />
                  <button 
                    onClick={() => handleRemoveTeam(team.id)}
                    className="bg-red-600 pixel-border p-3 text-white hover:bg-red-500"
                  >
                    <i className="fa-solid fa-trash text-xs"></i>
                  </button>
                </div>
              ))}
              {teams.length < 4 && (
                <button 
                  onClick={handleAddTeam}
                  className="w-full bg-stone-800 text-white pixel-border py-3 text-xs hover:bg-stone-700 transition-colors"
                >
                  + RECRUIT NEW FACTION
                </button>
              )}
            </div>

            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="w-full bg-yellow-400 hover:bg-yellow-300 pixel-border py-5 text-sm active:translate-y-1 transition-all"
            >
              DEPLOY CHANGES
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
