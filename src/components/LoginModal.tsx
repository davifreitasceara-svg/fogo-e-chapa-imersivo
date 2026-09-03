import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Apple, Eye, EyeOff, Flame, Lock, Mail, X } from "lucide-react";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.64 4.1-5.35 4.1a5.9 5.9 0 1 1 0-11.8c1.68 0 2.81.72 3.46 1.33l2.36-2.27C16.3 3.9 14.36 3 12 3a9 9 0 1 0 0 18c5.2 0 8.64-3.65 8.64-8.8 0-.59-.06-1.04-.29-1.1Z"
      />
    </svg>
  );
}

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Acessar conta"
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel relative w-full max-w-md overflow-hidden rounded-3xl p-8"
          >
            <div className="absolute -top-24 -right-16 size-56 rounded-full bg-fire opacity-25 blur-3xl" />

            <button
              onClick={onClose}
              aria-label="Fechar"
              className="absolute top-4 right-4 grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-flame hover:text-flame"
            >
              <X className="size-4" />
            </button>

            <div className="relative">
              <span className="grid size-12 place-items-center rounded-2xl bg-fire shadow-[var(--shadow-fire)]">
                <Flame className="size-6 text-primary-foreground" strokeWidth={2.5} />
              </span>
              <h2 className="mt-5 font-display text-3xl uppercase">
                {mode === "login" ? "Bem-vindo de volta" : "Criar conta"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {mode === "login"
                  ? "Entre para acompanhar pedidos e resgatar brasas de fidelidade."
                  : "Cadastre-se e ganhe seu primeiro combo na brasa."}
              </p>

              <form
                className="mt-7 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  onClose();
                }}
              >
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    E-mail
                  </span>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 transition-colors focus-within:border-flame">
                    <Mail className="size-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      placeholder="voce@email.com"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Senha
                  </span>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 transition-colors focus-within:border-flame">
                    <Lock className="size-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                    />
                    <button
                      type="button"
                      aria-label="Mostrar senha"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-muted-foreground transition-colors hover:text-flame"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </label>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-xl bg-fire py-3.5 text-sm font-bold text-primary-foreground uppercase transition-shadow hover:shadow-[0_0_40px_-6px_var(--flame)]"
                >
                  {mode === "login" ? "Entrar" : "Cadastrar"}
                </motion.button>
              </form>

              <div className="my-6 flex items-center gap-4 text-xs text-muted-foreground uppercase">
                <span className="h-px flex-1 bg-border" />
                ou continue com
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background/50 py-3 text-sm font-medium transition-colors hover:border-flame hover:text-flame">
                  <GoogleIcon /> Google
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background/50 py-3 text-sm font-medium transition-colors hover:border-flame hover:text-flame">
                  <Apple className="size-4" /> Apple
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "login" ? "Ainda não tem conta?" : "Já é da brasa?"}{" "}
                <button
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="font-semibold text-flame hover:underline"
                >
                  {mode === "login" ? "Cadastre-se" : "Entrar"}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
