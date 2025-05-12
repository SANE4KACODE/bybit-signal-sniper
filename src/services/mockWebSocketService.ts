import { MarketData, Signal, SignalStrength, SignalType, TimeFrame, WebSocketStatus } from "@/types";

// Функция для генерации случайного числа в заданном диапазоне
const randomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Функция для генерации случайной цены
const randomPrice = (min, max) => {
  return parseFloat(randomNumber(min, max).toFixed(2));
};

// Функция для генерации случайного типа сигнала
const generateSignalType = (): SignalType => {
  const types: SignalType[] = ['LONG', 'SHORT'];
  return types[Math.floor(Math.random() * types.length)];
};

// Функция для генерации случайного таймфрейма
const generateTimeFrame = (): TimeFrame => {
  const timeFrames: TimeFrame[] = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'];
  return timeFrames[Math.floor(Math.random() * timeFrames.length)];
};

// Функция для генерации случайного актива
const generateAsset = () => {
  const assets = ['BTCUSDT', 'ETHUSDT', 'LTCUSDT', 'XRPUSDT', 'ADAUSDT'];
  return assets[Math.floor(Math.random() * assets.length)];
};

// Функция для генерации базовых индикаторов
const generateBaseIndicators = (signalType: SignalType, price: number) => {
  const atrValue = randomPrice(0.01, 0.05) * price;
  const vwapValue = price * randomNumber(0.99, 1.01);
  
  return {
    rsi: randomNumber(30, 70),
    macd: {
      value: randomPrice(-1, 1),
      signal: randomPrice(-1, 1),
      histogram: randomPrice(-1, 1),
    },
    bollingerBands: {
      upper: price * 1.05,
      middle: price,
      lower: price * 0.95,
    },
    movingAverages: {
      ema20: price * randomNumber(0.98, 1.02),
      ema50: price * randomNumber(0.95, 1.05),
      ema100: price * randomNumber(0.9, 1.1),
      sma200: price * randomNumber(0.85, 1.15),
    },
    stochastic: {
      k: randomNumber(20, 80),
      d: randomNumber(20, 80),
    },
    adx: randomNumber(20, 50),
    obv: randomNumber(-10000, 10000),
    atr: {
      value: atrValue,
      average: atrValue * 0.9,
    },
    cci: randomNumber(-100, 100),
    mfi: randomNumber(20, 80),
    vwap: {
      value: vwapValue
    },
    pivot: {
      r3: price * 1.15,
      r2: price * 1.1,
      r1: price * 1.05,
      pp: price,
      s1: price * 0.95,
      s2: price * 0.9,
      s3: price * 0.85,
    },
     ichimoku: {
      tenkanSen: price * randomNumber(0.98, 1.02),
      kijunSen: price * randomNumber(0.95, 1.05),
      senkouSpanA: price * randomNumber(0.9, 1.1),
      senkouSpanB: price * randomNumber(0.85, 1.15),
      chikouSpan: price * randomNumber(0.9, 1.1),
    },
    wpr: randomNumber(-100, 0),
    supertrend: {
      value: price * randomNumber(0.9, 1.1),
      direction: Math.random() > 0.5 ? 'up' as const : 'down' as const,
    },
    dmi: {
      plus: randomNumber(20, 60),
      minus: randomNumber(20, 60),
      plusDI: randomNumber(20, 60),
      minusDI: randomNumber(20, 60),
    },
    aroon: {
      up: randomNumber(0, 100),
      down: randomNumber(0, 100),
    },
    ao: randomNumber(-50, 50),
    mom: randomNumber(-10, 10),
    roc: randomNumber(-5, 5),
    kst: {
      value: randomNumber(-20, 20),
      signal: randomNumber(-20, 20),
    },
    trix: {
      value: randomNumber(-0.5, 0.5),
      signal: randomNumber(-0.5, 0.5),
    },
  };
};

// Функция для генерации индикаторов с исправленными типами
const generateIndicators = (signalType: SignalType, price: number) => {
  const baseIndicators = generateBaseIndicators(signalType, price);

  return {
    ...baseIndicators,
    
    // Добавим недостающий isReversal для psar
    psar: {
      value: signalType === 'LONG' ? price * 0.98 : price * 1.02,
      isReversal: Math.random() > 0.8
    },
    
    // Добавляем новые индикаторы из Билла Вильямса и др.
    gatorOscillator: {
      value: signalType === 'LONG' ? randomPrice(0.1, 2) : randomPrice(-2, -0.1),
      upper: signalType === 'LONG' ? randomPrice(0.1, 2) : randomPrice(-2, -0.1),
      lower: signalType === 'LONG' ? randomPrice(0.1, 2) : randomPrice(-2, -0.1)
    },
    elderRayIndex: {
      bullPower: signalType === 'LONG' ? randomPrice(1, 3) : randomPrice(-1, 1),
      bearPower: signalType === 'LONG' ? randomPrice(-1, 1) : randomPrice(-3, -1)
    },
    mfi_bill_williams: {
      value: signalType === 'LONG' ? randomPrice(0.5, 2) : randomPrice(-2, -0.5),
      trend: signalType === 'LONG' ? 'long' : 'short'
    }
  };
};

// Создаем функцию для создания случайного сигнала
const createRandomSignal = (): Signal => {
  const signalType = generateSignalType();
  const price = randomPrice(50000, 65000);
  
  return {
    id: Math.random().toString(36).substring(2, 15),
    symbol: generateAsset(),
    timeframe: generateTimeFrame(),
    signalType: signalType,
    price: price,
    strength: Math.random() > 0.7 ? 'STRONG' : Math.random() > 0.5 ? 'MODERATE' : 'WEAK',
    timestamp: Date.now(),
    openInterestChange: randomNumber(-5, 5),
    
    // Добавляем все обязательные поля для типа Signal
    entryPrice: price,
    takeProfit: signalType === 'LONG' ? price * 1.05 : price * 0.95,
    stopLoss: signalType === 'LONG' ? price * 0.97 : price * 1.03,
    leverage: Math.ceil(randomNumber(1, 10)),
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'mock-user-id',
    indicators: generateIndicators(signalType, price)
  };
};

// Создаем функцию для создания случайных данных рынка
const createRandomMarketData = (): MarketData[] => {
  const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT'];
  
  return symbols.map(symbol => {
    const lastPrice = symbol === 'BTCUSDT' 
      ? randomPrice(50000, 65000) 
      : symbol === 'ETHUSDT'
        ? randomPrice(3000, 4000)
        : randomPrice(100, 1000);
        
    return {
      symbol,
      lastPrice,
      priceChangePercent: randomNumber(-5, 5),
      volume: randomNumber(1000000, 10000000),
      openInterest: randomNumber(500000, 5000000),
      openInterestChange: randomNumber(-5, 5)
    };
  });
};

// Экспортируем функцию создания мок-сервиса веб-сокета
export function createMockWebSocketService(callbacks: {
  onMarketData: (data: MarketData[]) => void,
  onSignal: (signal: Signal) => void,
  onStatusChange: (status: WebSocketStatus) => void
}) {
  let interval: ReturnType<typeof setInterval> | null = null;
  let signalInterval: ReturnType<typeof setInterval> | null = null;
  let marketDataInterval: ReturnType<typeof setInterval> | null = null;
  let isConnected = false;
  
  return {
    connect: () => {
      if (isConnected) return;
      
      callbacks.onStatusChange('connecting');
      
      // Имитируем задержку соединения
      setTimeout(() => {
        isConnected = true;
        callbacks.onStatusChange('connected');
        
        // Отправляем начальные данные рынка
        callbacks.onMarketData(createRandomMarketData());
        
        // Запускаем обновления данных рынка каждые 5 секунд
        marketDataInterval = setInterval(() => {
          callbacks.onMarketData(createRandomMarketData());
        }, 5000);
        
        // Отправляем сигналы случа��но каждые 10-30 секунд
        signalInterval = setInterval(() => {
          if (Math.random() > 0.3) { // 70% шанс отправки сигнала
            callbacks.onSignal(createRandomSignal());
          }
        }, Math.floor(randomNumber(10000, 30000)));
        
      }, 1500);
    },
    
    disconnect: () => {
      if (!isConnected) return;
      
      isConnected = false;
      
      if (interval) clearInterval(interval);
      if (signalInterval) clearInterval(signalInterval);
      if (marketDataInterval) clearInterval(marketDataInterval);
      
      interval = null;
      signalInterval = null;
      marketDataInterval = null;
      
      callbacks.onStatusChange('disconnected');
    },
    
    isConnected: () => isConnected
  };
}

// Функция для создания мок-сигнала с исправленными типами
export const createMockSignal = (): Signal => {
  const signalType = generateSignalType();
  const asset = generateAsset();
  const timeFrame = generateTimeFrame();
  const price = randomPrice(50000, 65000);
  const indicators = generateIndicators(signalType, price);

  return {
    id: Math.random().toString(36).substring(7),
    symbol: asset,
    timeframe: timeFrame,
    signalType: signalType,
    price: price,
    entryPrice: price,
    takeProfit: signalType === 'LONG' ? price * 1.05 : price * 0.95,
    stopLoss: signalType === 'LONG' ? price * 0.97 : price * 1.03,
    leverage: Math.ceil(randomNumber(1, 10)),
    indicators: indicators,
    timestamp: Date.now(),
    status: 'ACTIVE' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'mock-user-id',
    strength: Math.random() > 0.7 ? 'STRONG' as SignalStrength : 
              Math.random() > 0.5 ? 'MODERATE' as SignalStrength : 
              'WEAK' as SignalStrength
  };
};

// Функция для создания массива мок-сигналов
export const createMockSignals = (count: number): Signal[] => {
  const signals: Signal[] = [];
  for (let i = 0; i < count; i++) {
    signals.push(createMockSignal());
  }
  return signals;
};
