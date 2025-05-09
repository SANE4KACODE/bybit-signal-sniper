import { Signal } from "@/types";

// Функция для генерации случайного числа в заданном диапазоне
const randomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Функция для генерации случайной цены
const randomPrice = (min, max) => {
  return parseFloat(randomNumber(min, max).toFixed(2));
};

// Функция для генерации случайного типа сигнала
const generateSignalType = () => {
  const types = ['LONG', 'SHORT'];
  return types[Math.floor(Math.random() * types.length)];
};

// Функция для генерации случайного таймфрейма
const generateTimeFrame = () => {
  const timeFrames = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];
  return timeFrames[Math.floor(Math.random() * timeFrames.length)];
};

// Функция для генерации случайного актива
const generateAsset = () => {
  const assets = ['BTCUSDT', 'ETHUSDT', 'LTCUSDT', 'XRPUSDT', 'ADAUSDT'];
  return assets[Math.floor(Math.random() * assets.length)];
};

// Функция для генерации базовых индикаторов
const generateBaseIndicators = (signalType, price) => {
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
    atr: randomPrice(0.01, 0.05) * price,
    cci: randomNumber(-100, 100),
    mfi: randomNumber(20, 80),
    vwap: price * randomNumber(0.99, 1.01),
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
      direction: Math.random() > 0.5 ? 'up' : 'down',
    },
    dmi: {
      plus: randomNumber(20, 60),
      minus: randomNumber(20, 60),
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

// Исправим генерацию индикаторов, чтобы включить недостающие поля
const generateIndicators = (signalType, price) => {
  const baseIndicators = generateBaseIndicators(signalType, price);

  return {
    ...baseIndicators,
    
    // Добавим недостающий isReversal для psar
    psar: {
      value: signalType === 'LONG' ? price * 0.98 : price * 1.02,
      isReversal: Math.random() > 0.8 // Добавляем требуемое поле isReversal
    },
    
    // Добавляем новые индикаторы из Билла Вильямса и др.
    gatorOscillator: {
      value: signalType === 'LONG' ? randomPrice(0.1, 2) : randomPrice(-2, -0.1)
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

// Функция для создания мок-сигнала
export const createMockSignal = (): Signal => {
  const signalType = generateSignalType();
  const asset = generateAsset();
  const timeFrame = generateTimeFrame();
  const price = randomPrice(50000, 65000);
  const indicators = generateIndicators(signalType, price);

  return {
    id: Math.random().toString(36).substring(7),
    asset: asset,
    timeFrame: timeFrame,
    signalType: signalType,
    price: price,
    indicators: indicators,
    date: new Date(),
    isNew: Math.random() > 0.5,
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
