
import { Language } from './types';

export const ANIMALS = ['🦁', '🐯', '🐻', '🐨', '🐼', '🦊', '🐸', '🐙', '🦄', '🐲', '🐹', '🐰'];
export const AVATAR_COLORS = [
  'bg-red-200 text-red-700',
  'bg-orange-200 text-orange-700',
  'bg-amber-200 text-amber-700',
  'bg-green-200 text-green-700',
  'bg-emerald-200 text-emerald-700',
  'bg-teal-200 text-teal-700',
  'bg-cyan-200 text-cyan-700',
  'bg-sky-200 text-sky-700',
  'bg-blue-200 text-blue-700',
  'bg-indigo-200 text-indigo-700',
  'bg-violet-200 text-violet-700',
  'bg-purple-200 text-purple-700',
  'bg-fuchsia-200 text-fuchsia-700',
  'bg-pink-200 text-pink-700',
  'bg-rose-200 text-rose-700',
];

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    appTitle: 'PokerLedger',
    start: 'Start Game',
    players: 'Players',
    history: 'History',
    settings: 'Settings',
    newGame: 'New Game',
    continueGame: 'Continue Game',
    setup: {
      title: 'Game Setup',
      buyIn: 'Buy-in Amount',
      ratio: 'Chip Ratio (1 Chip = ? Cash)',
      selectPlayers: 'Select Players',
      createPlayer: 'New Player',
      recentConfigs: 'Recent Configs',
      startGame: 'Deal Cards',
    },
    game: {
      active: 'Active Game',
      totalPot: 'Total Buy-in',
      configInfo: 'Buy-in: {buyIn} | Ratio: {ratio}',
      addBuyIn: '+1 Buy-in',
      subBuyIn: '-1 Buy-in',
      customBuyIn: 'Custom +',
      buyOut: 'Cash Out',
      endGame: 'End & Settle',
      playing: 'Playing',
      cashedOut: 'Cashed Out',
      edit: 'Edit',
      hands: 'Hands',
      settleError: 'Please ensure all players have cashed out before settling.',
    },
    settlement: {
      title: 'Settlement',
      ledger: 'Ledger Balance',
      perfect: 'Perfect Balance',
      shortage: 'Shortage (Winners Share)',
      surplus: 'Surplus (Losers Share)',
      shareImage: 'Share Image',
      backToHome: 'Back to Home',
      net: 'Net',
      details: {
        raw: 'Raw',
        diff: 'Split',
        ratio: 'Ratio'
      }
    },
    player: {
      name: 'Name',
      add: 'Add Player',
      stats: 'Stats',
      lastGame: 'Last Game',
      thisMonth: 'This Month',
      allTime: 'All Time',
    },
    common: {
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
    }
  },
  zh: {
    appTitle: '德州账本',
    start: '开始游戏',
    players: '玩家管理',
    history: '历史记录',
    settings: '设置',
    newGame: '新牌局',
    continueGame: '继续牌局',
    setup: {
      title: '牌局设置',
      buyIn: '一手买入',
      ratio: '筹码比例 (1筹码 = ?元)',
      selectPlayers: '选择玩家',
      createPlayer: '新建玩家',
      recentConfigs: '常用配置',
      startGame: '开始牌局',
    },
    game: {
      active: '进行中',
      totalPot: '总买入',
      configInfo: '一手: {buyIn} | 比例: {ratio}',
      addBuyIn: '+1手',
      subBuyIn: '-1手',
      customBuyIn: '散入',
      buyOut: '离桌结算',
      endGame: '结束并清算',
      playing: '在桌',
      cashedOut: '已结算',
      edit: '修改',
      hands: '手',
      settleError: '请确保所有玩家都已Buyout（离桌结算）后再进行清算。',
    },
    settlement: {
      title: '最终清算',
      ledger: '账面平衡',
      perfect: '账目平',
      shortage: '差钱 (水上平摊)',
      surplus: '多钱 (水下分红)',
      shareImage: '生成长图分享',
      backToHome: '返回首页',
      net: '净胜',
      details: {
        raw: '原始',
        diff: '平摊',
        ratio: '比例'
      }
    },
    player: {
      name: '姓名',
      add: '添加玩家',
      stats: '数据',
      lastGame: '上次',
      thisMonth: '本月',
      allTime: '历史',
    },
    common: {
      cancel: '取消',
      confirm: '确认',
      save: '保存',
    }
  }
};