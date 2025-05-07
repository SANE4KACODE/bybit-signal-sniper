
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { SignalSettings } from "@/components/settings/SignalSettings";
import { EmailSettings } from "@/components/settings/EmailSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
    
    document.title = "Настройки | Bybit Signal Sniper";
  }, [user, navigate]);
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-trading-dark text-foreground">
      <header className="bg-trading-card border-b border-trading-highlight p-4">
        <div className="container">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Настройки</h1>
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                На главную
              </Link>
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container my-8">
        <Tabs defaultValue="signals" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="signals">Настройки сигналов</TabsTrigger>
            <TabsTrigger value="notifications">Настройки уведомлений</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signals">
            <SignalSettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <EmailSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
