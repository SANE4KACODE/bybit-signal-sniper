
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { MoscowClock } from "@/components/MoscowClock";
import { MarketTicker } from "@/components/MarketTicker";
import { WebSocketStatus } from "@/components/WebSocketStatus";
import { SignalsList } from "@/components/SignalsList";
import { OpenInterestTable } from "@/components/OpenInterestTable";
import { UserMenu } from "@/components/UserMenu";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import TradingViewChart from "@/components/TradingViewChart";
import CoinglassWidget from "@/components/CoinglassWidget";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown } from "lucide-react";

const Index = () => {
  const { isPremium } = useAuth();
  const [themeStyle, setThemeStyle] = useState<'dark' | 'light' | 'colorful'>('dark');
  const [selectedPair, setSelectedPair] = useState('BTCUSDT');
  
  // Expanded list of popular pairs
  const popularPairs = [
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'AVAXUSDT', 
    'DOGEUSDT', 'ADAUSDT', 'LTCUSDT', 'DOTUSDT', 'MATICUSDT', 'SHIBUSDT', 
    'LINKUSDT', 'TRXUSDT', 'ATOMUSDT', 'UNIUSDT', 'ETCUSDT', 'FILUSDT', 
    'NEARUSDT', 'APTUSDT'
  ];

  // Set title
  useEffect(() => {
    document.title = "Bybit Signal Sniper";
  }, []);

  return (
    <WebSocketProvider>
      <div className="min-h-screen bg-trading-dark text-foreground">
        <header className={`${themeStyle === 'colorful' ? 'bg-gradient-to-r from-trading-card to-indigo-900' : 'bg-trading-card'} border-b border-trading-highlight p-4`}>
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <h1 className={`text-2xl font-bold ${themeStyle === 'colorful' ? 'text-gradient-primary' : 'text-primary'}`}>
                Bybit Signal Sniper
              </h1>
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
            <>
              <div className="mb-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                  <h2 className="text-xl font-medium">Графики</h2>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center bg-trading-highlight rounded-md p-1">
                      <button 
                        onClick={() => setThemeStyle('dark')} 
                        className={`px-3 py-1 rounded-sm ${themeStyle === 'dark' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
                      >
                        Темная
                      </button>
                      <button 
                        onClick={() => setThemeStyle('light')} 
                        className={`px-3 py-1 rounded-sm ${themeStyle === 'light' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
                      >
                        Светлая
                      </button>
                      <button 
                        onClick={() => setThemeStyle('colorful')} 
                        className={`px-3 py-1 rounded-sm ${themeStyle === 'colorful' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
                      >
                        Цветная
                      </button>
                    </div>
                    
                    <select 
                      value={selectedPair}
                      onChange={(e) => setSelectedPair(e.target.value)}
                      className="bg-trading-highlight border-none rounded-md p-2 text-sm"
                    >
                      {popularPairs.map(pair => (
                        <option key={pair} value={pair}>{pair}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <TradingViewChart symbol={selectedPair} theme={themeStyle} height={400} />
                  <CoinglassWidget type="all" title="Аналитика Coinglass" height={400} />
                </div>
              </div>
            </>
          )}
          
          {!isPremium && (
            <div className="mb-6">
              <Card className="bg-gradient-to-br from-trading-card to-indigo-900 border-trading-highlight">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Crown className="h-5 w-5 mr-2 text-yellow-500" />
                    Улучшите ваш трейдинг с Premium
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Получите доступ к расширенным инструментам анализа и точным сигналам
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium mb-2 text-white">Преимущества Premium:</h3>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li>• Высокоточные сигналы с 20+ индикаторами</li>
                        <li>• Интеграция с TradingView и полный доступ к Coinglass</li>
                        <li>• Расширенная аналитика и разные цветовые темы</li>
                        <li>• Подключение аккаунта Bybit</li>
                        <li>• Все криптовалюты (≈500 монет)</li>
                        <li>• Email-уведомления о точных сигналах</li>
                      </ul>
                    </div>
                    <div className="flex items-center justify-center">
                      <Button asChild className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
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
                {isPremium && (
                  <CoinglassWidget type="longShortRatio" title="Long/Short соотношение" height={300} />
                )}
              </div>
            </div>
          </div>
        </div>
        
        <footer className={`mt-8 border-t border-trading-highlight ${themeStyle === 'colorful' ? 'bg-gradient-to-r from-trading-card to-indigo-900' : 'bg-trading-card'} py-4`}>
          <div className="container text-center text-sm text-muted-foreground">
            <p>Bybit Signal Sniper © {new Date().getFullYear()}</p>
            <p className="text-xs mt-1">Высокоточные сигналы для профессиональных трейдеров</p>
          </div>
        </div>
      </div>
    </WebSocketProvider>
  );
};

export default Index;
