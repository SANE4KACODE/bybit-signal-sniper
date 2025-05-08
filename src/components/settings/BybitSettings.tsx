
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BybitAccountConnect from "@/components/BybitAccountConnect";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Crown } from "lucide-react";

export const BybitSettings = () => {
  const { isPremium } = useAuth();
  
  if (!isPremium) {
    return (
      <Card className="bg-gradient-to-br from-trading-card to-indigo-900 border-trading-highlight">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="h-5 w-5 mr-2 text-yellow-500" />
            Функция доступна только в Premium
          </CardTitle>
          <CardDescription>
            Подключение аккаунта Bybit доступно только для Premium пользователей
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Premium подписка позволяет подключить ваш аккаунт Bybit и получить доступ к:
            </p>
            <ul className="space-y-1 text-sm">
              <li>• Просмотру ваших позиций</li>
              <li>• Отслеживанию ордеров</li>
              <li>• Балансу и истории торгов</li>
            </ul>
            <Button asChild>
              <Link to="/subscription">Перейти на Premium</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Настройки аккаунта Bybit</CardTitle>
        <CardDescription>
          Подключите ваш аккаунт Bybit для отслеживания позиций и выполнения торговых операций
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="account">
          <TabsList className="mb-4">
            <TabsTrigger value="account">Аккаунт</TabsTrigger>
            <TabsTrigger value="trading">Настройки торговли</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <BybitAccountConnect />
          </TabsContent>
          
          <TabsContent value="trading">
            <Card>
              <CardHeader>
                <CardTitle>Настройки торговли</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Эта функциональность будет доступна после подключения аккаунта Bybit.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BybitSettings;
