export type SignalType = 'LONG' | 'SHORT';
export type SignalStatus = 'ACTIVE' | 'CLOSED';
export type SubscriptionPlan = 'free' | 'premium';
export type UserRole = 'free' | 'admin';

// Расширим тип TimeFrame, чтобы включить "1w"
export type TimeFrame = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w';

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
  };
  psar?: {
    value: number;
    isReversal: boolean;
  };
  dmi?: {
    plus: number;
    minus: number;
  };
  aroon?: {
    up: number;
    down: number;
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
}
