
export type TimeFrame = '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d';

export type SignalType = 'LONG' | 'SHORT' | 'NEUTRAL';

export type SignalStrength = 'STRONG' | 'MODERATE' | 'WEAK';

export type UserRole = 'admin' | 'premium' | 'free';

export interface Signal {
  id: string;
  symbol: string;
  timestamp: number;
  signalType: SignalType;
  strength: SignalStrength;
  price: number;
  openInterestChange: number;
  timeframe: TimeFrame;
  indicators: {
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
    atr?: {
      value: number;
      average: number;
    };
    adx?: {
      value: number;
      plusDI: number;
      minusDI: number;
    };
    obv?: {
      current: number;
      previous: number;
    };
    ichimoku?: {
      tenkanSen: number;
      kijunSen: number;
      senkouSpanA: number;
      senkouSpanB: number;
      cloud: {
        top: number;
        bottom: number;
      }
    };
    wma?: {
      wma9: number;
      wma21: number;
    };
    psar?: {
      value: number;
      isReversal: boolean;
    };
    mfi?: number;
    cci?: number;
    williamsr?: number;
  };
}

export type MarketData = {
  symbol: string;
  lastPrice: number;
  priceChangePercent: number;
  volume: number;
  openInterest: number;
  openInterestChange: number;
}

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export type SubscriptionPlan = 'free' | 'premium';

export interface UserSubscription {
  plan: SubscriptionPlan;
  startDate: string;
  endDate: string;
  active: boolean;
}
