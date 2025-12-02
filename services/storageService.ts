import { GameConfig, GameSession, Player } from '../types';

const KEYS = {
  PLAYERS: 'poker_players',
  SESSIONS: 'poker_sessions',
  CONFIGS: 'poker_configs',
};

export const getPlayers = (): Player[] => {
  const data = localStorage.getItem(KEYS.PLAYERS);
  return data ? JSON.parse(data) : [];
};

export const savePlayer = (player: Player) => {
  const players = getPlayers();
  players.push(player);
  localStorage.setItem(KEYS.PLAYERS, JSON.stringify(players));
};

export const getConfigs = (): GameConfig[] => {
  const data = localStorage.getItem(KEYS.CONFIGS);
  return data ? JSON.parse(data) : [];
};

export const saveConfig = (config: GameConfig) => {
  const configs = getConfigs();
  // Avoid duplicates if exactly same
  const exists = configs.find(c => c.buyInAmount === config.buyInAmount && c.chipRatio === config.chipRatio);
  if (!exists) {
    // Keep only last 5
    const newConfigs = [config, ...configs].slice(0, 5);
    localStorage.setItem(KEYS.CONFIGS, JSON.stringify(newConfigs));
  }
};

export const getSessions = (): GameSession[] => {
  const data = localStorage.getItem(KEYS.SESSIONS);
  return data ? JSON.parse(data) : [];
};

export const saveSession = (session: GameSession) => {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.id === session.id);
  if (index >= 0) {
    sessions[index] = session;
  } else {
    sessions.push(session);
  }
  localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
};

export const calculatePlayerStats = (playerId: string, sessions: GameSession[]) => {
  let totalProfit = 0;
  let currentMonthProfit = 0;
  let lastSessionProfit = 0;
  let totalGames = 0;

  const now = new Date();
  const sortedSessions = [...sessions].sort((a, b) => (b.endTime || 0) - (a.endTime || 0));

  sortedSessions.forEach((session, idx) => {
    // Skip active sessions for stats usually, or include tentative. Let's only count closed ones.
    if (session.isActive) return;

    const pData = session.players.find(p => p.playerId === playerId);
    if (!pData || pData.cashOut === null) return;

    totalGames++;
    
    const invested = (pData.buyInCount * session.config.buyInAmount) + pData.extraBuyIn;
    const profit = pData.cashOut - invested;
    
    totalProfit += profit;

    const sDate = new Date(session.startTime);
    if (sDate.getMonth() === now.getMonth() && sDate.getFullYear() === now.getFullYear()) {
      currentMonthProfit += profit;
    }

    if (idx === 0) {
      lastSessionProfit = profit;
    }
  });

  return { totalProfit, currentMonthProfit, lastSessionProfit, totalGames };
};