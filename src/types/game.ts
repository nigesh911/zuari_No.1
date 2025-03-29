export interface GameState {
  balance: number;
  betAmount: number;
  mineCount: number;
  gridSize: number;
  isPlaying: boolean;
  cashoutMultiplier: number;
  history: GameHistoryItem[];
}

export interface GameHistoryItem {
  id: number;
  betAmount: number;
  mineCount: number;
  result: 'win' | 'loss';
  profit: number;
  multiplier: number;
  tiles: number;
} 