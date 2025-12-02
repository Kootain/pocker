
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TRANSLATIONS, ANIMALS, AVATAR_COLORS } from './constants';
import { Player, GameConfig, GameSession, Language, Theme, SessionPlayer, SettlementResult } from './types';
import * as Storage from './services/storageService';
import { Icon } from './components/Icon';
import { Button } from './components/Button';
import { Modal } from './components/Modal';

// --- Sub-components ---

const PlayerAvatar = ({ player, size = 'md' }: { player: Player | undefined, size?: 'sm' | 'md' | 'lg' }) => {
  if (!player) return <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />;
  
  const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-12 h-12 text-xl', lg: 'w-20 h-20 text-4xl' };
  
  return (
    <div className={`${sizes[size]} shrink-0 rounded-full flex items-center justify-center shadow-inner ${player.avatarColor}`}>
      {player.avatar}
    </div>
  );
};

// --- Screens ---

const PlayerManager = ({ 
  players, 
  onAddPlayer, 
  onClose, 
  t, 
  sessions 
}: { 
  players: Player[], 
  onAddPlayer: (name: string) => void, 
  onClose: () => void, 
  t: any,
  sessions: GameSession[] 
}) => {
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleAdd = () => {
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <input 
          type="text" 
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          placeholder={t.player.name}
          className="flex-1 bg-gray-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-swiss-red dark:focus:ring-poker-orange outline-none"
        />
        <Button onClick={handleAdd} disabled={!newPlayerName.trim()}>
          <Icon name="Plus" size={20} />
        </Button>
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {players.map(p => {
          const stats = Storage.calculatePlayerStats(p.id, sessions);
          const isProfitable = stats.totalProfit >= 0;
          
          return (
            <div key={p.id} className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm">
              <PlayerAvatar player={p} />
              <div className="flex-1">
                <div className="font-bold text-gray-900 dark:text-white">{p.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex gap-3 mt-1">
                  <span>{t.player.lastGame}: <span className={stats.lastSessionProfit >= 0 ? 'text-green-500' : 'text-red-500'}>{stats.lastSessionProfit}</span></span>
                  <span>{t.player.allTime}: <span className={isProfitable ? 'text-green-500' : 'text-red-500'}>{stats.totalProfit}</span></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <Button variant="ghost" fullWidth onClick={onClose}>{t.settlement.backToHome}</Button>
    </div>
  );
};

const SetupScreen = ({ 
  players, 
  onStartGame, 
  onCreatePlayer, 
  t,
  configs
}: { 
  players: Player[], 
  onStartGame: (config: GameConfig, selectedPlayerIds: string[]) => void, 
  onCreatePlayer: (name: string) => void,
  t: any,
  configs: GameConfig[]
}) => {
  const [buyIn, setBuyIn] = useState<string>('500');
  const [ratio, setRatio] = useState<string>('1');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');

  const togglePlayer = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleStart = () => {
    const amt = parseInt(buyIn);
    const rat = parseFloat(ratio);
    if (amt > 0 && rat > 0 && selectedIds.size > 0) {
      onStartGame(
        { id: Date.now().toString(), buyInAmount: amt, chipRatio: rat, createdAt: Date.now() },
        Array.from(selectedIds)
      );
    }
  };

  const handleQuickAdd = () => {
    if (newPlayerName.trim()) {
      onCreatePlayer(newPlayerName.trim());
      setNewPlayerName('');
      setShowAddPlayer(false);
    }
  };
  
  const loadConfig = (c: GameConfig) => {
    setBuyIn(c.buyInAmount.toString());
    setRatio(c.chipRatio.toString());
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">{t.setup.buyIn}</label>
          <input 
            type="number" 
            value={buyIn} 
            onChange={(e) => setBuyIn(e.target.value)}
            className="w-full bg-white dark:bg-zinc-800 text-2xl font-bold p-4 rounded-2xl shadow-sm border-2 border-transparent focus:border-swiss-red dark:focus:border-poker-orange outline-none dark:text-white" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">{t.setup.ratio}</label>
          <input 
            type="number" 
            value={ratio} 
            onChange={(e) => setRatio(e.target.value)}
            className="w-full bg-white dark:bg-zinc-800 text-2xl font-bold p-4 rounded-2xl shadow-sm border-2 border-transparent focus:border-swiss-red dark:focus:border-poker-orange outline-none dark:text-white" 
          />
        </div>
      </div>

      {configs.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {configs.map(c => (
            <button 
              key={c.id} 
              onClick={() => loadConfig(c)}
              className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 rounded-lg text-xs whitespace-nowrap text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
            >
              Buy: {c.buyInAmount} / R: {c.chipRatio}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">{t.setup.selectPlayers} ({selectedIds.size})</label>
          <button onClick={() => setShowAddPlayer(true)} className="text-swiss-red dark:text-poker-orange text-sm font-bold flex items-center gap-1">
            <Icon name="Plus" size={16} /> {t.setup.createPlayer}
          </button>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {players.map(p => {
            const isSelected = selectedIds.has(p.id);
            return (
              <button 
                key={p.id}
                onClick={() => togglePlayer(p.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 border-2 ${isSelected ? 'border-swiss-red dark:border-poker-orange bg-swiss-red/5 dark:bg-poker-orange/10' : 'border-transparent bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700'}`}
              >
                <div className={`relative ${isSelected ? 'scale-110' : 'scale-100'} transition-transform`}>
                  <PlayerAvatar player={p} size="md" />
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 bg-swiss-red dark:bg-poker-orange text-white rounded-full p-0.5 shadow-sm">
                      <Icon name="Check" size={10} />
                    </div>
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium truncate w-full text-center ${isSelected ? 'text-swiss-red dark:text-poker-orange' : 'text-gray-700 dark:text-gray-300'}`}>
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Button onClick={handleStart} fullWidth size="lg" disabled={selectedIds.size < 2}>
        {t.setup.startGame}
      </Button>

      {/* Quick Add Player Modal */}
      <Modal isOpen={showAddPlayer} onClose={() => setShowAddPlayer(false)} title={t.setup.createPlayer}>
        <div className="space-y-4">
          <input 
            autoFocus
            type="text" 
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder={t.player.name}
            className="w-full bg-gray-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-swiss-red dark:focus:ring-poker-orange"
          />
          <div className="flex gap-3">
             <Button variant="ghost" fullWidth onClick={() => setShowAddPlayer(false)}>{t.common.cancel}</Button>
             <Button fullWidth onClick={handleQuickAdd}>{t.common.confirm}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const ActiveGameScreen = ({ 
  session, 
  players, 
  onUpdateSession, 
  onEndGame, 
  t 
}: { 
  session: GameSession, 
  players: Player[], 
  onUpdateSession: (s: GameSession) => void, 
  onEndGame: () => void,
  t: any 
}) => {
  const [editingPlayer, setEditingPlayer] = useState<SessionPlayer | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [mode, setMode] = useState<'buyIn' | 'buyOut'>('buyIn');

  const activePlayers = useMemo(() => {
    return session.players.map(sp => ({
      ...sp,
      details: players.find(p => p.id === sp.playerId)
    }));
  }, [session.players, players]);

  const totalPot = activePlayers.reduce((acc, p) => acc + (p.buyInCount * session.config.buyInAmount) + p.extraBuyIn, 0);

  const handleQuickBuyIn = (playerId: string, delta: number) => {
    const updatedPlayers = session.players.map(p => {
      if (p.playerId === playerId) {
        return { ...p, buyInCount: Math.max(0, p.buyInCount + delta) };
      }
      return p;
    });
    onUpdateSession({ ...session, players: updatedPlayers });
  };

  const openCustom = (p: SessionPlayer, m: 'buyIn' | 'buyOut') => {
    setEditingPlayer(p);
    setMode(m);
    setCustomAmount(m === 'buyOut' && p.cashOut !== null ? p.cashOut.toString() : '');
  };

  const saveCustom = () => {
    if (!editingPlayer) return;
    const amount = parseInt(customAmount) || 0;
    
    const updatedPlayers = session.players.map(p => {
      if (p.playerId === editingPlayer.playerId) {
        if (mode === 'buyIn') {
          return { ...p, extraBuyIn: p.extraBuyIn + amount };
        } else {
          return { ...p, cashOut: amount };
        }
      }
      return p;
    });

    onUpdateSession({ ...session, players: updatedPlayers });
    setEditingPlayer(null);
    setCustomAmount('');
  };

  const handleEndGameClick = () => {
    // Validation: All players must be cashed out
    const unfinished = activePlayers.some(p => p.cashOut === null);
    if (unfinished) {
      alert(t.game.settleError);
      return;
    }
    onEndGame();
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-10 py-4 -mx-4 px-4 border-b border-gray-200 dark:border-zinc-800 shadow-sm flex justify-between items-center">
        <div>
           <div className="text-xs uppercase text-gray-500 font-bold">{t.game.totalPot}</div>
           <div className="text-3xl font-black text-gray-900 dark:text-white font-mono">{totalPot.toLocaleString()}</div>
           <div className="text-[10px] text-gray-400 font-medium tracking-wide">
             {t.game.configInfo.replace('{buyIn}', session.config.buyInAmount).replace('{ratio}', session.config.chipRatio)}
           </div>
        </div>
        <button 
          onClick={handleEndGameClick}
          className="bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition-all font-bold px-4 py-2 rounded-xl text-sm shadow-lg shadow-indigo-600/20"
        >
          {t.game.endGame}
        </button>
      </div>

      <div className="space-y-4">
        {activePlayers.map((p) => {
          const invested = (p.buyInCount * session.config.buyInAmount) + p.extraBuyIn;
          const isCashedOut = p.cashOut !== null;
          
          return (
            <div key={p.playerId} className={`relative group p-4 rounded-2xl transition-all ${isCashedOut ? 'bg-gray-100 dark:bg-zinc-900 opacity-60' : 'bg-white dark:bg-zinc-800 shadow-lg shadow-gray-200/50 dark:shadow-black/50'}`}>
              <div className="flex items-center gap-4 mb-4">
                <PlayerAvatar player={p.details} />
                <div className="flex-1">
                  <div className="font-bold text-lg dark:text-white">{p.details?.name}</div>
                  <div className="text-xs font-mono text-gray-500">
                     {/* Show Hands Count and Total Chip Value */}
                     IN: {p.buyInCount} {t.game.hands} ({invested}) {p.extraBuyIn > 0 && `+ ${p.extraBuyIn}`}
                     {isCashedOut && <span className="text-green-600 font-bold"> | OUT: {p.cashOut}</span>}
                  </div>
                </div>
                {isCashedOut ? (
                  <Button size="sm" variant="outline" onClick={() => openCustom(p, 'buyOut')}>{t.game.edit}</Button>
                ) : (
                  <Button size="sm" variant="secondary" onClick={() => openCustom(p, 'buyOut')}>{t.game.buyOut}</Button>
                )}
              </div>

              {!isCashedOut && (
                <div className="flex gap-2">
                   <button 
                    onClick={() => handleQuickBuyIn(p.playerId, -1)}
                    disabled={p.buyInCount === 0}
                    className="flex-1 h-10 rounded-lg bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 font-bold disabled:opacity-30"
                   >
                     {t.game.subBuyIn}
                   </button>
                   <button 
                    onClick={() => handleQuickBuyIn(p.playerId, 1)}
                    className="flex-2 w-1/3 h-10 rounded-lg bg-swiss-red/10 dark:bg-poker-orange/10 text-swiss-red dark:text-poker-orange font-bold border border-swiss-red/20 dark:border-poker-orange/20"
                   >
                     {t.game.addBuyIn}
                   </button>
                   <button 
                    onClick={() => openCustom(p, 'buyIn')}
                    className="flex-1 h-10 rounded-lg bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 font-bold text-xs"
                   >
                     {t.game.customBuyIn}
                   </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal isOpen={!!editingPlayer} onClose={() => setEditingPlayer(null)} title={mode === 'buyIn' ? t.game.customBuyIn : t.game.buyOut}>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
             {mode === 'buyIn' ? 'Add extra chips (non-standard amount)' : 'Enter total chip value at end of game'}
          </p>
          <input 
            autoFocus
            type="number" 
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="w-full bg-gray-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-2xl font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-swiss-red dark:focus:ring-poker-orange text-center"
          />
          <div className="flex gap-3">
             <Button variant="ghost" fullWidth onClick={() => setEditingPlayer(null)}>{t.common.cancel}</Button>
             <Button fullWidth onClick={saveCustom}>{t.common.confirm}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const SettlementScreen = ({ 
  session, 
  players, 
  onClose, 
  t 
}: { 
  session: GameSession, 
  players: Player[], 
  onClose: () => void, 
  t: any 
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const settlement = useMemo(() => {
    let totalBuyIn = 0;
    let totalCashOut = 0;
    const results: SettlementResult[] = [];

    session.players.forEach(p => {
      const invested = (p.buyInCount * session.config.buyInAmount) + p.extraBuyIn;
      const out = p.cashOut || 0;
      totalBuyIn += invested;
      totalCashOut += out;
      results.push({
        playerId: p.playerId,
        playerName: players.find(pl => pl.id === p.playerId)?.name || 'Unknown',
        totalBuyIn: invested,
        cashOut: out,
        rawProfit: out - invested,
        adjustedProfit: 0,
        adjustment: 0,
        shareRatio: 0
      });
    });

    const discrepancy = totalCashOut - totalBuyIn;

    const winners = results.filter(r => r.rawProfit > 0);
    const losers = results.filter(r => r.rawProfit < 0);
    
    // Initial
    results.forEach(r => r.adjustedProfit = r.rawProfit);

    if (Math.abs(discrepancy) > 0.01) {
      if (discrepancy > 0) {
        // Shortage (差钱): CashOut > BuyIn. Winners share the burden.
        const totalWinnings = winners.reduce((sum, w) => sum + w.rawProfit, 0);
        if (totalWinnings > 0) {
          winners.forEach(w => {
            const ratio = w.rawProfit / totalWinnings;
            const share = Math.abs(discrepancy) * ratio;
            w.adjustment = -share; 
            w.adjustedProfit = w.rawProfit - share;
            w.shareRatio = ratio;
          });
        }
      } else {
        // Surplus (多钱): CashOut < BuyIn. Losers share the refund.
        const totalLosses = losers.reduce((sum, l) => sum + Math.abs(l.rawProfit), 0);
        if (totalLosses > 0) {
          losers.forEach(l => {
             const ratio = Math.abs(l.rawProfit) / totalLosses;
             const share = Math.abs(discrepancy) * ratio;
             l.adjustment = share; 
             l.adjustedProfit = l.rawProfit + share; 
             l.shareRatio = ratio;
          });
        }
      }
    }
    
    results.sort((a, b) => b.adjustedProfit - a.adjustedProfit);

    return { totalBuyIn, totalCashOut, discrepancy, results };
  }, [session, players]);

  const handleShare = async () => {
    if (!contentRef.current) return;
    try {
      // Use html2canvas to create image
      const canvas = await (window as any).html2canvas(contentRef.current, {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#1E1E1E' : '#F5F5F5',
        scale: 2
      });
      
      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) return;
        const file = new File([blob], "poker_settlement.png", { type: "image/png" });
        
        // Try native share
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
             await navigator.share({
               files: [file],
               title: 'Poker Settlement',
               text: 'Check out the game results!'
             });
          } catch (err) {
            console.error('Share failed', err);
          }
        } else {
          // Fallback: Show image in new tab or modal (Simplest: Download)
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'poker_settlement.png';
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (e) {
      console.error("Screenshot failed", e);
    }
  };

  return (
    <div className="space-y-6">
      <div ref={contentRef} className="bg-white dark:bg-poker-darkgray p-4 rounded-xl space-y-6">
        {/* Header Summary */}
        <div className={`p-6 rounded-2xl ${Math.abs(settlement.discrepancy) < 1 ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400'}`}>
          <div className="flex justify-between items-center mb-2">
             <span className="font-bold uppercase tracking-wider text-xs">{t.settlement.ledger}</span>
             <Icon name={Math.abs(settlement.discrepancy) < 1 ? "CheckCircle" : "AlertTriangle"} size={20} />
          </div>
          <div className="text-3xl font-black font-mono">
            {Math.abs(settlement.discrepancy) < 1 ? t.settlement.perfect : (settlement.discrepancy > 0 ? `+${settlement.discrepancy}` : settlement.discrepancy)}
          </div>
          <div className="text-sm opacity-80 mt-1">
            {Math.abs(settlement.discrepancy) < 1 ? 'All chips accounted for.' : (settlement.discrepancy > 0 ? t.settlement.shortage : t.settlement.surplus)}
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {settlement.results.map((r) => {
            const hasAdjustment = Math.abs(r.adjustment || 0) > 0.01;
            const playerDetails = players.find(p => p.id === r.playerId);

            return (
              <div key={r.playerId} className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-sm">
                 <div className="flex items-center gap-3">
                   <PlayerAvatar player={playerDetails} size="sm" />
                   <span className="font-bold text-gray-900 dark:text-white">{r.playerName}</span>
                 </div>
                 <div className="text-right">
                    {/* Primary Amount: Always show the final adjusted profit clearly */}
                    <div className={`text-xl font-black font-mono ${r.adjustedProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {r.adjustedProfit > 0 ? '+' : ''}{Math.round(r.adjustedProfit)}
                    </div>
                    
                    {/* Adjustment Details: Only if adjusted */}
                    {hasAdjustment && (
                      <div className="flex flex-col items-end text-[10px] text-gray-500 font-mono mt-1 opacity-80">
                         <div className="flex gap-2">
                            <span>{t.settlement.details.raw}: {Math.round(r.rawProfit)}</span>
                            <span>|</span>
                            <span>{t.settlement.details.diff}: {r.adjustment! > 0 ? '+' : ''}{Math.round(r.adjustment!)}</span>
                            <span>|</span>
                            <span>{t.settlement.details.ratio}: {Math.round((r.shareRatio || 0) * 100)}%</span>
                         </div>
                      </div>
                    )}
                 </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="pt-4 space-y-3">
        <Button variant="primary" fullWidth onClick={handleShare}>
           <Icon name="Share2" className="mr-2" size={18} /> {t.settlement.shareImage}
        </Button>
        <Button variant="ghost" fullWidth onClick={onClose}>
           {t.settlement.backToHome}
        </Button>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [lang, setLang] = useState<Language>('zh');
  const [players, setPlayers] = useState<Player[]>([]);
  const [configs, setConfigs] = useState<GameConfig[]>([]);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  
  const [view, setView] = useState<'home' | 'game' | 'settlement' | 'players'>('home');
  const [activeSession, setActiveSession] = useState<GameSession | null>(null);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    // Load initial data
    setPlayers(Storage.getPlayers());
    setConfigs(Storage.getConfigs());
    setSessions(Storage.getSessions());

    // Check for active session
    const allSessions = Storage.getSessions();
    const current = allSessions.find(s => s.isActive);
    if (current) {
      setActiveSession(current);
      setView('game');
    }
  }, []);

  useEffect(() => {
    // Theme toggle
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleCreatePlayer = (name: string) => {
    const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const newPlayer: Player = {
      id: Date.now().toString() + Math.random().toString().slice(2, 5),
      name,
      avatar: randomAnimal,
      avatarColor: randomColor,
      createdAt: Date.now()
    };
    Storage.savePlayer(newPlayer);
    setPlayers(Storage.getPlayers());
  };

  const handleStartGame = (config: GameConfig, playerIds: string[]) => {
    Storage.saveConfig(config);
    setConfigs(Storage.getConfigs());

    const session: GameSession = {
      id: Date.now().toString(),
      config,
      startTime: Date.now(),
      isActive: true,
      players: playerIds.map(pid => ({
        playerId: pid,
        buyInCount: 1,
        extraBuyIn: 0,
        cashOut: null,
        isSettled: false
      }))
    };
    
    Storage.saveSession(session);
    setSessions(Storage.getSessions());
    setActiveSession(session);
    setView('game');
  };

  const handleUpdateSession = (updatedSession: GameSession) => {
    Storage.saveSession(updatedSession);
    setActiveSession(updatedSession);
    setSessions(Storage.getSessions()); // refresh list
  };

  const handleEndGame = () => {
    if (!activeSession) return;
    
    const finalizedPlayers = activeSession.players.map(p => ({
      ...p,
      cashOut: p.cashOut === null ? 0 : p.cashOut
    }));

    const endedSession = {
      ...activeSession,
      endTime: Date.now(),
      isActive: false,
      players: finalizedPlayers
    };

    Storage.saveSession(endedSession);
    setActiveSession(endedSession);
    setSessions(Storage.getSessions());
    setView('settlement');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'light' ? 'bg-swiss-offwhite' : 'bg-poker-black'}`}>
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative shadow-2xl overflow-hidden bg-white dark:bg-poker-darkgray">
        
        {/* Header */}
        <header className="px-6 py-5 flex justify-between items-center z-20 bg-white/80 dark:bg-poker-darkgray/80 backdrop-blur-md sticky top-0">
          <h1 className="text-xl font-black tracking-tight text-swiss-red dark:text-poker-orange flex items-center gap-2">
            <Icon name="Spade" className="fill-current" /> {t.appTitle}
          </h1>
          <div className="flex gap-3">
             <button onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')} className="font-bold text-xs px-2 py-1 rounded bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400">
               {lang.toUpperCase()}
             </button>
             <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} className="p-1 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800">
               <Icon name={theme === 'light' ? 'Moon' : 'Sun'} size={20} />
             </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-6 py-4 overflow-y-auto">
          {view === 'home' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="grid grid-cols-2 gap-4 mt-4">
                 <button onClick={() => setView('players')} className="h-32 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform">
                    <Icon name="Users" size={32} className="text-gray-400" />
                    <span className="font-bold text-gray-700 dark:text-gray-300">{t.players}</span>
                 </button>
                 <div className="h-32 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-700 flex flex-col items-center justify-center gap-2 opacity-50">
                    <Icon name="History" size={32} className="text-gray-400" />
                    <span className="font-bold text-gray-700 dark:text-gray-300">{t.history}</span>
                 </div>
               </div>

               <div className="space-y-4">
                 <h2 className="text-2xl font-black text-gray-900 dark:text-white">{t.setup.title}</h2>
                 <SetupScreen 
                   players={players} 
                   configs={configs}
                   onStartGame={handleStartGame} 
                   onCreatePlayer={handleCreatePlayer}
                   t={t}
                 />
               </div>
            </div>
          )}

          {view === 'players' && (
            <PlayerManager 
              players={players} 
              onAddPlayer={handleCreatePlayer} 
              onClose={() => setView('home')} 
              t={t}
              sessions={sessions}
            />
          )}

          {view === 'game' && activeSession && (
            <ActiveGameScreen 
              session={activeSession}
              players={players}
              onUpdateSession={handleUpdateSession}
              onEndGame={handleEndGame}
              t={t}
            />
          )}

          {view === 'settlement' && activeSession && (
            <SettlementScreen 
              session={activeSession}
              players={players}
              onClose={() => { setActiveSession(null); setView('home'); }}
              t={t}
            />
          )}
        </main>
      </div>
    </div>
  );
}