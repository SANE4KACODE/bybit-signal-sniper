
import { Signal, SignalType } from "@/types";

// Четвертая часть оценки индикаторов - осцилляторы и импульсы
export const evaluateOscillatorsIndicators = (signal: Partial<Signal>): number => {
  if (!signal.indicators) return 0;
  
  const {
    gatorOscillator,
    elderRayIndex,
    mfi_bill_williams
  } = signal.indicators;
  
  let confirmingFactors = 0;
  
  // Gator Oscillator анализ (Bill Williams)
  if (gatorOscillator) {
    if ((signal.signalType === 'LONG' && gatorOscillator.upper > 0 && gatorOscillator.lower > 0) ||
        (signal.signalType === 'SHORT' && gatorOscillator.upper < 0 && gatorOscillator.lower < 0)) {
      confirmingFactors += 1;
    }
  }
  
  // Elder Ray Index анализ
  if (elderRayIndex) {
    if ((signal.signalType === 'LONG' && elderRayIndex.bullPower > 0 && elderRayIndex.bearPower < 0) ||
        (signal.signalType === 'SHORT' && elderRayIndex.bullPower < 0 && elderRayIndex.bearPower < 0)) {
      confirmingFactors += 1;
    }
  }
  
  // Market Facilitation Index анализ (Bill Williams)
  if (mfi_bill_williams) {
    if ((signal.signalType === 'LONG' && mfi_bill_williams.value > 0) ||
        (signal.signalType === 'SHORT' && mfi_bill_williams.value < 0)) {
      confirmingFactors += 1;
    }
  }
  
  return confirmingFactors;
};
