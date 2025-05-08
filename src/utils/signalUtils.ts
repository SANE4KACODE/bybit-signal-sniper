
import { Signal, SignalStrength, SignalType } from "@/types";

// Determine signal strength based on technical indicators
export const determineSignalStrength = (signal: Partial<Signal>): SignalStrength => {
  if (!signal.indicators) return 'MODERATE';
  
  const { 
    rsi, 
    macd, 
    bollingerBands, 
    movingAverages,
    stochastic,
    atr,
    adx,
    obv,
    ichimoku,
    wma,
    psar,
    mfi,
    cci,
    williamsr
  } = signal.indicators;
  
  // Count confirming indicators
  let confirmingFactors = 0;
  
  // RSI analysis
  if (rsi !== undefined) {
    if ((signal.signalType === 'LONG' && rsi < 30) || 
        (signal.signalType === 'SHORT' && rsi > 70)) {
      confirmingFactors += 1;
    }
  }
  
  // MACD analysis
  if (macd) {
    if ((signal.signalType === 'LONG' && macd.histogram > 0 && macd.value > macd.signal) || 
        (signal.signalType === 'SHORT' && macd.histogram < 0 && macd.value < macd.signal)) {
      confirmingFactors += 1;
    }
  }
  
  // Bollinger Bands analysis
  if (bollingerBands && signal.price) {
    if ((signal.signalType === 'LONG' && signal.price <= bollingerBands.lower) || 
        (signal.signalType === 'SHORT' && signal.price >= bollingerBands.upper)) {
      confirmingFactors += 1;
    }
  }
  
  // Moving Averages analysis
  if (movingAverages && signal.price) {
    if (signal.signalType === 'LONG') {
      if (signal.price > movingAverages.ema50 && movingAverages.ema20 > movingAverages.ema50) {
        confirmingFactors += 1;
      }
      if (signal.price > movingAverages.sma200) {
        confirmingFactors += 1;
      }
    } else if (signal.signalType === 'SHORT') {
      if (signal.price < movingAverages.ema50 && movingAverages.ema20 < movingAverages.ema50) {
        confirmingFactors += 1;
      }
      if (signal.price < movingAverages.sma200) {
        confirmingFactors += 1;
      }
    }
  }
  
  // Open Interest analysis
  if (signal.openInterestChange) {
    if ((signal.signalType === 'LONG' && signal.openInterestChange > 5) || 
        (signal.signalType === 'SHORT' && signal.openInterestChange < -5)) {
      confirmingFactors += 1;
    }
  }
  
  // Stochastic analysis
  if (stochastic) {
    if ((signal.signalType === 'LONG' && stochastic.k < 20 && stochastic.k > stochastic.d) ||
        (signal.signalType === 'SHORT' && stochastic.k > 80 && stochastic.k < stochastic.d)) {
      confirmingFactors += 1;
    }
  }
  
  // ATR (Average True Range) analysis
  if (atr && atr.value && atr.average) {
    if (atr.value > atr.average * 1.5) {
      confirmingFactors += 1; // High volatility can confirm potential trend changes
    }
  }
  
  // ADX (Average Directional Index) analysis
  if (adx) {
    if (adx.value > 25) {
      if ((signal.signalType === 'LONG' && adx.plusDI > adx.minusDI) ||
          (signal.signalType === 'SHORT' && adx.plusDI < adx.minusDI)) {
        confirmingFactors += 1;
      }
    }
  }
  
  // OBV (On-Balance Volume) analysis
  if (obv && obv.current && obv.previous) {
    if ((signal.signalType === 'LONG' && obv.current > obv.previous) ||
        (signal.signalType === 'SHORT' && obv.current < obv.previous)) {
      confirmingFactors += 1;
    }
  }
  
  // Ichimoku Cloud analysis
  if (ichimoku) {
    if (signal.signalType === 'LONG') {
      if (signal.price && signal.price > ichimoku.cloud.top) {
        confirmingFactors += 1;
      }
      if (ichimoku.tenkanSen > ichimoku.kijunSen) {
        confirmingFactors += 1;
      }
    } else if (signal.signalType === 'SHORT') {
      if (signal.price && signal.price < ichimoku.cloud.bottom) {
        confirmingFactors += 1;
      }
      if (ichimoku.tenkanSen < ichimoku.kijunSen) {
        confirmingFactors += 1;
      }
    }
  }
  
  // WMA (Weighted Moving Average) analysis
  if (wma && wma.wma9 && wma.wma21 && signal.price) {
    if ((signal.signalType === 'LONG' && signal.price > wma.wma9 && wma.wma9 > wma.wma21) ||
        (signal.signalType === 'SHORT' && signal.price < wma.wma9 && wma.wma9 < wma.wma21)) {
      confirmingFactors += 1;
    }
  }
  
  // PSAR (Parabolic SAR) analysis
  if (psar && psar.value && signal.price) {
    if ((signal.signalType === 'LONG' && psar.value < signal.price) ||
        (signal.signalType === 'SHORT' && psar.value > signal.price)) {
      confirmingFactors += 1;
    }
  }
  
  // MFI (Money Flow Index) analysis
  if (mfi !== undefined) {
    if ((signal.signalType === 'LONG' && mfi < 20) ||
        (signal.signalType === 'SHORT' && mfi > 80)) {
      confirmingFactors += 1;
    }
  }
  
  // CCI (Commodity Channel Index) analysis
  if (cci !== undefined) {
    if ((signal.signalType === 'LONG' && cci < -100) ||
        (signal.signalType === 'SHORT' && cci > 100)) {
      confirmingFactors += 1;
    }
  }
  
  // Williams %R analysis
  if (williamsr !== undefined) {
    if ((signal.signalType === 'LONG' && williamsr < -80) ||
        (signal.signalType === 'SHORT' && williamsr > -20)) {
      confirmingFactors += 1;
    }
  }
  
  // Determine strength based on confirming factors
  // With many more indicators, we adjust the thresholds
  if (confirmingFactors >= 10) return 'STRONG';
  if (confirmingFactors >= 6) return 'MODERATE';
  return 'WEAK';
};

// Format price with appropriate decimals
export const formatPrice = (price: number): string => {
  if (price < 0.1) return price.toFixed(6);
  if (price < 1) return price.toFixed(4);
  if (price < 100) return price.toFixed(2);
  return price.toFixed(0);
};

// Get color class based on signal type
export const getSignalColorClass = (signalType: SignalType): string => {
  switch (signalType) {
    case 'LONG':
      return 'text-success';
    case 'SHORT':
      return 'text-warning';
    default:
      return 'text-muted-foreground';
  }
};

// Get background color class based on signal type
export const getSignalBgClass = (signalType: SignalType): string => {
  switch (signalType) {
    case 'LONG':
      return 'bg-success/10';
    case 'SHORT':
      return 'bg-warning/10';
    default:
      return 'bg-muted/10';
  }
};

// Get strength indicator
export const getStrengthIndicator = (strength: SignalStrength): string => {
  switch (strength) {
    case 'STRONG':
      return '●●●';
    case 'MODERATE':
      return '●●○';
    case 'WEAK':
      return '●○○';
  }
};

// Get a description of the strength
export const getStrengthDescription = (strength: SignalStrength): string => {
  switch (strength) {
    case 'STRONG':
      return 'Подтвержден 10+ индикаторами';
    case 'MODERATE':
      return 'Подтвержден 6-9 индикаторами';
    case 'WEAK':
      return 'Подтвержден 3-5 индикаторами';
  }
};
