
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
    trix
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
  
  // VWAP (Volume-Weighted Average Price) analysis
  if (vwap && signal.price) {
    if ((signal.signalType === 'LONG' && signal.price > vwap.value) ||
        (signal.signalType === 'SHORT' && signal.price < vwap.value)) {
      confirmingFactors += 1;
    }
  }
  
  // Supertrend analysis
  if (supertrend) {
    if ((signal.signalType === 'LONG' && supertrend.trend === 'UP') ||
        (signal.signalType === 'SHORT' && supertrend.trend === 'DOWN')) {
      confirmingFactors += 1;
    }
  }
  
  // DMI (Directional Movement Index) analysis 
  if (dmi) {
    if ((signal.signalType === 'LONG' && dmi.plusDI > dmi.minusDI && dmi.adx > 20) ||
        (signal.signalType === 'SHORT' && dmi.plusDI < dmi.minusDI && dmi.adx > 20)) {
      confirmingFactors += 1;
    }
  }
  
  // Keltner Channels analysis
  if (keltnerChannels && signal.price) {
    if ((signal.signalType === 'LONG' && signal.price < keltnerChannels.lower) ||
        (signal.signalType === 'SHORT' && signal.price > keltnerChannels.upper)) {
      confirmingFactors += 1;
    }
  }
  
  // Aroon analysis
  if (aroon) {
    if ((signal.signalType === 'LONG' && aroon.up > 70 && aroon.down < 30) ||
        (signal.signalType === 'SHORT' && aroon.up < 30 && aroon.down > 70)) {
      confirmingFactors += 1;
    }
  }
  
  // ZigZag analysis
  if (zigzag && zigzag.trend) {
    if ((signal.signalType === 'LONG' && zigzag.trend === 'UP') ||
        (signal.signalType === 'SHORT' && zigzag.trend === 'DOWN')) {
      confirmingFactors += 1;
    }
  }
  
  // Donchian Channels analysis
  if (donchianChannels && signal.price) {
    if ((signal.signalType === 'LONG' && signal.price === donchianChannels.upper) ||
        (signal.signalType === 'SHORT' && signal.price === donchianChannels.lower)) {
      confirmingFactors += 1;
    }
  }
  
  // Fibonacci Retracement analysis
  if (fibonacciRetracement && signal.price) {
    if (signal.signalType === 'LONG' && 
        (signal.price >= fibonacciRetracement.level_0_382 && signal.price <= fibonacciRetracement.level_0_618)) {
      confirmingFactors += 1;
    } else if (signal.signalType === 'SHORT' && 
              (signal.price >= fibonacciRetracement.level_0_618 && signal.price <= fibonacciRetracement.level_0_764)) {
      confirmingFactors += 1;
    }
  }
  
  // Volume Profile analysis
  if (volumeProfile && volumeProfile.valueArea) {
    if ((signal.signalType === 'LONG' && signal.price && signal.price < volumeProfile.valueArea.low) ||
        (signal.signalType === 'SHORT' && signal.price && signal.price > volumeProfile.valueArea.high)) {
      confirmingFactors += 1;
    }
  }
  
  // Cumulative Delta Volume analysis
  if (cumulativeDeltaVolume) {
    if ((signal.signalType === 'LONG' && cumulativeDeltaVolume.value > 0 && cumulativeDeltaVolume.trendStrength > 70) ||
        (signal.signalType === 'SHORT' && cumulativeDeltaVolume.value < 0 && cumulativeDeltaVolume.trendStrength > 70)) {
      confirmingFactors += 1;
    }
  }
  
  // Force Index analysis
  if (forceIndex) {
    if ((signal.signalType === 'LONG' && forceIndex.value > 0) ||
        (signal.signalType === 'SHORT' && forceIndex.value < 0)) {
      confirmingFactors += 1;
    }
  }
  
  // Money Flow Index analysis (again, separate from MFI above)
  if (moneyFlowIndex) {
    if ((signal.signalType === 'LONG' && moneyFlowIndex.value < 20) ||
        (signal.signalType === 'SHORT' && moneyFlowIndex.value > 80)) {
      confirmingFactors += 1;
    }
  }
  
  // TRIX analysis
  if (trix) {
    if ((signal.signalType === 'LONG' && trix.value > trix.signal) ||
        (signal.signalType === 'SHORT' && trix.value < trix.signal)) {
      confirmingFactors += 1;
    }
  }
  
  // Determine strength based on confirming factors
  // With 20+ indicators, we adjust the thresholds
  if (confirmingFactors >= 15) return 'STRONG';
  if (confirmingFactors >= 10) return 'MODERATE';
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
      return 'Подтвержден 15+ индикаторами';
    case 'MODERATE':
      return 'Подтвержден 10-14 индикаторами';
    case 'WEAK':
      return 'Подтвержден 5-9 индикаторами';
  }
};
