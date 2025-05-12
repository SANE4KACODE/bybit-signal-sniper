
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Search, User, UserPlus, UserCheck, UserX, Calendar, AlertTriangle, ArrowLeftRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Расширяем интерфейс для данных пользователя с учетом данных из профиля
interface UserData {
  id: string;
  email: string;
  username: string | null;
  last_login: string | null;
  created_at: string;
  timezone: string | null;
  // Эти данные будем получать из контекста, а не из базы данных
  isPremium?: boolean;
  premiumExpiry?: string | null;
  premiumStartDate?: string | null;
}

// Схема формы для добавления/редактирования подписки
const subscriptionFormSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  username: z.string().nullable(),
  months: z.number().int().positive().default(1),
  subscriptionActive: z.boolean().default(true),
});

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [tabView, setTabView] = useState("all");
  
  // Форма для управления подпиской
  const subscriptionForm = useForm<z.infer<typeof subscriptionFormSchema>>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      userId: "",
      email: "",
      username: null,
      months: 1,
      subscriptionActive: true,
    },
  });

  // Проверка прав администратора
  useEffect(() => {
    if (!isAdmin && user) {
      toast.error("У вас нет прав администратора");
      navigate("/");
    }
  }, [isAdmin, user, navigate]);

  // Загрузка списка пользователей
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  // Фильтрация пользователей
  useEffect(() => {
    if (searchQuery.trim() === "") {
      // Если строка поиска пуста, применяем только фильтр по вкладке
      filterUsersByTab(users);
    } else {
      // Применяем поиск и фильтр по вкладке
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(user => 
        (user.email.toLowerCase().includes(query) || 
        (user.username && user.username.toLowerCase().includes(query)))
      );
      filterUsersByTab(filtered);
    }
  }, [searchQuery, users, tabView]);

  // Фильтрация по вкладке
  const filterUsersByTab = (usersToFilter: UserData[]) => {
    let result = [...usersToFilter];
    
    if (tabView === "premium") {
      // Для демонстрации мы будем считать premium всех пользователей с определенными email
      result = result.filter(user => 
        user.email === "lubolyad@gmail.com" || 
        user.isPremium || 
        user.username === "admin"
      );
    } else if (tabView === "free") {
      result = result.filter(user => 
        !(user.email === "lubolyad@gmail.com" || 
        user.isPremium || 
        user.username === "admin")
      );
    }
    
    setFilteredUsers(result);
  };

  // Загрузка списка пользователей
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Получаем всех пользователей из базы данных
      const { data, error } = await supabase
        .from('users')
        .select('*');
        
      if (error) throw error;

      // Преобразуем данные
      const processedUsers: UserData[] = data.map(user => {
        // Для демонстрационных целей, отмечаем пользователей как premium
        // основываясь на их email или имени пользователя
        const isPremium = user.email === "lubolyad@gmail.com" || user.username === "admin";
        
        return {
          id: user.id,
          email: user.email,
          username: user.username,
          last_login: user.last_login,
          created_at: user.created_at,
          timezone: user.timezone,
          isPremium: isPremium,
          // Демонстрационная дата окончания подписки (1 год от текущей даты)
          premiumExpiry: isPremium ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString() : null,
          premiumStartDate: isPremium ? new Date().toISOString() : null
        };
      });
      
      setUsers(processedUsers);
      setFilteredUsers(processedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Ошибка загрузки списка пользователей");
    } finally {
      setIsLoading(false);
    }
  };

  // Открытие диалога добавления пользователя
  const openAddUserDialog = () => {
    setIsAddUserDialogOpen(true);
  };

  // Открытие панели деталей пользователя
  const openUserDetails = (user: UserData) => {
    setSelectedUser(user);
    
    // Установка значений формы
    subscriptionForm.reset({
      userId: user.id,
      email: user.email,
      username: user.username,
      months: 1,
      subscriptionActive: user.isPremium || false
    });
    
    setIsUserDetailsOpen(true);
  };

  // Обновление подписки пользователя
  const handleSubscriptionUpdate = async (data: z.infer<typeof subscriptionFormSchema>) => {
    try {
      toast.loading("Обновление подписки...");
      
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          username: data.username
        })
        .eq('id', data.userId);
      
      if (userUpdateError) throw userUpdateError;
      
      // Обновляем локальное состояние пользователей
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === data.userId 
            ? { 
                ...u, 
                username: data.username, 
                isPremium: data.subscriptionActive,
                premiumExpiry: data.subscriptionActive 
                  ? new Date(new Date().setMonth(new Date().getMonth() + data.months)).toISOString() 
                  : null,
                premiumStartDate: data.subscriptionActive ? new Date().toISOString() : null
              } 
            : u
        )
      );
      
      toast.dismiss();
      toast.success("Подписка пользователя успешно обновлена");
      setIsUserDetailsOpen(false);
      
      // Применяем текущие фильтры к обновлённому списку
      filterUsersByTab([...users]);
    } catch (error) {
      toast.dismiss();
      console.error("Error updating subscription:", error);
      toast.error("Ошибка обновления подписки");
    }
  };

  // Удаление пользователя
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Вы действительно хотите удалить этого пользователя?")) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
        
      if (error) throw error;
      
      toast.success("Пользователь успешно удален");
      setUsers(users.filter(u => u.id !== userId));
      setFilteredUsers(filteredUsers.filter(u => u.id !== userId));
      setIsUserDetailsOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Ошибка удаления пользователя");
    }
  };
  
  // Добавление нового пользователя и активация подписки
  const handleAddUser = async (email: string) => {
    try {
      // Проверяем существование пользователя
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingUser) {
        // Пользователь существует, обновляем локальное состояние
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === existingUser.id 
              ? { 
                  ...u, 
                  isPremium: true,
                  premiumExpiry: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
                  premiumStartDate: new Date().toISOString()
                } 
              : u
          )
        );
        
        toast.success(`Подписка для ${email} активирована`);
      } else {
        // Пользователь не существует
        toast.error(`Пользователь ${email} не найден в системе`);
      }
      
      setIsAddUserDialogOpen(false);
      // Применяем текущие фильтры к обновлённому списку
      filterUsersByTab([...users]);
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Ошибка активации подписки");
    }
  };
  
  // Если загружаем данные или нет прав админа
  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-trading-dark flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Админ-панель</CardTitle>
            <CardDescription className="text-center">
              {isLoading ? "Загрузка данных..." : "Проверка прав доступа..."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-trading-dark">
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            Админ-панель
          </h1>
          <p className="text-muted-foreground">Управление пользователями и подписками</p>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Пользователи ({filteredUsers.length})</CardTitle>
                <CardDescription>Управление учетными записями</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Поиск пользователей..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button onClick={openAddUserDialog}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Активировать подписку
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={tabView} onValueChange={setTabView} className="mb-4">
              <TabsList>
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="premium">Premium</TabsTrigger>
                <TabsTrigger value="free">Без подписки</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {filteredUsers.length > 0 ? (
              <div className="border rounded-md">
                <div className="grid grid-cols-12 gap-2 p-3 font-medium border-b bg-muted/50 text-sm">
                  <div className="col-span-5">Email / Имя пользователя</div>
                  <div className="col-span-2">Регистрация</div>
                  <div className="col-span-2">Последний вход</div>
                  <div className="col-span-2 text-center">Статус</div>
                  <div className="col-span-1 text-right">Действия</div>
                </div>
                
                <div className="divide-y">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="grid grid-cols-12 gap-2 p-3 items-center text-sm hover:bg-muted/30 transition-colors">
                      <div className="col-span-5">
                        <div className="font-medium">{user.email}</div>
                        {user.username && <div className="text-xs text-muted-foreground">{user.username}</div>}
                      </div>
                      <div className="col-span-2 text-muted-foreground">
                        {user.created_at ? format(new Date(user.created_at), 'dd MMM yyyy', { locale: ru }) : '—'}
                      </div>
                      <div className="col-span-2 text-muted-foreground">
                        {user.last_login ? format(new Date(user.last_login), 'dd MMM yyyy', { locale: ru }) : '—'}
                      </div>
                      <div className="col-span-2 text-center">
                        {user.isPremium ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <Crown className="mr-1 h-3 w-3" />
                            Premium
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                            Базовый
                          </span>
                        )}
                      </div>
                      <div className="col-span-1 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openUserDetails(user)}
                        >
                          <span className="sr-only">Управление</span>
                          <ArrowLeftRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'Пользователи не найдены' : 'Нет доступных пользователей'}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={fetchUsers}>
              Обновить список
            </Button>
            <div className="text-sm text-muted-foreground">
              Всего пользователей: {users.length}
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Диалог добавления нового пользователя */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Активация Premium подписки</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Введите email пользователя, которому нужно активировать Premium подписку
              </p>
              <Input
                id="email"
                placeholder="Email пользователя"
                type="email"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    handleAddUser(input.value);
                  }
                }}
              />
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 p-3 rounded text-sm text-amber-800 dark:text-amber-300 flex items-start">
              <AlertTriangle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
              <p>Пользователь должен быть зарегистрирован в системе. После активации подписка будет действовать 1 месяц.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>Отмена</Button>
            <Button onClick={() => {
              const emailInput = document.getElementById('email') as HTMLInputElement;
              handleAddUser(emailInput.value);
            }}>Активировать</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Боковая панель с деталями пользователя */}
      <Sheet open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Управление пользователем</SheetTitle>
            <SheetDescription>
              {selectedUser?.email}
            </SheetDescription>
          </SheetHeader>
          
          {selectedUser && (
            <div className="py-6 space-y-6">
              <div className="space-y-1">
                <h3 className="font-medium text-sm">Основная информация</h3>
                <div className="bg-muted/50 p-3 rounded-md space-y-2">
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-muted-foreground">ID пользователя:</div>
                    <div className="text-sm font-mono text-xs overflow-hidden text-ellipsis">{selectedUser.id}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-muted-foreground">Имя пользователя:</div>
                    <div className="text-sm">{selectedUser.username || '—'}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-muted-foreground">Дата регистрации:</div>
                    <div className="text-sm">
                      {selectedUser.created_at ? format(new Date(selectedUser.created_at), 'dd MMM yyyy, HH:mm', { locale: ru }) : '—'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-muted-foreground">Последний вход:</div>
                    <div className="text-sm">
                      {selectedUser.last_login ? format(new Date(selectedUser.last_login), 'dd MMM yyyy, HH:mm', { locale: ru }) : '—'}
                    </div>
                  </div>
                </div>
              </div>
              
              <Form {...subscriptionForm}>
                <form onSubmit={subscriptionForm.handleSubmit(handleSubscriptionUpdate)} className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Управление подпиской</h3>
                    
                    <FormField
                      control={subscriptionForm.control}
                      name="subscriptionActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Статус Premium-подписки</FormLabel>
                            <FormDescription>
                              {field.value ? 'Активна' : 'Не активна'}
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Button
                              type="button"
                              variant={field.value ? "default" : "outline"}
                              className={`${field.value ? 'bg-green-600 hover:bg-green-700' : ''}`}
                              onClick={() => field.onChange(!field.value)}
                            >
                              {field.value ? (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Активна
                                </>
                              ) : (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Не активна
                                </>
                              )}
                            </Button>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={subscriptionForm.control}
                      name="months"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Продолжительность подписки</FormLabel>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                max="12" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">месяцев</span>
                          </div>
                          <FormDescription>
                            Срок действия Premium подписки
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {selectedUser.isPremium && selectedUser.premiumExpiry && (
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">
                          Текущая подписка истекает: <span className="font-medium text-foreground">
                            {format(new Date(selectedUser.premiumExpiry), 'dd MMMM yyyy', { locale: ru })}
                          </span>
                        </p>
                      </div>
                    )}
                    
                    <div className="pt-2 flex justify-between">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleDeleteUser(selectedUser.id)}
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        Удалить пользователя
                      </Button>
                      
                      <Button type="submit">Сохранить изменения</Button>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Admin;
