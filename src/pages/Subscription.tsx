
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";

const Subscription = () => {
  const navigate = useNavigate();
  const { user, profile, isPremium } = useAuth();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    document.title = "Подписка | Bybit Signal Sniper";
  }, []);
  
  const handleSubscribe = async () => {
    setLoading(true);
    // Здесь будет интеграция с платёжной системой
    
    // Временная имитация подписки для демонстрации
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-trading-dark text-foreground">
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
          <h2 className="text-2xl font-bold mb-6 text-center">Выберите план подписки</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <Card className={`border-2 ${!isPremium ? 'border-primary' : 'border-transparent'} bg-trading-card`}>
              <CardHeader>
                <CardTitle>Базовый план</CardTitle>
                <CardDescription>Бесплатно</CardDescription>
                {!isPremium && <div className="absolute top-4 right-4 bg-primary text-xs px-2 py-1 rounded-full">Ваш план</div>}
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Базовые сигналы</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Список активных рынков</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Аналитика открытого интереса</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled>
                  Текущий план
                </Button>
              </CardFooter>
            </Card>
            
            {/* Premium Plan */}
            <Card className={`border-2 ${isPremium ? 'border-primary' : 'border-transparent'} bg-trading-card`}>
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <CardDescription>1000₽ / месяц</CardDescription>
                {isPremium && <div className="absolute top-4 right-4 bg-primary text-xs px-2 py-1 rounded-full">Ваш план</div>}
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span>Все базовые функции</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span>Высокоточные сигналы (10+ индикаторов)</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span>Интеграция с TradingView</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span>Подробная аналитика сигналов</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span>Email-уведомления о сигналах</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span>Приоритетная техподдержка</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {isPremium ? (
                  <Button variant="outline" className="w-full" disabled>
                    Активен до {new Date(profile?.subscription?.expires_at || '').toLocaleDateString('ru-RU')}
                  </Button>
                ) : (
                  <Button className="w-full" onClick={handleSubscribe} disabled={loading || !user}>
                    {loading ? "Обработка..." : "Подписаться"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
          
          {!user && (
            <div className="mt-6 p-4 bg-muted/20 rounded text-center">
              <p>Для оформления подписки необходимо войти в систему</p>
              <Button asChild className="mt-2">
                <Link to="/auth">Войти</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
