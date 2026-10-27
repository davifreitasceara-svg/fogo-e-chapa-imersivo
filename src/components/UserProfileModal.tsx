import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Flame,
  Sparkles,
  MapPin,
  Trash2,
  Plus,
  LogOut,
  ShoppingBag,
  Award,
  Clock,
  ShieldCheck,
  ChevronRight,
  Home,
  Briefcase,
  Check,
  Copy,
  ExternalLink,
  Crown,
  Zap,
  Gift,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useUserAddresses } from "@/hooks/useUserAddresses";
import { useLoyalty } from "@/hooks/useLoyalty";

interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
  onOpenTracking?: () => void;
}

// Sintetizador Web Audio para som de chapa estalando e brasa ardente
function playGrillSizzleSound(intensity: "normal" | "burst" = "normal") {
  if (typeof window === "undefined") return;
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const t = ctx.currentTime;

    const duration = intensity === "burst" ? 0.35 : 0.2;
    const freqTarget = intensity === "burst" ? 750 : 540;

    // Pop de calor
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(freqTarget, t + 0.1);
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.02);

    // Chapa chiando (ruído de carne estalando na chapa)
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(intensity === "burst" ? 0.12 : 0.06, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    noise.connect(noiseGain).connect(ctx.destination);
    noise.start(t);
  } catch {
    /* ignore */
  }
}

// Visual Vetorial Estilizado do Carimbo Artesanal Fogo & Chapa
function ArtisanalBurgerStamp({
  isStamped,
  isReward,
  isNext,
  index,
}: {
  isStamped: boolean;
  isReward: boolean;
  isNext: boolean;
  index: number;
}) {
  if (isStamped) {
    if (isReward) {
      return (
        <div className="relative flex flex-col items-center justify-center">
          {/* Coroa Dourada Flutuando */}
          <div className="absolute -top-3 z-10 animate-bounce">
            <div className="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 text-black text-[7.5px] font-black uppercase shadow-md flex items-center gap-0.5">
              <Crown className="size-2.5 fill-black" />
              <span>GRÁTIS!</span>
            </div>
          </div>
          {/* Burger Dourado da Vitória */}
          <svg viewBox="0 0 36 36" className="size-8 sm:size-9 drop-shadow-[0_0_12px_rgba(245,158,11,0.85)]">
            <defs>
              <linearGradient id={`royalBun-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id={`royalMeat-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>
            </defs>
            <path d="M 5 15 C 5 6, 31 6, 31 15 Z" fill={`url(#royalBun-${index})`} stroke="#fef08a" strokeWidth="0.8" />
            <circle cx="12" cy="10" r="0.75" fill="#fff" />
            <circle cx="18" cy="8.5" r="0.85" fill="#fff" />
            <circle cx="24" cy="10.5" r="0.75" fill="#fff" />
            <path d="M 4 15.5 Q 8 20 12 16 Q 18 21 24 16.5 Q 28 20 32 15.5 Z" fill="#fde047" />
            <rect x="4" y="18" width="28" height="5" rx="2.5" fill={`url(#royalMeat-${index})`} stroke="#b45309" strokeWidth="0.6" />
            <line x1="9" y1="18.5" x2="13" y2="23" stroke="#f97316" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="16" y1="18.5" x2="20" y2="23" stroke="#f97316" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="23" y1="18.5" x2="27" y2="23" stroke="#f97316" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 6 25 L 30 25 C 30 29.5, 6 29.5, 6 25 Z" fill={`url(#royalBun-${index})`} stroke="#fef08a" strokeWidth="0.8" />
          </svg>
        </div>
      );
    }

    return (
      <div className="relative flex flex-col items-center justify-center">
        {/* Hambúrguer Artesanal Carimbado a Fogo */}
        <svg viewBox="0 0 36 36" className="size-7 sm:size-8 drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)]">
          <defs>
            <linearGradient id={`bunGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id={`pattyGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="100%" stopColor="#1c0701" />
            </linearGradient>
            <linearGradient id={`cheeseGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          {/* Pão Superior Brioche com Brasa */}
          <path d="M 6 15 C 6 6, 30 6, 30 15 Z" fill={`url(#bunGrad-${index})`} stroke="#d97706" strokeWidth="0.8" />
          {/* Gergelins */}
          <circle cx="13" cy="10" r="0.7" fill="#fef3c7" />
          <circle cx="18" cy="8.5" r="0.8" fill="#fef3c7" />
          <circle cx="23" cy="10.5" r="0.7" fill="#fef3c7" />
          {/* Queijo Cheddar Derretendo na Chapa */}
          <path d="M 5 15.5 Q 9 19 12 16 Q 16 20 20 16.5 Q 24 19 31 15.5 Z" fill={`url(#cheeseGrad-${index})`} />
          {/* Hambúrguer Artesanal Grelhado na Brasa */}
          <rect x="5" y="18" width="26" height="4.8" rx="2.4" fill={`url(#pattyGrad-${index})`} stroke="#78350f" strokeWidth="0.6" />
          {/* Marcas de Grelha em Brasa */}
          <line x1="10" y1="18.5" x2="13" y2="22.5" stroke="#ea580c" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="17" y1="18.5" x2="20" y2="22.5" stroke="#ea580c" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="24" y1="18.5" x2="27" y2="22.5" stroke="#ea580c" strokeWidth="1.2" strokeLinecap="round" />
          {/* Alface / Molho Especial */}
          <path d="M 6 24 C 9 25.5, 12 24, 15 25.5 C 18 24, 21 25.5, 24 24 C 27 25.5, 30 24, 30 24" stroke="#84cc16" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          {/* Pão Inferior Tostadinho */}
          <path d="M 7 25.5 L 29 25.5 C 29 29.5, 7 29.5, 7 25.5 Z" fill={`url(#bunGrad-${index})`} stroke="#b45309" strokeWidth="0.8" />
        </svg>
        <span className="text-[8.5px] font-black uppercase text-amber-300 mt-0.5 tracking-tight flex items-center gap-0.5">
          <Flame className="size-2 text-orange-400 fill-orange-400" />
          <span>#{index}</span>
        </span>
      </div>
    );
  }

  if (isNext) {
    return (
      <div className="relative flex flex-col items-center justify-center">
        <div className="relative size-7 sm:size-8 rounded-full border-2 border-dashed border-amber-400/90 flex items-center justify-center animate-pulse bg-amber-500/10">
          <Flame className="size-3.5 text-amber-400 animate-bounce" />
        </div>
        <span className="text-[7.5px] font-black uppercase tracking-tight text-amber-300 mt-0.5">
          PRÓXIMO
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center opacity-40 hover:opacity-70 transition-opacity">
      <div className="size-6 sm:size-7 rounded-full border border-white/15 bg-black/40 flex items-center justify-center">
        {isReward ? (
          <span className="text-xs">🎁</span>
        ) : (
          <span className="text-[10px] font-mono font-bold text-white/50">{index}</span>
        )}
      </div>
      <span className="text-[7.5px] font-semibold text-white/40 uppercase mt-0.5">
        {isReward ? "GRÁTIS" : `#${index}`}
      </span>
    </div>
  );
}

export function UserProfileModal({ open, onClose, onOpenTracking }: UserProfileModalProps) {
  const { user, signOut } = useAuth();
  const { addresses, saveAddress, deleteAddress } = useUserAddresses();
  const {
    stampsCount,
    freeBurgersCount,
    redeemFreeBurger,
    addStampManual,
    refreshLoyalty,
  } = useLoyalty();

  // Recarrega os carimbos mais recentes do armazenamento sempre que o modal abrir
  useEffect(() => {
    if (open) {
      refreshLoyalty();
    }
  }, [open, refreshLoyalty]);

  const [activeTab, setActiveTab] = useState<"overview" | "addresses" | "orders">("overview");

  // Estado da Chapa Gamificada
  const [heatBoost, setHeatBoost] = useState(0);
  const [isSizzling, setIsSizzling] = useState(false);
  const [chefPhrase, setChefPhrase] = useState("A chapa está no ponto exato para grelhar!");

  // Form para adicionar novo endereço dentro do perfil
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newTitle, setNewTitle] = useState("Casa");
  const [newName, setNewName] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newComplement, setNewComplement] = useState("");
  const [copiedId, setCopiedId] = useState(false);

  if (!user) return null;

  const metadata = user.user_metadata as Record<string, any> | undefined;
  const userName =
    (metadata?.["full_name"] as string | undefined) ||
    (metadata?.["name"] as string | undefined) ||
    user.email?.split("@")[0] ||
    "Cliente Fogo & Chapa";

  const userAvatar =
    (metadata?.["avatar_url"] as string | undefined) ||
    (metadata?.["picture"] as string | undefined);

  const memberId = `FC-${user.id.substring(0, 8).toUpperCase()}`;

  const handleCopyId = () => {
    navigator.clipboard.writeText(memberId);
    setCopiedId(true);
    toast.success("ID de membro copiado!");
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Atiçar a brasa (Interatividade Divertida)
  const handleBoostFlame = () => {
    playGrillSizzleSound("burst");
    setIsSizzling(true);
    setHeatBoost((prev) => Math.min(prev + 35, 120));

    const phrases = [
      "🔥 Fogo vivo! A crostinha perfeita está garantida!",
      "🥩 Tsssss! Cheiro irresistível de defumado na chapa!",
      "⚡ Calor máximo! Os hambúrgueres estão quase prontos!",
      "👑 Mais calor, mais sabor! A brasa nunca apaga!",
      "✨ Chapa incandescente a 420°C!",
    ];
    const picked = phrases[Math.floor(Math.random() * phrases.length)];
    if (picked) {
      setChefPhrase(picked);
    }

    setTimeout(() => {
      setIsSizzling(false);
    }, 450);

    setTimeout(() => {
      setHeatBoost((prev) => Math.max(0, prev - 20));
    }, 2500);
  };



  // Simular carimbo direto na chapa
  const handleSimulateStamp = async () => {
    playGrillSizzleSound("burst");
    setIsSizzling(true);
    const res = await addStampManual(1);
    if (res.wonFree) {
      toast.success("🎉 PARABÉNS! Cartela completa! Você ganhou 1 BURGER GRÁTIS! 🍔🔥", {
        duration: 6000,
      });
    } else {
      toast.success(`🔥 Carimbo registrado com sucesso! (${res.stamps}/10)`, {
        duration: 3500,
      });
    }
    setTimeout(() => setIsSizzling(false), 450);
  };

  // Resgatar burger grátis pelo perfil
  const handleRedeemFree = async () => {
    playGrillSizzleSound("burst");
    await redeemFreeBurger();
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim() || !newNumber.trim()) {
      toast.error("Preencha a rua e o número do endereço.");
      return;
    }

    await saveAddress({
      title: newTitle.trim() || "Meu Endereço",
      name: newName.trim() || userName,
      address: newStreet.trim(),
      number: newNumber.trim(),
      complement: newComplement.trim() || undefined,
      is_default: addresses.length === 0,
    });

    setIsAddingAddress(false);
    setNewStreet("");
    setNewNumber("");
    setNewComplement("");
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  // Temperatura dinâmica da chapa
  const baseTemp = 240 + stampsCount * 18;
  const currentTemp = baseTemp + heatBoost;

  // Nível do Usuário
  const levelTitle =
    stampsCount >= 10
      ? "Lorde da Chapa Suprema"
      : stampsCount >= 7
        ? "Mestre do Fogo Alto"
        : stampsCount >= 4
          ? "Domador da Grelha"
          : "Iniciante da Brasa";

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Meu Perfil Fogo & Chapa"
        >
          {/* Backdrop cinematográfico escuro com blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* PALCO DO MODAL */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative z-10 w-full max-w-[560px] my-auto select-none max-h-[94vh] flex flex-col"
          >
            {/* CARD GLASSMORPHISM COM BORDA LUMINOSA */}
            <div className="relative p-[1.5px] rounded-[38px] overflow-hidden bg-gradient-to-b from-amber-500/60 via-orange-600/20 to-transparent shadow-[0_35px_100px_rgba(0,0,0,0.95)] flex flex-col max-h-full">
              {/* Efeito Glow Aurora sutil */}
              <div
                className="absolute inset-0 opacity-30 animate-spin pointer-events-none"
                style={{
                  animationDuration: "16s",
                  background:
                    "conic-gradient(from 0deg, transparent 0%, rgba(245,158,11,0.5) 25%, transparent 50%, rgba(239,68,68,0.5) 75%, transparent 100%)",
                }}
              />

              <div className="relative overflow-hidden rounded-[37px] bg-[#0d0d12]/98 p-5 sm:p-7 backdrop-blur-3xl flex flex-col max-h-full">
                {/* Radial Glow quente no fundo */}
                <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-gradient-to-b from-amber-500/25 via-orange-600/10 to-transparent blur-3xl" />

                {/* Botão Fechar */}
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-5 right-5 z-40 flex size-9 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/25 hover:text-white transition-all cursor-pointer shadow-lg"
                  aria-label="Fechar janela"
                >
                  <X className="size-4" />
                </button>

                {/* ========================================================= */}
                {/* CABEÇALHO DO PERFIL COM FOTO DO GOOGLE                   */}
                {/* ========================================================= */}
                <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                  <div className="relative shrink-0">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="size-16 sm:size-18 rounded-full border-2 border-amber-400 object-cover shadow-[0_0_25px_rgba(245,158,11,0.5)]"
                      />
                    ) : (
                      <div className="flex size-16 sm:size-18 items-center justify-center rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-300 font-display font-black text-2xl">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span
                      className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md"
                      title="Membro VIP"
                    >
                      <Flame className="size-3.5 fill-black text-black" />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-white truncate tracking-tight">
                        {userName}
                      </h3>
                    </div>
                    <p className="text-xs text-white/60 truncate mt-0.5">{user.email}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
                        <Sparkles className="size-2.5 text-amber-300" />
                        {levelTitle}
                      </span>

                      <button
                        type="button"
                        onClick={handleCopyId}
                        className="inline-flex items-center gap-1 text-[10px] text-white/40 hover:text-white/80 transition-colors"
                        title="Clique para copiar seu ID"
                      >
                        <span>{memberId}</span>
                        {copiedId ? <Check className="size-2.5 text-emerald-400" /> : <Copy className="size-2.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* ABAS DO PERFIL                                           */}
                {/* ========================================================= */}
                <div className="grid grid-cols-3 gap-1 p-1 mt-4 rounded-2xl bg-white/5 border border-white/10 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className={`py-2 px-1 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-1 ${
                      activeTab === "overview"
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md scale-100 font-extrabold"
                        : "text-white/60 hover:text-white scale-95"
                    }`}
                  >
                    <Flame className="size-3.5" />
                    <span>Cartão Brasa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("addresses")}
                    className={`py-2 px-1 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                      activeTab === "addresses"
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md scale-100 font-extrabold"
                        : "text-white/60 hover:text-white scale-95"
                    }`}
                  >
                    <span>Endereços</span>
                    <span className="size-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center">
                      {addresses.length}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    className={`py-2 px-1 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-1 ${
                      activeTab === "orders"
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md scale-100 font-extrabold"
                        : "text-white/60 hover:text-white scale-95"
                    }`}
                  >
                    <ShoppingBag className="size-3.5" />
                    <span>Pedidos</span>
                  </button>
                </div>

                {/* ========================================================= */}
                {/* CONTEÚDO DAS ABAS (COM SCROLL INTERNO)                    */}
                {/* ========================================================= */}
                <div className="mt-4 flex-1 overflow-y-auto pr-1 space-y-4 max-h-[50vh]">
                  {/* ABA 1: CARTÃO FIDELIDADE GAMIFICADO FOGO & CHAPA */}
                  {activeTab === "overview" && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      {/* ==================================================== */}
                      {/* O CARTÃO BLACK DE FERRO E BRASA                      */}
                      {/* ==================================================== */}
                      <motion.div
                        animate={isSizzling ? { scale: [1, 1.025, 0.99, 1.01, 1], rotate: [0, -0.5, 0.5, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className="relative rounded-3xl p-5 overflow-hidden border border-amber-500/40 shadow-[0_15px_40px_rgba(245,158,11,0.25)] select-none bg-[#121110]"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 100% 0%, rgba(245,158,11,0.25) 0%, transparent 60%), radial-gradient(circle at 0% 100%, rgba(239,68,68,0.2) 0%, transparent 60%)",
                        }}
                      >
                        {/* Marca d'água da grelha de ferro fundido */}
                        <div
                          className="absolute inset-0 opacity-10 pointer-events-none"
                          style={{
                            backgroundImage:
                              "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 16px)",
                          }}
                        />

                        {/* Topo do Cartão: Logo & Chip de Chapa */}
                        <div className="flex items-start justify-between relative z-10">
                          <div className="flex items-center gap-2">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-black shadow-md font-bold">
                              <Flame className="size-5 fill-black text-black animate-pulse" />
                            </div>
                            <div>
                              <div className="font-display font-black text-sm uppercase tracking-wider text-white">
                                FOGO & CHAPA
                              </div>
                              <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-amber-400">
                                CARTÃO FIDELIDADE BRASA
                              </div>
                            </div>
                          </div>

                          {/* Termômetro da Chapa */}
                          <div className="text-right">
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                              <Flame className="size-3 text-orange-400 animate-bounce" />
                              <span>{currentTemp}°C</span>
                            </div>
                            <div className="text-[8px] text-white/50 tracking-wider uppercase mt-0.5">
                              {currentTemp >= 400 ? "Chapa Vulcânica" : "Ponto da Brasa"}
                            </div>
                          </div>
                        </div>

                        {/* Chip metálico do cartão */}
                        <div className="my-3 flex items-center justify-between relative z-10">
                          <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 border border-amber-600 shadow-inner flex items-center justify-center">
                            <div className="w-6 h-4 border border-amber-800/40 rounded-sm flex items-center justify-center">
                              <Flame className="size-2.5 text-amber-900 fill-amber-900" />
                            </div>
                          </div>
                          <div className="text-[10px] font-mono tracking-widest text-amber-300/80">
                            PASSAPORTE VIP
                          </div>
                        </div>

                        {/* Número & Nome */}
                        <div className="relative z-10 flex items-end justify-between">
                          <div>
                            <div className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                              Mestre da Mesa
                            </div>
                            <div className="font-display font-black text-base text-white tracking-wide uppercase truncate max-w-[240px]">
                              {userName}
                            </div>
                          </div>

                          <div className="text-right font-mono text-xs font-bold text-amber-400">
                            {stampsCount} / 10 CARIMBOS
                            {freeBurgersCount > 0 && (
                              <div className="text-emerald-400 text-[10px] font-black uppercase">
                                🎁 {freeBurgersCount} GRÁTIS!
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>

                      {/* BANNER CELEBRATÓRIO QUANDO TIVER BURGER GRÁTIS */}
                      {freeBurgersCount > 0 && (
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/25 via-orange-600/25 to-amber-500/20 border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.35)] flex flex-col sm:flex-row items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-black flex items-center justify-center font-black shadow-lg shrink-0">
                              <Crown className="size-6 fill-black" />
                            </div>
                            <div>
                              <h4 className="font-display font-black text-xs uppercase tracking-wider text-amber-300">
                                {freeBurgersCount === 1
                                  ? "🎉 1 Hambúrguer Grátis Disponível!"
                                  : `🎉 ${freeBurgersCount} Hambúrgueres Grátis Disponíveis!`}
                              </h4>
                              <p className="text-[11px] text-white/80">
                                Você completou a cartela! Resgate no checkout do carrinho com <strong>-R$ 35,00</strong>!
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRedeemFree}
                            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-110 text-black font-display font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer shrink-0"
                          >
                            Resgatar Agora
                          </button>
                        </motion.div>
                      )}

                      {/* REGRAS CLARAS DE ACÚMULO */}
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white/90">
                          <span className="block text-base">🍔</span>
                          <span className="text-amber-400 font-extrabold">+1 Carimbo</span>
                          <span className="block text-[9px] text-white/50">Por Hambúrguer</span>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-white/90">
                          <span className="block text-base">👑</span>
                          <span className="text-orange-400 font-extrabold">+2 Carimbos</span>
                          <span className="block text-[9px] text-white/50">Por Combo</span>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-white/90">
                          <span className="block text-base">🎁</span>
                          <span className="text-emerald-400 font-extrabold">10 = Grátis</span>
                          <span className="block text-[9px] text-white/50">1 Burger Grátis</span>
                        </div>
                      </div>

                      {/* ==================================================== */}
                      {/* A GRELHA DE 10 CARIMBOS DA CHAPA                     */}
                      {/* ==================================================== */}
                      <div className="p-4 sm:p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-display font-black text-sm uppercase tracking-wide text-white flex items-center gap-1.5">
                              <Flame className="size-4 text-amber-400" />
                              Cartão Fidelidade da Chapa
                            </h4>
                            <p className="text-[11px] text-white/60">
                              Cada hambúrguer = 1 carimbo. Cada combo = 2 carimbos. Aos 10 = 1 Burger Grátis!
                            </p>
                          </div>

                          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 shrink-0">
                            {stampsCount}/10
                          </span>
                        </div>

                        {/* Grid dos 10 Selos com Hambúrgueres Artesanais Estilizados */}
                        <div className="grid grid-cols-5 gap-2 pt-1">
                          {Array.from({ length: 10 }).map((_, i) => {
                            const index = i + 1;
                            const isStamped = index <= stampsCount;
                            const isNext = index === stampsCount + 1;
                            const isReward = index === 10;

                            return (
                              <motion.div
                                key={index}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.94 }}
                                onClick={() => {
                                  playGrillSizzleSound("burst");
                                  toast.info(
                                    isStamped
                                      ? `Selo #${index}: Hambúrguer artesanal carimbado na brasa! 🔥`
                                      : isReward
                                        ? "🎁 Selo #10: Complete para ganhar seu Hambúrguer Grátis!"
                                        : `Selo #${index}: Conquiste no seu próximo hambúrguer ou combo!`,
                                  );
                                }}
                                className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-1 cursor-pointer transition-all border ${
                                  isStamped
                                    ? isReward
                                      ? "bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 text-black border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.7)]"
                                      : "bg-gradient-to-br from-amber-500/30 to-orange-600/30 border-amber-500/70 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                                    : isNext
                                      ? "bg-amber-500/10 border-dashed border-amber-400/80 text-amber-400 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                                      : "bg-white/[0.03] border-white/10 text-white/20 hover:border-white/25"
                                }`}
                              >
                                <ArtisanalBurgerStamp
                                  isStamped={isStamped}
                                  isReward={isReward}
                                  isNext={isNext}
                                  index={index}
                                />
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Barra de Progresso Fogo & Chapa */}
                        <div className="pt-2 space-y-1.5">
                          <div className="w-full h-3 rounded-full bg-black/50 border border-white/10 p-0.5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(stampsCount / 10) * 100}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                            />
                          </div>

                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-white/60">
                              {stampsCount >= 10 ? (
                                <strong className="text-emerald-400 font-bold">
                                  🎉 Cartela completa! Burger grátis liberado!
                                </strong>
                              ) : (
                                <>
                                  Faltam <strong className="text-amber-400 font-extrabold">{10 - stampsCount}</strong>{" "}
                                  carimbos para o prêmio
                                </>
                              )}
                            </span>
                            <span className="text-amber-400 font-mono font-bold">
                              {Math.round((stampsCount / 10) * 100)}%
                            </span>
                          </div>
                        </div>

                        {/* ==================================================== */}
                        {/* INTERATIVIDADE DIVERTIDA: ATIÇAR A BRASA & CARIMBAR   */}
                        {/* ==================================================== */}
                        <div className="pt-2 border-t border-white/10 space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.96 }}
                              onClick={handleBoostFlame}
                              className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-400 text-black font-display font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Flame className={`size-4 ${isSizzling ? "animate-spin text-white" : ""}`} />
                              <span>Atiçar Brasa (+Calor)</span>
                            </motion.button>

                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.96 }}
                              onClick={handleSimulateStamp}
                              className="w-full py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                            >
                              <Sparkles className="size-4 text-amber-400" />
                              <span>Carimbar Selo (+1)</span>
                            </motion.button>
                          </div>
                        </div>

                        {/* Frase divertida do Mestre da Brasa */}
                        <div className="text-center text-[10px] text-amber-300/80 italic pt-1">
                          "{chefPhrase}"
                        </div>
                      </div>

                      {/* Vantagens Ativas */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                          <div className="size-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                            <Award className="size-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Frete Grátis da Chapa</p>
                            <p className="text-[11px] text-white/60 mt-0.5">Automático em pedidos acima de R$ 60</p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                          <div className="size-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                            <ShieldCheck className="size-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Endereços Salvos</p>
                            <p className="text-[11px] text-white/60 mt-0.5">Preenchimento com 1 clique</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ABA 2: MEUS ENDEREÇOS */}
                  {activeTab === "addresses" && (
                    <div className="space-y-3.5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[11px] font-bold text-white/60 uppercase tracking-wider ml-1">
                          Locais de Entrega ({addresses.length})
                        </h4>
                        {!isAddingAddress && (
                          <button
                            type="button"
                            onClick={() => setIsAddingAddress(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all cursor-pointer shadow-md"
                          >
                            <Plus className="size-3.5" />
                            <span>Novo Endereço</span>
                          </button>
                        )}
                      </div>

                      {/* Formulário para Adicionar Endereço */}
                      {isAddingAddress && (
                        <form
                          onSubmit={handleCreateAddress}
                          className="p-4 rounded-2xl bg-white/5 border border-amber-500/40 space-y-3 animate-in slide-in-from-top duration-200"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-white/10">
                            <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                              Cadastrar Novo Endereço
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsAddingAddress(false)}
                              className="text-xs text-white/40 hover:text-white"
                            >
                              Cancelar
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            {["Casa", "Trabalho", "Outro"].map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => setNewTitle(type)}
                                className={`py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                  newTitle === type
                                    ? "bg-amber-500/20 border-amber-500 text-amber-300"
                                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>

                          <div>
                            <input
                              type="text"
                              value={newStreet}
                              onChange={(e) => setNewStreet(e.target.value)}
                              placeholder="Rua / Avenida"
                              required
                              className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-amber-500 focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={newNumber}
                              onChange={(e) => setNewNumber(e.target.value)}
                              placeholder="Número"
                              required
                              className="col-span-1 bg-black/40 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-amber-500 focus:outline-none"
                            />
                            <input
                              type="text"
                              value={newComplement}
                              onChange={(e) => setNewComplement(e.target.value)}
                              placeholder="Complemento (Apto, Bloco)"
                              className="col-span-2 bg-black/40 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-amber-500 focus:outline-none"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                          >
                            Salvar Endereço
                          </button>
                        </form>
                      )}

                      {/* Lista de Endereços */}
                      {addresses.length === 0 ? (
                        <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-white/15 bg-white/5">
                          <MapPin className="size-8 mx-auto text-white/30 mb-2" />
                          <p className="text-xs text-white/70 font-semibold">Nenhum endereço salvo ainda</p>
                          <p className="text-[11px] text-white/40 mt-1 max-w-xs mx-auto">
                            Cadastre seu endereço acima ou faça seu primeiro pedido para salvar automaticamente!
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {addresses.map((addr) => (
                            <div
                              key={addr.id}
                              className="group flex items-start justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/40 hover:bg-white/[0.08] transition-all"
                            >
                              <div className="flex items-start gap-3 min-w-0 flex-1">
                                <div className="size-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                                  {addr.title.toLowerCase().includes("trabalho") ? (
                                    <Briefcase className="size-4" />
                                  ) : (
                                    <Home className="size-4" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-white truncate">
                                      {addr.title}
                                    </span>
                                    {addr.is_default && (
                                      <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold px-1.5 py-0.5 rounded-full">
                                        Principal
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-white/70 mt-1 truncate">
                                    {addr.address}, {addr.number} {addr.complement ? `(${addr.complement})` : ""}
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => deleteAddress(addr.id)}
                                className="p-2 text-white/40 hover:text-red-400 hover:bg-white/10 rounded-xl transition-all ml-2 cursor-pointer"
                                title="Excluir endereço"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ABA 3: PEDIDOS */}
                  {activeTab === "orders" && (
                    <div className="space-y-3.5 animate-in fade-in duration-200">
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-2xl bg-amber-500 text-black flex items-center justify-center font-bold">
                            <ShoppingBag className="size-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Rastrear Pedido Atual</p>
                            <p className="text-[11px] text-white/60">Acompanhe seu entregador no mapa</p>
                          </div>
                        </div>

                        {onOpenTracking && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenTracking();
                            }}
                            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all cursor-pointer shadow-md flex items-center gap-1"
                          >
                            <span>Abrir Mapa</span>
                            <ExternalLink className="size-3" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-[11px] font-bold text-white/60 uppercase tracking-wider ml-1">
                          Histórico de Experiências
                        </h4>

                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-xl bg-white/10 text-white/70 flex items-center justify-center">
                              <Flame className="size-4 text-amber-400" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">Combo Brasa Suprema</p>
                              <p className="text-[11px] text-white/50 flex items-center gap-1 mt-0.5">
                                <Clock className="size-3" /> Hoje às 19:42 • Entregue
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-amber-400">R$ 58,90</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ========================================================= */}
                {/* RODAPÉ DO PERFIL COM LOGOUT                               */}
                {/* ========================================================= */}
                <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex-1 py-3 px-4 rounded-2xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogOut className="size-4" />
                    <span>Sair da Conta</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-display font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-1"
                  >
                    <span>Fazer Pedido</span>
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
