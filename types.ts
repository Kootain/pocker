
export type Language = 'en' | 'zh';
export type Theme = 'light' | 'dark';

export interface Player {
  id: string;
  name: string;
  avatar: string; // Emoji char
  avatarColor: string; // Tailwind color class
  createdAt: number;
}

export interface PlayerStats {
  playerId: string;
  lastSessionProfit: number;
  currentMonthProfit: number;
  totalProfit: number;
  totalGames: number;
}

export interface GameConfig {
  id: string;
  buyInAmount: number; // e.g., 1000
  chipRatio: number; // e.g., 1:1 or 1:10
  blindLevel?: string;
  createdAt: number;
}

export interface SessionPlayer {
  playerId: string;
  buyInCount: number; // Number of full buy-ins
  extraBuyIn: number; // Partial buy-in amount
  cashOut: number | null; // Null means still playing
  isSettled: boolean;
}

export interface GameSession {
  id: string;
  config: GameConfig;
  startTime: number;
  endTime?: number;
  players: SessionPlayer[];
  isActive: boolean;
}

export interface SettlementResult {
  playerId: string;
  playerName: string;
  totalBuyIn: number;
  cashOut: number;
  rawProfit: number; // Purely CashOut - BuyIn
  adjustedProfit: number; // After rebalancing for discrepancies
  adjustment?: number; // The amount added/subtracted due to imbalance
  shareRatio?: number; // The percentage of the imbalance this player covered/received
}

export interface SettlementSummary {
  totalBuyIn: number;
  totalCashOut: number;
  discrepancy: number; // totalCashOut - totalBuyIn
  results: SettlementResult[];
}
