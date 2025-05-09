
import { Signal, SignalStrength } from "@/types";
import { evaluateAdvancedIndicators } from './determineSignalStrengthPart2';
import { evaluateVolumeIndicators } from './determineSignalStrengthPart3';
import { evaluateOscillatorsIndicators } from './determineSignalStrengthPart4';
import { evaluateSpecialIndicators } from './determineSignalStrengthPart5';

// Определение силы сигнала на основе технических индикаторов
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
    obv
  } = signal.indicators;
  
  // Подсчет подтверждающих факторов
  let confirmingFactors = 0;
  
  // RSI анализ
  if (rsi !== undefined) {
    if ((signal.signalType === 'LONG' && rsi < 30) || 
        (signal.signalType === 'SHORT' && rsi > 70)) {
      confirmingFactors += 1;
    }
  }
  
  // MACD анализ
  if (macd) {
    if ((signal.signalType === 'LONG' && macd.histogram > 0 && macd.value > macd.signal) || 
        (signal.signalType === 'SHORT' && macd.histogram < 0 && macd.value < macd.signal)) {
      confirmingFactors += 1;
    }
  }
  
  // Bollinger Bands анализ
  if (bollingerBands && signal.price) {
    if ((signal.signalType === 'LONG' && signal.price <= bollingerBands.lower) || 
        (signal.signalType === 'SHORT' && signal.price >= bollingerBands.upper)) {
      confirmingFactors += 1;
    }
  }
  
  // Moving Averages анализ
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
  
  // Open Interest анализ
  if (signal.openInterestChange) {
    if ((signal.signalType === 'LONG' && signal.openInterestChange > 5) || 
        (signal.signalType === 'SHORT' && signal.openInterestChange < -5)) {
      confirmingFactors += 1;
    }
  }
  
  // Stochastic анализ
  if (stochastic) {
    if ((signal.signalType === 'LONG' && stochastic.k < 20 && stochastic.k > stochastic.d) ||
        (signal.signalType === 'SHORT' && stochastic.k > 80 && stochastic.k < stochastic.d)) {
      confirmingFactors += 1;
    }
  }
  
  // ATR (Average True Range) анализ
  if (atr && atr.value && atr.average) {
    if (atr.value > atr.average * 1.5) {
      confirmingFactors += 1; // Высокая волатильность может подтвердить потенциальные изменения тренда
    }
  }
  
  // ADX (Average Directional Index) анализ
  if (adx) {
    if (adx.value > 25) {
      if ((signal.signalType === 'LONG' && adx.plusDI > adx.minusDI) ||
          (signal.signalType === 'SHORT' && adx.plusDI < adx.minusDI)) {
        confirmingFactors += 1;
      }
    }
  }
  
  // OBV (On-Balance Volume) анализ
  if (obv && obv.current && obv.previous) {
    if ((signal.signalType === 'LONG' && obv.current > obv.previous) ||
        (signal.signalType === 'SHORT' && obv.current < obv.previous)) {
      confirmingFactors += 1;
    }
  }
  
  // Добавляем оценки от других групп индикаторов
  confirmingFactors += evaluateAdvancedIndicators(signal);
  confirmingFactors += evaluateVolumeIndicators(signal);
  confirmingFactors += evaluateOscillatorsIndicators(signal);
  confirmingFactors += evaluateSpecialIndicators(signal);
  
  // Определение силы на основе подтверждающих факторов
  // С 25+ индикаторами мы повышаем пороговые значения
  if (confirmingFactors >= 25) return 'STRONG';
  if (confirmingFactors >= 15) return 'MODERATE';
  return 'WEAK';
};
