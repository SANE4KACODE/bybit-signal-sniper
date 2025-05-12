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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const timeframes: TimeFrame[] = ['1m', '3m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'];
  const symbols = [
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT', 'LTCUSDT',
    'AVAXUSDT', 'DOTUSDT', 'MATICUSDT', 'LINKUSDT', 'UNIUSDT', 'SHIBUSDT', 'TRXUSDT', 'ETCUSDT',
    'ATOMUSDT', 'ICPUSDT', 'XLMUSDT', 'VETUSDT', 'FILUSDT', 'APTUSDT', 'NEARUSDT', 'ALGOUSDT',
    'EOSUSDT', 'AAVEUSDT', 'AXSUSDT', 'FTMUSDT', 'SANDUSDT', 'MANAUSDT', 'CAKEUSDT', 'QNTUSDT'
  ];
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
        .maybeSingle();
      
      if (error) {
        if (error.code !== 'PGRST116') { // No rows returned
          throw error;
        }
      }
      
      if (data) {
        setSelectedTimeframes(data.timeframes as TimeFrame[]);
        setSelectedSymbols(data.symbols || []);
        setSelectedStrength(data.min_strength as SignalStrength);
        setSelectedSignalTypes(data.signal_types as SignalType[]);
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

  const selectAllSymbols = () => {
    setSelectedSymbols([...symbols]);
  };

  const clearAllSymbols = () => {
    setSelectedSymbols([]);
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
      <Card className="bg-trading-card border-trading-highlight">
        <CardHeader>
          <CardTitle className="text-primary">Настройки сигналов</CardTitle>
          <CardDescription>
            Настройте параметры отображаемых сигналов
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3 text-primary">Таймфреймы</h3>
            <div className="flex flex-wrap gap-2">
              {timeframes.map(timeframe => (
                <Button
                  key={timeframe}
                  variant={selectedTimeframes.includes(timeframe) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTimeframe(timeframe)}
                  className={selectedTimeframes.includes(timeframe) ? "bg-primary" : ""}
                >
                  {timeframe}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-primary">Торговые пары</h3>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={selectAllSymbols}>
                  Выбрать все
                </Button>
                <Button variant="outline" size="sm" onClick={clearAllSymbols}>
                  Очистить
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="grid">
              <TabsList className="mb-4">
                <TabsTrigger value="grid">Сетка</TabsTrigger>
                <TabsTrigger value="list">Список</TabsTrigger>
              </TabsList>
              
              <TabsContent value="grid">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {symbols.map(symbol => (
                    <div key={symbol} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`symbol-grid-${symbol}`}
                        checked={selectedSymbols.includes(symbol)}
                        onCheckedChange={() => toggleSymbol(symbol)}
                      />
                      <Label htmlFor={`symbol-grid-${symbol}`}>{symbol}</Label>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="list">
                <ScrollArea className="h-[250px] pr-4">
                  <div className="space-y-2">
                    {symbols.map(symbol => (
                      <div key={symbol} className="flex items-center space-x-2 p-2 hover:bg-muted/20 rounded-md">
                        <Checkbox 
                          id={`symbol-list-${symbol}`}
                          checked={selectedSymbols.includes(symbol)}
                          onCheckedChange={() => toggleSymbol(symbol)}
                        />
                        <Label htmlFor={`symbol-list-${symbol}`}>{symbol}</Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3 text-primary">Минимальная сила сигнала</h3>
            <div className="bg-muted/10 p-4 rounded-md">
              <RadioGroup value={selectedStrength} onValueChange={(value) => setSelectedStrength(value as SignalStrength)}>
                {strengths.map(strength => (
                  <div key={strength} className="flex items-center space-x-2">
                    <RadioGroupItem value={strength} id={`strength-${strength}`} />
                    <Label htmlFor={`strength-${strength}`}>
                      {strength === 'WEAK' ? 'Слабый - минимум 3 индикатора' : 
                       strength === 'MODERATE' ? 'Средний - минимум 6 индикаторов' : 'Сильный - минимум 10 индикаторов'}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3 text-primary">Типы сигналов</h3>
            <div className="flex flex-wrap gap-2">
              {signalTypes.map(type => (
                <Button
                  key={type}
                  variant={selectedSignalTypes.includes(type) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSignalType(type)}
                  className={`
                    ${selectedSignalTypes.includes(type) ? (
                      type === 'LONG' ? "bg-success text-background" : 
                      type === 'SHORT' ? "bg-warning text-background" : 
                      "bg-primary"
                    ) : (
                      type === 'LONG' ? "text-success border-success" : 
                      type === 'SHORT' ? "text-warning border-warning" : 
                      ""
                    )}
                  `}
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
        <Button onClick={saveSettings} disabled={saving} className="bg-primary hover:bg-primary/90">
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
