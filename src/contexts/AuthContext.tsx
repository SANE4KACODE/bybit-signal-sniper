
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "@/components/ui/sonner";
import { SubscriptionPlan, UserRole } from "@/types";

type UserProfile = {
  id: string;
  username: string | null;
  timezone: string;
  role: UserRole;
  subscription: {
    plan: SubscriptionPlan;
    expires_at: string | null;
    active: boolean;
  };
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isPremium: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Fetch user profile in a separate function to avoid deadlocks
        if (newSession?.user) {
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }

        if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        if (data.session?.user) {
          await fetchUserProfile(data.session.user.id);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, timezone')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      // Since 'role', 'subscription_plan', and 'subscription_expires_at' columns don't exist
      // We'll use default values and check if the email is the admin email
      const isAdminUser = data.username === 'admin' || (user?.email === 'lubolyad@gmail.com');
      const subscriptionPlan = isAdminUser ? 'premium' : 'free';
      const subscriptionExpiresAt = isAdminUser ? '2099-12-31' : null;
      
      setProfile({
        id: data.id,
        username: data.username,
        timezone: data.timezone || 'Europe/Moscow',
        role: isAdminUser ? 'admin' : 'free',
        subscription: {
          plan: subscriptionPlan,
          expires_at: subscriptionExpiresAt,
          active: subscriptionPlan === 'premium'
        }
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Вы успешно вышли из системы");
    } catch (error: any) {
      toast.error(error.message || "Ошибка при выходе");
    }
  };

  // Determine user permissions
  const isAdmin = profile?.role === 'admin' || user?.email === 'lubolyad@gmail.com';
  const isPremium = isAdmin || (profile?.subscription?.active && profile?.subscription?.plan === 'premium');

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      loading, 
      signOut,
      isAdmin,
      isPremium
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
