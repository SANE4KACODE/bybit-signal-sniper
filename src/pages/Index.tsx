
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { MoscowClock } from "@/components/MoscowClock";
import { MarketTicker } from "@/components/MarketTicker";
import { WebSocketStatus } from "@/components/WebSocketStatus";
import { SignalsList } from "@/components/SignalsList";
import { OpenInterestTable } from "@/components/OpenInterestTable";
import { UserMenu } from "@/components/UserMenu";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import TradingViewChart from "@/components/TradingViewChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown } from "lucide-react";

const Index = () => {
  const { isPremium } = useAuth();

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
          
          {isPremium && (
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-4">Графики</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <TradingViewChart symbol="BTCUSDT" height={400} />
                <TradingViewChart symbol="ETHUSDT" height={400} />
              </div>
            </div>
          )}
          
          {!isPremium && (
            <div className="mb-6">
              <Card className="bg-trading-card border-trading-highlight">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Crown className="h-5 w-5 mr-2 text-yellow-500" />
                    Улучшите ваш трейдинг с Premium
                  </CardTitle>
                  <CardDescription>
                    Получите доступ к расширенным инструментам анализа и точным сигналам
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">Преимущества Premium:</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• Высокоточные сигналы с 10+ индикаторами</li>
                        <li>• Интеграция с TradingView</li>
                        <li>• Расширенная аналитика</li>
                        <li>• Email-уведомления</li>
                      </ul>
                    </div>
                    <div className="flex items-center justify-center">
                      <Button asChild>
                        <Link to="/subscription">Перейти на Premium за 1000₽/мес</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
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
