
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Bookmark, LogOut, Settings, CreditCard, Crown, UserCog, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export const UserMenu = () => {
  const { user, profile, signOut, isPremium, isAdmin } = useAuth();

  if (!user) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link to="/auth" className="text-xs">Войти</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 h-8">
          {isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
          <User className="h-4 w-4" />
          <span className="hidden md:inline">{profile?.username || user.email?.split('@')[0]}</span>
          {isPremium && (
            <Badge variant="outline" className="ml-1 bg-primary/10 text-primary text-[10px] py-0">Premium</Badge>
          )}
          {isAdmin && (
            <Badge variant="outline" className="ml-1 bg-amber-500/10 text-amber-500 text-[10px] py-0">Admin</Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="flex w-full cursor-pointer items-center">
              <UserCog className="mr-2 h-4 w-4" />
              <span>Админ-панель</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to="/subscription" className="flex w-full cursor-pointer items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Подписка</span>
            {isPremium && (
              <Badge variant="outline" className="ml-auto bg-primary/10 text-primary text-[10px] py-0">Premium</Badge>
            )}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/saved-signals" className="flex w-full cursor-pointer items-center">
            <Bookmark className="mr-2 h-4 w-4" />
            <span>Сохраненные сигналы</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex w-full cursor-pointer items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Настройки</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="https://t.me/sane4kakryt" target="_blank" rel="noopener noreferrer" className="flex w-full cursor-pointer items-center">
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>Поддержка в Telegram</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
