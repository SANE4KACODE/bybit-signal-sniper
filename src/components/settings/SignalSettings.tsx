
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { TimeFrame, SignalStrength, SignalType } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function SignalSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Settings state
  const [selectedTimeframes, setSelectedTimeframes] = useState<TimeFrame[]>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [selectedStrength, setSelectedStrength] = useState<SignalStrength>("WEAK");
  const [selectedSignalTypes, setSelectedSignalTypes] = useState<SignalType[]>([]);
  
  // Available options
  const timeframes: TimeFrame[] = ['1m', '3m', '5m', '15m', '30m', '1h', '4h', '1d'];
  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT', 'LTCUSDT'];
  const strengths: SignalStrength[] = ['WEAK', 'MODERATE', 'STRONG'];
  const signalTypes: SignalType[] = ['LONG', 'SHORT', 'NEUTRAL'];
  
  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);
  
  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_signal_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // No rows returned
          throw error;
        }
      }
      
      if (data) {
        setSelectedTimeframes(data.timeframes || []);
        setSelectedSymbols(data.symbols || []);
        setSelectedStrength(data.min_strength || 'WEAK');
        setSelectedSignalTypes(data.signal_types || []);
      } else {
        // Default settings
        setSelectedTimeframes(['5m', '15m', '1h', '4h', '1d']);
        setSelectedSymbols(['BTCUSDT', 'ETHUSDT', 'BNBUSDT']);
        setSelectedStrength('WEAK');
        setSelectedSignalTypes(['LONG', 'SHORT']);
      }
    } catch (error: any) {
      console.error("Error fetching settings:", error);
      toast.error("Ошибка при загрузке настроек");
    } finally {
      setLoading(false);
    }
  };
  
  const saveSettings = async () => {
    if (!user) return;
    
    setSaving(true);
    
    try {
      const { data: existingData } = await supabase
        .from('user_signal_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      const payload = {
        user_id: user.id,
        timeframes: selectedTimeframes,
        symbols: selectedSymbols,
        min_strength: selectedStrength,
        signal_types: selectedSignalTypes,
        updated_at: new Date().toISOString()
      };
      
      let error;
      
      if (existingData) {
        // Update existing record
        const response = await supabase
          .from('user_signal_settings')
          .update(payload)
          .eq('user_id', user.id);
        
        error = response.error;
      } else {
        // Insert new record
        const response = await supabase
          .from('user_signal_settings')
          .insert(payload);
        
        error = response.error;
      }
      
      if (error) throw error;
      
      toast.success("Настройки сигналов сохранены");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error("Ошибка при сохранении настроек");
    } finally {
      setSaving(false);
    }
  };
  
  const toggleTimeframe = (timeframe: TimeFrame) => {
    if (selectedTimeframes.includes(timeframe)) {
      setSelectedTimeframes(selectedTimeframes.filter(t => t !== timeframe));
    } else {
      setSelectedTimeframes([...selectedTimeframes, timeframe]);
    }
  };
  
  const toggleSymbol = (symbol: string) => {
    if (selectedSymbols.includes(symbol)) {
      setSelectedSymbols(selectedSymbols.filter(s => s !== symbol));
    } else {
      setSelectedSymbols([...selectedSymbols, symbol]);
    }
  };
  
  const toggleSignalType = (type: SignalType) => {
    if (selectedSignalTypes.includes(type)) {
      setSelectedSignalTypes(selectedSignalTypes.filter(t => t !== type));
    } else {
      setSelectedSignalTypes([...selectedSignalTypes, type]);
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Загрузка настроек...</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Настройки сигналов</CardTitle>
          <CardDescription>
            Настройте параметры отображаемых сигналов
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Таймфреймы</h3>
            <div className="flex flex-wrap gap-2">
              {timeframes.map(timeframe => (
                <Button
                  key={timeframe}
                  variant={selectedTimeframes.includes(timeframe) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTimeframe(timeframe)}
                >
                  {timeframe}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Символы</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {symbols.map(symbol => (
                <div key={symbol} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`symbol-${symbol}`}
                    checked={selectedSymbols.includes(symbol)}
                    onCheckedChange={() => toggleSymbol(symbol)}
                  />
                  <Label htmlFor={`symbol-${symbol}`}>{symbol}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Минимальная сила сигнала</h3>
            <RadioGroup value={selectedStrength} onValueChange={(value) => setSelectedStrength(value as SignalStrength)}>
              {strengths.map(strength => (
                <div key={strength} className="flex items-center space-x-2">
                  <RadioGroupItem value={strength} id={`strength-${strength}`} />
                  <Label htmlFor={`strength-${strength}`}>
                    {strength === 'WEAK' ? 'Слабый' : 
                     strength === 'MODERATE' ? 'Средний' : 'Сильный'}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Типы сигналов</h3>
            <div className="flex flex-wrap gap-2">
              {signalTypes.map(type => (
                <Button
                  key={type}
                  variant={selectedSignalTypes.includes(type) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSignalType(type)}
                  className={type === 'LONG' ? "text-success" : type === 'SHORT' ? "text-warning" : ""}
                >
                  {type === 'LONG' ? 'ЛОНГ' : 
                   type === 'SHORT' ? 'ШОРТ' : 'НЕЙТРАЛЬНЫЙ'}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? (
            "Сохранение..."
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Сохранить настройки
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
