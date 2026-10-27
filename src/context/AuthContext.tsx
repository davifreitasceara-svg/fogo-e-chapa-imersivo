import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Obter sessão inicial
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar sessão do Supabase:", err);
        setIsLoading(false);
      });

    // 2. Ouvir mudanças no estado de autenticação (OAuth login, logout, refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      if (event === "SIGNED_IN" && session?.user) {
        const metadata = session.user.user_metadata as Record<string, any> | undefined;
        const userName =
          metadata?.["full_name"] ||
          metadata?.["name"] ||
          session.user.email?.split("@")[0] ||
          "Cliente";
        toast.success(`Bem-vindo ao Fogo & Chapa, ${userName}! 🔥`);
      } else if (event === "SIGNED_OUT") {
        toast.info("Você saiu da sua conta.");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const redirectOrigin =
        typeof window !== "undefined" && window.location.origin
          ? window.location.origin
          : undefined;

      const options = redirectOrigin
        ? {
            redirectTo: redirectOrigin,
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
          }
        : {
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
          };

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options,
      });

      if (error) {
        console.error("Erro no login Google Supabase:", error);
        toast.error(`Falha no login com Google: ${error.message}`);
        throw error;
      }
    } catch (error: any) {
      console.error("Falha ao iniciar autenticação com Google:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
    } catch (error: any) {
      toast.error(`Erro ao sair: ${error.message}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
