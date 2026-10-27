import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LoyaltyRewardResult {
  stampsEarned: number;
  newStampsCount: number;
  freeBurgersEarned: number;
  totalFreeBurgers: number;
  completedCycle: boolean;
}

const LOYALTY_SYNC_EVENT = "fogo_loyalty_sync";

function broadcastLoyaltyUpdate(stamps: number, freeBurgers: number) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(LOYALTY_SYNC_EVENT, {
        detail: { stamps, freeBurgers },
      }),
    );
  }
}

export function useLoyalty() {
  const { user } = useAuth();
  const [stampsCount, setStampsCount] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    try {
      const key = "fogo_guest_loyalty";
      const local = localStorage.getItem(key);
      if (local) {
        const parsed = JSON.parse(local);
        return typeof parsed.stamps === "number" ? parsed.stamps : 2;
      }
    } catch {}
    return 2;
  });
  const [freeBurgersCount, setFreeBurgersCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const getStorageKey = useCallback(() => {
    return user?.id ? `fogo_loyalty_${user.id}` : "fogo_guest_loyalty";
  }, [user?.id]);

  const loadFromStorage = useCallback(() => {
    if (typeof window === "undefined") return null;
    const storageKey = user?.id ? `fogo_loyalty_${user.id}` : "fogo_guest_loyalty";
    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        const stamps = typeof parsed.stamps === "number" ? parsed.stamps : 0;
        const free = typeof parsed.freeBurgers === "number" ? parsed.freeBurgers : 0;
        setStampsCount(stamps);
        setFreeBurgersCount(free);
        return { stamps, free };
      }
    } catch {}
    return null;
  }, [user?.id]);

  // Carregar dados de fidelidade com sincronização
  const refreshLoyalty = useCallback(() => {
    if (typeof window === "undefined") return;

    if (!user) {
      // Visitante
      const fromLocal = loadFromStorage();
      if (!fromLocal) {
        setStampsCount(2);
        setFreeBurgersCount(0);
        try {
          localStorage.setItem("fogo_guest_loyalty", JSON.stringify({ stamps: 2, freeBurgers: 0 }));
        } catch {}
      }
      setIsLoaded(true);
      return;
    }

    const storageKey = `fogo_loyalty_${user.id}`;
    const fromLocal = loadFromStorage();

    // Se o usuário logou e tinha carimbos salvos como visitante, migra para a conta dele
    const guestData = localStorage.getItem("fogo_guest_loyalty");
    if (!fromLocal && guestData) {
      try {
        const parsedGuest = JSON.parse(guestData);
        if (parsedGuest.stamps > 0 || parsedGuest.freeBurgers > 0) {
          setStampsCount(parsedGuest.stamps);
          setFreeBurgersCount(parsedGuest.freeBurgers || 0);
          localStorage.setItem(storageKey, guestData);
          localStorage.removeItem("fogo_guest_loyalty");
          setIsLoaded(true);
          return;
        }
      } catch {}
    }

    // Se não há dados no localStorage, verifica user_metadata do Supabase ou dá 2 carimbos de boas-vindas
    if (!fromLocal) {
      const meta = user.user_metadata as Record<string, any> | undefined;
      const metaStamps = meta?.["stamps_count"];
      const metaFreeBurgers = meta?.["free_burgers_count"];

      const initialStamps = typeof metaStamps === "number" ? metaStamps : 2;
      const initialFree = typeof metaFreeBurgers === "number" ? metaFreeBurgers : 0;
      setStampsCount(initialStamps);
      setFreeBurgersCount(initialFree);
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ stamps: initialStamps, freeBurgers: initialFree }),
        );
      } catch {}
    } else {
      // Já tem dados no localStorage. Verifica se o Supabase tem contagem maior
      const meta = user.user_metadata as Record<string, any> | undefined;
      const metaStamps = meta?.["stamps_count"];
      const metaFree = meta?.["free_burgers_count"];
      if (typeof metaStamps === "number" && metaStamps > fromLocal.stamps) {
        setStampsCount(metaStamps);
        setFreeBurgersCount(typeof metaFree === "number" ? metaFree : fromLocal.free);
        try {
          localStorage.setItem(
            storageKey,
            JSON.stringify({ stamps: metaStamps, freeBurgers: metaFree || fromLocal.free }),
          );
        } catch {}
      }
    }

    setIsLoaded(true);
  }, [user, loadFromStorage]);

  useEffect(() => {
    refreshLoyalty();

    // Listener para sincronização instantânea entre abas e entre componentes montados
    const handleSync = (e: Event) => {
      const custom = e as CustomEvent<{ stamps: number; freeBurgers: number }>;
      if (custom.detail) {
        setStampsCount(custom.detail.stamps);
        setFreeBurgersCount(custom.detail.freeBurgers);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      const key = getStorageKey();
      if (e.key === key && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (typeof parsed.stamps === "number") setStampsCount(parsed.stamps);
          if (typeof parsed.freeBurgers === "number") setFreeBurgersCount(parsed.freeBurgers);
        } catch {}
      }
    };

    window.addEventListener(LOYALTY_SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(LOYALTY_SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleStorage);
    };
  }, [refreshLoyalty, getStorageKey]);

  // Salvar estado localmente e na nuvem, notificando todos os ouvintes
  const saveLoyaltyState = async (newStamps: number, newFreeBurgers: number) => {
    setStampsCount(newStamps);
    setFreeBurgersCount(newFreeBurgers);

    const storageKey = getStorageKey();
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          stamps: newStamps,
          freeBurgers: newFreeBurgers,
          updatedAt: Date.now(),
        }),
      );
      // Salva também na chave visitante como backup local seguro
      if (!user?.id) {
        localStorage.setItem(
          "fogo_guest_loyalty",
          JSON.stringify({ stamps: newStamps, freeBurgers: newFreeBurgers }),
        );
      }
    } catch {
      /* ignore */
    }

    // Notifica todos os componentes montados (UserProfileModal, CartSheet, etc.)
    broadcastLoyaltyUpdate(newStamps, newFreeBurgers);

    // Se usuário estiver logado, persiste no Supabase user_metadata
    if (user?.id) {
      try {
        await supabase.auth.updateUser({
          data: {
            stamps_count: newStamps,
            free_burgers_count: newFreeBurgers,
            loyalty_updated_at: Date.now(),
          },
        });
      } catch (err) {
        console.warn("Aviso ao salvar fidelidade no Supabase:", err);
      }
    }
  };

  /**
   * Calcula os carimbos conquistados com base nos itens do carrinho:
   * - Cada Hambúrguer = 1 carimbo
   * - Cada Combo = 2 carimbos
   * Ao completar 10 carimbos = ganha 1 Burger Grátis!
   */
  const processOrderRewards = async (
    cart: Record<number, number>,
    products: any[] = [],
  ): Promise<LoyaltyRewardResult> => {
    let earnedStamps = 0;

    // Garante que o estado mais recente esteja carregado antes de somar
    const storageKey = getStorageKey();
    let currentStamps = stampsCount;
    let currentFree = freeBurgersCount;
    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (typeof parsed.stamps === "number") currentStamps = parsed.stamps;
        if (typeof parsed.freeBurgers === "number") currentFree = parsed.freeBurgers;
      }
    } catch {}

    // Percorre cada item do carrinho
    Object.entries(cart).forEach(([idStr, quantity]) => {
      const prodId = parseInt(idStr, 10);
      const qty = typeof quantity === "number" ? quantity : 0;
      if (qty <= 0) return;

      const product = products.find((p) => p.id === prodId);
      const name = (product?.name || "").toLowerCase();
      const id = prodId;

      // 1. É COMBO? (IDs 400+, ou palavra combo, triplo, aristofome, reis)
      const isCombo =
        (id >= 400 && id < 500) ||
        name.includes("combo") ||
        name.includes("triplo") ||
        name.includes("aristofome") ||
        name.includes("reis") ||
        name.includes("fome dos reis");

      // 2. É HAMBÚRGUER? (Qualquer burger do menu, ou id 1 a 20, ou nome contendo burger/burguer)
      const isBurger =
        !isCombo &&
        (product?.category === "burger" ||
          (id >= 1 && id <= 20) ||
          name.includes("burger") ||
          name.includes("burguer") ||
          name.includes("brasa") ||
          name.includes("inferno") ||
          name.includes("davi vs golias") ||
          name.includes("triplex") ||
          name.includes("mac"));

      if (isCombo) {
        earnedStamps += qty * 2;
      } else if (isBurger) {
        earnedStamps += qty * 1;
      }
    });

    // Se o cliente comprou algo mas por ventura não bateu na categoria (ex: entrada premium),
    // dá pelo menos 1 carimbo de incentivo
    if (earnedStamps <= 0 && Object.keys(cart).length > 0) {
      earnedStamps = 1;
    }

    if (earnedStamps <= 0) {
      return {
        stampsEarned: 0,
        newStampsCount: currentStamps,
        freeBurgersEarned: 0,
        totalFreeBurgers: currentFree,
        completedCycle: false,
      };
    }

    const totalAccumulated = currentStamps + earnedStamps;
    const completedCycles = Math.floor(totalAccumulated / 10);
    const finalStamps = totalAccumulated % 10;
    const finalFreeBurgers = currentFree + completedCycles;

    await saveLoyaltyState(finalStamps, finalFreeBurgers);

    return {
      stampsEarned: earnedStamps,
      newStampsCount: finalStamps,
      freeBurgersEarned: completedCycles,
      totalFreeBurgers: finalFreeBurgers,
      completedCycle: completedCycles > 0,
    };
  };

  /**
   * Resgatar 1 burger grátis acumulado
   */
  const redeemFreeBurger = async (): Promise<boolean> => {
    if (freeBurgersCount <= 0) {
      toast.error("Você ainda não possui burgers grátis para resgatar.");
      return false;
    }

    const nextCount = freeBurgersCount - 1;
    await saveLoyaltyState(stampsCount, nextCount);
    toast.success("🎁 1 Burger Grátis resgatado com sucesso!");
    return true;
  };

  /**
   * Adicionar carimbos manualmente (para testes no perfil ou promoções)
   */
  const addStampManual = async (amount: number = 1) => {
    const total = stampsCount + amount;
    const cycles = Math.floor(total / 10);
    const remainder = total % 10;
    const newFree = freeBurgersCount + cycles;
    await saveLoyaltyState(remainder, newFree);
    return { stamps: remainder, freeBurgers: newFree, wonFree: cycles > 0 };
  };

  /**
   * Reiniciar cartela
   */
  const resetStamps = async () => {
    await saveLoyaltyState(0, freeBurgersCount);
  };

  return {
    stampsCount,
    freeBurgersCount,
    isLoaded,
    processOrderRewards,
    redeemFreeBurger,
    addStampManual,
    resetStamps,
    saveLoyaltyState,
    refreshLoyalty,
  };
}
