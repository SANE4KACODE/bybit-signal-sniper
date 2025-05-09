import { MarketData, Signal, SignalType, TimeFrame } from "@/types";
import { determineSignalStrength } from "@/utils/signals/determineSignalStrength";

const SYMBOLS = [
  'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'AVAXUSDT',
  'ADAUSDT', 'DOTUSDT', 'MATICUSDT', 'LINKUSDT', 'LTCUSDT'
];

const TIMEFRAMES: TimeFrame[] = ['1m', '5m', '15m', '1h', '4h'];

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

// Generate random indicator data
const generateIndicators = (signalType: SignalType, price: number) => {
  // Generate realistic technical indicators based on signal type
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
    }
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
