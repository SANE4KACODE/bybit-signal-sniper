
import { Signal, SignalStrength, SignalType } from "@/types";

// Determine signal strength based on technical indicators
export const determineSignalStrength = (signal: Partial<Signal>): SignalStrength => {
  // This is a simplified version - in a real application, you would have
  // more sophisticated logic based on multiple indicators
  
  if (!signal.indicators) return 'MODERATE';
  
  const { rsi, macd, bollingerBands, movingAverages } = signal.indicators;
  
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
    if ((signal.signalType === 'LONG' && macd.histogram > 0) || 
        (signal.signalType === 'SHORT' && macd.histogram < 0)) {
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
    if (signal.signalType === 'LONG' && 
        signal.price > movingAverages.ema50 && 
        movingAverages.ema20 > movingAverages.ema50) {
      confirmingFactors += 1;
    } else if (signal.signalType === 'SHORT' && 
              signal.price < movingAverages.ema50 && 
              movingAverages.ema20 < movingAverages.ema50) {
      confirmingFactors += 1;
    }
  }
  
  // Open Interest analysis
  if (signal.openInterestChange) {
    if ((signal.signalType === 'LONG' && signal.openInterestChange > 5) || 
        (signal.signalType === 'SHORT' && signal.openInterestChange < -5)) {
      confirmingFactors += 1;
    }
  }
  
  // Determine strength based on confirming factors
  if (confirmingFactors >= 4) return 'STRONG';
  if (confirmingFactors >= 2) return 'MODERATE';
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
