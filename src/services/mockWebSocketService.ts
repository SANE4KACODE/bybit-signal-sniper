
import { MarketData, Signal, SignalType, TimeFrame } from "@/types";
import { determineSignalStrength } from "@/utils/signals/determineSignalStrength";

// Расширенный список монет
const SYMBOLS = [
  // Основные монеты
  'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'AVAXUSDT',
  'ADAUSDT', 'DOTUSDT', 'MATICUSDT', 'LINKUSDT', 'LTCUSDT',
  // Дополнительные популярные монеты
  'XRPUSDT', 'DOGEUSDT', 'SHIBUSDT', 'TRXUSDT', 'UNIUSDT',
  'ATOMUSDT', 'ETCUSDT', 'FILUSDT', 'NEARUSDT', 'APTUSDT',
  // Дополнительно для премиум-пользователей
  'INJUSDT', 'AAVEUSDT', 'SNXUSDT', 'COMPUSDT', 'MKRUSDT',
  'SANDUSDT', 'MANAUSDT', 'AXSUSDT', 'GRTUSDT', 'CRVUSDT',
  'FTMUSDT', 'ONEUSDT', 'RUNEUSDT', 'LUNAUSDT', 'KAVAUSDT',
  'OPUSDT', 'ARBUSDT', 'SUIUSDT', 'GMTUSDT', 'IMXUSDT'
];

const TIMEFRAMES: TimeFrame[] = ['1m', '5m', '15m', '1h', '4h', '1d', '1w'];

// Generate random price within range
const randomPrice = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Generate random integer within range
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate random market data for a symbol
const generateMarketData = (symbol: string): MarketData => {
  const basePrice = symbol.startsWith('BTC') ? randomPrice(50000, 70000) :
                   symbol.startsWith('ETH') ? randomPrice(2500, 4000) :
                   symbol.startsWith('SOL') ? randomPrice(80, 200) :
                   symbol.startsWith('BNB') ? randomPrice(300, 500) :
                   randomPrice(0.1, 1000);
  
  const priceChangePercent = randomPrice(-5, 5);
  const openInterestChange = randomPrice(-10, 10);
  
  return {
    symbol,
    lastPrice: basePrice,
    priceChangePercent,
    volume: randomInt(1000000, 100000000),
    openInterest: randomInt(10000000, 1000000000),
    openInterestChange
  };
};

// Generate random indicator data with расширенными индикаторами
const generateIndicators = (signalType: SignalType, price: number) => {
  // Базовые индикаторы (существующие)
  const rsi = signalType === 'LONG' ? randomInt(20, 40) : 
             signalType === 'SHORT' ? randomInt(60, 80) : 
             randomInt(40, 60);
             
  const macdValue = signalType === 'LONG' ? randomPrice(0.1, 2) : 
                   signalType === 'SHORT' ? randomPrice(-2, -0.1) : 
                   randomPrice(-0.5, 0.5);
                   
  const macdSignal = macdValue - (signalType === 'LONG' ? -0.5 : 
                     signalType === 'SHORT' ? 0.5 : 
                     randomPrice(-0.2, 0.2));
                     
  const macdHistogram = macdValue - macdSignal;
  
  // Bollinger bands based on signal type and price
  const middleBB = price;
  const bbDeviation = price * 0.02;
  
  // Дополнительные индикаторы
  // Стохастический осциллятор
  const stochastic = {
    k: signalType === 'LONG' ? randomInt(15, 30) : randomInt(70, 85),
    d: signalType === 'LONG' ? randomInt(20, 35) : randomInt(65, 80)
  };
  
  // ATR (Average True Range)
  const atr = {
    value: price * randomPrice(0.01, 0.05),
    average: price * randomPrice(0.01, 0.03)
  };
  
  // ADX (Average Directional Index)
  const adx = {
    value: signalType === 'LONG' || signalType === 'SHORT' ? randomInt(25, 50) : randomInt(10, 20),
    plusDI: signalType === 'LONG' ? randomInt(25, 40) : randomInt(10, 20),
    minusDI: signalType === 'SHORT' ? randomInt(25, 40) : randomInt(10, 20)
  };
  
  // OBV (On-Balance Volume)
  const obv = {
    current: randomInt(1000000, 10000000),
    previous: randomInt(1000000, 10000000) * (signalType === 'LONG' ? 0.9 : 1.1)
  };

  // Ichimoku Cloud
  const ichimoku = {
    tenkanSen: price * (signalType === 'LONG' ? 0.98 : 1.02),
    kijunSen: price * (signalType === 'LONG' ? 0.97 : 1.03),
    senkouSpanA: price * (signalType === 'LONG' ? 0.99 : 1.01),
    senkouSpanB: price * (signalType === 'LONG' ? 0.96 : 1.04),
    cloud: {
      top: price * (signalType === 'LONG' ? 1.01 : 1.05),
      bottom: price * (signalType === 'LONG' ? 0.96 : 1.00)
    }
  };
  
  // WMA (Weighted Moving Average)
  const wma = {
    wma9: price * (signalType === 'LONG' ? 0.99 : 1.01),
    wma21: price * (signalType === 'LONG' ? 0.98 : 1.02)
  };
  
  // PSAR (Parabolic SAR)
  const psar = {
    value: signalType === 'LONG' ? price * 0.97 : price * 1.03
  };
  
  // MFI (Money Flow Index)
  const mfi = signalType === 'LONG' ? randomInt(15, 30) : randomInt(70, 85);
  
  // CCI (Commodity Channel Index)
  const cci = signalType === 'LONG' ? randomInt(-150, -80) : randomInt(80, 150);
  
  // Williams %R
  const williamsr = signalType === 'LONG' ? randomInt(-95, -80) : randomInt(-20, -5);
  
  // VWAP (Volume-Weighted Average Price)
  const vwap = {
    value: signalType === 'LONG' ? price * 1.01 : price * 0.99
  };
  
  // Supertrend
  const supertrend = {
    value: signalType === 'LONG' ? price * 0.97 : price * 1.03,
    trend: signalType === 'LONG' ? 'UP' : 'DOWN'
  };
  
  // DMI (Directional Movement Index)
  const dmi = {
    plusDI: signalType === 'LONG' ? randomInt(25, 40) : randomInt(10, 20),
    minusDI: signalType === 'SHORT' ? randomInt(25, 40) : randomInt(10, 20),
    adx: randomInt(20, 40)
  };
  
  // Keltner Channels
  const keltnerChannels = {
    upper: price * 1.03,
    middle: price,
    lower: price * 0.97
  };
  
  // Aroon
  const aroon = {
    up: signalType === 'LONG' ? randomInt(70, 100) : randomInt(0, 30),
    down: signalType === 'SHORT' ? randomInt(70, 100) : randomInt(0, 30)
  };
  
  // ZigZag
  const zigzag = {
    value: price * (signalType === 'LONG' ? 0.98 : 1.02),
    trend: signalType === 'LONG' ? 'UP' : 'DOWN'
  };
  
  // Donchian Channels
  const donchianChannels = {
    upper: price * 1.05,
    middle: price,
    lower: price * 0.95
  };
  
  // Fibonacci Retracement
  const fibonacciRetracement = {
    level_0: price * 1.1,
    level_0_236: price * 1.07,
    level_0_382: price * 1.05,
    level_0_5: price * 1.03,
    level_0_618: price * 1.01,
    level_0_764: price * 0.99,
    level_1: price * 0.96
  };
  
  // Volume Profile
  const volumeProfile = {
    valueArea: {
      high: price * 1.02,
      low: price * 0.98
    },
    poc: price * 1.01
  };
  
  // Cumulative Delta Volume
  const cumulativeDeltaVolume = {
    value: signalType === 'LONG' ? randomInt(10000, 100000) : randomInt(-100000, -10000),
    trendStrength: randomInt(50, 100)
  };
  
  // Force Index
  const forceIndex = {
    value: signalType === 'LONG' ? randomPrice(0.1, 2) : randomPrice(-2, -0.1)
  };
  
  // Money Flow Index
  const moneyFlowIndex = {
    value: signalType === 'LONG' ? randomInt(10, 30) : randomInt(70, 90)
  };
  
  // TRIX
  const trix = {
    value: signalType === 'LONG' ? randomPrice(0.1, 1) : randomPrice(-1, -0.1),
    signal: signalType === 'LONG' ? randomPrice(0, 0.5) : randomPrice(-0.5, 0)
  };
  
  // Gator Oscillator
  const gatorOscillator = {
    upper: signalType === 'LONG' ? randomPrice(0.1, 0.5) : randomPrice(-0.5, -0.1),
    lower: signalType === 'LONG' ? randomPrice(0.1, 0.5) : randomPrice(-0.5, -0.1)
  };
  
  // Market Facilitation Index
  const mfi_bill_williams = {
    value: signalType === 'LONG' ? randomPrice(0.1, 0.5) : randomPrice(-0.5, -0.1)
  };

  // Elder Ray Index
  const elderRayIndex = {
    bullPower: signalType === 'LONG' ? randomPrice(1, 5) : randomPrice(-1, 1),
    bearPower: signalType === 'SHORT' ? randomPrice(-5, -1) : randomPrice(-1, 1)
  };

  // Вернуть все индикаторы
  return {
    rsi,
    macd: {
      value: macdValue,
      signal: macdSignal,
      histogram: macdHistogram
    },
    bollingerBands: {
      upper: middleBB + bbDeviation,
      middle: middleBB,
      lower: middleBB - bbDeviation
    },
    movingAverages: {
      ema20: price * (signalType === 'LONG' ? 0.98 : 1.02),
      ema50: price * (signalType === 'LONG' ? 0.96 : 1.04),
      ema100: price * (signalType === 'LONG' ? 0.94 : 1.06),
      sma200: price * (signalType === 'LONG' ? 0.92 : 1.08)
    },
    stochastic,
    atr,
    adx,
    obv,
    ichimoku,
    wma,
    psar,
    mfi,
    cci,
    williamsr,
    vwap,
    supertrend,
    dmi,
    keltnerChannels,
    aroon,
    zigzag,
    donchianChannels,
    fibonacciRetracement,
    volumeProfile,
    cumulativeDeltaVolume,
    forceIndex,
    moneyFlowIndex,
    trix,
    gatorOscillator,
    mfi_bill_williams,
    elderRayIndex
  };
};

// Generate a random signal
const generateSignal = (): Signal => {
  const symbol = SYMBOLS[randomInt(0, SYMBOLS.length - 1)];
  const signalType: SignalType = Math.random() > 0.5 ? 'LONG' : 'SHORT';
  const timeframe = TIMEFRAMES[randomInt(0, TIMEFRAMES.length - 1)];
  
  const marketData = generateMarketData(symbol);
  const indicators = generateIndicators(signalType, marketData.lastPrice);
  
  const signal: Partial<Signal> = {
    symbol,
    timestamp: Date.now(),
    signalType,
    price: marketData.lastPrice,
    openInterestChange: marketData.openInterestChange,
    timeframe,
    indicators
  };
  
  return {
    ...signal,
    id: `${symbol}-${Date.now()}`,
    strength: determineSignalStrength(signal)
  } as Signal;
};

// Mock WebSocket connection
export class MockWebSocketService {
  private callbacks: {
    onMarketData: (data: MarketData[]) => void;
    onSignal: (signal: Signal) => void;
    onStatusChange: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  };
  
  private marketDataInterval: number | null = null;
  private signalInterval: number | null = null;
  private connected: boolean = false;
  
  constructor(callbacks: {
    onMarketData: (data: MarketData[]) => void;
    onSignal: (signal: Signal) => void;
    onStatusChange: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  }) {
    this.callbacks = callbacks;
  }
  
  connect() {
    this.callbacks.onStatusChange('connecting');
    
    // Simulate connection delay
    setTimeout(() => {
      this.connected = true;
      this.callbacks.onStatusChange('connected');
      
      // Send initial market data
      const initialMarketData = SYMBOLS.map(symbol => generateMarketData(symbol));
      this.callbacks.onMarketData(initialMarketData);
      
      // Set up regular market data updates
      this.marketDataInterval = window.setInterval(() => {
        if (!this.connected) return;
        
        const updatedMarketData = SYMBOLS.map(symbol => generateMarketData(symbol));
        this.callbacks.onMarketData(updatedMarketData);
      }, 5000);
      
      // Set up signal generation (less frequent)
      this.signalInterval = window.setInterval(() => {
        if (!this.connected) return;
        
        const newSignal = generateSignal();
        this.callbacks.onSignal(newSignal);
      }, 10000);
      
    }, 1500);
  }
  
  disconnect() {
    this.connected = false;
    
    if (this.marketDataInterval !== null) {
      window.clearInterval(this.marketDataInterval);
      this.marketDataInterval = null;
    }
    
    if (this.signalInterval !== null) {
      window.clearInterval(this.signalInterval);
      this.signalInterval = null;
    }
    
    this.callbacks.onStatusChange('disconnected');
  }
  
  isConnected() {
    return this.connected;
  }
}

// Export function to create the service
export const createMockWebSocketService = (callbacks: {
  onMarketData: (data: MarketData[]) => void;
  onSignal: (signal: Signal) => void;
  onStatusChange: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
}) => {
  return new MockWebSocketService(callbacks);
};
