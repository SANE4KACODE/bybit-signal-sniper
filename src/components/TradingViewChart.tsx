
import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TradingViewChartProps {
  symbol: string;
  theme?: 'light' | 'dark' | 'colorful';
  height?: number;
  autosize?: boolean;
  interval?: string;
}

const TradingViewChart = ({ 
  symbol, 
  theme = 'dark', 
  height = 400,
  autosize = false,
  interval = 'D'
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
  }, [symbol, theme, interval]);
  
  const initWidget = () => {
    if (!container.current || !window.TradingView) return;
    
    container.current.innerHTML = '';
    
    // Преобразование темы в формат TradingView
    const tvTheme = theme === 'colorful' ? 'colored' : theme;
    
    // Настраиваем стили в зависимости от выбранной темы
    const style = theme === 'colorful' ? '3' : '1';
    
    new window.TradingView.widget({
      container_id: container.current.id,
      symbol: `BYBIT:${symbol}`,
      interval: interval,
      timezone: 'Europe/Moscow',
      theme: tvTheme,
      style: style,
      locale: 'ru',
      toolbar_bg: theme === 'light' ? '#f1f3f6' : '#1c2438',
      enable_publishing: false,
      save_image: false,
      hide_top_toolbar: false,
      hide_legend: false,
      studies: [
        'MAExp@tv-basicstudies',
        'RSI@tv-basicstudies',
        'MACD@tv-basicstudies',
        'StochasticRSI@tv-basicstudies',
        'AwesomeOscillator@tv-basicstudies',
        'BollingerBands@tv-basicstudies'
      ],
      height: height,
      autosize: autosize,
      withdateranges: true,
    });
  };
  
  return (
    <Card className={`bg-trading-card border-trading-highlight ${theme === 'colorful' ? 'bg-gradient-to-br from-trading-card to-indigo-900' : ''}`}>
      <CardHeader className="px-4 py-2">
        <CardTitle className={`text-base font-medium ${theme === 'colorful' ? 'text-gradient-primary' : ''}`}>
          {symbol} График
        </CardTitle>
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
