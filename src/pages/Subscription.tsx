
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, CreditCard } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

const Subscription = () => {
  const navigate = useNavigate();
  const { user, profile, isPremium } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  useEffect(() => {
    document.title = "Подписка | Bybit Signal Sniper";
  }, []);
  
  const handleSubscribe = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // В реальном приложении здесь был бы код для интеграции с платежным шлюзом
      // и обработки платежа. Для демо мы просто имитируем успешную подписку.
      
      setTimeout(() => {
        toast.success("Подписка оформлена успешно!");
        setFormSubmitted(true);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Произошла ошибка при оформлении подписки");
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-trading-dark">
      <header className="bg-trading-card border-b border-trading-highlight p-4">
        <div className="container">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Подписка</h1>
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
        <div className="max-w-3xl mx-auto">
          {isPremium ? (
            <Card className="bg-gradient-to-br from-indigo-700 to-violet-900 border-primary text-white">
              <CardHeader>
                <CardTitle className="text-2xl">У вас активна Premium подписка!</CardTitle>
                <CardDescription className="text-gray-200">
                  Спасибо за поддержку Bybit Signal Sniper
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div>
                    <p className="mb-4">
                      Ваша подписка дает вам доступ ко всем премиум функциям:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                        <span>Высокоточные сигналы с использованием 10+ индикаторов</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                        <span>Интеграция с TradingView и Coinglass</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                        <span>Подключение аккаунта Bybit</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                        <span>Все монеты и все таймфреймы</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                        <span>Настраиваемые цветовые схемы и темы</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="secondary">
                  <Link to="/">
                    Вернуться на главную
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ) : formSubmitted ? (
            <Card className="bg-gradient-to-br from-green-600 to-emerald-800 border-green-500 text-white">
              <CardHeader>
                <CardTitle className="text-xl">Подписка успешно оформлена!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Спасибо за оформление Premium подписки! Теперь вам доступны все возможности платформы.
                </p>
                <p className="text-sm mb-6">
                  Ваша подписка будет активна в течение следующих 30 дней.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" asChild>
                  <Link to="/">
                    Вернуться на главную
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="space-y-8">
              <Card className="bg-gradient-to-br from-trading-card to-indigo-900 border-trading-highlight">
                <CardHeader>
                  <CardTitle className="text-xl">Premium подписка</CardTitle>
                  <CardDescription>
                    Разблокируйте все функции Bybit Signal Sniper
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold">1000₽</div>
                      <div className="text-sm text-muted-foreground">в месяц</div>
                    </div>
                    
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Высокоточные сигналы с использованием 10+ индикаторов</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Интеграция с TradingView и Coinglass</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Подключение аккаунта Bybit</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Все монеты и все таймфреймы</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Настраиваемые цветовые схемы и темы</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Приоритетная техническая поддержка</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleSubscribe} 
                    disabled={isLoading} 
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                  >
                    {isLoading ? "Обработка..." : "Оформить подписку"}
                    <CreditCard className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="text-sm text-muted-foreground text-center">
                <p>Оформляя подписку, вы соглашаетесь с <Link to="/terms" className="text-primary hover:underline">правилами использования</Link> сервиса.</p>
                <p className="mt-2">Отменить подписку можно в любой момент из личного кабинета.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
