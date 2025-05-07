
import { useEffect, useState } from "react";
import { MarketData } from "@/types";
import { Card } from "@/components/ui/card";
import { useWebSocket } from "@/contexts/WebSocketContext";

export const MarketTicker = () => {
  const { marketData } = useWebSocket();
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Auto-scroll ticker
  useEffect(() => {
    if (marketData.length === 0) return;
    
    const tickerInterval = setInterval(() => {
      setScrollPosition(prev => {
        const containerWidth = document.querySelector('.ticker-container')?.clientWidth || 0;
        const tickerWidth = document.querySelector('.ticker-content')?.scrollWidth || 0;
        
        if (tickerWidth <= containerWidth) return 0;
        
        if (prev >= tickerWidth) {
          return -containerWidth;
        }
        
        return prev + 1;
      });
    }, 30);
    
    return () => clearInterval(tickerInterval);
  }, [marketData.length]);
  
  if (marketData.length === 0) {
    return (
      <Card className="bg-trading-card border-trading-highlight h-10 flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Загрузка данных рынка...</div>
      </Card>
    );
  }
  
  return (
    <Card className="bg-trading-card border-trading-highlight h-10 overflow-hidden">
      <div className="ticker-container h-full relative overflow-hidden">
        <div 
          className="ticker-content absolute flex items-center h-full"
          style={{ transform: `translateX(-${scrollPosition}px)` }}
        >
          {marketData.map((item, index) => (
            <div key={`${item.symbol}-${index}`} className="flex items-center px-4 h-full">
              <span className="font-medium mr-1">{item.symbol}</span>
              <span 
                className={`${
                  item.priceChangePercent >= 0 ? 'text-price-up' : 'text-price-down'
                }`}
              >
                {item.lastPrice.toFixed(2)}
                <span className="text-xs ml-1">
                  ({item.priceChangePercent >= 0 ? '+' : ''}
                  {item.priceChangePercent.toFixed(2)}%)
                </span>
              </span>
            </div>
          ))}
          {marketData.map((item, index) => (
            <div key={`${item.symbol}-repeat-${index}`} className="flex items-center px-4 h-full">
              <span className="font-medium mr-1">{item.symbol}</span>
              <span 
                className={`${
                  item.priceChangePercent >= 0 ? 'text-price-up' : 'text-price-down'
                }`}
              >
                {item.lastPrice.toFixed(2)}
                <span className="text-xs ml-1">
                  ({item.priceChangePercent >= 0 ? '+' : ''}
                  {item.priceChangePercent.toFixed(2)}%)
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
