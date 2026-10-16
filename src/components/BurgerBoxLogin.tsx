import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Mail, Lock, Eye, EyeOff, RotateCcw, PackageCheck, Sparkles, LogIn } from "lucide-react";
import { toast } from "sonner";
import burgerClassico from "@/assets/burger-classico.png";

interface BurgerBoxLoginProps {
  open: boolean;
  onClose: () => void;
}

export function BurgerBoxLogin({ open, onClose }: BurgerBoxLoginProps) {
  const [isOpenBox, setIsOpenBox] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reseta para caixa fechada ao abrir o modal
  useEffect(() => {
    if (open) {
      setIsOpenBox(false);
      setIsSubmitting(false);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Login realizado com sucesso! Bem-vindo ao Fogo e Chapa 🔥");
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
          aria-label="Login na Caixa de Hambúrguer"
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

          {/* PALCO 3D COM PERSPECTIVA ISOMÉTRICA DA MESA */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-[520px] my-auto py-6 select-none"
            style={{ perspective: "1400px", perspectiveOrigin: "50% 36%" }}
          >
            {/* Botão de Fechar Modal */}
            <button
              onClick={onClose}
              className="absolute -top-3 right-2 z-50 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold tracking-wider uppercase transition-colors backdrop-blur-md border border-white/20 cursor-pointer shadow-lg"
              aria-label="Fechar janela"
            >
              <span>Fechar</span>
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Sombra de oclusão de contato realista na mesa */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[88%] h-16 rounded-[100%] bg-black/80 blur-2xl pointer-events-none transition-all duration-700"
              style={{
                transform: isOpenBox
                  ? "translate(-50%, 24px) scale(1.18)"
                  : "translate(-50%, 10px) scale(0.96)",
              }}
            />

            {/* ================================================================= */}
            {/* CAIXA CLAMSHELL KRAFT "SENTADA" NA MESA (GEOMETRIA REAL DA FOTO)  */}
            {/* ================================================================= */}
            <div
              className="relative w-full transition-transform duration-700 ease-[cubic-bezier(0.2,0.9,0.3,1)]"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateX(24deg) rotateY(-4deg)",
              }}
            >
              {/* =============================================================== */}
              {/* 1. TAMPA SUPERIOR (CLAMSHELL LID) - HINGED AT REAR SEAM         */}
              {/* =============================================================== */}
              <div
                onClick={() => {
                  if (!isOpenBox) setIsOpenBox(true);
                }}
                className={`relative w-full z-40 transition-all duration-750 ease-[cubic-bezier(0.2,0.9,0.3,1)] ${
                  !isOpenBox ? "cursor-pointer group" : ""
                }`}
                style={{
                  transformOrigin: "top center",
                  transformStyle: "preserve-3d",
                  transform: isOpenBox
                    ? "rotateX(-115deg) translateY(-32px) translateZ(44px)"
                    : "rotateX(0deg) translateY(0px) translateZ(0px)",
                }}
              >
                {/* ESTRUTURA DA TAMPA: CASCA HOLLOW (ABAS LATERAIS + TETO + ABA FRONTAL) */}
                <div
                  className="relative w-full rounded-t-2xl overflow-visible transition-shadow duration-700"
                  style={{
                    background:
                      "linear-gradient(155deg, #c79a66 0%, #b2824e 40%, #996937 75%, #7a4d21 100%)",
                    boxShadow: isOpenBox
                      ? "0 -28px 60px rgba(0,0,0,0.85), inset 0 2px 4px rgba(255,255,255,0.4)"
                      : "0 18px 45px rgba(0,0,0,0.65), inset 0 2px 5px rgba(255,255,255,0.4), inset 0 -4px 12px rgba(0,0,0,0.4)",
                  }}
                >
                  {/* Textura de papelão kraft natural com microfibras */}
                  <div
                    className="absolute inset-0 rounded-t-2xl pointer-events-none opacity-20 mix-blend-multiply"
                    style={{
                      backgroundImage: `radial-gradient(#4d2605 1px, transparent 1px)`,
                      backgroundSize: "5px 5px",
                    }}
                  />

                  {/* ABA LATERAL ESQUERDA DA TAMPA (COM CORTE CHANFRADO A 45° DA FOTO) */}
                  <div
                    className="absolute top-1 -left-3.5 w-7 h-28 pointer-events-none transition-transform duration-700"
                    style={{
                      transformOrigin: "right center",
                      transform: isOpenBox ? "rotateY(-35deg)" : "rotateY(0deg)",
                    }}
                  >
                    <svg viewBox="0 0 28 112" className="w-full h-full drop-shadow-md">
                      {/* Parede lateral trapezoidal com corte chanfrado */}
                      <polygon
                        points="28,0 4,20 4,92 28,112"
                        fill={isOpenBox ? "#f7f4ed" : "#946637"}
                        stroke="#754b20"
                        strokeWidth="1"
                      />
                      {/* Vinco diagonal de dobra da embalagem */}
                      <line x1="28" y1="56" x2="4" y2="20" stroke="#5a3310" strokeWidth="1" />
                      <line x1="28" y1="56" x2="4" y2="92" stroke="#5a3310" strokeWidth="1" />
                    </svg>
                  </div>

                  {/* ABA LATERAL DIREITA DA TAMPA (COM CORTE CHANFRADO A 45° DA FOTO) */}
                  <div
                    className="absolute top-1 -right-3.5 w-7 h-28 pointer-events-none transition-transform duration-700"
                    style={{
                      transformOrigin: "left center",
                      transform: isOpenBox ? "rotateY(35deg)" : "rotateY(0deg)",
                    }}
                  >
                    <svg viewBox="0 0 28 112" className="w-full h-full drop-shadow-md">
                      <polygon
                        points="0,0 24,20 24,92 0,112"
                        fill={isOpenBox ? "#f7f4ed" : "#946637"}
                        stroke="#754b20"
                        strokeWidth="1"
                      />
                      <line x1="0" y1="56" x2="24" y2="20" stroke="#5a3310" strokeWidth="1" />
                      <line x1="0" y1="56" x2="24" y2="92" stroke="#5a3310" strokeWidth="1" />
                    </svg>
                  </div>

                  {/* PAINEL CENTRAL DA TAMPA */}
                  <div className="relative z-10 px-6 pt-7 pb-4 flex flex-col items-center text-center">
                    {/* QUANDO A CAIXA ESTÁ FECHADA: DESIGN ARTESANAL DA EMBALAGEM KRAFT */}
                    {!isOpenBox ? (
                      <div className="w-full flex flex-col items-center">
                        {/* Carimbo Artesanal Fogo e Chapa queimado na brasa */}
                        <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#4d2807]/75 flex flex-col items-center justify-center p-1.5 rotate-[-2deg] bg-[#b88856]/40 shadow-inner mb-2.5">
                          <Flame className="w-8 h-8 text-[#401f04]" />
                          <span className="font-display font-black text-[11px] tracking-tight text-[#401f04] uppercase leading-none mt-1">
                            FOGO E CHAPA
                          </span>
                          <span className="text-[8px] font-bold text-[#5a320d] tracking-widest uppercase">
                            BURGERS NA BRASA
                          </span>
                        </div>

                        <h3 className="font-display text-2xl font-black text-[#361904] uppercase tracking-tighter">
                          Caixa de Hamburguer
                        </h3>
                        <p className="text-[11px] text-[#543111] font-bold uppercase tracking-wider mb-1">
                          Embalagem Clamshell Delivery • Chapa Quente
                        </p>

                        {/* Furos de respiro de vapor típicos de caixa de hambúrguer */}
                        <div className="flex items-center gap-6 my-2 text-[#5a320d]">
                          <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest">
                            <span className="size-2 rounded-full border border-[#4d2807] bg-[#754b20]/60 inline-block" />
                            <span>Respiro</span>
                          </div>
                          <span className="text-[10px] opacity-40">•</span>
                          <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest">
                            <span className="size-2 rounded-full border border-[#4d2807] bg-[#754b20]/60 inline-block" />
                            <span>Anti-Vapor</span>
                          </div>
                        </div>

                        {/* Botão chamativo de abrir a caixa */}
                        <div className="mt-2 flex flex-col items-center">
                          <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white font-display font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-950/70 border border-orange-400/40 group-hover:scale-105 transition-transform"
                          >
                            <PackageCheck className="w-4 h-4" />
                            <span>Clique para abrir a caixa</span>
                          </motion.div>
                          <span className="text-[10px] text-[#4d290c] font-extrabold uppercase tracking-widest mt-1.5">
                            Toque na caixa para abrir a tampa e entrar
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* QUANDO A CAIXA ESTÁ ABERTA: O INTERIOR BRANCO DA TAMPA VOLTADO AO USUÁRIO */
                      <div className="w-full py-4 flex flex-col items-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3d2007]/15 text-[#301704] text-[11px] font-bold uppercase tracking-wider mb-1">
                          <Flame className="w-3.5 h-3.5 text-orange-700" />
                          <span>Tampa Aberta a 115°</span>
                        </div>
                        <p className="text-[11px] text-[#543111] font-semibold">
                          O formulário de login está pronto na bandeja abaixo.
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsOpenBox(false);
                          }}
                          className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#422206]/20 hover:bg-[#422206]/35 text-[#2b1302] text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Fechar tampa</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ABA FRONTAL DA TAMPA COM LINGUETA ARREDONDADA DE ENCAIXE (TUCK TAB DA FOTO) */}
                  <div className="relative w-full flex flex-col items-center pt-1 pb-1">
                    {/* Linha de vinco da aba frontal */}
                    <div className="w-4/5 h-[1.5px] bg-[#5c3410]/60 rounded-full" />
                    {/* Lingueta de trava arredondada projetada para fora */}
                    <div
                      className="w-24 h-5 rounded-b-2xl border-x-2 border-b-2 shadow-md flex items-center justify-center -mt-[1px] transition-colors duration-500"
                      style={{
                        background: isOpenBox
                          ? "linear-gradient(180deg, #f7f4ed 0%, #eee7dc 100%)"
                          : "linear-gradient(180deg, #8c5d2e 0%, #75471c 100%)",
                        borderColor: isOpenBox ? "#d6cbba" : "#4f2b0b",
                      }}
                    >
                      {/* Ranhura decorativa de encaixe na lingueta */}
                      <div
                        className="w-8 h-1 rounded-full"
                        style={{
                          backgroundColor: isOpenBox ? "#c7b7a1" : "#996735",
                        }}
                      />
                    </div>
                  </div>

                  {/* FORRO INTERNO BRANCO DA TAMPA (Visível ao abrir a 115° como na foto!) */}
                  {isOpenBox && (
                    <div
                      className="absolute inset-x-2 top-0 h-8 rounded-b-xl border-b border-gray-200/80 shadow-inner"
                      style={{
                        background:
                          "linear-gradient(180deg, #ffffff 0%, #f6f3eb 70%, #ede5d7 100%)",
                      }}
                    />
                  )}
                </div>
              </div>

              {/* =============================================================== */}
              {/* 2. BANDEJA INFERIOR (CLAMSHELL BASE TRAY) - SENTADA NA MESA     */}
              {/* =============================================================== */}
              <div
                className={`relative w-full z-30 rounded-b-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] border-x-2 border-b-2 border-[#73461b] ${
                  isOpenBox ? "pt-5 -mt-3 min-h-[400px]" : "pt-2 -mt-1 min-h-[140px]"
                }`}
                style={{
                  background:
                    "linear-gradient(180deg, #996a39 0%, #825425 45%, #663e17 100%)",
                  boxShadow: isOpenBox
                    ? "0 35px 70px -10px rgba(0,0,0,0.95), inset 0 10px 30px rgba(0,0,0,0.6)"
                    : "0 12px 25px rgba(0,0,0,0.55)",
                }}
              >
                {/* PAREDE LATERAL CHANFRADA ESQUERDA DA BANDEJA (PINCH-FOLD DA FOTO) */}
                <div className="absolute top-2 -left-3.5 w-7 h-24 pointer-events-none">
                  <svg viewBox="0 0 28 96" className="w-full h-full drop-shadow-sm">
                    <polygon points="28,0 4,16 4,80 28,96" fill="#75481c" stroke="#523110" strokeWidth="1" />
                    <line x1="28" y1="48" x2="4" y2="48" stroke="#4a2a0a" strokeWidth="1" />
                  </svg>
                </div>

                {/* PAREDE LATERAL CHANFRADA DIREITA DA BANDEJA (PINCH-FOLD DA FOTO) */}
                <div className="absolute top-2 -right-3.5 w-7 h-24 pointer-events-none">
                  <svg viewBox="0 0 28 96" className="w-full h-full drop-shadow-sm">
                    <polygon points="0,0 24,16 24,80 0,96" fill="#75481c" stroke="#523110" strokeWidth="1" />
                    <line x1="0" y1="48" x2="24" y2="48" stroke="#4a2a0a" strokeWidth="1" />
                  </svg>
                </div>

                {/* SLIT FRONTAL DE ENCAIXE PARA A LINGUETA DA TAMPA */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-28 h-1.5 bg-[#3b1f07] rounded-full shadow-inner border-t border-[#261203]" />

                {/* FORRO INTERNO BRANCO DA BANDEJA (CAVIDADE BRANCA ALIMENTAR DA FOTO) */}
                <div
                  className={`mx-3 sm:mx-4.5 mb-3.5 rounded-xl transition-all duration-500 border border-gray-200 relative overflow-hidden ${
                    isOpenBox ? "p-4 sm:p-5 opacity-100" : "p-3 opacity-95"
                  }`}
                  style={{
                    background:
                      "linear-gradient(175deg, #ffffff 0%, #f7f4ed 50%, #eee6da 100%)",
                    boxShadow:
                      "inset 0 6px 18px rgba(0,0,0,0.08), 0 8px 25px rgba(0,0,0,0.25)",
                  }}
                >
                  {/* ============================================================= */}
                  {/* O HAMBÚRGUER + LOGIN EM PÉ (ERGUENDO-SE NA VERTICAL DA CAIXA) */}
                  {/* ============================================================= */}
                  <div
                    className="relative z-10 w-full flex flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      // COMPENSA A INCLINAÇÃO DA MESA (rotateX -24deg) PARA FICAR 100% "EM PÉ" E VIRADO AO USUÁRIO
                      transform: isOpenBox
                        ? "rotateX(-24deg) translateY(-8px) translateZ(42px)"
                        : "rotateX(0deg) scale(0.9)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* HAMBÚRGUER EM PÉ (SAINDO DA CAIXA COMO NA FOTO) */}
                    <div className="relative -mt-6 sm:-mt-8 mb-1 flex justify-center">
                      <motion.div
                        initial={false}
                        animate={{
                          scale: isOpenBox ? 1.05 : 0.85,
                          y: isOpenBox ? -2 : 4,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="relative w-36 sm:w-40 h-24 sm:h-26"
                      >
                        <img
                          src={burgerClassico}
                          alt="Burger Fogo e Chapa"
                          className="w-full h-full object-contain drop-shadow-[0_16px_22px_rgba(0,0,0,0.45)]"
                        />
                        {/* Vapor de chapa quente subindo do hambúrguer */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
                          <span className="w-1.5 h-3 bg-gray-400/30 blur-[1px] rounded-full animate-pulse" />
                          <span className="w-1.5 h-4 bg-orange-400/40 blur-[1px] rounded-full animate-pulse delay-100" />
                        </div>
                      </motion.div>
                    </div>

                    {/* TÍTULO DO LOGIN EM PÉ */}
                    <div className="text-center mb-3">
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-orange-700 bg-orange-100/90 border border-orange-200 px-2.5 py-0.5 rounded-full mb-1 shadow-sm">
                        <Flame className="w-3 h-3 text-orange-600" /> Fogo e Chapa Club
                      </div>
                      <h4 className="font-display text-2xl sm:text-3xl font-black text-[#2e1707] uppercase tracking-tight">
                        {isOpenBox ? "Entrar na sua Conta" : "Caixa Fechada"}
                      </h4>
                      <p className="text-xs text-[#6e4e30] font-medium">
                        {isOpenBox
                          ? "Peça direto da chapa com descontos exclusivos."
                          : "Clique na caixa para abrir a tampa e fazer login."}
                      </p>
                    </div>

                    {/* FORMULÁRIO DE LOGIN EM PÉ (FLEXBOX) */}
                    <form onSubmit={handleSubmit} className="w-full space-y-3">
                      {/* INPUT E-MAIL (Background translúcido papel craft) */}
                      <div className="space-y-1 text-left">
                        <label className="block text-[11px] font-bold text-[#4a2e16] uppercase tracking-wider pl-1">
                          E-mail
                        </label>
                        <div className="relative flex items-center rounded-xl bg-[#cba882]/25 border border-[#b89164]/70 backdrop-blur-sm px-3.5 py-2.5 transition-all duration-300 focus-within:border-orange-600 focus-within:bg-[#cba882]/35 focus-within:shadow-[0_0_15px_rgba(234,88,12,0.25)]">
                          <Mail className="w-4 h-4 text-[#734b22] mr-2.5 shrink-0" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu.email@exemplo.com"
                            className="w-full bg-transparent text-[#261204] placeholder-[#8c6742] text-sm outline-none font-semibold"
                          />
                        </div>
                      </div>

                      {/* INPUT SENHA (Background translúcido papel craft) */}
                      <div className="space-y-1 text-left">
                        <div className="flex justify-between items-center pl-1 pr-0.5">
                          <label className="text-[11px] font-bold text-[#4a2e16] uppercase tracking-wider">
                            Senha
                          </label>
                          <a
                            href="#esqueci"
                            onClick={(e) => {
                              e.preventDefault();
                              toast.info("Enviamos as instruções para o seu e-mail!");
                            }}
                            className="text-[10px] font-bold text-orange-700 hover:text-orange-900 transition-colors"
                          >
                            Esqueceu a senha?
                          </a>
                        </div>
                        <div className="relative flex items-center rounded-xl bg-[#cba882]/25 border border-[#b89164]/70 backdrop-blur-sm px-3.5 py-2.5 transition-all duration-300 focus-within:border-orange-600 focus-within:bg-[#cba882]/35 focus-within:shadow-[0_0_15px_rgba(234,88,12,0.25)]">
                          <Lock className="w-4 h-4 text-[#734b22] mr-2.5 shrink-0" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full bg-transparent text-[#261204] placeholder-[#8c6742] text-sm outline-none font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-[#734b22] hover:text-[#261204] transition-colors ml-2 cursor-pointer"
                            aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* BOTÃO 'ENTRAR' (Hover scale suave + paleta Fogo e Chapa) */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-2 group relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 py-3.5 px-6 font-display font-black text-white text-sm uppercase tracking-wider shadow-lg shadow-orange-950/50 transition-transform duration-300 ease-out hover:scale-105 active:scale-95 hover:shadow-orange-500/40 cursor-pointer disabled:opacity-75"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {isSubmitting ? (
                            <>
                              <Flame className="w-4 h-4 animate-spin" />
                              <span>Entrando...</span>
                            </>
                          ) : (
                            <>
                              <span>Entrar</span>
                              <Flame className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                      </button>
                    </form>

                    {/* Rodapé do formulário */}
                    <div className="mt-3.5 pt-2.5 border-t border-[#dfcfb9] w-full flex items-center justify-between text-xs text-[#6e4e30]">
                      <span>
                        Não tem conta?{" "}
                        <button
                          type="button"
                          onClick={() => toast.info("Criando nova conta na brasa...")}
                          className="font-bold text-orange-700 hover:underline cursor-pointer"
                        >
                          Cadastre-se
                        </button>
                      </span>

                      {!isOpenBox ? (
                        <button
                          type="button"
                          onClick={() => setIsOpenBox(true)}
                          className="font-bold text-orange-700 hover:underline cursor-pointer"
                        >
                          Abrir caixa
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsOpenBox(false)}
                          className="font-bold text-[#8c6136] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Fechar tampa
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Borda chanfrada inferior da bandeja */}
                <div className="w-full h-2.5 bg-[#523010]/40 flex justify-center items-center">
                  <div className="w-32 h-1 bg-[#7d5022] rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
