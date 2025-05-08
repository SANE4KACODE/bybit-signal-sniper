
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Key, KeyRound, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ApiKeyForm {
  apiKey: string;
  apiSecret: string;
  testnet: boolean;
}

const BybitAccountConnect = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [formData, setFormData] = useState<ApiKeyForm>({
    apiKey: '',
    apiSecret: '',
    testnet: false,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.apiKey || !formData.apiSecret) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите API ключ и секрет",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, you would validate the API keys with Bybit
      // For this demo, we're simulating a successful connection
      setTimeout(() => {
        setIsConnected(true);
        toast({
          title: "Успешно",
          description: "Аккаунт Bybit успешно подключен",
        });
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error connecting to Bybit:', error);
      toast({
        title: "Ошибка подключения",
        description: "Не удалось подключиться к Bybit. Проверьте ваши API ключи.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  const handleDisconnect = () => {
    setIsConnected(false);
    setFormData({
      apiKey: '',
      apiSecret: '',
      testnet: false,
    });
    toast({
      title: "Отключено",
      description: "Аккаунт Bybit отключен",
    });
  };
  
  if (isConnected) {
    return (
      <Card className="bg-trading-card border-trading-highlight">
        <CardHeader>
          <CardTitle className="text-success flex items-center">
            <KeyRound className="mr-2 h-5 w-5" />
            Аккаунт Bybit подключен
          </CardTitle>
          <CardDescription>
            Ваш аккаунт Bybit успешно подключен к Signal Sniper
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Теперь вы можете просматривать данные о ваших торгах и позициях прямо в приложении
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" onClick={handleDisconnect}>
            Отключить аккаунт
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="bg-trading-card border-trading-highlight">
      <CardHeader>
        <CardTitle>Подключение аккаунта Bybit</CardTitle>
        <CardDescription>
          Подключите ваш аккаунт Bybit для отслеживания позиций и выполнения торговых операций
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleConnect} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Ключ</Label>
            <Input
              id="apiKey"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              placeholder="Введите ваш API ключ Bybit"
              className="bg-trading-highlight/30"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="apiSecret">API Секрет</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowSecret(!showSecret)}
                className="h-6 px-2"
              >
                {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
              </Button>
            </div>
            <Input
              id="apiSecret"
              name="apiSecret"
              type={showSecret ? "text" : "password"}
              value={formData.apiSecret}
              onChange={handleChange}
              placeholder="Введите ваш API секрет Bybit"
              className="bg-trading-highlight/30"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="testnet"
              name="testnet"
              checked={formData.testnet}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, testnet: checked }))
              }
            />
            <Label htmlFor="testnet">Использовать Testnet (тестовую сеть)</Label>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Подключение..." : "Подключить аккаунт Bybit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BybitAccountConnect;
