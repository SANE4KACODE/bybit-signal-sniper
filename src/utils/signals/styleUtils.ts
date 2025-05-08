
import { SignalType } from "@/types";

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
