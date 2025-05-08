
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { SignalSettings } from "@/components/settings/SignalSettings";
import { EmailSettings } from "@/components/settings/EmailSettings";
import BybitSettings from "@/components/settings/BybitSettings";
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
            <TabsTrigger value="signals">Сигналы</TabsTrigger>
            <TabsTrigger value="notifications">Уведомления</TabsTrigger>
            <TabsTrigger value="bybit">Bybit</TabsTrigger>
            <TabsTrigger value="appearance">Внешний вид</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signals">
            <SignalSettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <EmailSettings />
          </TabsContent>
          
          <TabsContent value="bybit">
            <BybitSettings />
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card className="bg-trading-card border-trading-highlight">
              <CardHeader>
                <CardTitle>Настройки отображения</CardTitle>
                <CardDescription>
                  Настройте внешний вид приложения по вашему вкусу
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Тема TradingView</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="border border-primary rounded-md p-3 cursor-pointer bg-trading-card">
                        <div className="text-center mb-2">Темная</div>
                        <div className="h-20 bg-trading-dark rounded"></div>
                      </div>
                      <div className="border border-muted rounded-md p-3 cursor-pointer">
                        <div className="text-center mb-2">Светлая</div>
                        <div className="h-20 bg-white rounded"></div>
                      </div>
                      <div className="border border-muted rounded-md p-3 cursor-pointer bg-gradient-to-br from-trading-card to-indigo-900">
                        <div className="text-center mb-2">Цветная</div>
                        <div className="h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded"></div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Выбор темы влияет на отображение графиков TradingView
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
