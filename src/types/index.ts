
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
    vwap?: {
      value: number;
      deviation?: number;
    };
    supertrend?: {
      value: number;
      trend: 'UP' | 'DOWN';
      multiplier: number;
      period: number;
    };
    dmi?: {
      plusDI: number;
      minusDI: number;
      adx: number;
    };
    keltnerChannels?: {
      upper: number;
      middle: number;
      lower: number;
      bandwidth: number;
    };
    aroon?: {
      up: number;
      down: number;
      oscillator: number;
    };
    zigzag?: {
      value: number;
      trend: 'UP' | 'DOWN' | 'NEUTRAL';
      pivots: number[];
    };
    donchianChannels?: {
      upper: number;
      middle: number;
      lower: number;
      width: number;
    };
    fibonacciRetracement?: {
      level_0: number;
      level_0_236: number;
      level_0_382: number;
      level_0_5: number;
      level_0_618: number;
      level_0_764: number;
      level_1: number;
    };
    volumeProfile?: {
      poc: number;  // Point of Control
      valueArea: {
        high: number;
        low: number;
      };
      volumes: Record<number, number>;
    };
    cumulativeDeltaVolume?: {
      value: number;
      trendStrength: number;
    };
    forceIndex?: {
      value: number;
      ema: number;
    };
    moneyFlowIndex?: {
      value: number;
      threshold: {
        overbought: number;
        oversold: number;
      }
    };
    trix?: {
      value: number;
      signal: number;
      histogram: number;
    };
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
