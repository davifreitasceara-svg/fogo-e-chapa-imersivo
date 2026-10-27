import { useState, useEffect, useCallback } from "react";
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

export function useLoyalty() {
  const { user } = useAuth();
  const [stampsCount, setStampsCount] = useState<number>(0);
  const [freeBurgersCount, setFreeBurgersCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const getStorageKey = useCallback(() => {
    return user?.id ? `fogo_loyalty_${user.id}` : "fogo_guest_loyalty";
  }, [user?.id]);

  // Carregar dados de fidelidade (do Supabase Auth user_metadata ou localStorage)
  useEffect(() => {
    if (!user) {
      // Visitante
      try {
        const local = localStorage.getItem("fogo_guest_loyalty");
        if (local) {
          const parsed = JSON.parse(local);
          setStampsCount(parsed.stamps || 0);
          setFreeBurgersCount(parsed.freeBurgers || 0);
        }
      } catch {
        /* ignore */
      }
      setIsLoaded(true);
      return;
    }

    const storageKey = `fogo_loyalty_${user.id}`;
    let loadedFromCache = false;

    // 1. Tentar ler do localStorage primeiro (imediato)
    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        setStampsCount(parsed.stamps || 0);
        setFreeBurgersCount(parsed.freeBurgers || 0);
        loadedFromCache = true;
      }
    } catch {
      /* ignore */
    }

    // 2. Sincronizar com user_metadata do Supabase
    const meta = user.user_metadata as Record<string, any> | undefined;
    const metaStamps = meta?.["stamps_count"];
    const metaFreeBurgers = meta?.["free_burgers_count"];

    if (typeof metaStamps === "number") {
      setStampsCount(metaStamps);
      setFreeBurgersCount(typeof metaFreeBurgers === "number" ? metaFreeBurgers : 0);
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            stamps: metaStamps,
            freeBurgers: typeof metaFreeBurgers === "number" ? metaFreeBurgers : 0,
          }),
        );
      } catch {
        /* ignore */
      }
    } else if (!loadedFromCache) {
      // Primeira vez do usuário: inicializa com 2 carimbos de boas-vindas!
      setStampsCount(2);
      setFreeBurgersCount(0);
      try {
        localStorage.setItem(storageKey, JSON.stringify({ stamps: 2, freeBurgers: 0 }));
      } catch {
        /* ignore */
      }
    }

    setIsLoaded(true);
  }, [user]);

  // Salvar estado localmente e na nuvem
  const saveLoyaltyState = async (newStamps: number, newFreeBurgers: number) => {
    setStampsCount(newStamps);
    setFreeBurgersCount(newFreeBurgers);

    const storageKey = getStorageKey();
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ stamps: newStamps, freeBurgers: newFreeBurgers }),
      );
    } catch {
      /* ignore */
    }

    // Se usuário estiver logado, persiste no Supabase user_metadata
    if (user?.id) {
      try {
        await supabase.auth.updateUser({
          data: {
            stamps_count: newStamps,
            free_burgers_count: newFreeBurgers,
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
    products: any[],
  ): Promise<LoyaltyRewardResult> => {
    let earnedStamps = 0;

    // Percorre cada item do carrinho
    Object.entries(cart).forEach(([idStr, quantity]) => {
      const prodId = parseInt(idStr, 10);
      const qty = typeof quantity === "number" ? quantity : 0;
      if (qty <= 0) return;

      const product = products.find((p) => p.id === prodId);
      if (!product) return;

      const name = (product.name || "").toLowerCase();
      const id = product.id;

      // É COMBO? (IDs 400+, ou palavra "combo", "triplo", "aristofome", "fome dos reis")
      const isCombo =
        (id >= 400 && id < 500) ||
        name.includes("combo") ||
        name.includes("triplo") ||
        name.includes("aristofome") ||
        name.includes("fome dos reis");

      // É HAMBÚRGUER?
      const isBurger =
        product.category === "burger" && !isCombo && id < 100; // IDs de burgers artesanais (1, 2, 3, 4, 5, 6...)

      if (isCombo) {
        // Combo ganha 2 carimbos por unidade
        earnedStamps += qty * 2;
      } else if (isBurger) {
        // Hambúrguer comum ganha 1 carimbo por unidade
        earnedStamps += qty * 1;
      }
    });

    if (earnedStamps <= 0) {
      return {
        stampsEarned: 0,
        newStampsCount: stampsCount,
        freeBurgersEarned: 0,
        totalFreeBurgers: freeBurgersCount,
        completedCycle: false,
      };
    }

    const totalAccumulated = stampsCount + earnedStamps;
    const completedCycles = Math.floor(totalAccumulated / 10);
    const finalStamps = totalAccumulated % 10;
    const finalFreeBurgers = freeBurgersCount + completedCycles;

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
   * Simular ganho de carimbos para testes no perfil
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
  };
}
