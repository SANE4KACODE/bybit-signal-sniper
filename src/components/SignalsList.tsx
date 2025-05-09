
import { useWebSocket } from "@/contexts/WebSocketContext";
import SignalCard from "./SignalCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SignalType } from "@/types";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type SignalFilterType = SignalType | 'ALL';

export const SignalsList = () => {
  const { signals, clearSignals } = useWebSocket();
  const [filter, setFilter] = useState<SignalFilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter signals based on type and search query
  const filteredSignals = signals
    .filter(s => filter === 'ALL' || s.signalType === filter)
    .filter(s => !searchQuery || s.symbol.toLowerCase().includes(searchQuery.toLowerCase()));
  
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
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
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
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по монете..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-trading-highlight/30 border-trading-highlight h-9"
            />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={clearSignals}
          >
            Очистить
          </Button>
        </div>
      </div>
      
      {filteredSignals.length === 0 ? (
        <div className="mt-4 p-8 flex flex-col items-center justify-center bg-trading-card rounded-lg border border-trading-highlight">
          <p className="text-lg text-muted-foreground mb-2">Сигналы не найдены</p>
          <p className="text-sm text-muted-foreground">
            Попробуйте изменить параметры фильтрации
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSignals.map(signal => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      )}
    </div>
  );
};
