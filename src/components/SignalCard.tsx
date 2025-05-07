
import { Card, CardContent } from "@/components/ui/card";
import { Signal } from "@/types";
import { toMoscowTime } from "@/utils/timeUtils";
import { formatPrice, getSignalBgClass, getSignalColorClass, getStrengthIndicator } from "@/utils/signalUtils";
import { ArrowUp, ArrowDown, Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Button } from "./ui/button";

interface SignalCardProps {
  signal: Signal;
}

export const SignalCard = ({ signal }: SignalCardProps) => {
  const {
    id,
    symbol,
    timestamp,
    signalType,
    strength,
    price,
    openInterestChange,
    timeframe,
    indicators
  } = signal;
  
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  
  const signalColorClass = getSignalColorClass(signalType);
  const signalBgClass = getSignalBgClass(signalType);
  
  const handleSaveSignal = async () => {
    if (!user) {
      toast.error("Войдите, чтобы сохранять сигналы");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('saved_signals')
        .insert({
          user_id: user.id,
          signal_id: id,
          symbol,
          signal_type: signalType,
          price,
          timeframe,
          strength,
          timestamp
        });
        
      if (error) {
        if (error.code === '23505') {
          toast.error("Этот сигнал уже сохранен");
        } else {
          throw error;
        }
      } else {
        setIsSaved(true);
        toast.success(`Сигнал по ${symbol} сохранен`);
      }
    } catch (error: any) {
      console.error("Error saving signal:", error);
      toast.error(error.message || "Ошибка при сохранении сигнала");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card className={`${signalBgClass} border-trading-highlight shadow-sm hover:shadow-md transition-shadow`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <span className="text-lg font-bold">{symbol}</span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-muted">
              {timeframe}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{toMoscowTime(timestamp)}</span>
            {user && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleSaveSignal}
                disabled={isSaving || isSaved}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4 text-primary" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className={`flex items-center ${signalColorClass} font-bold`}>
            {signalType === 'LONG' ? (
              <>
                <ArrowUp className="w-4 h-4 mr-1" />
                <span>ЛОНГ</span>
              </>
            ) : (
              <>
                <ArrowDown className="w-4 h-4 mr-1" />
                <span>ШОРТ</span>
              </>
            )}
          </div>
          <div className="text-sm">
            Сила: <span className="font-mono">{getStrengthIndicator(strength)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-muted-foreground">Цена:</div>
            <div className="font-medium">{formatPrice(price)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Open Interest:</div>
            <div className={`font-medium ${openInterestChange > 0 ? 'text-price-up' : openInterestChange < 0 ? 'text-price-down' : ''}`}>
              {openInterestChange > 0 ? '+' : ''}{openInterestChange.toFixed(2)}%
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-t border-border/50 grid grid-cols-2 gap-2 text-xs">
          {indicators.rsi !== undefined && (
            <div>
              <span className="text-muted-foreground">RSI:</span>{' '}
              <span className={indicators.rsi > 70 ? 'text-price-down' : indicators.rsi < 30 ? 'text-price-up' : ''}>
                {indicators.rsi.toFixed(1)}
              </span>
            </div>
          )}
          
          {indicators.macd && (
            <div>
              <span className="text-muted-foreground">MACD:</span>{' '}
              <span className={indicators.macd.histogram > 0 ? 'text-price-up' : 'text-price-down'}>
                {indicators.macd.histogram.toFixed(2)}
              </span>
            </div>
          )}
          
          {indicators.bollingerBands && (
            <div className="col-span-2">
              <span className="text-muted-foreground">BB:</span>{' '}
              <span>{formatPrice(indicators.bollingerBands.lower)} - {formatPrice(indicators.bollingerBands.upper)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
