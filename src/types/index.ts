export type SignalType = 'LONG' | 'SHORT';
export type SignalStatus = 'ACTIVE' | 'CLOSED';
export type SubscriptionPlan = 'free' | 'premium';
export type UserRole = 'free' | 'admin';

// Расширим тип TimeFrame, чтобы включить "1w"
export type TimeFrame = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w';
export type SignalStrength = 'WEAK' | 'MODERATE' | 'STRONG';

// Добавляем типы для работы с данными рынка и веб-сокетами
export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected';

export interface MarketData {
  symbol: string;
  lastPrice: number;
  priceChangePercent: number;
  volume: number;
  openInterest: number;
  openInterestChange: number;
}

export interface Signal {
  id: string;
  symbol: string;
  timeframe: TimeFrame;
  signalType: SignalType;
  entryPrice: number;
  takeProfit: number;
  stopLoss: number;
  leverage: number;
  indicators: Indicators;
  status: SignalStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  pnl?: number;
  // Дополнительные поля для работы с веб-сокетами
  timestamp?: number;
  strength?: SignalStrength;
  price?: number;
  openInterestChange?: number;
}

// Расширим интерфейс Indicators, чтобы включить новые индикаторы
export interface Indicators {
  rsi?: number;
  macd?: {
    value: number;
    signal: number;
    histogram: number;
  };
  bollingerBands?: {
    upper: number;
    middle: number;
    lower: number;
  };
  movingAverages?: {
    ema20: number;
    ema50: number;
    ema100: number;
    sma200: number;
  };
  stochastic?: {
    k: number;
    d: number;
  };
  adx?: number;
  obv?: number;
  atr?: number;
  cci?: number;
  mfi?: number;
  vwap?: number;
  pivot?: {
    r3: number;
    r2: number;
    r1: number;
    pp: number;
    s1: number;
    s2: number;
    s3: number;
  };
  ichimoku?: {
    tenkanSen: number;
    kijunSen: number;
    senkouSpanA: number;
    senkouSpanB: number;
    chikouSpan: number;
  };
  wpr?: number;
  supertrend?: {
    value: number;
    direction: 'up' | 'down';
    trend?: string; // Добавлено для совместимости с компонентами
  };
  psar?: {
    value: number;
    isReversal: boolean;
  };
  dmi?: {
    plus: number;
    minus: number;
    plusDI?: number; // Альтернативные имена для совместимости
    minusDI?: number; // Альтернативные имена для совместимости
  };
  aroon?: {
    up: number;
    down: number;
    oscillator?: number; // Добавлено для совместимости с компонентами
  };
  ao?: number;
  mom?: number;
  roc?: number;
  kst?: {
    value: number;
    signal: number;
  };
  trix?: {
    value: number;
    signal: number;
  };
  // Добавление новых индикаторов
  gatorOscillator?: {
    value: number;
  };
  elderRayIndex?: {
    bullPower: number;
    bearPower: number;
  };
  mfi_bill_williams?: {
    value: number;
    trend: string;
  };
  // Добавление каналов Келтнера
  keltnerChannels?: {
    upper: number;
    middle: number;
    lower: number;
  };
  // Добавление каналов Дончиана
  donchianChannels?: {
    upper: number;
    middle: number;
    lower: number;
  };
}
