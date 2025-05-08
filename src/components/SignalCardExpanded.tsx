
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Signal } from "@/types";
import { formatPrice, getSignalColorClass, getStrengthIndicator, getStrengthDescription } from "@/utils/signals";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Star, Share, ChevronDown, ChevronUp } from "lucide-react";
import TradingViewChart from './TradingViewChart';
import IndicatorsTable from './IndicatorsTable';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface SignalCardExpandedProps {
  signal: Signal;
  onClose: () => void;
  onSave?: (signal: Signal) => void;
}

const SignalCardExpanded = ({ signal, onClose, onSave }: SignalCardExpandedProps) => {
  const { user, isPremium } = useAuth();
  const [showTechnicals, setShowTechnicals] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  
  const date = new Date(signal.timestamp);
  const timeAgo = formatDistanceToNow(date, { addSuffix: true, locale: ru });
  const timeString = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  
  const handleSaveSignal = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase.from('saved_signals').insert({
        user_id: user.id,
        signal_id: signal.id,
        symbol: signal.symbol,
        signal_type: signal.signalType,
        strength: signal.strength,
        price: signal.price,
        timestamp: signal.timestamp,
        timeframe: signal.timeframe
      });
      
      if (error) throw error;
      
      toast.success('Сигнал сохранен');
      if (onSave) onSave(signal);
    } catch (error) {
      console.error('Error saving signal:', error);
      toast.error('Ошибка при сохранении сигнала');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <Card className="bg-trading-card border-trading-highlight">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-xl font-bold">{signal.symbol}</h3>
              <div className="text-sm text-muted-foreground">
                {timeAgo} ({timeString}) - Таймфрейм: {signal.timeframe}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>&times;</Button>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-2xl font-bold ${getSignalColorClass(signal.signalType)}`}>
                      {signal.signalType} {getStrengthIndicator(signal.strength)}
                    </span>
                    <p className="text-muted-foreground text-sm">
                      {getStrengthDescription(signal.strength)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-mono">{formatPrice(signal.price)}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Ключевые показатели:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted/20 p-2 rounded">
                      <div className="text-sm text-muted-foreground">Изменение % OI:</div>
                      <div className={`font-medium ${signal.openInterestChange > 0 ? 'text-success' : 'text-warning'}`}>
                        {signal.openInterestChange.toFixed(2)}%
                      </div>
                    </div>
                    {signal.indicators.rsi && (
                      <div className="bg-muted/20 p-2 rounded">
                        <div className="text-sm text-muted-foreground">RSI:</div>
                        <div className="font-medium">
                          {signal.indicators.rsi.toFixed(2)}
                        </div>
                      </div>
                    )}
                    {signal.indicators.macd && (
                      <div className="bg-muted/20 p-2 rounded">
                        <div className="text-sm text-muted-foreground">MACD Histogram:</div>
                        <div className={`font-medium ${signal.indicators.macd.histogram > 0 ? 'text-success' : 'text-warning'}`}>
                          {signal.indicators.macd.histogram.toFixed(4)}
                        </div>
                      </div>
                    )}
                    {signal.indicators.adx && (
                      <div className="bg-muted/20 p-2 rounded">
                        <div className="text-sm text-muted-foreground">ADX:</div>
                        <div className="font-medium">
                          {signal.indicators.adx.value.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {isPremium && (
                <div className="w-full md:w-1/2">
                  <TradingViewChart symbol={signal.symbol} height={300} />
                </div>
              )}
              {!isPremium && (
                <div className="w-full md:w-1/2 border border-dashed border-muted-foreground/50 rounded-md p-4 flex items-center justify-center flex-col">
                  <h3 className="text-lg font-medium mb-2">Доступно в Premium</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Графики TradingView и расширенная аналитика
                  </p>
                  <Button variant="default" size="sm">
                    Перейти на Premium за 1000₽/мес
                  </Button>
                </div>
              )}
            </div>
            
            <div>
              <Button 
                variant="ghost" 
                className="w-full flex justify-between items-center"
                onClick={() => setShowTechnicals(!showTechnicals)}
              >
                <span>Технические показатели</span>
                {showTechnicals ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </Button>
              
              {showTechnicals && isPremium && (
                <div className="mt-2 p-2 bg-muted/20 rounded">
                  <IndicatorsTable signal={signal} />
                </div>
              )}
              
              {showTechnicals && !isPremium && (
                <div className="mt-2 p-4 border border-dashed border-muted-foreground/50 rounded-md flex items-center justify-center flex-col">
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Подробная техническая аналитика доступна в Premium
                  </p>
                  <Button variant="default" size="sm">
                    Перейти на Premium за 1000₽/мес
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <div className="space-x-2">
              {user && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSaveSignal} 
                  disabled={isSaving}
                >
                  <Star className="h-4 w-4 mr-1" />
                  Сохранить
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-1" />
                Поделиться
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>Закрыть</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignalCardExpanded;
