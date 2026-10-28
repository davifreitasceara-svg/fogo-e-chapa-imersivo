import { useState, useEffect, useCallback, useMemo } from "react";
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

export interface LoyaltyHistoryItem {
  id: string;
  type: "welcome" | "order" | "manual" | "redeem" | "reset";
  title: string;
  description: string;
  stampsDelta: number;
  freeBurgersDelta: number;
  timestamp: number;
}

export type LoyaltyTier = "Aspirante" | "Guerreiro" | "Mestre";

export interface LoyaltySyncPayload {
  userId: string | null;
  cardId: string;
  stamps: number;
  freeBurgers: number;
  tier: LoyaltyTier;
  history: LoyaltyHistoryItem[];
}

const LOYALTY_SYNC_EVENT = "fogo_loyalty_sync";

function computeTier(stamps: number, freeBurgers: number): LoyaltyTier {
  if (freeBurgers > 0 || stamps >= 8) return "Mestre";
  if (stamps >= 4) return "Guerreiro";
  return "Aspirante";
}

function generateCardId(userId?: string | null): string {
  if (userId) {
    const clean = userId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const suffix = clean.slice(-4) || "7777";
    return `FC-${suffix}-BRASA`;
  }
  return "FC-VIP-GUEST";
}

const DEFAULT_WELCOME_HISTORY: LoyaltyHistoryItem = {
  id: "welcome_init",
  type: "welcome",
  title: "Boas-Vindas da Chapa! 🔥",
  description: "Você ganhou 2 carimbos de cortesia para começar seu cartão oficial!",
  stampsDelta: 2,
  freeBurgersDelta: 0,
  timestamp: Date.now(),
};

function broadcastLoyaltyUpdate(payload: LoyaltySyncPayload) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(LOYALTY_SYNC_EVENT, {
        detail: payload,
      }),
    );
  }
}

export function useLoyalty() {
  const { user } = useAuth();
  const currentUserId = user?.id || null;

  const storageKey = useMemo(() => {
    return currentUserId ? `fogo_loyalty_account_${currentUserId}` : "fogo_guest_loyalty_account";
  }, [currentUserId]);

  const defaultCardId = useMemo(() => generateCardId(currentUserId), [currentUserId]);

  const [cardId, setCardId] = useState<string>(defaultCardId);
  const [stampsCount, setStampsCount] = useState<number>(2);
  const [freeBurgersCount, setFreeBurgersCount] = useState<number>(0);
  const [tier, setTier] = useState<LoyaltyTier>("Aspirante");
  const [history, setHistory] = useState<LoyaltyHistoryItem[]>([DEFAULT_WELCOME_HISTORY]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar dados de fidelidade com sincronização
  const refreshLoyalty = useCallback(() => {
    if (typeof window === "undefined") return;

    const computedCardId = generateCardId(currentUserId);

    // 1. Caso: Visitante (não autenticado)
    if (!user) {
      try {
        const cached = localStorage.getItem("fogo_guest_loyalty_account");
        if (cached) {
          const parsed = JSON.parse(cached);
          const stamps = typeof parsed.stamps === "number" ? parsed.stamps : 2;
          const free = typeof parsed.freeBurgers === "number" ? parsed.freeBurgers : 0;
          const parsedHistory = Array.isArray(parsed.history) ? parsed.history : [DEFAULT_WELCOME_HISTORY];
          setCardId(parsed.cardId || computedCardId);
          setStampsCount(stamps);
          setFreeBurgersCount(free);
          setTier(computeTier(stamps, free));
          setHistory(parsedHistory);
        } else {
          // Inicializa cartão do visitante com 2 selos
          const initData = {
            cardId: computedCardId,
            stamps: 2,
            freeBurgers: 0,
            tier: "Aspirante",
            history: [DEFAULT_WELCOME_HISTORY],
            updatedAt: Date.now(),
          };
          localStorage.setItem("fogo_guest_loyalty_account", JSON.stringify(initData));
          setCardId(computedCardId);
          setStampsCount(2);
          setFreeBurgersCount(0);
          setTier("Aspirante");
          setHistory([DEFAULT_WELCOME_HISTORY]);
        }
      } catch (e) {
        console.warn("Aviso ao carregar fidelidade visitante:", e);
      }
      setIsLoaded(true);
      return;
    }

    // 2. Caso: Usuário Autenticado
    const userStorageKey = `fogo_loyalty_account_${user.id}`;
    let localData: any = null;
    try {
      const cached = localStorage.getItem(userStorageKey);
      if (cached) {
        localData = JSON.parse(cached);
      }
    } catch {}

    const meta = user.user_metadata as Record<string, any> | undefined;
    const metaStamps = typeof meta?.["stamps_count"] === "number" ? meta["stamps_count"] : null;
    const metaFreeBurgers = typeof meta?.["free_burgers_count"] === "number" ? meta["free_burgers_count"] : null;
    const metaCardId = meta?.["loyalty_card_id"] || computedCardId;
    const metaHistory = Array.isArray(meta?.["loyalty_history"]) ? meta["loyalty_history"] : null;
    const metaUpdatedAt = typeof meta?.["loyalty_updated_at"] === "number" ? meta["loyalty_updated_at"] : 0;

    // Se é a primeira vez que o usuário loga e não tem dados em lugar nenhum:
    // Verifica se tinha dados de visitante para migrar
    const guestCached = localStorage.getItem("fogo_guest_loyalty_account");
    let migratedFromGuest = false;
    if (!localData && metaStamps === null && guestCached) {
      try {
        const guestParsed = JSON.parse(guestCached);
        if (guestParsed && (guestParsed.stamps > 2 || guestParsed.freeBurgers > 0)) {
          localData = {
            cardId: computedCardId,
            stamps: guestParsed.stamps,
            freeBurgers: guestParsed.freeBurgers,
            history: guestParsed.history || [DEFAULT_WELCOME_HISTORY],
            updatedAt: Date.now(),
          };
          migratedFromGuest = true;
          // limpa guest para não duplicar
          localStorage.removeItem("fogo_guest_loyalty_account");
        }
      } catch {}
    }

    // Determina o estado mais recente entre local e Supabase
    let finalStamps = 2;
    let finalFree = 0;
    let finalCardId = computedCardId;
    let finalHistory: LoyaltyHistoryItem[] = [DEFAULT_WELCOME_HISTORY];

    if (localData && (!metaUpdatedAt || localData.updatedAt >= metaUpdatedAt)) {
      finalStamps = typeof localData.stamps === "number" ? localData.stamps : 2;
      finalFree = typeof localData.freeBurgers === "number" ? localData.freeBurgers : 0;
      finalCardId = localData.cardId || computedCardId;
      finalHistory = Array.isArray(localData.history) ? localData.history : [DEFAULT_WELCOME_HISTORY];

      // Se o local é mais novo ou foi migrado, envia para o Supabase
      if (migratedFromGuest || localData.updatedAt > metaUpdatedAt) {
        supabase.auth.updateUser({
          data: {
            stamps_count: finalStamps,
            free_burgers_count: finalFree,
            loyalty_card_id: finalCardId,
            loyalty_tier: computeTier(finalStamps, finalFree),
            loyalty_history: finalHistory.slice(-10),
            loyalty_updated_at: localData.updatedAt || Date.now(),
          },
        }).catch(() => {});
      }
    } else if (metaStamps !== null) {
      // Supabase tem dados válidos
      finalStamps = metaStamps;
      finalFree = metaFreeBurgers || 0;
      finalCardId = metaCardId;
      finalHistory = metaHistory || [DEFAULT_WELCOME_HISTORY];
      // Salva no localStorage local
      try {
        localStorage.setItem(
          userStorageKey,
          JSON.stringify({
            cardId: finalCardId,
            stamps: finalStamps,
            freeBurgers: finalFree,
            history: finalHistory,
            updatedAt: metaUpdatedAt || Date.now(),
          }),
        );
      } catch {}
    } else {
      // Conta nova e zerada no Supabase e no local: Inicia com 2 carimbos de boas-vindas
      finalStamps = 2;
      finalFree = 0;
      finalCardId = computedCardId;
      finalHistory = [DEFAULT_WELCOME_HISTORY];

      const initPayload = {
        cardId: finalCardId,
        stamps: 2,
        freeBurgers: 0,
        history: finalHistory,
        updatedAt: Date.now(),
      };
      try {
        localStorage.setItem(userStorageKey, JSON.stringify(initPayload));
      } catch {}

      supabase.auth.updateUser({
        data: {
          stamps_count: 2,
          free_burgers_count: 0,
          loyalty_card_id: finalCardId,
          loyalty_tier: "Aspirante",
          loyalty_history: finalHistory,
          loyalty_updated_at: Date.now(),
        },
      }).catch(() => {});
    }

    setCardId(finalCardId);
    setStampsCount(finalStamps);
    setFreeBurgersCount(finalFree);
    setTier(computeTier(finalStamps, finalFree));
    setHistory(finalHistory);
    setIsLoaded(true);
  }, [user, currentUserId]);

  useEffect(() => {
    refreshLoyalty();

    const handleSync = (e: Event) => {
      const custom = e as CustomEvent<LoyaltySyncPayload>;
      if (custom.detail) {
        if (custom.detail.userId === currentUserId || (!custom.detail.userId && !currentUserId)) {
          setCardId(custom.detail.cardId);
          setStampsCount(custom.detail.stamps);
          setFreeBurgersCount(custom.detail.freeBurgers);
          setTier(custom.detail.tier);
          if (Array.isArray(custom.detail.history)) {
            setHistory(custom.detail.history);
          }
        }
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (typeof parsed.stamps === "number") setStampsCount(parsed.stamps);
          if (typeof parsed.freeBurgers === "number") setFreeBurgersCount(parsed.freeBurgers);
          if (parsed.cardId) setCardId(parsed.cardId);
          if (Array.isArray(parsed.history)) setHistory(parsed.history);
          setTier(computeTier(parsed.stamps, parsed.freeBurgers));
        } catch {}
      }
    };

    window.addEventListener(LOYALTY_SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(LOYALTY_SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleStorage);
    };
  }, [refreshLoyalty, storageKey, currentUserId]);

  // Salvar estado localmente e na nuvem, notificando todos os ouvintes
  const saveLoyaltyState = async (
    newStamps: number,
    newFreeBurgers: number,
    actionItem?: Omit<LoyaltyHistoryItem, "id" | "timestamp">,
  ) => {
    const computedTier = computeTier(newStamps, newFreeBurgers);
    const now = Date.now();

    let updatedHistory = [...history];
    if (actionItem) {
      const newItem: LoyaltyHistoryItem = {
        id: `act_${now}_${Math.random().toString(36).substring(2, 6)}`,
        ...actionItem,
        timestamp: now,
      };
      // Mantém os últimos 15 registros de histórico
      updatedHistory = [newItem, ...updatedHistory].slice(0, 15);
    }

    setStampsCount(newStamps);
    setFreeBurgersCount(newFreeBurgers);
    setTier(computedTier);
    setHistory(updatedHistory);

    const payloadToSave = {
      cardId,
      stamps: newStamps,
      freeBurgers: newFreeBurgers,
      tier: computedTier,
      history: updatedHistory,
      updatedAt: now,
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(payloadToSave));
      if (!currentUserId) {
        localStorage.setItem("fogo_guest_loyalty_account", JSON.stringify(payloadToSave));
      }
    } catch {}

    // Notifica outros componentes montados instantaneamente
    broadcastLoyaltyUpdate({
      userId: currentUserId,
      cardId,
      stamps: newStamps,
      freeBurgers: newFreeBurgers,
      tier: computedTier,
      history: updatedHistory,
    });

    // Se o usuário estiver logado, persiste no Supabase user_metadata
    if (user?.id) {
      try {
        await supabase.auth.updateUser({
          data: {
            stamps_count: newStamps,
            free_burgers_count: newFreeBurgers,
            loyalty_card_id: cardId,
            loyalty_tier: computedTier,
            loyalty_history: updatedHistory.slice(0, 10),
            loyalty_updated_at: now,
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
    const purchasedItems: string[] = [];

    // Percorre cada item do carrinho
    Object.entries(cart).forEach(([idStr, quantity]) => {
      const prodId = parseInt(idStr, 10);
      const qty = typeof quantity === "number" ? quantity : 0;
      if (qty <= 0) return;

      const product = products.find((p) => p.id === prodId);
      const name = (product?.name || "").toLowerCase();
      const id = prodId;

      // 1. É COMBO?
      const isCombo =
        (id >= 400 && id < 500) ||
        name.includes("combo") ||
        name.includes("triplo") ||
        name.includes("aristofome") ||
        name.includes("reis") ||
        name.includes("fome dos reis");

      // 2. É HAMBÚRGUER?
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
        purchasedItems.push(`${qty}x Combo ${product?.name || ""}`);
      } else if (isBurger) {
        earnedStamps += qty * 1;
        purchasedItems.push(`${qty}x Burger ${product?.name || ""}`);
      }
    });

    if (earnedStamps <= 0 && Object.keys(cart).length > 0) {
      earnedStamps = 1;
      purchasedItems.push("Pedido Fogo & Chapa");
    }

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

    await saveLoyaltyState(finalStamps, finalFreeBurgers, {
      type: "order",
      title: completedCycles > 0 ? "🎉 Cartela Completa! +1 Burger Grátis!" : `+${earnedStamps} Carimbo${earnedStamps > 1 ? "s" : ""} Conquistados!`,
      description: `Pedido: ${purchasedItems.slice(0, 2).join(", ")}${purchasedItems.length > 2 ? "..." : ""}`,
      stampsDelta: earnedStamps,
      freeBurgersDelta: completedCycles,
    });

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
    await saveLoyaltyState(stampsCount, nextCount, {
      type: "redeem",
      title: "🎁 Resgate de Hambúrguer Grátis",
      description: "Desconto de R$ 35,00 aplicado no pedido pelo Cartão Fidelidade!",
      stampsDelta: 0,
      freeBurgersDelta: -1,
    });

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

    await saveLoyaltyState(remainder, newFree, {
      type: "manual",
      title: cycles > 0 ? "🎉 Cartela Completa! +1 Burger Grátis" : `+${amount} Carimbo Conquistado`,
      description: "Carimbado na brasa quente!",
      stampsDelta: amount,
      freeBurgersDelta: cycles,
    });

    return { stamps: remainder, freeBurgers: newFree, wonFree: cycles > 0 };
  };

  /**
   * Reiniciar cartela
   */
  const resetStamps = async () => {
    await saveLoyaltyState(0, freeBurgersCount, {
      type: "reset",
      title: "Cartela Reiniciada",
      description: "Nova cartela aberta na brasa para novos pedidos!",
      stampsDelta: -stampsCount,
      freeBurgersDelta: 0,
    });
  };

  return {
    cardId,
    stampsCount,
    freeBurgersCount,
    tier,
    history,
    isLoaded,
    processOrderRewards,
    redeemFreeBurger,
    addStampManual,
    resetStamps,
    saveLoyaltyState,
    refreshLoyalty,
  };
}
