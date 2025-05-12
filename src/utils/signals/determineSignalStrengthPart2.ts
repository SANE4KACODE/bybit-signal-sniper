import { Signal, SignalType } from "@/types";

// Second part of indicators evaluation - extracted to keep files smaller
export const evaluateAdvancedIndicators = (signal: Partial<Signal>): number => {
  if (!signal.indicators) return 0;
  
  const {
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
    volumeProfile
  } = signal.indicators;
  
  let confirmingFactors = 0;
  
  // Ichimoku Cloud analysis
  if (ichimoku && ichimoku.cloud) {
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
  if (dmi && dmi.plusDI !== undefined && dmi.minusDI !== undefined && dmi.adx !== undefined) {
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
  
  return confirmingFactors;
};
