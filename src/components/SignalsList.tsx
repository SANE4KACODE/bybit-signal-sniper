
import { useWebSocket } from "@/contexts/WebSocketContext";
import { SignalCard } from "./SignalCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SignalType } from "@/types";

export const SignalsList = () => {
  const { signals, clearSignals } = useWebSocket();
  const [filter, setFilter] = useState<SignalType | 'ALL'>('ALL');
  
  const filteredSignals = filter === 'ALL' 
    ? signals 
    : signals.filter(s => s.signalType === filter);
  
  if (signals.length === 0) {
    return (
      <div className="mt-4 p-8 flex flex-col items-center justify-center bg-trading-card rounded-lg border border-trading-highlight">
        <p className="text-lg text-muted-foreground mb-4">Ожидание сигналов...</p>
        <p className="text-sm text-muted-foreground">
          Сигналы будут появляться здесь по мере их поступления
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={filter === 'ALL' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter('ALL')}
          >
            Все
          </Button>
          <Button
            variant={filter === 'LONG' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter('LONG')}
            className="text-success"
          >
            ЛОНГ
          </Button>
          <Button
            variant={filter === 'SHORT' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter('SHORT')}
            className="text-warning"
          >
            ШОРТ
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={clearSignals}
        >
          Очистить
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSignals.map(signal => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
      </div>
    </div>
  );
};
