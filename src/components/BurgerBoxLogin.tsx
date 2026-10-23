import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Mail, Lock, Eye, EyeOff, Sparkles, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import burgerClassico from "@/assets/burger-classico.png";

interface BurgerBoxLoginProps {
  open: boolean;
  onClose: () => void;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
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

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.47c.66-.82 1.11-1.96.99-3.1-.96.04-2.11.64-2.8 1.45-.61.71-1.14 1.87-1 2.98 1.07.08 2.16-.54 2.81-1.33z" />
    </svg>
  );
}

export function BurgerBoxLogin({ open, onClose }: BurgerBoxLoginProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("davifreitasceara@gmail.com");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        mode === "login"
          ? "Login realizado com sucesso! Bem-vindo ao Fogo e Chapa 🔥"
          : "Conta criada com sucesso! Aproveite seus benefícios 🔥",
      );
      onClose();
    }, 600);
  };

  const handleOAuthLogin = (provider: string) => {
    toast.success(`Autenticando via ${provider}...`);
    setTimeout(() => {
      toast.success(`Conectado com sucesso via ${provider}! 🔥`);
      onClose();
    }, 700);
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Acessar sua conta"
        >
          {/* Backdrop escuro cinematográfico com blur suave */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* PALCO MODAL 3D LIVRE (SEM FORMATO DE CAIXA DE PAPELÃO) */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            className="relative z-10 w-full max-w-[460px] my-auto select-none"
            style={{ perspective: 1200 }}
          >
            {/* HERO BURGER LIVRE 3D FLUTUANTE (O MODELO BONITO BEM FORMADO) */}
            <div className="relative -mb-16 z-20 flex justify-center pointer-events-none">
              {/* Sombra de contato e reflexo de brasa no chão */}
              <div className="absolute bottom-2 w-48 h-8 rounded-full bg-black/80 blur-xl" />
              <div className="absolute bottom-3 w-36 h-6 rounded-full bg-amber-500/25 blur-lg" />

              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotateZ: [0, 1.5, -1.5, 0],
                }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-40 sm:w-44"
              >
                <img
                  src={burgerClassico}
                  alt="Hambúrguer Fogo e Chapa"
                  draggable={false}
                  className="w-full object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.9)] filter contrast-110"
                />
              </motion.div>
            </div>

            {/* CONTAINER GLASSMORPHISM LUXUOSO */}
            <div className="relative overflow-hidden rounded-[36px] bg-[#0d0d10]/95 border border-white/10 p-6 sm:p-8 pt-20 shadow-[0_30px_100px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
              {/* Radial Glow interno quente no topo */}
              <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full bg-gradient-to-b from-amber-500/30 via-orange-600/15 to-transparent blur-3xl" />

              {/* Botão Fechar Modal */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-5 right-5 z-30 flex size-9 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all cursor-pointer shadow-lg"
                aria-label="Fechar janela"
              >
                <X className="size-4" />
              </button>

              {/* Tag Fogo e Chapa Club */}
              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 mb-3 shadow-md">
                  <Flame className="size-3.5 animate-pulse" />
                  <span className="font-display font-black text-[10px] tracking-[0.2em] uppercase">
                    Fogo & Chapa Club
                  </span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                  {mode === "login" ? "Entrar na sua Conta" : "Criar sua Conta"}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-white/60 max-w-xs">
                  {mode === "login"
                    ? "Acompanhe seus pedidos em tempo real e resgate brasas de fidelidade."
                    : "Cadastre-se e ganhe desconto exclusivo no seu primeiro combo."}
                </p>
              </div>

              {/* Tabs Switcher: Entrar / Cadastrar */}
              <div className="grid grid-cols-2 p-1 mt-5 rounded-2xl bg-white/5 border border-white/10">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`py-2 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    mode === "login"
                      ? "bg-amber-500 text-black shadow-lg"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`py-2 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    mode === "signup"
                      ? "bg-amber-500 text-black shadow-lg"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Cadastrar
                </button>
              </div>

              {/* FORMULÁRIO DE LOGIN / CADASTRO */}
              <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-white/70 uppercase tracking-wider mb-1">
                    E-mail
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition-colors focus-within:border-amber-500/60 focus-within:bg-white/10">
                    <Mail className="size-4 text-white/50" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-white/70 uppercase tracking-wider">
                      Senha
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => toast.info("Instruções de recuperação enviadas para seu e-mail!")}
                        className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                      >
                        Esqueceu?
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition-colors focus-within:border-amber-500/60 focus-within:bg-white/10">
                    <Lock className="size-4 text-white/50" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-white/50 hover:text-white transition-colors cursor-pointer"
                      aria-label={showPassword ? "Ocultar senha" : "Ver senha"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Botão Entrar / Cadastrar */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.02 }}
                  className="w-full mt-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 py-3.5 font-display font-black text-xs uppercase tracking-widest text-black shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="animate-spin text-sm">⏳</span>
                  ) : (
                    <>
                      <span>{mode === "login" ? "Entrar na Brasa" : "Concluir Cadastro"}</span>
                      <Flame className="size-4" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Divisor Social */}
              <div className="my-5 flex items-center gap-3 text-[11px] text-white/40 uppercase tracking-widest">
                <span className="h-px flex-1 bg-white/10" />
                <span>ou acesse com</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              {/* Botões Sociais: Google, GitHub, Apple */}
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleOAuthLogin("Google")}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/15 hover:border-white/25 cursor-pointer shadow-sm"
                >
                  <GoogleIcon />
                  <span className="hidden xs:inline">Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuthLogin("GitHub")}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/15 hover:border-white/25 cursor-pointer shadow-sm"
                >
                  <GitHubIcon />
                  <span className="hidden xs:inline">GitHub</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuthLogin("Apple")}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/15 hover:border-white/25 cursor-pointer shadow-sm"
                >
                  <AppleIcon />
                  <span className="hidden xs:inline">Apple</span>
                </button>
              </div>

              {/* Rodapé Alternar Modo */}
              <p className="mt-5 text-center text-xs text-white/50">
                {mode === "login" ? "Ainda não tem conta?" : "Já é cadastrado?"}{" "}
                <button
                  type="button"
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {mode === "login" ? "Cadastre-se grátis" : "Fazer login"}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
