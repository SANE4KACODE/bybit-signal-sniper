
import { Signal } from "@/types";

// Пятая часть оценки индикаторов - специальные индикаторы
export const evaluateSpecialIndicators = (signal: Partial<Signal>): number => {
  if (!signal.indicators) return 0;
  
  let score = 0;
  
  // Оценка данных алгоритмов Билла Вильямса (если они доступны)
  const indicators = signal.indicators;
  
  // Оценка Gator Oscillator (осциллятор "Аллигатор")
  if (indicators.gatorOscillator) {
    const gator = indicators.gatorOscillator;
    if ((signal.signalType === 'LONG' && gator.value > 0) || 
        (signal.signalType === 'SHORT' && gator.value < 0)) {
      score += 3;
    }
  }
  
  // Оценка Elder Ray Index
  if (indicators.elderRayIndex) {
    const elderRay = indicators.elderRayIndex;
    if ((signal.signalType === 'LONG' && elderRay.bullPower > 0 && elderRay.bearPower > -elderRay.bullPower) ||
        (signal.signalType === 'SHORT' && elderRay.bearPower < 0 && Math.abs(elderRay.bearPower) > elderRay.bullPower)) {
      score += 4;
    }
  }
  
  // Оценка MFI (Market Facilitation Index) Билла Вильямса
  if (indicators.mfi_bill_williams) {
    const mfi = indicators.mfi_bill_williams;
    if ((signal.signalType === 'LONG' && mfi.value > 0) ||
        (signal.signalType === 'SHORT' && mfi.value < 0)) {
      score += 3;
    }
    
    if (mfi.trend === signal.signalType.toLowerCase()) {
      score += 2;
    }
  }
  
  return score;
};
