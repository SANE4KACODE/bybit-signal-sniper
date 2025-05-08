
import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COINGLASS_API_KEY } from "@/config/apiKeys";

interface CoinglassWidgetProps {
  type: 'funding' | 'liquidations' | 'openInterest' | 'longShortRatio';
  title: string;
  height?: number;
}

const CoinglassWidget = ({ type, title, height = 400 }: CoinglassWidgetProps) => {
  const container = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!container.current) return;

    const fetchData = async () => {
      try {
        // This is a placeholder - in a real app, you would make an API call to Coinglass
        // using the provided API key and render the data
        const url = `https://api.coinglass.com/api/`;
        const headers = {
          'coinglassSecret': COINGLASS_API_KEY,
          'Content-Type': 'application/json'
        };
        
        // In a real implementation, you would actually fetch data from Coinglass
        // and visualize it. Here we're just demonstrating the component structure.
        container.current.innerHTML = `
          <div class="text-center p-4">
            <div class="text-xl font-bold text-primary mb-4">Coinglass ${type} данные</div>
            <div class="flex flex-col gap-2">
              <div class="bg-trading-highlight/30 p-3 rounded">
                <div class="text-sm text-muted-foreground">BTC</div>
                <div class="font-mono text-lg">Данные загружаются...</div>
              </div>
              <div class="bg-trading-highlight/30 p-3 rounded">
                <div class="text-sm text-muted-foreground">ETH</div>
                <div class="font-mono text-lg">Данные загружаются...</div>
              </div>
              <div class="bg-trading-highlight/30 p-3 rounded">
                <div class="text-sm text-muted-foreground">BNB</div>
                <div class="font-mono text-lg">Данные загружаются...</div>
              </div>
            </div>
            <div class="mt-4 text-sm text-muted-foreground">Данные предоставлены Coinglass</div>
          </div>
        `;
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
  }, [type]);
  
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
