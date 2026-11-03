import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  Store,
  Truck,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  MapPin,
  Bookmark,
  Crown,
  Gift,
  Flame,
  Sparkles,
  Search,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { CreditCardForm } from "./ui/credit-card-form";
import { PixPayment } from "./ui/pix-payment";
import { useAuth } from "@/context/AuthContext";
import { useUserAddresses, isSameAddress } from "@/hooks/useUserAddresses";
import { useLoyalty } from "@/hooks/useLoyalty";
import { DELIVERY_POINTS, normalizeText, type LatLng } from "@/lib/deliveryPoints";

const STEP_ORDER = ["cart", "type", "details", "review", "payment", "credit_card", "pix"] as const;
const STEP_PROGRESS: Record<string, number> = {
  cart: 0.14,
  type: 0.28,
  details: 0.42,
  review: 0.58,
  payment: 0.76,
  credit_card: 1,
  pix: 1,
};

interface AddressSuggestionItem {
  title: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  badge?: string;
  keywords: string[];
  coords?: LatLng | null;
}

// Pontos de entrega reais (com coordenadas) compartilhados com o GPS do motoboy
const FORTALEZA_ADDRESS_SUGGESTIONS: AddressSuggestionItem[] = DELIVERY_POINTS.map((p) => ({
  title: `${p.emoji} ${p.title}`,
  address: p.address,
  number: p.number,
  complement: p.complement,
  neighborhood: p.neighborhood,
  badge: p.badge,
  keywords: p.keywords,
  coords: p.coords,
}));

const stepVariants = {
  enter: (dir: number) => ({ x: dir * 48, opacity: 0, filter: "blur(6px)" }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({ x: dir * -48, opacity: 0, filter: "blur(6px)" }),
};

export function CartCheckoutSheet({
  cart,
  products,
  updateQuantity,
  handleCheckout,
  currentTheme,
}: any) {
  const [step, setStep] = useState<
    "cart" | "type" | "details" | "review" | "payment" | "credit_card" | "pix"
  >("cart");
  const [orderType, setOrderType] = useState<"delivery" | "pickup" | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [changeAmount, setChangeAmount] = useState<string>("");
  const { user } = useAuth();
  const { addresses, saveAddress, deleteAddress } = useUserAddresses();
  const { stampsCount, freeBurgersCount, cardId, processOrderRewards, redeemFreeBurger } = useLoyalty();
  const [saveAddressForFuture, setSaveAddressForFuture] = useState(true);
  const [isUsingNewAddress, setIsUsingNewAddress] = useState(false);
  const [isRedeemingFreeBurger, setIsRedeemingFreeBurger] = useState(false);

  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [isAddressFocused, setIsAddressFocused] = useState(false);
  const [onlineSuggestions, setOnlineSuggestions] = useState<AddressSuggestionItem[]>([]);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  // Coordenadas reais do destino escolhido (ponto de entrega ou resultado do mapa)
  const [selectedCoords, setSelectedCoords] = useState<LatLng | null>(null);

  const addressContainerRef = useRef<HTMLDivElement>(null);

  // Preenchimento automático com nome do Google se o usuário estiver logado
  useEffect(() => {
    if (user && !name) {
      const meta = user.user_metadata as Record<string, any> | undefined;
      const fullName = (meta?.["full_name"] as string) || (meta?.["name"] as string);
      if (fullName) setName(fullName);
    }
  }, [user, name]);

  // O endereço NÃO é mais preenchido automaticamente: o usuário escolhe um endereço
  // salvo, um ponto de entrega ou digita o próprio endereço.
  const applyAddress = (item: {
    address: string;
    number?: string;
    complement?: string;
    name?: string;
    coords?: LatLng | null;
  }) => {
    if (item.name) setName(item.name);
    setAddress(item.address);
    setNumber(item.number || "");
    setComplement(item.complement || "");
    setSelectedCoords(item.coords ?? null);
    setIsAddressFocused(false);
  };

  // Fechar dropdown de sugestões ao clicar fora do campo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addressContainerRef.current && !addressContainerRef.current.contains(event.target as Node)) {
        setIsAddressFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Busca online em tempo real no OpenStreetMap (Fortaleza/CE) com debounce
  useEffect(() => {
    const q = address.trim();
    if (q.length < 3) {
      setOnlineSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearchingOnline(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            q + ", Fortaleza, CE"
          )}&addressdetails=1&limit=4`,
          { headers: { "Accept-Language": "pt-BR" } }
        );
        if (res.ok) {
          const data = await res.json();
          const parsed = (data || []).map((item: any) => {
            const road = item.address?.road || item.display_name.split(",")[0] || item.name;
            const suburb =
              item.address?.suburb ||
              item.address?.neighbourhood ||
              item.address?.city_district ||
              "Fortaleza";
            const houseNumber = item.address?.house_number || "";
            return {
              title: road,
              address: road,
              number: houseNumber,
              complement: "",
              neighborhood: suburb,
              badge: "🌐 Mapa",
              keywords: [],
              coords: [parseFloat(item.lat), parseFloat(item.lon)] as LatLng,
            };
          });
          setOnlineSuggestions(parsed);
        }
      } catch {
        // Fallback silencioso nas sugestões locais
      } finally {
        setIsSearchingOnline(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [address]);

  // Busca e sugestão dinâmica de endereços em tempo real ao digitar a primeira letra
  const matchingSuggestions = useMemo<AddressSuggestionItem[]>(() => {
    const q = normalizeText(address);
    if (!q) return [];

    // 1. Endereços salvos do próprio usuário que combinem com a busca
    const userSaved: AddressSuggestionItem[] = addresses
      .filter(
        (a) =>
          normalizeText(a.address).includes(q) ||
          (a.title && normalizeText(a.title).includes(q)) ||
          (a.complement && normalizeText(a.complement).includes(q))
      )
      .map((a) => ({
        title: a.title || "Endereço Salvo",
        address: a.address,
        number: a.number,
        complement: a.complement || "",
        neighborhood: "Salvo no seu perfil",
        badge: "⭐ Salvo",
        keywords: [],
        coords: null,
      }));

    // 2. Pontos de entrega reais de Fortaleza
    const predefined = FORTALEZA_ADDRESS_SUGGESTIONS.filter(
      (item) =>
        normalizeText(item.title).includes(q) ||
        normalizeText(item.address).includes(q) ||
        normalizeText(item.neighborhood).includes(q) ||
        item.keywords.some((k) => normalizeText(k).includes(q))
    );

    // 3. Resultados online em tempo real (evitando duplicatas com a lista já existente)
    const onlineFiltered = onlineSuggestions.filter(
      (onl) =>
        !userSaved.some((u) => u.address.toLowerCase() === onl.address.toLowerCase()) &&
        !predefined.some((p) => p.address.toLowerCase() === onl.address.toLowerCase())
    );

    return [...userSaved, ...predefined, ...onlineFiltered].slice(0, 6);
  }, [address, addresses, onlineSuggestions]);
  const [detailsError, setDetailsError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    type: "fixed" | "percentage" | "free_shipping";
    value: number;
    label: string;
    code: string;
  } | null>(null);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [observations, setObservations] = useState("");
  const [pulseKey, setPulseKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Estados para o cursor customizado de espátula
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isMouseIn, setIsMouseIn] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // Listener global para garantir que o cursor de espátula NUNCA se perca ou trave durante arraste rápido
  useEffect(() => {
    if (isTouchDevice) return;
    const handleGlobalPointerMove = (e: PointerEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleGlobalPointerUp = () => {
      setIsMouseDown(false);
    };
    window.addEventListener("pointermove", handleGlobalPointerMove, { passive: true });
    window.addEventListener("pointerup", handleGlobalPointerUp);
    return () => {
      window.removeEventListener("pointermove", handleGlobalPointerMove);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
    };
  }, [isTouchDevice]);

  // Estado para arrastar o card ou botão da lixeira para a esquerda e diminuir a quantidade
  const [dragState, setDraggingState] = useState<{
    id: number;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    maxLeft: number;
    initialQty: number;
    fromTrashBtn: boolean;
    isDraggingHorizontal: boolean;
  } | null>(null);

  // Itens sendo excluídos com animação de saída suave
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const wasDraggingRef = useRef(false);

  const triggerDelete = (id: number, qty: number) => {
    setDeletingIds((prev) => [...prev, id]);
    setTimeout(() => {
      updateQuantity(id, -qty);
      setDeletingIds((prev) => prev.filter((item) => item !== id));
    }, 260);
  };

  const handleCardPointerDown = (
    e: React.PointerEvent,
    id: number,
    initialQty: number,
    fromTrashBtn = false,
  ) => {
    const target = e.target as HTMLElement | null;
    if (!fromTrashBtn && target?.closest("button, input, [data-prevent-drag]")) {
      return;
    }

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}

    setIsMouseDown(true);
    setIsMouseIn(true);
    setMousePos({ x: e.clientX, y: e.clientY });

    setDraggingState({
      id,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      maxLeft: 0,
      initialQty,
      fromTrashBtn,
      isDraggingHorizontal: fromTrashBtn,
    });
  };

  const handleCardPointerMove = (e: React.PointerEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    if (!dragState) return;

    const currentX = e.clientX;
    const currentY = e.clientY;
    const diffX = dragState.startX - currentX;
    const diffY = currentY - dragState.startY;

    let isHoriz = dragState.isDraggingHorizontal;
    if (!isHoriz) {
      if (Math.abs(diffX) > 8 && Math.abs(diffX) > Math.abs(diffY)) {
        isHoriz = true;
      } else if (Math.abs(diffY) > 12) {
        setDraggingState(null);
        return;
      }
    }

    if (isHoriz) {
      const leftDrag = Math.max(0, diffX);
      setDraggingState((prev) =>
        prev
          ? {
              ...prev,
              currentX,
              currentY,
              maxLeft: Math.max(prev.maxLeft, leftDrag),
              isDraggingHorizontal: true,
            }
          : null,
      );
    }
  };

  const handleCardPointerUp = (e: React.PointerEvent, id: number) => {
    if (!dragState || dragState.id !== id) {
      setDraggingState(null);
      setIsMouseDown(false);
      return;
    }

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    setIsMouseDown(false);
    const leftDrag = Math.max(0, dragState.startX - dragState.currentX);
    const maxLeft = dragState.maxLeft;
    const fromTrashBtn = dragState.fromTrashBtn;
    const initialQty = dragState.initialQty;

    // Se foi clique simples no botão de lixeira (< 12px), remove o item
    if (fromTrashBtn && maxLeft < 12) {
      triggerDelete(id, initialQty);
      setDraggingState(null);
      return;
    }

    // Se arrastou para a esquerda
    if (dragState.isDraggingHorizontal && maxLeft >= 16) {
      wasDraggingRef.current = true;
      setTimeout(() => {
        wasDraggingRef.current = false;
      }, 200);

      if (initialQty === 1) {
        if (leftDrag >= 75) {
          triggerDelete(id, initialQty);
        }
      } else {
        const stepSize = 38;
        const deadZone = 14;
        const decreaseUnits = Math.min(
          initialQty,
          Math.floor(Math.max(0, leftDrag - deadZone) / stepSize),
        );
        const isFull = decreaseUnits >= initialQty || leftDrag >= 170;

        if (isFull) {
          triggerDelete(id, initialQty);
        } else if (decreaseUnits > 0) {
          updateQuantity(id, -decreaseUnits);
        }
      }
    }

    setDraggingState(null);
  };

  const handleCardPointerCancel = () => {
    setDraggingState(null);
    setIsMouseDown(false);
  };

  // Expansão da área de clique do mouse (espátula ~45px de raio):
  // Se o usuário clicar próximo a qualquer botão interativo, o botão é acionado!
  const handleSheetClick = (e: React.MouseEvent) => {
    if (wasDraggingRef.current) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest("button, a, input, select, textarea, [role='button']")) {
      return;
    }

    const clickX = e.clientX;
    const clickY = e.clientY;
    const sampleRadii = [18, 30, 42];
    const angles = [0, 45, 90, 135, 180, 225, 270, 315];

    for (const r of sampleRadii) {
      for (const deg of angles) {
        const rad = (deg * Math.PI) / 180;
        const px = clickX + Math.cos(rad) * r;
        const py = clickY + Math.sin(rad) * r;
        const el = document.elementFromPoint(px, py) as HTMLElement | null;
        const btn = el?.closest("button, [role='button']") as HTMLElement | null;
        if (btn && btn.isConnected) {
          btn.click();
          return;
        }
      }
    }
  };

  // Limpa o timeout do loading se o componente desmontar
  useEffect(
    () => () => {
      if (loadingTimeout.current) clearTimeout(loadingTimeout.current);
    },
    [],
  );

  // Direção da animação: avança para a direita, volta para a esquerda
  const stepIndex = STEP_ORDER.indexOf(step);
  const prevStepIndex = useRef(stepIndex);
  const direction = stepIndex >= prevStepIndex.current ? 1 : -1;
  useEffect(() => {
    prevStepIndex.current = stepIndex;
  }, [stepIndex]);

  const cartCount = Object.entries(cart).reduce((sum, [id, count]) => {
    if (products.some((p: any) => p.id === parseInt(id))) return sum + (count as number);
    return sum;
  }, 0);

  const subtotal = Object.entries(cart).reduce((total, [id, qty]) => {
    const product = products.find((p: any) => p.id === parseInt(id));
    return total + (product ? product.price * (qty as number) : 0);
  }, 0);

  const deliveryFee = orderType === "delivery" ? 8 : 0;

  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.type === "free_shipping") {
      discountAmount = deliveryFee;
    } else if (appliedDiscount.type === "percentage") {
      discountAmount = subtotal * appliedDiscount.value;
    } else if (appliedDiscount.type === "fixed") {
      discountAmount = appliedDiscount.value;
    }
  }

  // Ensure the discount does not exceed the subtotal + delivery fee
  discountAmount = Math.min(discountAmount, subtotal + deliveryFee);

  const totalPrice = Math.max(0, subtotal - discountAmount + deliveryFee);

  // Calcula carimbos previstos para este pedido: Burger = +1, Combo = +2
  const potentialStamps = Object.entries(cart).reduce((acc, [idStr, quantity]) => {
    const prodId = parseInt(idStr, 10);
    const qty = typeof quantity === "number" ? quantity : 0;
    if (qty <= 0) return acc;
    const product = products.find((p: any) => p.id === prodId);
    if (!product) return acc;
    const name = (product.name || "").toLowerCase();
    const id = product.id;
    const isCombo =
      (id >= 400 && id < 500) ||
      name.includes("combo") ||
      name.includes("triplo") ||
      name.includes("aristofome") ||
      name.includes("fome dos reis");
    const isBurger = product.category === "burger" && !isCombo && id < 100;
    if (isCombo) return acc + qty * 2;
    if (isBurger) return acc + qty * 1;
    return acc;
  }, 0);

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const handleNext = () => {
    if (step === "cart") setStep("type");
    else if (step === "type") {
      if (orderType === "delivery") setStep("details");
      else if (orderType === "pickup") setStep("review");
    } else if (step === "details") {
      if (!name.trim() || !address.trim() || !number.trim()) {
        setDetailsError("Informações incompletas");
        return;
      }
      const alreadySaved = addresses.some((a) =>
        isSameAddress(a, {
          address: address.trim(),
          number: number.trim(),
          complement: complement.trim() || undefined,
        }),
      );

      // Só salva se o usuário marcou para salvar no futuro e se NÃO for um endereço que já estava salvo
      if (saveAddressForFuture && address.trim() && !alreadySaved) {
        saveAddress({
          title: "Endereço Principal",
          name: name.trim(),
          address: address.trim(),
          number: number.trim(),
          complement: complement.trim() || undefined,
          is_default: true,
        });
      }
      setDetailsError("");
      setStep("review");
    } else if (step === "review") {
      setStep("payment");
    } else if (step === "payment") {
      if (paymentMethod === "credit_card") {
        setStep("credit_card");
      } else if (paymentMethod === "pix") {
        setStep("pix");
      } else if (paymentMethod) {
        finishOrder();
      }
    }
  };

  const isContinueDisabled = cartCount === 0 || (step === "type" && !orderType);

  // Botão "Continuar": mostra o loading e bloqueia cliques repetidos
  const handleContinue = () => {
    if (isLoading || isContinueDisabled) return;

    // Se o formulário de entrega estiver incompleto, mostra o erro na hora (sem loading)
    if (step === "details" && (!name.trim() || !address.trim() || !number.trim())) {
      handleNext();
      return;
    }

    setPulseKey((k) => k + 1);
    setIsLoading(true);
    loadingTimeout.current = setTimeout(() => {
      handleNext();
      setIsLoading(false);
      loadingTimeout.current = null;
    }, 1200);
  };

  const finishOrder = async () => {
    // Se o cliente escolheu resgatar um Burger Grátis da fidelidade neste pedido
    if (isRedeemingFreeBurger) {
      try {
        await redeemFreeBurger();
      } catch (err) {
        console.warn("Erro ao resgatar burger grátis:", err);
      }
      setIsRedeemingFreeBurger(false);
    }

    // Processa carimbos da fidelidade: 1 carimbo por burger, 2 carimbos por combo!
    try {
      const reward = await processOrderRewards(cart, products);
      if (reward.stampsEarned > 0) {
        if (reward.completedCycle) {
          toast.success(
            `🎉 PARABÉNS! Você ganhou +${reward.stampsEarned} carimbos e COMPLETOU A CARTELA! Ganhou 1 BURGER GRÁTIS! 🍔🔥`,
            { duration: 7000 },
          );
        } else {
          toast.success(
            `🔥 Pedido confirmado! +${reward.stampsEarned} carimbos na sua cartela Fogo & Chapa (${reward.newStampsCount}/10)!`,
            { duration: 5000 },
          );
        }
      }
    } catch (e) {
      console.warn("Erro ao processar fidelidade:", e);
    }

    const fullAddress = [address, number, complement].filter(Boolean).join(", ");
    handleCheckout(fullAddress || address, orderType, selectedCoords);
    setStep("cart");
    setPaymentMethod(null);
    setOrderType(null);
    setAppliedDiscount(null);
  };

  const handleBack = () => {
    if (step === "credit_card" || step === "pix") {
      setStep("payment");
    } else if (step === "payment") {
      setStep("review");
    } else if (step === "review") {
      setStep(orderType === "delivery" ? "details" : "type");
    } else if (step === "details") {
      setStep("type");
    } else if (step === "type") {
      setStep("cart");
    }
  };

  const COUPONS: Record<
    string,
    { type: "fixed" | "percentage" | "free_shipping"; value: number; label: string }
  > = {
    DVSCODES: { type: "free_shipping", value: 0, label: "Frete Grátis" },
    FOGO10: { type: "percentage", value: 0.1, label: "10% OFF" },
    CHAPA20: { type: "fixed", value: 20, label: "R$ 20 OFF" },
  };

  return (
    <SheetContent
      data-cart-sheet="true"
      style={{
        backgroundColor: currentTheme.bgDark,
        color: currentTheme.bgLight,
        borderColor: currentTheme.secondaryAlpha,
      }}
      className={`flex w-full flex-col sm:max-w-md border-l-[1px] p-0 font-sans shadow-2xl transition-all duration-500 ease-in-out cart-spatula-area overflow-hidden`}
    >
      <div
        data-cart-sheet="true"
        className="flex flex-col w-full h-full relative cart-spatula-area"
        onClick={handleSheetClick}
        onMouseMove={(e) => {
          setMousePos({ x: e.clientX, y: e.clientY });
          if (!isMouseIn) setIsMouseIn(true);
        }}
        onMouseEnter={() => setIsMouseIn(true)}
        onMouseLeave={() => {
          if (!dragState) setIsMouseIn(false);
        }}
        onMouseDown={() => setIsMouseDown(true)}
        onMouseUp={() => setIsMouseDown(false)}
      >
        {/* Cursor Espátula Customizado */}
        <AnimatePresence>
          {!isTouchDevice && (isMouseIn || dragState !== null) && (
            <motion.div
              className="fixed top-0 left-0 pointer-events-none z-[99999]"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                x: mousePos.x - 24,
                y: mousePos.y - 14,
                opacity: 1,
                scale: dragState ? 0.92 : isMouseDown ? 0.85 : 1,
                rotate: dragState
                  ? Math.max(12, 28 - (dragState.isDraggingHorizontal ? Math.min(18, (dragState.startX - dragState.currentX) * 0.1) : 0))
                  : isMouseDown ? 25 : 45,
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                type: "spring",
                stiffness: dragState || isMouseDown ? 1800 : 900,
                damping: dragState || isMouseDown ? 45 : 28,
                mass: 0.15,
              }}
              style={{
                transformOrigin: "40% 30%",
              }}
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  filter: dragState
                    ? "drop-shadow(0 0 16px rgba(255, 157, 0, 0.75)) drop-shadow(3px 12px 10px rgba(0,0,0,0.5))"
                    : "drop-shadow(3px 12px 10px rgba(0,0,0,0.5))",
                }}
              >
                <defs>
                  <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f8f9fa" />
                    <stop offset="25%" stopColor="#ced4da" />
                    <stop offset="50%" stopColor="#e9ecef" />
                    <stop offset="75%" stopColor="#adb5bd" />
                    <stop offset="100%" stopColor="#6c757d" />
                  </linearGradient>
                  <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1a1a1a" />
                    <stop offset="50%" stopColor="#4d4d4d" />
                    <stop offset="100%" stopColor="#0a0a0a" />
                  </linearGradient>
                  <linearGradient id="rivetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#888888" />
                  </linearGradient>

                  <mask id="hyper-holes">
                    <rect width="100" height="100" fill="white" />
                    <rect x="32" y="10" width="6" height="28" rx="3" fill="black" />
                    <rect x="47" y="10" width="6" height="28" rx="3" fill="black" />
                    <rect x="62" y="10" width="6" height="28" rx="3" fill="black" />
                  </mask>

                  {/* Geometria perfeita e contínua da espátula inteira */}
                  <path
                    id="spatula-shape"
                    d="
                  M 45 70 
                  L 45 48 
                  C 35 48 26 42 24 35 
                  L 20 10 
                  C 18 5 22 2 28 2 
                  L 72 2 
                  C 78 2 82 5 80 10 
                  L 76 35 
                  C 74 42 65 48 55 48 
                  L 55 70 
                  Z"
                  />
                </defs>
                {/* Corpo de Metal com Buracos */}
                <use href="#spatula-shape" fill="url(#metalGrad)" mask="url(#hyper-holes)" />
                {/* Borda Externa de Metal */}
                <use
                  href="#spatula-shape"
                  fill="none"
                  stroke="#495057"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Reflexo de luz na borda esquerda */}
                <path
                  d="M 45 70 L 45 48 C 35 48 26 42 24 35 L 20 10 C 18 5 22 2 28 2 L 72 2"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.9"
                />
                {/* Furos da Espátula (Borda interna escura e anel de luz 3D) */}
                <g opacity="0.8">
                  <rect
                    x="32"
                    y="10"
                    width="6"
                    height="28"
                    rx="3"
                    fill="none"
                    stroke="#343a40"
                    strokeWidth="2"
                  />
                  <rect
                    x="31"
                    y="9"
                    width="8"
                    height="30"
                    rx="4"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1"
                  />

                  <rect
                    x="47"
                    y="10"
                    width="6"
                    height="28"
                    rx="3"
                    fill="none"
                    stroke="#343a40"
                    strokeWidth="2"
                  />
                  <rect
                    x="46"
                    y="9"
                    width="8"
                    height="30"
                    rx="4"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1"
                  />

                  <rect
                    x="62"
                    y="10"
                    width="6"
                    height="28"
                    rx="3"
                    fill="none"
                    stroke="#343a40"
                    strokeWidth="2"
                  />
                  <rect
                    x="61"
                    y="9"
                    width="8"
                    height="30"
                    rx="4"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                </g>
                {/* Cabo Preto */}
                <rect
                  x="39"
                  y="65"
                  width="22"
                  height="33"
                  rx="6"
                  fill="url(#handleGrad)"
                  stroke="#111"
                  strokeWidth="2"
                />
                <rect x="41" y="67" width="2" height="29" rx="1" fill="#ffffff" opacity="0.2" />{" "}
                {/* Luz do cabo */}
                {/* Rebites / Parafusos do cabo */}
                <circle
                  cx="50"
                  cy="72"
                  r="2.5"
                  fill="url(#rivetGrad)"
                  stroke="#111"
                  strokeWidth="0.5"
                />
                <circle
                  cx="50"
                  cy="81"
                  r="2.5"
                  fill="url(#rivetGrad)"
                  stroke="#111"
                  strokeWidth="0.5"
                />
                <circle
                  cx="50"
                  cy="90"
                  r="2.5"
                  fill="url(#rivetGrad)"
                  stroke="#111"
                  strokeWidth="0.5"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fundo Detalhado (Textura de Grelha + Gradiente) */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 12px), repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 1px, transparent 12px)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-black/30 to-black/90" />

        <SheetHeader className="relative z-10 px-8 pt-10 pb-4 text-left flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            {step !== "cart" && (
              <button
                onClick={handleBack}
                className="p-2 -ml-2 bg-white/5 hover:bg-white/10 rounded-full transition-all duration-300 opacity-80 hover:opacity-100 flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            )}
            <SheetTitle
              className="font-bold text-3xl tracking-tight m-0 text-white"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              {step === "cart"
                ? "Carrinho"
                : step === "type"
                  ? "Entrega ou Retirada?"
                  : step === "details"
                    ? "Onde entregar?"
                    : step === "review"
                      ? "Conferir Pedido"
                      : step === "payment"
                        ? "Pagamento"
                        : step === "credit_card"
                          ? "Cartao de Credito"
                          : "Pagamento via Pix"}
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Barra de progresso animada */}
        <div className="mx-8 mb-4 h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[#ff9d00] shadow-[0_0_12px_rgba(255,157,0,0.7)]"
            initial={false}
            animate={{ width: `${(STEP_PROGRESS[step] ?? 0) * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 pb-8 font-sans">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === "cart" && (
                <div className="space-y-4">
                  {cartCount === 0 ? (
                    <div className="text-center py-16 opacity-50 flex flex-col items-center justify-center h-full">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Truck className="w-10 h-10 opacity-50" />
                      </div>
                      <p className="text-xl font-bold tracking-tight text-white">
                        Seu carrinho esta vazio
                      </p>
                      <p className="text-sm font-medium mt-2 text-white/70">
                        Bateu a fome? Adicione algo delicioso!
                      </p>
                    </div>
                  ) : (
                    Object.entries(cart).map(([idStr, quantity]) => {
                      const product = products.find((p: any) => p.id === parseInt(idStr));
                      if (!product) return null;

                      const prodId = product.id;
                      const initialCount = quantity as number;
                      const isDraggingThis = dragState?.id === prodId;
                      const isDeletingThis = deletingIds.includes(prodId);

                      const deltaX =
                        isDraggingThis && dragState
                          ? dragState.startX - dragState.currentX
                          : 0;
                      const leftDrag = Math.max(0, deltaX);

                      // Curva de amortecimento suave elástica (rubber-banding)
                      const calculateVisualX = (drag: number) => {
                        if (drag <= 0) return 0;
                        if (drag < 150) return drag;
                        const maxVisual = 240;
                        const excess = drag - 150;
                        return 150 + (maxVisual - 150) * (1 - Math.exp(-excess / 110));
                      };
                      const visualX = calculateVisualX(leftDrag);

                      let unitsToDecrease = 0;
                      let isFullDelete = false;

                      if (initialCount === 1) {
                        isFullDelete = isDraggingThis && leftDrag >= 75;
                        unitsToDecrease = isFullDelete ? 1 : 0;
                      } else {
                        const stepSize = 38;
                        const deadZone = 14;
                        unitsToDecrease = isDraggingThis
                          ? Math.min(
                              initialCount,
                              Math.floor(Math.max(0, leftDrag - deadZone) / stepSize),
                            )
                          : 0;
                        isFullDelete =
                          isDraggingThis &&
                          (unitsToDecrease >= initialCount || leftDrag >= 170);
                        if (isFullDelete) {
                          unitsToDecrease = initialCount;
                        }
                      }

                      const displayedQty = Math.max(0, initialCount - unitsToDecrease);

                      return (
                        <div
                          key={product.id}
                          className="relative rounded-3xl overflow-hidden select-none transition-all duration-300"
                          style={{
                            opacity: isDeletingThis ? 0 : 1,
                            maxHeight: isDeletingThis ? 0 : "200px",
                            marginBottom: isDeletingThis ? 0 : undefined,
                            transition: isDeletingThis
                              ? "max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1) 0.15s, opacity 0.25s ease, margin 0.28s ease 0.15s"
                              : undefined,
                          }}
                        >
                          {/* Fundo de Ação Revelado Atrás do Pedido Inteiro */}
                          <div
                            className={`absolute inset-0 rounded-3xl overflow-hidden transition-all duration-300 flex items-center justify-end pr-6 ${
                              isFullDelete
                                ? "bg-gradient-to-l from-red-600/35 via-red-950/45 to-transparent border border-red-500/50 shadow-[inset_0_0_24px_rgba(239,68,68,0.35)]"
                                : unitsToDecrease > 0
                                  ? "bg-gradient-to-l from-amber-500/25 via-orange-950/40 to-transparent border border-amber-500/40 shadow-[inset_0_0_20px_rgba(245,158,11,0.2)]"
                                  : "bg-white/[0.03] border border-white/5"
                            }`}
                          >
                            <div className="flex flex-col items-end gap-1.5 z-10">
                              {isFullDelete ? (
                                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/30 border border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse">
                                  <Trash2 className="w-4 h-4 text-red-300 animate-bounce" />
                                  <span className="text-red-200 font-black text-xs uppercase tracking-wider">
                                    Solte para excluir tudo
                                  </span>
                                </div>
                              ) : unitsToDecrease > 0 ? (
                                <div className="flex flex-col items-end gap-1">
                                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                                    <Minus className="w-3.5 h-3.5 text-amber-300" />
                                    <span className="text-amber-300 font-black text-xs uppercase tracking-wider">
                                      -{unitsToDecrease} {unitsToDecrease > 1 ? "pedidos" : "pedido"}
                                    </span>
                                  </div>
                                  <span className="text-[11px] font-bold text-white/70 tracking-tight">
                                    Restam <strong className="text-amber-300 font-extrabold">{displayedQty}</strong> no carrinho
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-white/40 text-xs font-semibold">
                                  <span className="inline-block animate-[pulse_1.5s_infinite]">←</span>
                                  <span>Arraste para diminuir</span>
                                </div>
                              )}
                            </div>

                            {/* Barra de progresso do arrasto na borda inferior */}
                            {isDraggingThis && (
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-75 ${
                                    isFullDelete
                                      ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                                      : "bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.6)]"
                                  }`}
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      (leftDrag / (initialCount === 1 ? 75 : 170)) * 100,
                                    )}%`,
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          {/* O CARD DO PEDIDO INTEIRO (QUE DESLIZA PARA A ESQUERDA) */}
                          <div
                            onPointerDown={(e) => handleCardPointerDown(e, prodId, initialCount, false)}
                            onPointerMove={handleCardPointerMove}
                            onPointerUp={(e) => handleCardPointerUp(e, prodId)}
                            onPointerCancel={handleCardPointerCancel}
                            style={{
                              transform: isDeletingThis
                                ? "translateX(-120%) rotate(-6deg) scale(0.9)"
                                : isDraggingThis
                                  ? `translateX(-${visualX}px) rotate(-${Math.min(3.5, visualX * 0.016)}deg) scale(0.985)`
                                  : "translateX(0px) rotate(0deg) scale(1)",
                              opacity: isDeletingThis ? 0 : 1,
                              filter: isDeletingThis ? "blur(4px)" : "none",
                              transition: isDraggingThis
                                ? "none"
                                : isDeletingThis
                                  ? "transform 0.26s cubic-bezier(0.2, 0, 0, 1), opacity 0.26s ease, filter 0.26s ease"
                                  : "transform 0.45s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s ease",
                            }}
                            className={`relative flex gap-5 items-center p-4 rounded-3xl bg-[#141414] border transition-colors duration-300 select-none shadow-xl cursor-grab ${
                              isDraggingThis
                                ? "border-amber-500/40 shadow-2xl bg-[#1a1714] cursor-grabbing"
                                : "border-white/10 hover:bg-[#1a1a1a] hover:border-white/20"
                            }`}
                          >
                            {/* Botão de Lixeira fixo no topo do card do pedido */}
                            <div className="absolute -top-2.5 -right-2.5 z-20 touch-none">
                              <button
                                data-trash-btn="true"
                                onPointerDown={(e) => {
                                  e.stopPropagation();
                                  handleCardPointerDown(e, prodId, initialCount, true);
                                }}
                                onPointerMove={handleCardPointerMove}
                                onPointerUp={(e) => handleCardPointerUp(e, prodId)}
                                onPointerCancel={handleCardPointerCancel}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-xl border select-none touch-none relative after:absolute after:-inset-3 after:content-[''] ${
                                  isDraggingThis
                                    ? isFullDelete
                                      ? "bg-red-600 border-red-400 text-white scale-110 shadow-[0_0_20px_rgba(220,38,38,0.7)]"
                                      : unitsToDecrease > 0
                                        ? "bg-amber-500 border-amber-300 text-black scale-110 shadow-[0_0_15px_rgba(245,158,11,0.6)]"
                                        : "bg-white/20 border-white/40 text-white scale-105"
                                    : "bg-black border-white/10 text-white/60 hover:bg-red-500 hover:text-white hover:border-red-500 hover:scale-110"
                                }`}
                                title="Arraste para diminuir ou clique para excluir"
                              >
                                <Trash2 className="w-4 h-4 pointer-events-none" />
                              </button>
                            </div>

                            {/* Imagem do produto */}
                            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-black/20 shadow-inner border border-white/5 pointer-events-none">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 pointer-events-none"
                              />
                            </div>

                            {/* Informações e Contadores */}
                            <div className="flex-1 py-1">
                              <h4 className="font-bold text-lg text-white leading-tight tracking-tight">
                                {product.name}
                              </h4>
                              <p className="text-sm mt-1 text-[#ff9d00] font-bold">
                                {formatPrice(product.price)}
                              </p>

                              <div className="flex items-center gap-3 mt-3 bg-black/40 w-fit rounded-full px-1.5 py-1 border border-white/10">
                                <button
                                  data-prevent-drag="true"
                                  onPointerDown={(e) => e.stopPropagation()}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateQuantity(product.id, -1);
                                  }}
                                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all w-8 h-8 flex items-center justify-center relative after:absolute after:-inset-3 after:content-['']"
                                  title="Diminuir 1"
                                >
                                  <Minus className="w-3.5 h-3.5 pointer-events-none" />
                                </button>
                                <div className="min-w-6 text-center overflow-hidden flex items-center justify-center px-1">
                                  <AnimatePresence mode="popLayout" initial={false}>
                                    <motion.span
                                      key={displayedQty}
                                      initial={{ y: 8, opacity: 0, scale: 0.7 }}
                                      animate={{ y: 0, opacity: 1, scale: 1 }}
                                      exit={{ y: -8, opacity: 0, scale: 0.7 }}
                                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                      className={`text-sm font-black inline-block transition-colors ${
                                        isDraggingThis ? "text-amber-400 scale-110" : "text-white"
                                      }`}
                                    >
                                      {displayedQty}
                                    </motion.span>
                                  </AnimatePresence>
                                </div>
                                <button
                                  data-prevent-drag="true"
                                  onPointerDown={(e) => e.stopPropagation()}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateQuantity(product.id, 1);
                                  }}
                                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all w-8 h-8 flex items-center justify-center relative after:absolute after:-inset-3 after:content-['']"
                                  title="Aumentar 1"
                                >
                                  <Plus className="w-3.5 h-3.5 pointer-events-none" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {step === "type" && (
                <div className="space-y-4 mt-6">
                  <button
                    onClick={() => setOrderType("delivery")}
                    className={`w-full relative overflow-hidden flex items-center gap-5 p-6 rounded-2xl border-2 transition-all duration-300 ease-out ${orderType === "delivery" ? "bg-[#ff9d00]/10 border-[#ff9d00]/50 scale-[1.02] shadow-[0_0_20px_rgba(255,157,0,0.15)]" : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"}`}
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${orderType === "delivery" ? "bg-[#ff9d00]" : "bg-white/10"}`}
                    >
                      <Truck
                        className={`w-7 h-7 ${orderType === "delivery" ? "text-white" : "opacity-70 text-white"}`}
                      />
                    </div>
                    <div className="text-left flex-1">
                      <h4
                        className={`font-bold text-xl tracking-tight transition-colors duration-300 ${orderType === "delivery" ? "text-[#ff9d00]" : "text-white"}`}
                      >
                        Receber em casa
                      </h4>
                    </div>
                    {orderType === "delivery" && (
                      <div className="absolute right-4 animate-in zoom-in duration-300">
                        <CheckCircle2 className="w-7 h-7 text-[#ff9d00]" />
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setOrderType("pickup")}
                    className={`w-full relative overflow-hidden flex items-center gap-5 p-6 rounded-2xl border-2 transition-all duration-300 ease-out ${orderType === "pickup" ? "bg-[#ff9d00]/10 border-[#ff9d00]/50 scale-[1.02] shadow-[0_0_20px_rgba(255,157,0,0.15)]" : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"}`}
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${orderType === "pickup" ? "bg-[#ff9d00]" : "bg-white/10"}`}
                    >
                      <Store
                        className={`w-7 h-7 ${orderType === "pickup" ? "text-white" : "opacity-70 text-white"}`}
                      />
                    </div>
                    <div className="text-left flex-1">
                      <h4
                        className={`font-bold text-xl tracking-tight transition-colors duration-300 ${orderType === "pickup" ? "text-[#ff9d00]" : "text-white"}`}
                      >
                        Pegue no local
                      </h4>
                    </div>
                    {orderType === "pickup" && (
                      <div className="absolute right-4 animate-in zoom-in duration-300">
                        <CheckCircle2 className="w-7 h-7 text-[#ff9d00]" />
                      </div>
                    )}
                  </button>
                </div>
              )}

              {step === "details" && (
                <div className="space-y-5 mt-4 text-white">
                  {/* Banner de endereços salvos / login */}
                  {user ? (
                    addresses.length > 0 && (
                      <div className="space-y-2.5 pb-2 border-b border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Bookmark className="size-3.5 fill-amber-400" />
                            Seus Endereços Salvos ({addresses.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsUsingNewAddress(true);
                              applyAddress({ address: "" });
                            }}
                            className="text-[11px] font-bold text-amber-400/80 hover:text-amber-300 underline transition-colors cursor-pointer"
                          >
                            + Digitar outro
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-2 max-h-[170px] overflow-y-auto pr-1">
                          {addresses.map((addr) => {
                            const isSelected = isSameAddress(addr, { address, number, complement });
                            return (
                              <div
                                key={addr.id}
                                onClick={() => {
                                  setIsUsingNewAddress(false);
                                  applyAddress({
                                    address: addr.address,
                                    number: addr.number,
                                    complement: addr.complement || "",
                                    name: addr.name || undefined,
                                    coords: null,
                                  });
                                }}
                                className={`group relative flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-amber-500/15 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                                    : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <div
                                    className={`size-8 rounded-xl flex items-center justify-center shrink-0 ${
                                      isSelected ? "bg-amber-500 text-black font-bold" : "bg-white/10 text-white/70"
                                    }`}
                                  >
                                    <MapPin className="size-4" />
                                  </div>
                                  <div className="text-left min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-xs text-white truncate">
                                        {addr.title || "Endereço"}
                                      </span>
                                      {isSelected && (
                                        <span className="text-[9px] bg-amber-500 text-black font-extrabold px-1.5 py-0.5 rounded-full shrink-0">
                                          USANDO ESTE
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-white/70 truncate mt-0.5">
                                      {addr.address}, {addr.number} {addr.complement ? `• ${addr.complement}` : ""}
                                    </p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteAddress(addr.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1.5 text-white/40 hover:text-red-400 hover:bg-white/10 rounded-lg transition-all ml-2"
                                  title="Excluir este endereço"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200">
                      <span className="text-base">💡</span>
                      <span className="leading-snug">
                        Conecte sua <strong>Conta Google</strong> no topo da página para salvar seus endereços e pedir com 1 clique!
                      </span>
                    </div>
                  )}

                  {/* PONTOS DE ENTREGA DO MOTOBOY (locais reais de Fortaleza) */}
                  <div className="space-y-2.5 pb-2 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        Pontos de Entrega ({DELIVERY_POINTS.length})
                      </span>
                      <span className="text-[10px] text-white/40 font-semibold">GPS com rota real 🏍️</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-[176px] overflow-y-auto pr-1">
                      {DELIVERY_POINTS.map((p) => {
                        const isSelected =
                          !!selectedCoords &&
                          selectedCoords[0] === p.coords[0] &&
                          selectedCoords[1] === p.coords[1];
                        return (
                          <button
                            key={p.id}
                            id={`delivery-point-${p.id}`}
                            type="button"
                            onClick={() => {
                              setIsUsingNewAddress(true);
                              applyAddress({
                                address: p.address,
                                number: p.number,
                                complement: p.complement,
                                coords: p.coords,
                              });
                              toast.success(`${p.emoji} Entrega em: ${p.title}`);
                            }}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer active:scale-[0.97] ${
                              isSelected
                                ? "bg-amber-500/15 border-amber-500 shadow-[0_0_14px_rgba(245,158,11,0.25)]"
                                : "bg-white/5 border-white/10 hover:border-amber-400/40 hover:bg-white/10"
                            }`}
                          >
                            <span className="text-lg shrink-0">{p.emoji}</span>
                            <span className="min-w-0">
                              <span className="block text-[11px] font-bold text-white truncate">{p.title}</span>
                              <span className="block text-[10px] text-white/50 truncate">{p.neighborhood}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-white/60 ml-2 mb-2 block uppercase tracking-wider">
                      NOME COMPLETO
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-5 py-4 text-base font-medium focus:border-white/40 focus:bg-white/10 focus:outline-none transition-all duration-300 placeholder:text-white/20 placeholder:font-normal"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="relative" ref={addressContainerRef}>
                    <label className="text-[11px] font-bold text-white/60 ml-2 mb-2 block uppercase tracking-wider flex items-center justify-between">
                      <span>ENDEREÇO (RUA / AVENIDA)</span>
                      {matchingSuggestions.length > 0 && isAddressFocused && (
                        <span className="text-[10px] text-amber-400 font-extrabold flex items-center gap-1.5">
                          {isSearchingOnline ? (
                            <>
                              <Loader2 className="size-3 animate-spin text-amber-400" />
                              <span>Buscando no mapa...</span>
                            </>
                          ) : (
                            <>
                              <span className="size-1.5 rounded-full bg-amber-400 animate-ping" />
                              <span>{matchingSuggestions.length} sugestão(ões)</span>
                            </>
                          )}
                        </span>
                      )}
                    </label>

                    <div className="relative">
                      <input
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          setSelectedCoords(null);
                          setIsAddressFocused(true);
                        }}
                        onFocus={() => setIsAddressFocused(true)}
                        type="text"
                        className="w-full bg-white/5 border-2 border-white/10 rounded-2xl pl-12 pr-11 py-4 text-base font-medium focus:border-amber-400/60 focus:bg-white/10 focus:outline-none transition-all duration-300 placeholder:text-white/20 placeholder:font-normal"
                        placeholder="Digite o endereço (ex: Sesi Senai, Av...)"
                      />
                      <Search className="size-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />

                      {address && (
                        <button
                          type="button"
                          onClick={() => {
                            applyAddress({ address: "" });
                          }}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 size-7 rounded-full bg-white/10 hover:bg-white/25 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                          title="Limpar campo de endereço"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>

                    {/* DROPDOWN DE AUTOCOMPLETE DE ENDEREÇOS AO DIGITAR */}
                    <AnimatePresence>
                      {isAddressFocused && address.trim().length >= 1 && matchingSuggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#161616] border border-white/15 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.85)] backdrop-blur-xl overflow-hidden divide-y divide-white/5 max-h-[290px] overflow-y-auto"
                        >
                          <div className="px-3.5 py-2 bg-white/5 flex items-center justify-between text-[10px] text-white/50 font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                              <span className="size-1.5 rounded-full bg-emerald-400" />
                              Sugestões inteligentes:
                            </span>
                            <span className="text-amber-400 font-mono">Clique para aplicar</span>
                          </div>

                          {matchingSuggestions.map((item, idx) => (
                            <button
                              key={`sug-${idx}-${item.address}-${item.number}`}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                applyAddress({
                                  address: item.address,
                                  number: item.number,
                                  complement: item.complement,
                                  coords: item.coords ?? null,
                                });
                                setIsUsingNewAddress(false);
                                toast.success(`Endereço selecionado: ${item.title}! 📍`);
                              }}
                              className="w-full p-3.5 flex items-start gap-3 hover:bg-white/10 transition-colors text-left cursor-pointer group"
                            >
                              <div className="size-8 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <MapPin className="size-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                                    {item.title}
                                  </span>
                                  {item.badge && (
                                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10 shrink-0">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-white/60 truncate mt-0.5">
                                  {item.address}, {item.number} • {item.neighborhood}
                                </p>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="text-[11px] font-bold text-white/60 ml-2 mb-2 block uppercase tracking-wider">
                        NÚMERO
                      </label>
                      <input
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        type="text"
                        className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-5 py-4 text-base font-medium focus:border-white/40 focus:bg-white/10 focus:outline-none transition-all duration-300 placeholder:text-white/20 placeholder:font-normal"
                        placeholder="123"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[11px] font-bold text-white/60 ml-2 mb-2 block uppercase tracking-wider">
                        COMPLEMENTO
                      </label>
                      <input
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                        type="text"
                        className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-5 py-4 text-base font-medium focus:border-white/40 focus:bg-white/10 focus:outline-none transition-all duration-300 placeholder:text-white/20 placeholder:font-normal"
                        placeholder="Apto, bloco (opcional)"
                      />
                    </div>
                  </div>

                  {/* Checkbox de Salvar Endereço */}
                  {user && (
                    <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold text-white/80 cursor-pointer select-none hover:bg-white/10 transition-all">
                      <input
                        type="checkbox"
                        checked={saveAddressForFuture}
                        onChange={(e) => setSaveAddressForFuture(e.target.checked)}
                        className="size-4 rounded accent-amber-500 cursor-pointer"
                      />
                      <span>Salvar este endereço para preencher nos próximos pedidos</span>
                    </label>
                  )}
                </div>
              )}

              {step === "review" && (
                <div className="space-y-4 mt-4 text-white">
                  {/* Banner de Resgate de Burger Grátis se tiver disponível */}
                  {freeBurgersCount > 0 && (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="rounded-2xl p-4 bg-gradient-to-r from-amber-500/25 via-orange-600/20 to-amber-500/15 border-2 border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.3)] space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="size-9 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black shadow-md">
                            <Crown className="size-5 fill-black" />
                          </div>
                          <div>
                            <h4 className="font-display font-black text-xs uppercase tracking-wider text-amber-300">
                              Hambúrguer Grátis Liberado!
                            </h4>
                            <p className="text-[11px] text-white/80">
                              Você tem <strong>{freeBurgersCount}</strong> hambúrguer(es) de presente da chapa!
                            </p>
                          </div>
                        </div>
                      </div>

                      {!isRedeemingFreeBurger ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsRedeemingFreeBurger(true);
                            setAppliedDiscount({
                              type: "fixed",
                              value: 35,
                              label: "1 Burger Grátis (Fidelidade)",
                              code: "BURGER_GRATIS",
                            });
                            toast.success("🎁 1 Hambúrguer Grátis aplicado ao seu pedido! (-R$ 35,00)");
                          }}
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-display font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
                        >
                          <Gift className="size-4" />
                          <span>Resgatar 1 Burger Grátis (-R$ 35,00)</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-between bg-black/50 rounded-xl px-3.5 py-2.5 border border-emerald-400/50 text-emerald-300 text-xs font-bold">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-4 text-emerald-400" />
                            1 Burger Grátis aplicado com sucesso!
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsRedeemingFreeBurger(false);
                              setAppliedDiscount(null);
                            }}
                            className="text-red-400 hover:text-red-300 text-[11px] underline cursor-pointer font-bold"
                          >
                            Desfazer
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Painel do Cartão Fidelidade no Carrinho */}
                  <div className="rounded-2xl p-3.5 bg-gradient-to-r from-amber-500/10 via-black/50 to-orange-500/10 border border-amber-500/30 flex flex-col gap-2.5 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-black flex items-center justify-center font-bold shadow-md shrink-0">
                          <Flame className="size-4 fill-black" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>Cartão Fidelidade ({cardId})</span>
                            <Sparkles className="size-3 text-amber-400 animate-pulse" />
                          </p>
                          <p className="text-[10px] text-white/60">
                            {potentialStamps > 0 ? (
                              <span className="text-amber-300 font-medium">
                                +{potentialStamps} carimbo{potentialStamps > 1 ? "s" : ""} com este pedido!
                              </span>
                            ) : (
                              "Cada hambúrguer = 1 selo • Combo = 2 selos"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {stampsCount}/10 Selos
                        </span>
                      </div>
                    </div>

                    {/* Barra de Progresso com Previsão do Pedido */}
                    <div className="space-y-1">
                      <div className="w-full h-2 rounded-full bg-black/60 border border-white/10 p-0.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                          style={{
                            width: `${Math.min(100, Math.max(10, ((stampsCount + potentialStamps) / 10) * 100))}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-white/50">
                        <span>Atual: {stampsCount} selos</span>
                        {potentialStamps > 0 && (
                          <span className="text-amber-400 font-bold">
                            Após o pedido: {Math.min(10, stampsCount + potentialStamps)}/10
                            {stampsCount + potentialStamps >= 10 && " 🎉 Burger Grátis!"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                    <h3 className="font-bold text-sm text-white/60 uppercase tracking-wider mb-2">
                      Resumo do Pedido
                    </h3>
                    {Object.entries(cart).map(([idStr, quantity]) => {
                      const product = products.find((p: any) => p.id === parseInt(idStr));
                      if (!product) return null;
                      return (
                        <div key={product.id} className="flex justify-between text-sm">
                          <span>
                            {quantity as number}x {product.name}
                          </span>
                          <span className="font-medium text-[#ff9d00]">
                            {formatPrice(product.price * (quantity as number))}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                    <h3 className="font-bold text-sm text-white/60 uppercase tracking-wider mb-2">
                      Cupom de Desconto
                    </h3>
                    <div className="flex gap-2">
                      <input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        disabled={!!appliedDiscount}
                        type="text"
                        className="flex-1 bg-black/40 border-2 border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:border-white/40 focus:bg-black/60 focus:outline-none transition-all duration-300 placeholder:text-white/30 uppercase"
                        placeholder="DIGITE O CUPOM"
                      />
                      {!appliedDiscount ? (
                        <button
                          onClick={() => {
                            const code = couponCode.toUpperCase();
                            if (COUPONS[code]) {
                              setAppliedDiscount({ ...COUPONS[code], code });
                            } else {
                              alert("Cupom invalido");
                            }
                          }}
                          className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 rounded-xl transition-colors"
                        >
                          Aplicar
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setAppliedDiscount(null);
                            setCouponCode("");
                          }}
                          className="bg-red-500/20 text-red-400 hover:bg-red-500/30 font-bold px-4 rounded-xl transition-colors"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                    <h3 className="font-bold text-sm text-white/60 uppercase tracking-wider mb-2">
                      {"Observa\u00e7\u00f5es (opcional)"}
                    </h3>
                    <textarea
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      placeholder={"Ex: Tirar cebola, hamb\u00farguer bem passado, sem picles..."}
                      className="w-full bg-black/40 border-2 border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:border-white/40 focus:bg-black/60 focus:outline-none transition-all duration-300 placeholder:text-white/30 min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between text-sm text-white/80">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-white/80">
                      <span>Taxa de Entrega</span>
                      <span>{orderType === "delivery" ? formatPrice(deliveryFee) : "Gratis"}</span>
                    </div>
                    {appliedDiscount && (
                      <div className="flex justify-between text-sm text-green-400 font-bold">
                        <span>Desconto ({appliedDiscount.label})</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="h-[1px] w-full bg-white/10 my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-[#ff9d00]">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>
              )}

              {step === "payment" && (
                <div className="space-y-2.5 mt-4 text-white">
                  <button
                    onClick={() => {
                      setPaymentMethod("pix");
                      setStep("pix");
                    }}
                    className={`w-full relative overflow-hidden flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-300 text-left group ${paymentMethod === "pix" ? "bg-[#ff9d00]/10 border-[#ff9d00]/50 shadow-[0_0_20px_rgba(255,157,0,0.15)]" : "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10"}`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${paymentMethod === "pix" ? "bg-[#ff9d00]" : "bg-white/10 group-hover:bg-white/20"}`}
                    >
                      <QrCode
                        className={`w-4 h-4 ${paymentMethod === "pix" ? "text-white" : "opacity-80 group-hover:opacity-100"}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-bold text-sm tracking-tight ${paymentMethod === "pix" ? "text-[#ff9d00]" : ""}`}
                      >
                        Pix
                      </h4>
                      <p className="text-xs opacity-60 font-medium mt-0">Aprovacao imediata</p>
                    </div>
                    {paymentMethod === "pix" && (
                      <div className="absolute right-4 animate-in zoom-in duration-300">
                        <CheckCircle2 className="w-5 h-5 text-[#ff9d00]" />
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setPaymentMethod("credit_card");
                      setStep("credit_card"); // Maximiza na hora
                    }}
                    className={`w-full relative overflow-hidden flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-300 text-left group ${paymentMethod === "credit_card" ? "bg-[#ff9d00]/10 border-[#ff9d00]/50 shadow-[0_0_20px_rgba(255,157,0,0.15)]" : "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10"}`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${paymentMethod === "credit_card" ? "bg-[#ff9d00]" : "bg-white/10 group-hover:bg-white/20"}`}
                    >
                      <CreditCard
                        className={`w-4 h-4 ${paymentMethod === "credit_card" ? "text-white" : "opacity-80 group-hover:opacity-100"}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-bold text-sm tracking-tight ${paymentMethod === "credit_card" ? "text-[#ff9d00]" : ""}`}
                      >
                        Cartao de Credito
                      </h4>
                      <p className="text-xs opacity-60 font-medium mt-0">
                        Pague online com seguranca
                      </p>
                    </div>
                    {paymentMethod === "credit_card" && (
                      <div className="absolute right-4 animate-in zoom-in duration-300">
                        <CheckCircle2 className="w-5 h-5 text-[#ff9d00]" />
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setPaymentMethod("nubank")}
                    className={`w-full relative overflow-hidden flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-300 text-left group ${paymentMethod === "nubank" ? "bg-[#8A05BE]/10 border-[#8A05BE]/50 shadow-[0_0_20px_rgba(138,5,190,0.15)]" : "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10"}`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${paymentMethod === "nubank" ? "bg-[#8A05BE]" : "bg-[#8A05BE]/20 group-hover:bg-[#8A05BE]/30"}`}
                    >
                      <span
                        className={`font-bold text-[14px] ${paymentMethod === "nubank" ? "text-white" : "text-[#8A05BE]"}`}
                      >
                        nu
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-bold text-sm tracking-tight ${paymentMethod === "nubank" ? "text-[#8A05BE]" : ""}`}
                      >
                        Nubank Pay
                      </h4>
                      <p className="text-xs opacity-60 font-medium mt-0">Direto pelo app</p>
                    </div>
                    {paymentMethod === "nubank" && (
                      <div className="absolute right-4 animate-in zoom-in duration-300">
                        <CheckCircle2 className="w-5 h-5 text-[#8A05BE]" />
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setPaymentMethod("money")}
                    className={`w-full relative overflow-hidden flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-300 text-left group ${paymentMethod === "money" ? "bg-[#ff9d00]/10 border-[#ff9d00]/50 shadow-[0_0_20px_rgba(255,157,0,0.15)]" : "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10"}`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${paymentMethod === "money" ? "bg-[#ff9d00]" : "bg-white/10 group-hover:bg-white/20"}`}
                    >
                      <Banknote
                        className={`w-4 h-4 ${paymentMethod === "money" ? "text-white" : "opacity-80 group-hover:opacity-100"}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-bold text-sm tracking-tight ${paymentMethod === "money" ? "text-[#ff9d00]" : ""}`}
                      >
                        Dinheiro
                      </h4>
                      <p className="text-xs opacity-60 font-medium mt-0">Pagamento na entrega</p>
                    </div>
                    {paymentMethod === "money" && (
                      <div className="absolute right-4 animate-in zoom-in duration-300">
                        <CheckCircle2 className="w-5 h-5 text-[#ff9d00]" />
                      </div>
                    )}
                  </button>
                  {paymentMethod === "money" && (
                    <div className="mt-3 p-4 rounded-xl border border-white/10 bg-white/5 animate-in slide-in-from-top-2 duration-300">
                      <label className="text-sm font-medium text-white/80 mb-2 block">
                        Troco para quanto? (opcional)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                          R$
                        </span>
                        <input
                          type="number"
                          value={changeAmount}
                          onChange={(e) => setChangeAmount(e.target.value)}
                          placeholder="Ex: 50"
                          className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-9 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#ff9d00]/50 focus:ring-1 focus:ring-[#ff9d00]/50 transition-all"
                        />
                      </div>
                      {changeAmount && parseFloat(changeAmount) >= totalPrice && (
                        <p className="text-sm text-[#ff9d00] mt-3 font-medium">
                          Troco: {formatPrice(parseFloat(changeAmount) - totalPrice)}
                        </p>
                      )}
                      {changeAmount && parseFloat(changeAmount) < totalPrice && (
                        <p className="text-xs text-red-400 mt-2 font-medium">
                          Valor menor que o total
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {step === "credit_card" && (
                <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <CreditCardForm showSubmit={false} onSubmit={() => finishOrder()} />
                </div>
              )}

              {step === "pix" && (
                <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex justify-center">
                  <PixPayment totalPrice={totalPrice} onFinish={finishOrder} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-8 pt-6 border-t border-white/10 bg-black/20 backdrop-blur-md">
          <div className="flex justify-between items-baseline mb-6 text-white">
            <span className="text-base font-semibold opacity-70 tracking-tight">
              Total da compra
            </span>
            <span
              className="text-3xl font-bold tracking-tighter"
              style={{ fontFamily: "'Barlow Condensed', 'Manrope', sans-serif" }}
            >
              {formatPrice(
                ["review", "payment", "credit_card", "pix"].includes(step) ? totalPrice : subtotal,
              )}
            </span>
          </div>

          {step === "credit_card" ? (
            <button
              onClick={finishOrder}
              className="w-full py-5 rounded-2xl text-lg font-bold bg-[#ff9d00] text-black hover:bg-[#ffaa22] hover:scale-[1.02] shadow-[0_0_40px_rgba(255,157,0,0.3)] transition-all duration-300 ease-out"
            >
              Pagar e Finalizar Pedido
            </button>
          ) : step === "pix" ? (
            <button
              onClick={finishOrder}
              className="w-full py-5 rounded-2xl text-lg font-bold bg-[#ff9d00] text-black hover:bg-[#ffaa22] hover:scale-[1.02] shadow-[0_0_40px_rgba(255,157,0,0.3)] transition-all duration-300 ease-out"
            >
              Ja realizei o pagamento
            </button>
          ) : step === "payment" ? (
            <button
              onClick={handleNext}
              disabled={!paymentMethod}
              className="w-full py-5 rounded-2xl text-lg font-bold bg-[#ff9d00] text-black hover:bg-[#ffaa22] hover:scale-[1.02] shadow-[0_0_40px_rgba(255,157,0,0.3)] transition-all duration-300 ease-out disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {paymentMethod === "credit_card"
                ? "Preencher Cartao"
                : paymentMethod === "pix"
                  ? "Pagar com Pix"
                  : "Finalizar Pedido"}
            </button>
          ) : (
            <motion.button
              onClick={handleContinue}
              disabled={isContinueDisabled || isLoading}
              aria-busy={isLoading}
              {...(isLoading ? { "aria-label": "Carregando..." } : {})}
              whileHover={{ scale: isLoading || isContinueDisabled ? 1 : 1.02 }}
              whileTap={{ scale: isLoading || isContinueDisabled ? 1 : 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className={`group relative w-full overflow-hidden py-5 rounded-2xl text-lg font-bold bg-white text-black transition-[background-color,opacity,box-shadow] duration-300 ease-in-out ${
                isLoading
                  ? "cursor-not-allowed bg-white/90"
                  : "hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed"
              }`}
            >
              {/* Brilho contínuo ao passar o mouse */}
              {!isLoading && (
                <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-[#ff9d00]/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-[400%] transition-all duration-700 ease-out" />
              )}
              {/* Pulso ao clicar */}
              {pulseKey > 0 && (
                <motion.span
                  key={pulseKey}
                  className="pointer-events-none absolute inset-0 bg-[#ff9d00]"
                  initial={{ x: "-100%", opacity: 0.85 }}
                  animate={{ x: "100%", opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              )}
              {/* Texto: continua no layout (só fica invisível) para o botão não mudar de tamanho */}
              <motion.span
                className="relative flex items-center justify-center gap-2"
                animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? -6 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                Continuar
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </motion.span>
              {/* Animação do Hambúrguer Sendo Montado */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    key="burger-loading"
                    className="absolute inset-0 flex flex-col items-center justify-center gap-[1px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      initial={{ y: -15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.25, delay: 0.45, type: "spring", stiffness: 300 }}
                      className="w-6 h-2.5 bg-[#e29337] rounded-t-full z-40 shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                    />
                    <motion.div
                      initial={{ y: -15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.25, delay: 0.35, type: "spring", stiffness: 300 }}
                      className="w-[1.6rem] h-1 bg-[#6ebe43] rounded-full z-30"
                    />
                    <motion.div
                      initial={{ y: -15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.25, delay: 0.25, type: "spring", stiffness: 300 }}
                      className="w-6 h-1 bg-[#fdbd10] z-20"
                    />
                    <motion.div
                      initial={{ y: -15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.25, delay: 0.15, type: "spring", stiffness: 300 }}
                      className="w-[1.65rem] h-1.5 bg-[#5e3023] rounded-full z-10"
                    />
                    <motion.div
                      initial={{ y: 0, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.2, delay: 0 }}
                      className="w-6 h-2 bg-[#e29337] rounded-b-full z-0 shadow-[0_-1px_1px_rgba(0,0,0,0.1)]"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </div>
      </div>
    </SheetContent>
  );
}
