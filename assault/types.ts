
export interface Team {
  id: string;
  name: string;
  hp: number; // 0 to 8
  color: string;
}

export type GameAction = 'ATTACK' | 'REPAIR' | 'IDLE';

export interface BattleState {
  attackerId: string | null;
  targetId: string | null;
  action: GameAction;
  isAnimating: boolean;
}
