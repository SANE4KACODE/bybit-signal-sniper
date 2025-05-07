
import { useEffect, useState } from "react";
import { getCurrentMoscowTime, formatUserLocalTime } from "@/utils/timeUtils";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const MoscowClock = () => {
  const [moscowTime, setMoscowTime] = useState(getCurrentMoscowTime());
  const [localTime, setLocalTime] = useState("");
  const { profile } = useAuth();
  
  useEffect(() => {
    const timer = setInterval(() => {
      setMoscowTime(getCurrentMoscowTime());
      setLocalTime(formatUserLocalTime(profile?.timezone));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [profile?.timezone]);
  
  return (
    <Card className="bg-trading-card border-trading-highlight">
      <CardContent className="p-3">
        <Tabs defaultValue="moscow" className="w-full">
          <TabsList className="grid grid-cols-2 mb-2">
            <TabsTrigger value="moscow">Москва</TabsTrigger>
            <TabsTrigger value="local">Локальное</TabsTrigger>
          </TabsList>
          
          <TabsContent value="moscow" className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Московское время</div>
            <div className="text-xl font-mono">
              {moscowTime}
              <span className="ml-1 text-primary animate-blink">●</span>
            </div>
          </TabsContent>
          
          <TabsContent value="local" className="text-center">
            <div className="text-xs text-muted-foreground mb-1">
              {profile?.timezone || "Ваше время"}
            </div>
            <div className="text-xl font-mono">
              {localTime}
              <span className="ml-1 text-primary animate-blink">●</span>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
