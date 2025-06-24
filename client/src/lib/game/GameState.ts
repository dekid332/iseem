export type GamePhase = 'ready' | 'playing' | 'ended';

export interface GameState {
  phase: GamePhase;
  score: number;
  health: number;
  level: number;
  enemiesKilled: number;
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
}
