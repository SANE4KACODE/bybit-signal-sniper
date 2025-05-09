
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, ArrowLeft, CreditCard, Wallet, Shield } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

// Компонент формы оплаты через Юмани с улучшенной документацией
const YooMoneyPaymentForm = ({ onPaymentInitiated }: { onPaymentInitiated: () => void }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const handleYooMoneyPayment = async () => {
    if (!user) return;
    
    setIsProcessing(true);
    
    try {
      // В реальном приложении здесь был бы код запроса к серверному API для создания платежа
      // В качестве иллюстрации, вот как может выглядеть процесс интеграции с ЮMoney:
      
      // 1. Формируем данные для платежа
      const paymentData = {
        amount: {
          value: "1000.00",
          currency: "RUB"
        },
        confirmation: {
          type: "redirect",
          return_url: window.location.origin + "/subscription"
        },
        description: "Bybit Signal Sniper - Premium подписка (1 месяц)",
        metadata: {
          userId: user.id
        }
      };
      
      // 2. В реальном приложении отправили бы запрос на сервер, который использует API ЮMoney
      // fetch('/api/create-payment', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(paymentData)
      // }).then(res => res.json()).then(data => {
      //   // Редирект на страницу оплаты ЮMoney
      //   window.location.href = data.confirmation_url;
      // });
      
      // Для демонстрации имитируем успешную инициализацию платежа
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onPaymentInitiated();
      
      toast.success("Перенаправление на страницу оплаты Юмани...");
    } catch (error) {
      console.error("YooMoney payment error:", error);
      toast.error("Произошла ошибка при инициализации платежа");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted/20 p-4 rounded-md">
        <h3 className="font-medium mb-2">Оплата через ЮMoney</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Безопасная оплата через платежную систему ЮMoney (бывший Яндекс.Деньги)
        </p>
        
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span>Премиум подписка (1 месяц)</span>
            <span className="font-medium">1000₽</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Комиссия сервиса</span>
            <span className="font-medium">0₽</span>
          </div>
          <div className="border-t border-muted-foreground/20 my-2"></div>
          <div className="flex justify-between">
            <span>Итого к оплате:</span>
            <span className="font-bold">1000₽</span>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleYooMoneyPayment} 
        disabled={isProcessing}
        className="w-full bg-[#8b3ffd] hover:bg-[#7426fc]"
      >
        {isProcessing ? "Подготовка платежа..." : "Оплатить через ЮMoney"}
        <Wallet className="ml-2 h-4 w-4" />
      </Button>
      
      <div className="text-xs text-center text-muted-foreground">
        <p className="flex items-center justify-center">
          <Shield className="h-3 w-3 mr-1" />
          Безопасный платеж с шифрованием данных
        </p>
      </div>
      
      <div className="text-xs text-muted-foreground border-t pt-4 border-muted-foreground/20">
        <p>
          Для интеграции с ЮMoney в реальном приложении требуется:
        </p>
        <ol className="list-decimal list-inside space-y-1 mt-2">
          <li>Зарегистрироваться как бизнес в ЮMoney.</li>
          <li>Получить ключи доступа к API ЮMoney.</li>
          <li>Использовать серверный компонент для создания платежей через API ЮMoney.</li>
          <li>Обрабатывать колбэки от ЮMoney для подтверждения платежей.</li>
        </ol>
      </div>
    </div>
  );
};

// Компонент формы оплаты банковской картой с улучшенной документацией
const CardPaymentForm = ({ onPaymentInitiated }: { onPaymentInitiated: () => void }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const handleCardPayment = async () => {
    if (!user) return;
    
    setIsProcessing(true);
    
    try {
      // В реальном приложении здесь был бы код запроса к API платежной системы
      // Примерная схема для интеграции:
      
      // 1. Формируем данные для платежа
      const paymentData = {
        amount: 1000,
        currency: "RUB",
        description: "Bybit Signal Sniper - Premium подписка (1 месяц)",
        customer: {
          email: user.email
        },
        returnUrl: window.location.origin + "/subscription"
      };
      
      // 2. Отправка запроса на API платежной системы (через серверную часть)
      // const response = await fetch('/api/create-card-payment', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(paymentData)
      // });
      // const data = await response.json();
      // window.location.href = data.paymentUrl;
      
      // Имитация запроса к API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onPaymentInitiated();
      
      toast.success("Перенаправление на страницу оплаты...");
    } catch (error) {
      console.error("Card payment error:", error);
      toast.error("Произошла ошибка при инициализации платежа");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted/20 p-4 rounded-md">
        <h3 className="font-medium mb-2">Оплата банковской картой</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Поддерживаются карты Visa, Mastercard, МИР
        </p>
        
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span>Премиум подписка (1 месяц)</span>
            <span className="font-medium">1000₽</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Комиссия сервиса</span>
            <span className="font-medium">0₽</span>
          </div>
          <div className="border-t border-muted-foreground/20 my-2"></div>
          <div className="flex justify-between">
            <span>Итого к оплате:</span>
            <span className="font-bold">1000₽</span>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleCardPayment} 
        disabled={isProcessing}
        className="w-full"
      >
        {isProcessing ? "Подготовка платежа..." : "Оплатить картой"}
        <CreditCard className="ml-2 h-4 w-4" />
      </Button>
      
      <div className="text-xs text-center text-muted-foreground">
        <p className="flex items-center justify-center">
          <Shield className="h-3 w-3 mr-1" />
          Безопасный платеж по стандарту PCI DSS
        </p>
      </div>
    </div>
  );
};

const Subscription = () => {
  const navigate = useNavigate();
  const { user, profile, isPremium } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  useEffect(() => {
    document.title = "Подписка | Bybit Signal Sniper";
  }, []);
  
  const handlePaymentInitiated = async () => {
    setIsLoading(true);
    
    try {
      // В реальном приложении здесь был бы код для обработки успешной инициализации платежа
      
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
                        <span>Высокоточные сигналы с использованием 25+ индикаторов</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                        <span>Полная интеграция с TradingView и Coinglass</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                        <span>Подключение аккаунта Bybit</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                        <span>Все монеты (≈500) и все таймфреймы</span>
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
                        <span>Высокоточные сигналы с использованием 25+ индикаторов</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Полная интеграция с TradingView и все функции Coinglass</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Подключение аккаунта Bybit и отслеживание позиций</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span>Все монеты (≈500) и все таймфреймы</span>
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
                  <Tabs defaultValue="yoomoney" className="w-full">
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger value="yoomoney">ЮMoney</TabsTrigger>
                      <TabsTrigger value="card">Банковская карта</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="yoomoney">
                      <YooMoneyPaymentForm onPaymentInitiated={handlePaymentInitiated} />
                    </TabsContent>
                    
                    <TabsContent value="card">
                      <CardPaymentForm onPaymentInitiated={handlePaymentInitiated} />
                    </TabsContent>
                  </Tabs>
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
