
// Format price with appropriate decimals
export const formatPrice = (price: number): string => {
  if (price < 0.1) return price.toFixed(6);
  if (price < 1) return price.toFixed(4);
  if (price < 100) return price.toFixed(2);
  return price.toFixed(0);
};

// Get strength indicator
export const getStrengthIndicator = (strength: 'STRONG' | 'MODERATE' | 'WEAK'): string => {
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
export const getStrengthDescription = (strength: 'STRONG' | 'MODERATE' | 'WEAK'): string => {
  switch (strength) {
    case 'STRONG':
      return 'Подтвержден 15+ индикаторами';
    case 'MODERATE':
      return 'Подтвержден 10-14 индикаторами';
    case 'WEAK':
      return 'Подтвержден 5-9 индикаторами';
  }
};
