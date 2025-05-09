
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Signal } from "@/types";
import SignalCard from "@/components/SignalCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

const SavedSignals = () => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchSavedSignals = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('saved_signals')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Convert saved signals to the Signal format
        const formattedSignals: Signal[] = data.map(item => ({
          id: item.signal_id,
          symbol: item.symbol,
          timestamp: item.timestamp,
          signalType: item.signal_type,
          strength: item.strength,
          price: Number(item.price),
          openInterestChange: 0, // Default value
          timeframe: item.timeframe,
          // Add required fields for Signal type
          entryPrice: Number(item.price),
          takeProfit: Number(item.price) * (item.signal_type === 'LONG' ? 1.05 : 0.95),
          stopLoss: Number(item.price) * (item.signal_type === 'LONG' ? 0.95 : 1.05),
          leverage: 1, // Default value
          status: 'ACTIVE',
          createdAt: item.created_at || new Date().toISOString(),
          updatedAt: item.created_at || new Date().toISOString(),
          userId: user.id,
          indicators: {} // Empty indicators object
        }));
        
        setSignals(formattedSignals);
      } catch (error: any) {
        console.error("Error fetching saved signals:", error);
        toast.error(error.message || "Ошибка при загрузке сохраненных сигналов");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedSignals();
  }, [user]);
  
  if (!user) {
    return (
      <div className="container my-8 p-6 bg-trading-card rounded-lg border border-trading-highlight">
        <h2 className="text-2xl font-bold mb-4">Сохраненные сигналы</h2>
        <p>Пожалуйста, войдите чтобы увидеть сохраненные сигналы</p>
        <Button asChild className="mt-4">
          <Link to="/auth">Войти</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container my-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Сохраненные сигналы</h2>
        <Button variant="outline" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Link>
        </Button>
      </div>
      
      {loading ? (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Загрузка сигналов...</p>
        </div>
      ) : signals.length === 0 ? (
        <div className="p-8 text-center bg-trading-card rounded-lg border border-trading-highlight">
          <p className="text-lg text-muted-foreground mb-4">У вас пока нет сохраненных сигналов</p>
          <p className="text-sm text-muted-foreground">
            Сохраняйте интересные сигналы, нажимая на иконку закладки
          </p>
          <Button asChild className="mt-4">
            <Link to="/">Вернуться к списку сигналов</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {signals.map(signal => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedSignals;
