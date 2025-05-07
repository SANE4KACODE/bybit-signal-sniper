
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { MoscowClock } from "@/components/MoscowClock";
import { MarketTicker } from "@/components/MarketTicker";
import { WebSocketStatus } from "@/components/WebSocketStatus";
import { SignalsList } from "@/components/SignalsList";
import { OpenInterestTable } from "@/components/OpenInterestTable";
import { UserMenu } from "@/components/UserMenu";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  // Set title
  useEffect(() => {
    document.title = "Bybit Signal Sniper";
  }, []);

  return (
    <WebSocketProvider>
      <div className="min-h-screen bg-trading-dark text-foreground">
        <header className="bg-trading-card border-b border-trading-highlight p-4">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-primary">Bybit Signal Sniper</h1>
              <div className="flex items-center gap-4">
                <WebSocketStatus />
                <UserMenu />
              </div>
            </div>
          </div>
        </header>
        
        <div className="container my-4">
          <div className="flex flex-col md:flex-row gap-4 items-start mb-6">
            <div className="w-full md:w-1/3">
              <MoscowClock />
            </div>
            <div className="w-full md:w-2/3">
              <MarketTicker />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-medium mb-4">Сигналы</h2>
              <SignalsList />
            </div>
            
            <div>
              <h2 className="text-xl font-medium mb-4">Аналитика</h2>
              <div className="space-y-6">
                <OpenInterestTable />
              </div>
            </div>
          </div>
        </div>
        
        <footer className="mt-8 border-t border-trading-highlight bg-trading-card py-4">
          <div className="container text-center text-sm text-muted-foreground">
            <p>Bybit Signal Sniper © {new Date().getFullYear()}</p>
            <p className="text-xs mt-1">Анализ в реальном времени для профессиональных трейдеров</p>
          </div>
        </footer>
      </div>
    </WebSocketProvider>
  );
};

export default Index;
