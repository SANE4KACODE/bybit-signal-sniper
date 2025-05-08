
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COINGLASS_API_KEY } from "@/config/apiKeys";
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface CoinglassWidgetProps {
  type: 'funding' | 'liquidations' | 'openInterest' | 'longShortRatio' | 'all';
  title: string;
  height?: number;
}

const CoinglassWidget = ({ type, title, height = 400 }: CoinglassWidgetProps) => {
  const container = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(type === 'all' ? 'funding' : type);
  const { isPremium } = useAuth();
  
  useEffect(() => {
    if (!container.current) return;
    if (!isPremium) {
      container.current.innerHTML = `
        <div class="text-center p-4">
          <div class="text-xl text-primary mb-4">Coinglass данные - Premium</div>
          <div class="text-sm text-muted-foreground mb-4">
            Доступно только для Premium пользователей
          </div>
          <a href="/subscription" class="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-2 px-4 rounded">
            Перейти на Premium за 1000₽/мес
          </a>
        </div>
      `;
      return;
    }

    const fetchData = async () => {
      try {
        // This is a placeholder - in a real app, you would make an API call to Coinglass
        // using the provided API key and render the data
        const widgetType = type === 'all' ? activeTab : type;
        const url = `https://api.coinglass.com/api/`;
        const headers = {
          'coinglassSecret': COINGLASS_API_KEY,
          'Content-Type': 'application/json'
        };
        
        // In a real implementation, you would actually fetch data from Coinglass
        // and visualize it. Here we're just demonstrating the component structure.
        if (container.current) {
          if (widgetType === 'funding') {
            container.current.innerHTML = `
              <div class="text-center p-4">
                <div class="text-xl font-bold text-primary mb-4">Ставки финансирования</div>
                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead>
                      <tr class="border-b border-muted-foreground/20">
                        <th class="text-left p-2">Монета</th>
                        <th class="text-right p-2">Bybit</th>
                        <th class="text-right p-2">Binance</th>
                        <th class="text-right p-2">OKX</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="border-b border-muted-foreground/20">
                        <td class="p-2">BTC</td>
                        <td class="text-right p-2 font-mono text-success">0.01%</td>
                        <td class="text-right p-2 font-mono text-success">0.01%</td>
                        <td class="text-right p-2 font-mono text-warning">-0.01%</td>
                      </tr>
                      <tr class="border-b border-muted-foreground/20">
                        <td class="p-2">ETH</td>
                        <td class="text-right p-2 font-mono text-warning">-0.02%</td>
                        <td class="text-right p-2 font-mono text-warning">-0.01%</td>
                        <td class="text-right p-2 font-mono text-warning">-0.03%</td>
                      </tr>
                      <tr class="border-b border-muted-foreground/20">
                        <td class="p-2">BNB</td>
                        <td class="text-right p-2 font-mono text-success">0.05%</td>
                        <td class="text-right p-2 font-mono text-success">0.04%</td>
                        <td class="text-right p-2 font-mono text-success">0.03%</td>
                      </tr>
                      <tr class="border-b border-muted-foreground/20">
                        <td class="p-2">SOL</td>
                        <td class="text-right p-2 font-mono text-warning">-0.03%</td>
                        <td class="text-right p-2 font-mono text-warning">-0.02%</td>
                        <td class="text-right p-2 font-mono text-warning">-0.03%</td>
                      </tr>
                      <tr class="border-b border-muted-foreground/20">
                        <td class="p-2">XRP</td>
                        <td class="text-right p-2 font-mono text-success">0.02%</td>
                        <td class="text-right p-2 font-mono text-success">0.01%</td>
                        <td class="text-right p-2 font-mono text-success">0.01%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="mt-4 text-sm text-muted-foreground">Данные предоставлены Coinglass</div>
              </div>
            `;
          } else if (widgetType === 'liquidations') {
            container.current.innerHTML = `
              <div class="text-center p-4">
                <div class="text-xl font-bold text-primary mb-4">Ликвидации за 24ч</div>
                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead>
                      <tr class="border-b border-muted-foreground/20">
                        <th class="text-left p-2">Монета</th>
                        <th class="text-right p-2">Лонги</th>
                        <th class="text-right p-2">Шорты</th>
                        <th class="text-right p-2">Всего</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="border-b border-muted-foreground/20">
                        <td class="p-2">BTC</td>
                        <td class="text-right p-2 font-mono text-warning">$45.2M</td>
                        <td class="text-right p-2 font-mono text-success">$23.7M</td>
                        <td class="text-right p-2 font-mono">$68.9M</td>
                      </tr>
                      <tr class="border-b border-muted-foreground/20">
                        <td class="p-2">ETH</td>
                        <td class="text-right p-2 font-mono text-warning">$25.8M</td>
                        <td class="text-right p-2 font-mono text-success">$19.3M</td>
                        <td class="text-right p-2 font-mono">$45.1M</td>
                      </tr>
                      <tr class="border-b border-muted-foreground/20">
                        <td class="p-2">SOL</td>
                        <td class="text-right p-2 font-mono text-warning">$15.2M</td>
                        <td class="text-right p-2 font-mono text-success">$8.7M</td>
                        <td class="text-right p-2 font-mono">$23.9M</td>
                      </tr>
                      <tr class="border-b border-muted-foreground/20">
                        <td class="p-2">XRP</td>
                        <td class="text-right p-2 font-mono text-warning">$6.5M</td>
                        <td class="text-right p-2 font-mono text-success">$5.3M</td>
                        <td class="text-right p-2 font-mono">$11.8M</td>
                      </tr>
                      <tr class="border-b border-muted-foreground/20">
                        <td class="p-2">DOGE</td>
                        <td class="text-right p-2 font-mono text-warning">$3.2M</td>
                        <td class="text-right p-2 font-mono text-success">$4.1M</td>
                        <td class="text-right p-2 font-mono">$7.3M</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="mt-4 text-sm text-muted-foreground">Данные предоставлены Coinglass</div>
              </div>
            `;
          } else if (widgetType === 'openInterest') {
            container.current.innerHTML = `
              <div class="text-center p-4">
                <div class="text-xl font-bold text-primary mb-4">Открытый интерес</div>
                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead>
                      <tr class="border-b border-muted-foreground/20">
                        <th class="text-left p-2">Монета</th>
                        <th class="text-right p-2">OI (USD)</th>
                        <th class="text-right p-2">OI (BTC)</th>
                        <th class="text-right p-2">Изм. 24ч</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="border-b border-muted-foreground/20">
                        <td class="p-2">BTC</td>
                        <td class="text-right p-2 font-mono">$14.52B</td>
                        <td class="text-right p-2 font-mono">248,735</td>
                        <td class="text-right p-2 font-mono text-success">+3.67%</td>
                      </tr>
                      <tr class="border-b border-muted-foreground/20">
                        <td class="p-2">ETH</td>
                        <td class="text-right p-2 font-mono">$8.75B</td>
                        <td class="text-right p-2 font-mono">149,982</td>
                        <td class="text-right p-2 font-mono text-warning">-1.23%</td>
                      </tr>
                      <tr class="border-b border-muted-foreground/20">
                        <td class="p-2">SOL</td>
                        <td class="text-right p-2 font-mono">$2.31B</td>
                        <td class="text-right p-2 font-mono">39,587</td>
                        <td class="text-right p-2 font-mono text-success">+5.89%</td>
                      </tr>
                      <tr class="border-b border-muted-foreground/20">
                        <td class="p-2">XRP</td>
                        <td class="text-right p-2 font-mono">$1.05B</td>
                        <td class="text-right p-2 font-mono">17,982</td>
                        <td class="text-right p-2 font-mono text-success">+0.67%</td>
                      </tr>
                      <tr class="border-b border-muted-foreground/20">
                        <td class="p-2">BNB</td>
                        <td class="text-right p-2 font-mono">$0.98B</td>
                        <td class="text-right p-2 font-mono">16,821</td>
                        <td class="text-right p-2 font-mono text-warning">-0.34%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="mt-4 text-sm text-muted-foreground">Данные предоставлены Coinglass</div>
              </div>
            `;
          } else if (widgetType === 'longShortRatio') {
            container.current.innerHTML = `
              <div class="text-center p-4">
                <div class="text-xl font-bold text-primary mb-4">Long/Short соотношение</div>
                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead>
                      <tr class="border-b border-muted-foreground/20">
                        <th class="text-left p-2">Монета</th>
                        <th class="text-right p-2">Long %</th>
                        <th class="text-right p-2">Short %</th>
                        <th class="text-right p-2">L/S Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="border-b border-muted-foreground/20">
                        <td class="p-2">BTC</td>
                        <td class="text-right p-2 font-mono text-success">53.2%</td>
                        <td class="text-right p-2 font-mono text-warning">46.8%</td>
                        <td class="text-right p-2 font-mono">1.14</td>
                      </tr>
                      <tr class="border-b border-muted-foreground/20">
                        <td class="p-2">ETH</td>
                        <td class="text-right p-2 font-mono text-success">55.7%</td>
                        <td class="text-right p-2 font-mono text-warning">44.3%</td>
                        <td class="text-right p-2 font-mono">1.26</td>
                      </tr>
                      <tr class="border-b border-muted-foreground/20">
                        <td class="p-2">SOL</td>
                        <td class="text-right p-2 font-mono text-success">58.9%</td>
                        <td class="text-right p-2 font-mono text-warning">41.1%</td>
                        <td class="text-right p-2 font-mono">1.43</td>
                      </tr>
                      <tr class="border-b border-muted-foreground/20">
                        <td class="p-2">XRP</td>
                        <td class="text-right p-2 font-mono text-success">52.3%</td>
                        <td class="text-right p-2 font-mono text-warning">47.7%</td>
                        <td class="text-right p-2 font-mono">1.10</td>
                      </tr>
                      <tr class="border-b border-muted-foreground/20">
                        <td class="p-2">DOGE</td>
                        <td class="text-right p-2 font-mono text-warning">48.2%</td>
                        <td class="text-right p-2 font-mono text-success">51.8%</td>
                        <td class="text-right p-2 font-mono">0.93</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="mt-4 text-sm text-muted-foreground">Данные предоставлены Coinglass</div>
              </div>
            `;
          }
        }
      } catch (error) {
        console.error('Error fetching Coinglass data:', error);
        if (container.current) {
          container.current.innerHTML = `
            <div class="text-center p-4">
              <div class="text-xl text-warning mb-4">Ошибка загрузки данных</div>
              <div class="text-muted-foreground">Не удалось загрузить данные Coinglass</div>
            </div>
          `;
        }
      }
    };

    fetchData();
  }, [type, isPremium, activeTab]);

  if (type === 'all' && isPremium) {
    return (
      <Card className="bg-trading-card border-trading-highlight">
        <CardHeader className="px-4 py-2">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-trading-highlight w-full grid grid-cols-4">
              <TabsTrigger value="funding">Финансирование</TabsTrigger>
              <TabsTrigger value="liquidations">Ликвидации</TabsTrigger>
              <TabsTrigger value="openInterest">Открытый интерес</TabsTrigger>
              <TabsTrigger value="longShortRatio">Long/Short</TabsTrigger>
            </TabsList>
            <div 
              ref={container} 
              style={{ height: `${height}px`, overflow: 'auto' }}
              className="w-full"
            />
          </Tabs>
        </CardContent>
      </Card>
    );
  }
  
  // Default individual widget view
  return (
    <Card className="bg-trading-card border-trading-highlight">
      <CardHeader className="px-4 py-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={container} 
          style={{ height: `${height}px`, overflow: 'auto' }}
          className="w-full"
        />
      </CardContent>
    </Card>
  );
};

export default CoinglassWidget;
