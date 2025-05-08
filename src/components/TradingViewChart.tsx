
import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TradingViewChartProps {
  symbol: string;
  theme?: 'light' | 'dark';
  height?: number;
  autosize?: boolean;
}

const TradingViewChart = ({ 
  symbol, 
  theme = 'dark', 
  height = 400,
  autosize = false 
}: TradingViewChartProps) => {
  const container = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => initWidget();
    
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  
  useEffect(() => {
    if (typeof window.TradingView !== 'undefined') {
      initWidget();
    }
  }, [symbol, theme]);
  
  const initWidget = () => {
    if (!container.current || !window.TradingView) return;
    
    container.current.innerHTML = '';
    
    new window.TradingView.widget({
      container_id: container.current.id,
      symbol: `BYBIT:${symbol}`,
      interval: 'D',
      timezone: 'Europe/Moscow',
      theme: theme,
      style: '1',
      locale: 'ru',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      save_image: false,
      hide_top_toolbar: false,
      hide_legend: false,
      studies: [
        'MAExp@tv-basicstudies',
        'RSI@tv-basicstudies',
        'MACD@tv-basicstudies'
      ],
      height: height,
      autosize: autosize,
    });
  };
  
  return (
    <Card className="bg-trading-card border-trading-highlight">
      <CardHeader className="px-4 py-2">
        <CardTitle className="text-base font-medium">{symbol} График</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          id="tradingview_widget" 
          ref={container} 
          style={{ height: `${height}px` }}
        />
      </CardContent>
    </Card>
  );
};

export default TradingViewChart;
