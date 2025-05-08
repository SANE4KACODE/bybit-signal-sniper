
import { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Signal } from "@/types";
import { formatPrice, getSignalColorClass, getStrengthIndicator } from "@/utils/signalUtils";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Star, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import SignalCardExpanded from "./SignalCardExpanded";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SignalCardProps {
  signal: Signal;
}

const SignalCard = ({ signal }: SignalCardProps) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [showExpanded, setShowExpanded] = useState(false);
  
  const date = new Date(signal.timestamp);
  const timeAgo = formatDistanceToNow(date, { addSuffix: true, locale: ru });
  const timeString = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  
  const handleSaveSignal = async () => {
    if (!user) {
      toast.error("Необходимо войти в систему");
      return;
    }
    
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
    } catch (error) {
      console.error('Error saving signal:', error);
      toast.error('Ошибка при сохранении сигнала');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Card className="bg-trading-card border-trading-highlight hover:border-primary/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-lg">{signal.symbol}</h3>
              <div className="text-sm text-muted-foreground">
                {timeAgo} ({timeString})
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`${getSignalColorClass(signal.signalType)} px-2 py-1 h-auto`}
                  >
                    {signal.signalType}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{signal.signalType === 'LONG' ? 'Сигнал на покупку' : 'Сигнал на продажу'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <div>
              <div className="text-sm text-muted-foreground">Сила сигнала</div>
              <div className="text-base font-medium">{getStrengthIndicator(signal.strength)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Цена</div>
              <div className="font-mono text-lg">{formatPrice(signal.price)}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-sm text-muted-foreground">Изм. OI</div>
              <div className={`${signal.openInterestChange > 0 ? 'text-success' : 'text-warning'}`}>
                {signal.openInterestChange.toFixed(2)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Таймфрейм</div>
              <div>{signal.timeframe}</div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="px-4 py-2 border-t border-muted/20 flex justify-between">
          {user ? (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs" 
              onClick={handleSaveSignal}
              disabled={isSaving}
            >
              <Star className="h-3 w-3 mr-1" />
              Сохранить
            </Button>
          ) : (
            <div className="text-xs text-muted-foreground">Войдите, чтобы сохранить</div>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs" 
            onClick={() => setShowExpanded(true)}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Детали
          </Button>
        </CardFooter>
      </Card>
      
      {showExpanded && (
        <SignalCardExpanded 
          signal={signal} 
          onClose={() => setShowExpanded(false)} 
          onSave={handleSaveSignal}
        />
      )}
    </>
  );
};

export default SignalCard;
