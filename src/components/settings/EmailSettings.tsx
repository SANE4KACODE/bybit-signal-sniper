
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Mail, Clock } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { TimeField } from "@/components/TimeField";
import { Separator } from "@/components/ui/separator";

export function EmailSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Settings state
  const [email, setEmail] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [notifyOnStrongOnly, setNotifyOnStrongOnly] = useState(true);
  const [dailyDigestEnabled, setDailyDigestEnabled] = useState(false);
  const [dailyDigestTime, setDailyDigestTime] = useState("18:00");
  
  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);
  
  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('email_notification_settings')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();
      
      if (error) {
        if (error.code !== 'PGRST116') { // No rows returned
          throw error;
        }
        
        // Set default email from user
        if (user?.email) {
          setEmail(user.email);
        }
      }
      
      if (data) {
        setEmail(data.email);
        setIsEnabled(data.is_enabled || false);
        setNotifyOnStrongOnly(data.notify_on_strong_only || true);
        setDailyDigestEnabled(data.daily_digest_enabled || false);
        setDailyDigestTime(data.daily_digest_time?.substring(0, 5) || "18:00");
      }
    } catch (error: any) {
      console.error("Error fetching email settings:", error);
      toast.error("Ошибка при загрузке настроек уведомлений");
    } finally {
      setLoading(false);
    }
  };
  
  const saveSettings = async () => {
    if (!user) return;
    
    setSaving(true);
    
    try {
      const { data: existingData } = await supabase
        .from('email_notification_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      const payload = {
        user_id: user.id,
        email,
        is_enabled: isEnabled,
        notify_on_strong_only: notifyOnStrongOnly,
        daily_digest_enabled: dailyDigestEnabled,
        daily_digest_time: dailyDigestTime,
        updated_at: new Date().toISOString()
      };
      
      let error;
      
      if (existingData) {
        // Update existing record
        const response = await supabase
          .from('email_notification_settings')
          .update(payload)
          .eq('user_id', user.id);
        
        error = response.error;
      } else {
        // Insert new record
        const response = await supabase
          .from('email_notification_settings')
          .insert(payload);
        
        error = response.error;
      }
      
      if (error) throw error;
      
      toast.success("Настройки уведомлений сохранены");
    } catch (error: any) {
      console.error("Error saving email settings:", error);
      toast.error("Ошибка при сохранении настроек уведомлений");
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <Card className="bg-trading-card border-trading-highlight">
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
          <CardTitle className="text-primary flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Настройки уведомлений по электронной почте
          </CardTitle>
          <CardDescription>
            Настройте получение уведомлений о новых торговых сигналах на вашу почту
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email для уведомлений</Label>
                <Input 
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-background/50"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 p-3 rounded-md bg-muted/10 mt-4">
              <Switch 
                id="notifications-enabled"
                checked={isEnabled}
                onCheckedChange={setIsEnabled}
              />
              <Label htmlFor="notifications-enabled" className="font-medium">Включить уведомления по email</Label>
            </div>
            
            {isEnabled && (
              <>
                <div className="pl-6 space-y-4">
                  <div className="flex items-center space-x-2 p-2 rounded-md">
                    <Checkbox 
                      id="strong-only"
                      checked={notifyOnStrongOnly}
                      onCheckedChange={() => setNotifyOnStrongOnly(!notifyOnStrongOnly)}
                    />
                    <Label htmlFor="strong-only">Уведомлять только о сильных сигналах (10+ индикаторов)</Label>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-medium">Ежедневная сводка</h3>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-2 rounded-md">
                      <Switch 
                        id="daily-digest"
                        checked={dailyDigestEnabled}
                        onCheckedChange={setDailyDigestEnabled}
                      />
                      <Label htmlFor="daily-digest">Отправлять ежедневную сводку сигналов</Label>
                    </div>
                    
                    {dailyDigestEnabled && (
                      <div className="ml-6 mt-2">
                        <div className="space-y-2">
                          <Label htmlFor="digest-time" className="text-sm">Время отправки сводки (МСК)</Label>
                          <TimeField 
                            value={dailyDigestTime}
                            onChange={(value) => setDailyDigestTime(value)}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Вы будете получать сводку всех активных сигналов в указанное время
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
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
