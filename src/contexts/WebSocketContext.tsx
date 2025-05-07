import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createMockWebSocketService } from "@/services/mockWebSocketService";
import { MarketData, Signal, WebSocketStatus } from "@/types";
import { toast } from "@/components/ui/sonner";

interface WebSocketContextType {
  status: WebSocketStatus;
  marketData: MarketData[];
  signals: Signal[];
  clearSignals: () => void;
  connect: () => void;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [service, setService] = useState<any>(null);

  useEffect(() => {
    const wsService = createMockWebSocketService({
      onMarketData: (data) => {
        setMarketData(data);
      },
      onSignal: (signal) => {
        setSignals(prev => {
          // Keep only the last 100 signals
          const newSignals = [signal, ...prev].slice(0, 100);
          return newSignals;
        });
        
        // Show toast for strong signals
        if (signal.strength === 'STRONG') {
          const signalType = signal.signalType === 'LONG' ? 'ЛОНГ' : 'ШОРТ';
          toast(`${signal.symbol} ${signalType} сигнал (${signal.timeframe})`, {
            description: `Цена: ${signal.price.toFixed(2)}`,
            duration: 5000
          });
        }
      },
      onStatusChange: (newStatus) => {
        setStatus(newStatus);
        
        if (newStatus === 'connected') {
          toast.success("Подключено к Bybit WebSocket");
        } else if (newStatus === 'disconnected') {
          toast.info("Отключено от Bybit WebSocket");
        } else if (newStatus === 'error') {
          toast.error("Ошибка подключения к Bybit WebSocket");
        }
      }
    });
    
    setService(wsService);
    
    return () => {
      if (wsService) {
        wsService.disconnect();
      }
    };
  }, []);

  const connect = () => {
    if (service && !service.isConnected()) {
      service.connect();
    }
  };

  const disconnect = () => {
    if (service && service.isConnected()) {
      service.disconnect();
    }
  };

  const clearSignals = () => {
    setSignals([]);
  };

  return (
    <WebSocketContext.Provider value={{
      status,
      marketData,
      signals,
      clearSignals,
      connect,
      disconnect
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
