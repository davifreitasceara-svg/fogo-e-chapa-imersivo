import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Sparkles, CheckCircle2, ShieldCheck, LogOut, ArrowRight, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface BurgerBoxLoginProps {
  open: boolean;
  onClose: () => void;
}

// Web Audio synthesis for fun interactive feedback
function playBurgerSizzleSound() {
  if (typeof window === "undefined") return;
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const t = ctx.currentTime;

    // Pop tone
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(340, t);
    osc.frequency.exponentialRampToValueAtTime(580, t + 0.08);
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(g).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.14);

    // Chapa sizzle noise
    const bufferSize = Math.floor(ctx.sampleRate * 0.16);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.05, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    noise.connect(noiseGain).connect(ctx.destination);
    noise.start(t);
  } catch {
    /* ignore */
  }
}

function GoogleIcon({ className = "size-5 shrink-0" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 2.3 1.9 4.7l3.7-1.9z"
      />
      <path
        fill="#34A853"
        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
      />
    </svg>
  );
}

export function BurgerBoxLogin({ open, onClose }: BurgerBoxLoginProps) {
  const { user, signInWithGoogle, signOut, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      playBurgerSizzleSound();
      await signInWithGoogle();
      // O redirect do OAuth levará ao Google
    } catch (err: any) {
      setIsSubmitting(false);
      toast.error(err?.message || "Não foi possível conectar com o Google. Tente novamente.");
    }
  };

  const handleLogout = async () => {
    playBurgerSizzleSound();
    await signOut();
    onClose();
  };

  const metadata = user?.user_metadata as Record<string, any> | undefined;

  const userName =
    (metadata?.["full_name"] as string | undefined) ||
    (metadata?.["name"] as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Cliente Fogo & Chapa";

  const userAvatar =
    (metadata?.["avatar_url"] as string | undefined) ||
    (metadata?.["picture"] as string | undefined);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Acessar com o Google"
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

          {/* PALCO 3D DO MODAL */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 25 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-[440px] my-auto select-none"
          >
            {/* CARD GLASSMORPHISM COM BORDA LUMINOSA ANIMADA */}
            <div className="relative p-[1.5px] rounded-[36px] overflow-hidden bg-gradient-to-b from-amber-500/50 via-white/10 to-transparent shadow-[0_30px_100px_rgba(0,0,0,0.95)]">
              {/* Efeito Aurora Glow nas bordas */}
              <div
                className="absolute inset-0 opacity-40 animate-spin pointer-events-none"
                style={{
                  animationDuration: "12s",
                  background:
                    "conic-gradient(from 0deg, transparent 0%, rgba(245,158,11,0.6) 25%, transparent 50%, rgba(239,68,68,0.6) 75%, transparent 100%)",
                }}
              />

              <div className="relative overflow-hidden rounded-[35px] bg-[#0d0d11]/95 p-6 sm:p-8 pt-8 backdrop-blur-3xl">
                {/* Radial Glow quente no fundo */}
                <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-gradient-to-b from-amber-500/25 via-orange-600/10 to-transparent blur-3xl" />

                {/* Botão Fechar Modal */}
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-5 right-5 z-40 flex size-9 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/25 hover:text-white transition-all cursor-pointer shadow-lg"
                  aria-label="Fechar janela"
                >
                  <X className="size-4" />
                </button>

                {user ? (
                  /* ========================================================= */
                  /* ESTADO: USUÁRIO JÁ CONECTADO VIA GOOGLE                   */
                  /* ========================================================= */
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt={userName}
                          className="size-20 rounded-full border-2 border-amber-500/80 object-cover shadow-[0_0_25px_rgba(245,158,11,0.5)]"
                        />
                      ) : (
                        <div className="flex size-20 items-center justify-center rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-400">
                          <User className="size-10" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-black shadow-md">
                        <CheckCircle2 className="size-4 text-black" />
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
                      <GoogleIcon className="size-3.5" />
                      <span>Conectado com Google</span>
                    </div>

                    <h3 className="font-display text-2xl font-black uppercase text-white tracking-tight">
                      {userName}
                    </h3>
                    <p className="text-xs text-white/60 mb-6">{user.email}</p>

                    <div className="w-full space-y-2.5">
                      <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 py-3.5 font-display font-black text-xs uppercase tracking-widest text-black shadow-[0_0_35px_-8px_rgba(245,158,11,0.8)] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Continuar Comprando</span>
                        <ArrowRight className="size-4" />
                      </button>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 hover:bg-red-500/15 hover:border-red-500/40 hover:text-red-300 py-3 text-xs font-bold text-white/70 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <LogOut className="size-4" />
                        <span>Sair da Conta</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ========================================================= */
                  /* ESTADO: LOGIN EXCLUSIVO COM O GOOGLE                      */
                  /* ========================================================= */
                  <div className="flex flex-col items-center text-center">
                    {/* Badge topo */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 mb-3 shadow-md cursor-default"
                    >
                      <Flame className="size-3.5 animate-pulse text-amber-400" />
                      <span className="font-display font-black text-[10px] tracking-[0.2em] uppercase">
                        Acesso Fogo & Chapa
                      </span>
                      <Sparkles className="size-3 text-amber-300" />
                    </motion.div>

                    <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                      Entre na Brasa
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-white/65 max-w-xs leading-relaxed">
                      Conecte-se com sua conta Google em um clique para resgatar benefícios e acompanhar pedidos.
                    </p>

                    {/* Botão de Destaque Oficial: Entrar com o Google */}
                    <div className="w-full mt-6">
                      <motion.button
                        type="button"
                        disabled={isSubmitting || isLoading}
                        onClick={handleGoogleLogin}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative w-full overflow-hidden rounded-2xl bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 px-6 text-sm sm:text-base shadow-[0_10px_35px_-5px_rgba(255,255,255,0.35)] transition-all cursor-pointer flex items-center justify-center gap-3 border border-white"
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                        {isSubmitting ? (
                          <>
                            <span className="size-5 animate-spin rounded-full border-2 border-gray-400 border-t-gray-900" />
                            <span className="font-semibold text-gray-800">Conectando ao Google...</span>
                          </>
                        ) : (
                          <>
                            <GoogleIcon className="size-5" />
                            <span className="font-bold tracking-tight">Continuar com o Google</span>
                          </>
                        )}
                      </motion.button>
                    </div>

                    {/* Vantagens exclusivas do Google Login */}
                    <div className="w-full mt-6 pt-5 border-t border-white/10 text-left space-y-2.5">
                      <div className="flex items-center gap-2.5 text-xs text-white/80">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
                          <CheckCircle2 className="size-3.5" />
                        </div>
                        <span>Acesso instantâneo sem precisar cadastrar senhas</span>
                      </div>

                      <div className="flex items-center gap-2.5 text-xs text-white/80">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
                          <Flame className="size-3.5" />
                        </div>
                        <span>Acumule brasas e ganhe descontos automáticos</span>
                      </div>

                      <div className="flex items-center gap-2.5 text-xs text-white/80">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
                          <Sparkles className="size-3.5" />
                        </div>
                        <span>Rastreio de entrega em tempo real direto na sua mesa</span>
                      </div>
                    </div>

                    {/* Selo de Segurança */}
                    <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-white/40">
                      <ShieldCheck className="size-3.5 text-emerald-400" />
                      <span>Autenticação rápida e segura via Google & Supabase</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
