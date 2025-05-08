
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (signUpError) throw signUpError;
      
      if (data.user) {
        // Determine if this is the admin email
        const isAdmin = email.toLowerCase() === "lubolyad@gmail.com";
        
        // Create a user profile with username and detected timezone
        const { error: profileError } = await supabase
          .from('users')
          .update({ 
            username, 
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            role: isAdmin ? 'admin' : 'free',
            subscription_plan: isAdmin ? 'premium' : 'free',
            subscription_expires_at: isAdmin ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null
          })
          .eq('id', data.user.id);
        
        if (profileError) throw profileError;
        
        toast.success("Аккаунт успешно создан, можете войти");
        setEmail("");
        setPassword("");
        setUsername("");
      }
    } catch (error: any) {
      toast.error(error.message || "Ошибка при регистрации");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Update last login time and ensure timezone is up to date
      if (data.user) {
        await supabase
          .from('users')
          .update({ 
            last_login: new Date().toISOString(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone 
          })
          .eq('id', data.user.id);
      }
      
      toast.success("Вход выполнен успешно");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Ошибка при входе");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-trading-dark flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-trading-card border-trading-highlight">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Bybit Signal Sniper</CardTitle>
          <CardDescription className="text-center">
            Войдите или создайте аккаунт для сохранения сигналов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="signin">Вход</TabsTrigger>
              <TabsTrigger value="signup">Регистрация</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Входим..." : "Войти"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Регистрируемся..." : "Создать аккаунт"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            Bybit Signal Sniper — Профессиональный инструмент для трейдеров
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
