import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import { CreditCardForm } from "./ui/credit-card-form";
import { PixPayment } from "./ui/pix-payment";

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
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
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
        setDetailsError("Informacoes incompletas");
        return;
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

  const finishOrder = () => {
    handleCheckout(address, orderType);
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
      style={{
        backgroundColor: currentTheme.bgDark,
        color: currentTheme.bgLight,
        borderColor: currentTheme.secondaryAlpha,
      }}
      className={`flex w-full flex-col sm:max-w-md border-l-[1px] p-0 font-sans shadow-2xl transition-all duration-500 ease-in-out [&_*]:cursor-none cursor-none overflow-hidden`}
    >
      <div
        className="flex flex-col w-full h-full relative"
        onMouseMove={(e) => {
          setMousePos({ x: e.clientX, y: e.clientY });
          if (!isMouseIn) setIsMouseIn(true);
        }}
        onMouseLeave={() => setIsMouseIn(false)}
        onMouseDown={() => setIsMouseDown(true)}
        onMouseUp={() => setIsMouseDown(false)}
      >
        {/* Cursor Espátula Customizado */}
        <AnimatePresence>
          {isMouseIn && (
            <motion.div
              className="fixed top-0 left-0 pointer-events-none z-[99999]"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                x: mousePos.x - 20,
                y: mousePos.y - 20,
                opacity: 1,
                scale: isMouseDown ? 0.8 : 1,
                rotate: isMouseDown ? 15 : 45,
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 800, damping: 25, mass: 0.5 }}
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ filter: "drop-shadow(3px 12px 10px rgba(0,0,0,0.5))" }}
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
                      return (
                        <div
                          key={product.id}
                          className="relative flex gap-5 items-center p-4 rounded-3xl bg-white/5 border border-white/10 group transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                        >
                          <button
                            onClick={() => updateQuantity(product.id, -(quantity as number))}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-black border border-white/10 text-white/60 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-red-500 hover:text-white hover:border-red-500 hover:scale-110 z-10 shadow-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-black/20 shadow-inner border border-white/5">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                            />
                          </div>
                          <div className="flex-1 py-1">
                            <h4 className="font-bold text-lg text-white leading-tight tracking-tight">
                              {product.name}
                            </h4>
                            <p className="text-sm mt-1 text-[#ff9d00] font-bold">
                              {formatPrice(product.price)}
                            </p>

                            <div className="flex items-center gap-4 mt-3 bg-black/40 w-fit rounded-full px-1 py-1 border border-white/10">
                              <button
                                onClick={() => updateQuantity(product.id, -1)}
                                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all p-1.5"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <div className="w-5 text-center overflow-hidden flex items-center justify-center">
                                <AnimatePresence mode="popLayout" initial={false}>
                                  <motion.span
                                    key={quantity as number}
                                    initial={{ y: 8, opacity: 0, scale: 0.7 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    exit={{ y: -8, opacity: 0, scale: 0.7 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                    className="text-sm font-black text-white inline-block"
                                  >
                                    {quantity as number}
                                  </motion.span>
                                </AnimatePresence>
                              </div>
                              <button
                                onClick={() => updateQuantity(product.id, 1)}
                                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all p-1.5"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
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
                <div className="space-y-6 mt-4 text-white">
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
                  <div>
                    <label className="text-[11px] font-bold text-white/60 ml-2 mb-2 block uppercase tracking-wider">
                      ENDERECO
                    </label>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      type="text"
                      className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-5 py-4 text-base font-medium focus:border-white/40 focus:bg-white/10 focus:outline-none transition-all duration-300 placeholder:text-white/20 placeholder:font-normal"
                      placeholder="Rua, Avenida..."
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="text-[11px] font-bold text-white/60 ml-2 mb-2 block uppercase tracking-wider">
                        NUMERO
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
                </div>
              )}

              {step === "review" && (
                <div className="space-y-6 mt-4 text-white">
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
