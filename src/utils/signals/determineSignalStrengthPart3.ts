import { Signal } from "@/types";

// Third part of indicators evaluation - extracted to keep files smaller
export const evaluateVolumeIndicators = (signal: Partial<Signal>): number => {
  if (!signal.indicators) return 0;
  
  const {
    cumulativeDeltaVolume,
    forceIndex,
    moneyFlowIndex,
    trix
  } = signal.indicators;
  
  let confirmingFactors = 0;
  
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
  
  // Money Flow Index analysis
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
  
  return confirmingFactors;
};
