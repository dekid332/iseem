export type GamePhase = 'menu' | 'ready' | 'playing' | 'ended' | 'leaderboard' | 'submit-score';

export interface GameState {
  phase: GamePhase;
  score: number;
  health: number;
  level: number;
  enemiesKilled: number;
  gameTime: number;
}

export interface LeaderboardEntry {
  id: number;
  username: string;
  walletAddress?: string;
  score: number;
  level: number;
  enemiesKilled: number;
  gameTime: number;
  createdAt: string;
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
