
import { useEffect, useState } from "react";
import { getCurrentMoscowTime } from "@/utils/timeUtils";
import { Card, CardContent } from "@/components/ui/card";

export const MoscowClock = () => {
  const [time, setTime] = useState(getCurrentMoscowTime());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getCurrentMoscowTime());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <Card className="bg-trading-card border-trading-highlight">
      <CardContent className="p-3 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Московское время</div>
          <div className="text-xl font-mono">
            {time}
            <span className="ml-1 text-primary animate-blink">●</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
